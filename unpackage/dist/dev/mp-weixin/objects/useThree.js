"use strict";
var objects_loaders_gltfLoader = require("./loaders/gltf-loader.js");
var common_vendor = require("../common/vendor.js");
var objects_GL = require("./GL.js");
let instance = null;
function useThree(canvas) {
  if (instance)
    return instance;
  const THREE = common_vendor.dist.createScopedThreejs(canvas);
  objects_loaders_gltfLoader.registerGLTFLoader(THREE);
  const camera = new THREE.Camera();
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });
  const gl = new objects_GL.GL(renderer);
  function destroy() {
    scene.dispose();
    renderer.dispose();
    gl.destroy();
  }
  instance = {
    THREE,
    GL: gl,
    camera,
    scene,
    renderer,
    destroy
  };
  return instance;
}
exports.useThree = useThree;
