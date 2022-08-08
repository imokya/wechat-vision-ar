"use strict";
var common_vendor = require("../../common/vendor.js");
var objects_MarkerExperience = require("../../objects/MarkerExperience.js");
require("../../objects/useThree.js");
require("../../objects/loaders/gltf-loader.js");
require("../../objects/loaders/gltf-clone.js");
require("../../objects/Marker.js");
require("../../objects/GL.js");
const _sfc_main = {
  __name: "marker",
  setup(__props) {
    const info = common_vendor.index.getSystemInfoSync();
    const cw = info.windowWidth;
    const ch = info.windowHeight;
    const pixelRatio = info.pixelRatio;
    let experience;
    common_vendor.onMounted(() => {
      common_vendor.index.createSelectorQuery().select("#webgl").node().exec((res) => {
        const canvas = res[0].node;
        canvas.width = cw * pixelRatio / 2;
        canvas.height = ch * pixelRatio / 2;
        experience = new objects_MarkerExperience.MarkerExperience(canvas);
      });
    });
    common_vendor.onUnmounted(() => {
      experience.destroy();
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.unref(cw) + "px",
        b: common_vendor.unref(ch) + "px"
      };
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "C:/Users/david.xing/Desktop/wechat-vision-ar/pages/marker/marker.vue"]]);
wx.createPage(MiniProgramPage);
