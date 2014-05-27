var CameraAPI = {

  init:function () {
    document.sonycameracontroller.setup({ipaddress: "10.0.0.1", port: 10000, version: "1.0"});
  },

  shoot:function () {
    var d = $.Deferred();
    var listener = {
      taken:function (url,res) {
        d.resolve(url);
      }
    };
    document.sonycameracontroller.take(listener);
    return d.promise();
  }

};
