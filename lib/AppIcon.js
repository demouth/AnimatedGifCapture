var AppIcon = function(){
  var c  = document.createElement('canvas');
  c.width  = 19;
  c.height = 19;
  var cx = c.getContext('2d');
  
  this.defaultIconImg    = document.getElementById('defaultIcon');
  this.capturingIconImg  = document.getElementById('capturingIcon');
  this.processingIconImg = document.getElementById('processingIcon');
  
  this.progressBarColor = 'rgb(0, 170, 181)';
  this.progressBarBackgroundColor = 'rgb(40, 40, 40)';
  
  this.w  = c.width;
  this.h  = c.height;
  this.c  = c;
  this.cx = cx;
};
AppIcon.prototype = {
  drawProgress : function(progress){
    var w=this.w, h=this.h;
    
    var barWidth = 15;
    var barHeight = 4;
    var barX = 2;
    var barY = 11;
    var barColor = this.progressBarColor;
    var barBackgroundColor = this.progressBarBackgroundColor;
    var barLineWidth = 2;
    
    this.cx.fillStyle = barBackgroundColor;
    this.cx.fillRect(
      barX-barLineWidth,
      barY-barLineWidth,
      barWidth+barLineWidth*2,
      barHeight+barLineWidth*2
    );
    this.cx.fillStyle = barColor;
    this.cx.fillRect(
      barX,barY,barWidth*progress,barHeight
    );
    
    return this;
  },
  setProgressCapturingColor : function(){
    this.setProgressColor('rgb(244, 28, 84)');
    return this;
  },
  setProgressProcessingColor : function(){
    this.setProgressColor('rgb(0, 170, 181)');
    return this;
  },
  setProgressColor : function(color){
    this.progressBarColor = color;
    return this;
  },
  disable : function(){
    chrome.browserAction.disable();
    return this;
  },
  enable : function(){
    chrome.browserAction.enable();
    return this;
  },
  clearImage : function(){
    this.cx.clearRect(0, 0, this.w, this.h);
    return this;
  },
  drawDefaultBackground : function(){
    var w=this.w, h=this.h;
    this.cx.drawImage(this.defaultIconImg,0,0,w,h);
    return this;
  },
  drawCapturingBackground : function(){
    var w=this.w, h=this.h;
    this.cx.drawImage(this.defaultIconImg,0,0,w,h);
    return this;
  },
  drawProcessingBackground : function(){
    var w=this.w, h=this.h;
    this.cx.drawImage(this.processingIconImg,0,0,w,h);
    return this;
  },
  draw : function(progress){
    
    return this;
  },
  getImageData : function(){
    return this.cx.getImageData( 0,0,this.w,this.h );
  },
  changeIcon : function(){
    chrome.browserAction.setIcon({
      "imageData": this.getImageData()
    });
  }
};