(function ($, scope) {
  
  function DesktopStreamCapture(option){
    TabCapture.apply(this,[option]);
    this.stream = null;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.video = document.createElement('video');
  }
  DesktopStreamCapture.prototype = Object.create(TabCapture.prototype);
  DesktopStreamCapture.prototype.constructor = DesktopStreamCapture;
  DesktopStreamCapture.prototype.startCapture = function(){
    var deferred = new $.Deferred;
    var that = this;
    
    var tab = null;
    
    chrome.desktopCapture.chooseDesktopMedia(
      ["screen", "window"] ,
      function(desktop_id) {
        if (!desktop_id) {
          deferred.reject();
          that.onError.bind(that)();
          that._onDone.bind(that)();
          return;
        }
        
        deferred.done(function(){
          TabCapture.prototype.startCapture.apply(that);
        });
        
        navigator.webkitGetUserMedia(
          {
            audio: false,
            video: {
              mandatory: {
                chromeMediaSource: 'desktop',
                chromeMediaSourceId: desktop_id,
                minWidth: 10,
                maxWidth: 1920,
                minHeight: 10,
                maxHeight: 1080
              }
            }
          },
          function(stream){
            if(!stream){
              deferred.resolve();
              return;
            }
            that.stream = stream;
            var video = document.createElement('video');
            that.video = video;
            video.src = window.URL.createObjectURL(stream);
            video.addEventListener('canplay',function(event){
              deferred.resolve();
            });
            video.play();
          },
          function(e){
            console.log(e);
          }
        );
      }
    );
    
    
    return this;
    
  };
  DesktopStreamCapture.prototype.capture = function(){
    var deferred = new $.Deferred;
    var that = this;
    var video = this.video;
    var canvas = this.canvas;
    var ctx = this.ctx;
    
    setTimeout(function(){
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      //var imageData = that.canvas.toDataURL('image/webp'); //ダントツで遅い
      //var imageData = that.canvas.toDataURL('image/png'); //速い
      //var imageData = that.canvas.toDataURL('image/gif'); //速い pngと変わらない
      var imageData = that.canvas.toDataURL('image/jpeg',1); //1番速い
      that._srcList.push(imageData);
      deferred
        .notify(that._srcList.length / that.numCapture)
        .resolve();
      
    }, this._delayTime);
    //this._delayTime = 0;
    return deferred;
  };
  
  DesktopStreamCapture.prototype._onDone = function(){
    if(this.stream)this.stream.stop();
    return TabCapture.prototype._onDone.apply(this);
  };
  
  scope.DesktopStreamCapture = DesktopStreamCapture;
  
})(jQuery, window);