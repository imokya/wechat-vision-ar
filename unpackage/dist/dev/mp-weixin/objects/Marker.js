"use strict";
var common_vendor = require("../common/vendor.js");
class Marker {
  constructor(session) {
    this.session = session;
    this.init();
  }
  init() {
    this.initMakerImage();
  }
  addMarker() {
    this.markerId = this.session.addMarker(this.filePath);
    console.log("markerid", this.markerId);
  }
  removeMarker() {
    if (this.markerId) {
      this.session.removeMarker(this.markerId);
      this.markerId = null;
    }
  }
  getAllMarker() {
    console.log(this.session.getAllMarker());
  }
  initMakerImage() {
    const filePath = `${common_vendor.index.env.USER_DATA_PATH}/marker.png`;
    console.log("before filepath", filePath);
    const fs = common_vendor.index.getFileSystemManager();
    common_vendor.index.downloadFile({
      url: "https://www.xinapp.net/markers/logo.png",
      success: (res) => {
        fs.saveFile({
          filePath,
          tempFilePath: res.tempFilePath,
          success: (data) => {
            this.filePath = data.savedFilePath;
            this.addMarker();
          }
        });
      }
    });
  }
}
exports.Marker = Marker;
