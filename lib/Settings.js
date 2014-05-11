var Settings = function(_values){
  this._values = _values;
};

Settings.CAPTURE_TYPE_VISIBLE_TAB = 1; //chrome.tabs.captureVisibleTab()
Settings.CAPTURE_TYPE_TAB_STREAM_CAPTURE = 2; //chrome.tabCapture.capture()
Settings.CAPTURE_TYPE_DESKTOP_STREAM_CAPTURE = 3; //chrome.desktopCapture.chooseDesktopMedia() & navigator.webkitGetUserMedia()
Settings.getDefault = function(){
  return {
    repeat: 0,
    captureSeconds: 1.5,
    captureFrameRate: 3,
    scale: 0.3,
    filename: '{Y}{M}{D}-{H}{I}{S}_capture',
    captureType: Settings.CAPTURE_TYPE_TAB_STREAM_CAPTURE, 
    captureFrameRateLimit: true,
    captureSecondsLimit: true,
    scaleLimit: true
  };
};
Settings.limits = {
  limited:{
    captureFrameRate:{ min:1 , max:5 },
    captureSeconds:{ min:1 , max:2 },
    scale:{ min:0.1 , max:0.5 }
  },
  unlimited:{
    captureFrameRate:{ min:1 , max:30 },
    captureSeconds:{ min:1 , max:30 },
    scale:{ min:0.1 , max:1 }
  }
};

Settings.prototype = {
  save: function(callback){
    chrome.storage.sync.set(
      this._values,
      function(){
        callback && callback.bind(that).call();
      }
    );
  },
  clear: function(callback){
    this._values = Settings.getDefault();
    chrome.storage.sync.clear(
      function(){
        callback && callback.bind(that).call();
      }
    );
  },
  getInterval : function(){
    var secondPerFrameRate = 1000 / this.getCaptureFrameRate();
    if(secondPerFrameRate < 1) secondPerFrameRate = 1;
    return ~~secondPerFrameRate;
  },
  getNumCapture : function(){
    var numCapture = this.getCaptureSeconds() * this.getCaptureFrameRate();
    return numCapture;
  },
  getRepeat : function(){
    return this._values.repeat;
  },
  getCaptureSeconds : function(){
    return this._values.captureSeconds;
  },
  getCaptureFrameRate : function(){
    return this._values.captureFrameRate;
  },
  getScale : function(){
    return this._values.scale;
  },
  getCaptureType : function(){
    return this._values.captureType;
  },
  getFilename : function(){
    return this._values.filename;
  },
  getCaptureFrameRateLimit : function(){
    return this._values.captureFrameRateLimit;
  },
  getCaptureSecondsLimit : function(){
    return this._values.captureSecondsLimit;
  },
  getScaleLimit : function(){
    return this._values.scaleLimit;
  },
  getCaptureFrameRateMax : function(){
    if(this.getCaptureFrameRateLimit()){
      return Settings.limits.limited.captureFrameRate.max;
    }else{
      return Settings.limits.unlimited.captureFrameRate.max;
    }
  },
  getCaptureFrameRateMin : function(){
    if(this.getCaptureFrameRateLimit()){
      return Settings.limits.limited.captureFrameRate.min;
    }else{
      return Settings.limits.unlimited.captureFrameRate.min;
    }
  },
  getCaptureSecondsMax : function(){
    if(this.getCaptureSecondsLimit()){
      return Settings.limits.limited.captureSeconds.max;
    }else{
      return Settings.limits.unlimited.captureSeconds.max;
    }
  },
  getCaptureSecondsMin : function(){
    if(this.getCaptureSecondsLimit()){
      return Settings.limits.limited.captureSeconds.min;
    }else{
      return Settings.limits.unlimited.captureSeconds.min;
    }
  },
  getScaleMax : function(){
    if(this.getScaleLimit()){
      return Settings.limits.limited.scale.max;
    }else{
      return Settings.limits.unlimited.scale.max;
    }
  },
  getScaleMin : function(){
    if(this.getScaleLimit()){
      return Settings.limits.limited.scale.min;
    }else{
      return Settings.limits.unlimited.scale.min;
    }
  },
  setCaptureSeconds : function(val){
    this._values.captureSeconds = val;
  },
  setCaptureFrameRate : function(val){
    this._values.captureFrameRate = val;
  },
  setScale : function(val){
    val = ~~(val * 10)/10;
    this._values.scale = val;
  },
  setCaptureType : function(val){
    this._values.captureType = ~~val;
  },
  setRepeat : function(val){
    this._values.repeat = ~~val;
  },
  setFilename : function(val){
    this._values.filename = val;
  },
  setCaptureFrameRateLimit : function(val){
    val = val ? true : false;
    this._values.captureFrameRateLimit = val;
    if(this._values.captureFrameRate > this.getCaptureFrameRateMax()){
      this._values.captureFrameRate = this.getCaptureFrameRateMax();
    }else if(this._values.captureFrameRate < this.getCaptureFrameRateMin()){
      this._values.captureFrameRate = this.getCaptureFrameRateMin();
    }
  },
  setCaptureSecondsLimit : function(val){
    val = val ? true : false;
    this._values.captureSecondsLimit = val;
    if(this._values.captureSeconds > this.getCaptureSecondsMax()){
      this._values.captureSeconds = this.getCaptureSecondsMax();
    }else if(this._values.captureSeconds < this.getCaptureSecondsMin()){
      this._values.captureSeconds = this.getCaptureSecondsMin();
    }
  },
  setScaleLimit : function(val){
    val = val ? true : false;
    this._values.scaleLimit = val;
    if(this._values.scale > this.getScaleMax()){
      this._values.scale = this.getScaleMax();
    }else if(this._values.scale < this.getScaleMin()){
      this._values.scale = this.getScaleMin();
    }
  }
};