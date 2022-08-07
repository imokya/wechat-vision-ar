import { registerGLTFLoader } from '@/objects/loaders/gltf-loader'
import { createScopedThreejs } from 'threejs-miniprogram'
import GL from '@/objects/GL'

let instance = null

export function useThree(canvas) {
  if(instance) return instance
  const THREE = createScopedThreejs(canvas)
  registerGLTFLoader(THREE)
  const camera = new THREE.Camera()
  const scene = new THREE.Scene()
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  })
 
  const gl = new GL(renderer)
  
  function destroy() {
    scene.dispose()
    renderer.dispose()
    gl.destroy()
  }
  
  instance = {
    THREE,
    GL: gl,
    camera,
    scene,
    renderer,
    destroy
  }
  
  return instance
}