import { registerGLTFLoader } from '@/objects/loaders/gltf-loader'
import { createScopedThreejs } from 'threejs-miniprogram'

export function useThree(canvas) {

  const THREE = createScopedThreejs(canvas)
  registerGLTFLoader(THREE)
  const camera = new THREE.Camera()
  const scene = new THREE.Scene()
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  })
  
  function destroy() {
    scene.dispose()
    renderer.dispose()
  }
  
  return {
    THREE,
    camera,
    scene,
    renderer,
    destroy
  }
  
}