/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */
var RecordController = {

  newProject : function() {
    $("#start").hide();
    $('#projectList').hide();
    PlayConfig.init();
    CommonController.getJSON("/project/new", function(result, error) {
      if (error) {
        alert(error);
        return;
      }
      var id = result["id"];
      PlayConfig.projectName = id;
      document.title = "Play: " +id;
    });
  },

  shoot: function() {
    $('#shoot').hide();
    $('#projectList').hide();
    $('#contents').hide();
    clearTimeout(RecordController.timer);
    CameraAPI.init();
    RecordController.timer = setTimeout(function() {
      var p = CameraAPI.shoot();
      p.then(function(url, error) {
        if (error) {
          alert(error);
          return;
        }
        queue.push(PlayConfig.projectName,url,PlayConfig.index);
        queue.fire();

        window.setTimeout(function(){
          CalibrateController.update();
        },2000);

        $('#shoot').show();
        $('#contents').show();
      });
    }, 10);
  },
  updateList: function () {
    PlayController.photoList.clear();
    for(key in PlayConfig.imgURLs){
      PlayController.photoList.append(PlayConfig.imgURLs[key]);
    }
  }
};

