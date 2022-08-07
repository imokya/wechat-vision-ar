"use strict";
var common_vendor = require("../../common/vendor.js");
var objects_Experience = require("../../objects/Experience.js");
require("../../objects/useThree.js");
require("../../objects/loaders/gltf-loader.js");
require("../../objects/GL.js");
require("../../objects/loaders/gltf-clone.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const info = common_vendor.index.getSystemInfoSync();
    const cw = info.windowWidth;
    const ch = info.windowHeight;
    const pixelRatio = info.pixelRatio;
    let experience;
    const handleTouch = (e) => {
      const touches = e.changedTouches.length ? e.changedTouches : e.touches;
      if (touches.length === 1) {
        const touch = touches[0];
        experience.addModel(touch.x, touch.y);
      }
    };
    common_vendor.onMounted(() => {
      common_vendor.index.createSelectorQuery().select("#webgl").node().exec((res) => {
        const canvas = res[0].node;
        canvas.width = cw * pixelRatio / 2;
        canvas.height = ch * pixelRatio / 2;
        experience = new objects_Experience.Experience(canvas);
      });
    });
    return (_ctx, _cache) => {
      return {
        a: common_vendor.unref(cw) + "px",
        b: common_vendor.unref(ch) + "px",
        c: common_vendor.o(handleTouch)
      };
    };
  }
};
var MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__file", "C:/Users/Administrator/Desktop/wechat-vision-ar/wechat-vision-ar/pages/index/index.vue"]]);
wx.createPage(MiniProgramPage);
