"use strict";
var objects_loaders_gltfLoader = require("./loaders/gltf-loader.js");
var common_vendor = require("../common/vendor.js");
function useThree(canvas) {
  const THREE = common_vendor.dist.createScopedThreejs(canvas);
  objects_loaders_gltfLoader.registerGLTFLoader(THREE);
  const camera = new THREE.Camera();
  const scene = new THREE.Scene();
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
  });
  function destroy() {
    scene.dispose();
    renderer.dispose();
  }
  return {
    THREE,
    camera,
    scene,
    renderer,
    destroy
  };
}
exports.useThree = useThree;
