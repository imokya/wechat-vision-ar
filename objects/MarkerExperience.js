import {
  useThree
} from '@/objects/useThree'
import cloneGltf from '@/objects/loaders/gltf-clone'
import Marker from '@/objects/Marker'
import GL from '@/objects/GL'

const NEAR = 0.1
const FAR = 1000

let DEBUG_SIZE = true

export default class MarkerExperience {

  constructor(canvas) {

    this.canvas = canvas

    this.initTHREE()
    this.initVisionKit()

  }

  initVisionKit() {
    this.session = uni.createVKSession({
      track: {
        plane: {
          mode: 3
        },
        marker: true,
      },
      version: 'v1',
      gl: this.GL.gl
    })

    this.session.start(err => {
      if (err) return console.error('VK error: ', err)
      console.log('@@@@@@@@ VKSession.version', this.session.version)

      const createCube = size => {
        const geometry = new this.THREE.BoxGeometry(size.width * 0.01, size.height * 0.01, size.width * 0.01)
        const material = new this.THREE.MeshNormalMaterial({
          color: 0xffffff,
          side: this.THREE.DoubleSide,
          transparent: true,
          opacity: 0.7
        })
        const mesh = new this.THREE.Mesh(geometry, material)
        const cnt = new this.THREE.Object3D()
        cnt.add(mesh)
        return cnt
      }

      const planeBox = this.planeBox = new this.THREE.Object3D()
      this.scene.add(planeBox)

      const updateMatrix = (object, m) => {
        object.matrixAutoUpdate = false
        object.matrix.fromArray(m)
      }

      this.session.on('addAnchors', anchors => {
        anchors.forEach(anchor => {
          let object, size = anchor.size 
    
          if (size && DEBUG_SIZE) {
            object = createCube(size)
          } else {
            if (!this.model) {
              console.warn('this.model 还没加载完成 ！！！！！')
              return
            }
            object = new this.THREE.Object3D()
            const model = this.getModel()
            model.rotateX(-Math.PI / 2)
            object.add(model)
          }
          object._id = anchor.id
          object._size = size
          updateMatrix(object, anchor.transform)
          this.planeBox.add(object)
        })
      })

      this.session.on('updateAnchors', anchors => {
        const map = anchors.reduce((temp, item) => {
          temp[item.id] = item
          return temp
        }, {})
        this.planeBox.children.forEach(object => {
          if (object._id && map[object._id]) {
            const anchor = map[object._id]
            const size = anchor.size
            if (size && DEBUG_SIZE && object._size && (size.width !== object._size.width || size
                .height !== object._size.height)) {
              this.planeBox.remove(object)
              object = createCube(size)
              this.planeBox.add(object)
            }

            object._id = anchor.id
            object._size = size
            updateMatrix(object, anchor.transform)
          }
        })
      })

      this.session.on('removeAnchors', anchors => {
        const map = anchors.reduce((temp, item) => {
          temp[item.id] = item
          return temp
        }, {})
        this.planeBox.children.forEach(object => {
          if (object._id && map[object._id]) this.planeBox.remove(object)
        })
      })


      this.marker = new Marker(this.session)

      const loader = new this.THREE.GLTFLoader()
      loader.load('https://www.xinapp.net/models/running2.glb', gltf => {
        this.model = {
          scene: gltf.scene,
          animations: gltf.animations,
        }
        gltf.scene.traverse(child => {
          if (child.material) {
            child.material.transparent = false
            child.material.depthTest = true
            child.material.side = this.THREE.FrontSide
          }
        })
      })


      this.clock = new this.THREE.Clock()
      const onFrame = timestamp => {
        const frame = this.session.getVKFrame(this.canvas.width, this.canvas.height)
        if (frame) {
          this.render(frame)
        }
        this.session.requestAnimationFrame(onFrame)
      }
      this.session.requestAnimationFrame(onFrame)
    })
  }

  render(frame) {
    this.GL.render(frame)
    const camera = frame.camera
    const dt = this.clock.getDelta()
    if (this.mixers) {
      this.mixers.forEach(mixer => mixer.update(dt))
    }

    if (camera) {
      this.camera.matrixAutoUpdate = false
      this.camera.matrixWorldInverse.fromArray(camera.viewMatrix)
      this.camera.matrixWorld.getInverse(this.camera.matrixWorldInverse)

      const projectionMatrix = camera.getProjectionMatrix(NEAR, FAR)
      this.camera.projectionMatrix.fromArray(projectionMatrix)
      this.camera.projectionMatrixInverse.getInverse(this.camera.projectionMatrix)
    }

    this.renderer.autoClearColor = false
    this.renderer.render(this.scene, this.camera)
    this.renderer.state.setCullFace(this.THREE.CullFaceNone)

  }

  initTHREE() {
    const {
      camera,
      scene,
      renderer,
      THREE,
      destroy
    } = useThree(this.canvas)
    this.THREE = THREE
    this.camera = camera
    this.scene = scene
    this.renderer = renderer
    this.GL = new GL(renderer)
    this.threeDestroy = destroy
    this.initLights()
  }

  initLights() {

    const light1 = new this.THREE.HemisphereLight(0xffffff, 0x444444)
    light1.position.set(0, 0.2, 0)
    this.scene.add(light1)
    const light2 = new this.THREE.DirectionalLight(0xffffff)
    light2.position.set(0, 0.2, 0.1)
    this.scene.add(light2)
  }

  copyModel() {
    const THREE = this.THREE
    const {
      scene,
      animations
    } = cloneGltf(this.model, THREE)
    scene.scale.set(0.5, 0.5, 0.5)

    const mixer = new THREE.AnimationMixer(scene)
    for (let i = 0; i < animations.length; i++) {
      const clip = animations[i]
      if (clip.name === 'metarig|mixamo.com|Layer0') {
        const action = mixer.clipAction(clip)
        action.play()
      }
    }

    this.mixers = this.mixers || []
    this.mixers.push(mixer)

    scene._mixer = mixer
    return scene
  }

  getModel() {
    const THREE = this.THREE

    const model = new THREE.Object3D()
    model.add(this.copyModel())

    this._insertModels = this._insertModels || []
    this._insertModels.push(model)

    if (this._insertModels.length > 5) {
      const needRemove = this._insertModels.splice(0, this._insertModels.length - 5)
      needRemove.forEach(item => {
        if (item._mixer) {
          const mixer = item._mixer
          this.mixers.splice(this.mixers.indexOf(mixer), 1)
          mixer.uncacheRoot(mixer.getModel())
        }
        if (item.parent) item.parent.remove(item)
      })
    }
    return model
  }

  addModel(x, y) {
    if (this.session && this.scene && this.model) {
      const info = uni.getSystemInfoSync()
      const hitTestRes = this.session.hitTest(x / info.windowWidth, y / info.windowHeight, this.resetPanel)
      this.resetPanel = false
      if (hitTestRes.length) {
        const model = this.getModel()
        model.matrixAutoUpdate = false
        model.matrix.fromArray(hitTestRes[0].transform)
        this.scene.add(model)
      }
    }
  }

  destroy() {
    this.threeDestroy()
    this.THREE = null
    this.camera = null
    this.scene = null
    this.session = null
    this.GL.destroy()
  }

}
