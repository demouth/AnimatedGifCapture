(function ($, scope) {
  
  function TabStreamCapture(option){
    TabCapture.apply(this,[option]);
    this.stream = null;
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.video = document.createElement('video');
  }
  TabStreamCapture.prototype = Object.create(TabCapture.prototype);
  TabStreamCapture.prototype.constructor = TabStreamCapture;
  TabStreamCapture.prototype.startCapture = function(){
    var deferred = new $.Deferred;
    var that = this;
    
    var tab = null;
    chrome.tabs.query(
      {
        active: true,
        currentWindow: true
      },
      function(_tab){
        tab = _tab[0];
        console.log(tab);
        deferred.resolve();
      });
    deferred.promise().then(function(){
      var deferred = new $.Deferred;
      var tabW = tab.width;
      var tabH = tab.height;
      that.canvas.width = tabW;
      that.canvas.height = tabH;
      chrome.tabCapture.capture(
        {
          audio:false,
          video:true,
          videoConstraints:{
            mandatory: {
//                chromeMediaSource: 'tab',
                minWidth: tabW,
                maxWidth: tabW,
                minHeight: tabH,
                maxHeight: tabH
            }
          }
        },function(stream){
          that.stream = stream;
          var video = document.createElement('video');
          that.video = video;
          video.src = window.URL.createObjectURL(stream);
          video.addEventListener('canplay',function(event){
            deferred.resolve();
          });
          video.play();
        });
      return deferred.promise();
    }).done(function(){
      TabCapture.prototype.startCapture.apply(that);
    });
    
    return this;
    
    
  };
  TabStreamCapture.prototype.capture = function(){
    var deferred = new $.Deferred;
    var that = this;
    var video = this.video;
    var canvas = this.canvas;
    var ctx = this.ctx;
    
    setTimeout(function(){
      canvas.width = video.videoWidth-2;
      canvas.height = video.videoHeight-2;
      console.log(video.videoWidth, video.videoHeight);
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
  
  TabStreamCapture.prototype._onDone = function(){
    if(this.stream)this.stream.stop();
    return TabCapture.prototype._onDone.apply(this);
  };
  
  scope.TabStreamCapture = TabStreamCapture;
  
})(jQuery, window);