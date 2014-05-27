/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this file,
 * You can obtain one at http://mozilla.org/MPL/2.0/. */
ID = "";
var PlayController = {
  currentURL:"",
  init: function() {
    PlayController.defaultInit();
    CalibrateController.init();

    ProjectList.load();
    $('#panel').hide();
    $('#projectList').show();
    $('#contents').hide();
    PlayController.photoList = new PhotoList();
    PlayController.configList = new ConfigList();
    window.setTimeout(function () {
      $('.help').fadeOut(3000);
    },3000);
  },

  defaultInit : function () {
    this.cvs = document.getElementById('cvs');
    this.ctx = this.cvs.getContext('2d');
    this.cvs.width = screen.width;
    this.cvs.height = screen.height;
  },

  exitProject : function(){
    PlayController.photoList.clear();
  },

  load: function() {
    ProjectList.load();
  },

  draw: function(imgElem){
    PlayController.drawImage(imgElem);
    if(PlayConfig.fastDraw){
      for(i in PlayConfig.notes){
        if(PlayConfig.notes[i].index == PlayConfig.index)PlayController.drawNote(PlayConfig.notes[i].url);
      }
    } else {
      window.setTimeout(function(){
        for(i in PlayConfig.notes){
          if(PlayConfig.notes[i].index == PlayConfig.index)PlayController.drawNote(PlayConfig.notes[i].url);
        }
      },150);
    }
  },

  drawNote:function (noteURL){
    var img = new Image();
    img.src = noteURL;
    img.onload = function(){
      PlayController.drawImage(img);
    };
  },

  drawImage:function(image){
    var sx = Number(CommonController.localConfig.x);
    var sy = Number(CommonController.localConfig.y);
    var sw = Number(CommonController.localConfig.w);
    var sh = Number(CommonController.localConfig.h);

    var dx = 0;
    var dy = 0;
    var dw = PlayController.cvs.width;
    var dh = PlayController.cvs.height;

    if(CommonController.localConfig.y < 0){
      var StoDh = dh/sh; 
      var StoDw = dw/sw;
      dy = sy*StoDh;
      dh += dy;
      sh += sy;
      sy = 0;
      dy *=-1;

      dx = sx*StoDw;
      dw += dx;
      sw += sx;
      sx = 0;
      dx *= -1;
      PlayController.ctx.fillStyle = "black"; 
      PlayController.ctx.fillRect(0,0,dw,dy);
      PlayController.ctx.fillRect(0,0,dx,dh);
    } 

    PlayController._drawImage(image,sx,sy,sw,sh,dx,dy,dw,dh);
  },

  _drawImage:function(image,sx,sy,sw,sh,dx,dy,dw,dh){
    PlayController.ctx.drawImage(image,sx,sy,sw,sh,dx,dy,dw,dh);
  },

  play: function(id) {
    $('#projectList').hide();
    $('#contents').show();
    CalibrateController.initProject(id);
    if(CommonController.localConfig == ""){
      CommonController.localConfig = {x:0,y:0,w:$('#photo').width(),h:$('#photo').height()};
    }
    PlayConfig.initProject(id).then(function(){
      PlayController.playSlide(id);
    });
  },

  playSlide : function(id){
    PlayController.photoList.update();
    document.title = "Play: " +id;
    PlayController.configList.load();

    var parameters = PlayController.getParametersFromQuery();
    var startIndex = 0;
    if (parameters["s"]) {
      startIndex = parseInt(parameters["s"])-1;
    }
    CommonController.getLocalConfig(id);
    PlayController.show(startIndex);
    $("#contents").show();
//    setTimeout(CalibrateController.update,100);
  },

  getParametersFromQuery: function () {
    var parameters = {};
    var url = window.location.href;
    var indexOfQ = url.indexOf("?");
    if (indexOfQ >= 0) {
      var queryString = url.substring(indexOfQ + 1);
      var params = queryString.split("&");
      for (var i = 0, n = params.length; i < n; i++) {
        var param = params[i];
        var keyvalue = param.split("=");
        parameters[keyvalue[0]] = keyvalue[1];
      }
      parameters["QueryString"] = queryString;
    }
    return parameters;
  },

  previous: function() {
    if (PlayConfig.index == 0) {
      PlayController.show(PlayConfig.imgURLs.length-1);
    } else {
      PlayController.show(Number(PlayConfig.index)-1);
    }
  },


  next: function() {
    if (PlayConfig.index == PlayConfig.imgURLs.length-1) {
      PlayController.show(0);
    } else {
      PlayController.show(Number(PlayConfig.index)+1);
    }
  },

  show: function(index) {
    PlayController.setPhoto(Number(index));
    $("#arrow").text("");
    clearTimeout(PlayController.timerid);
    //---------Annotations
    $('.annotations').remove();
    for (var i=0; i<PlayConfig.annotations.length;i++){
      if(index == PlayConfig.annotations[i].index){
        PlayController.setAnnotation(
            PlayConfig.annotations[i].x,
            PlayConfig.annotations[i].y,
            PlayConfig.annotations[i].angle);
      }
    }
    PlayController.current_animation = null;
    PlayConfig.index = Number(index);
  },

  setPhoto: function(index) {
    var url = PlayConfig.imgURLs[index];
    if(url != PlayController.currentURL){
      var img = new Image();
      img.src = url
        img.onload = function () {
          PlayController.ctx.clearRect(0,0,PlayController.cvs.width,PlayController.cvs.height);
          PlayController.draw(img);
        };
      $("#photo").attr("src",url); 
    }
    PlayController.currentURL = url;
    PlayController.photoList.selectByName(url);
    $("#counter").text((Number(index)+1)+"/"+PlayConfig.imgURLs.length);
    $('#cvs').css('display','block');
    $('#photo').css('display','none');
  },

  info : function(){
    var elem = $('#panel');
    if(elem.is(":visible"))
      elem.hide();
    else 
      elem.show();
  }
}

