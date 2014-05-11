(function ($, scope) {
  var TabCapture = function(option){
    this._srcList = [];
    this._delayTime = 0;
    this.onDone=function(srcList){};
    this.onProgress=function(progress){};
    this.onError=function(){};
    this.interval = option.interval;
    this.numCapture = option.numCapture;
  };
  TabCapture.prototype ={
    delay : function(time){
      this._delayTime = time;
      return this;
    },
    startCapture : function(){
      var def = new $.Deferred();
      var i=0,l=this.numCapture,interval=this.interval;
      this.delay(interval);
      def = this.capture();
      i++;
      for(;i<l;i++){
        def = def.then( this.capture.bind(this) );
      }
      
      var that = this;
      def
        .progress(function(progress){
          that.onProgress.bind(that)(progress);
        })
        .done(function(){
          that.onDone.bind(that)(that._srcList);
          that._onDone.bind(that)();
        });

      return this;
    },
    capture : function(){
      var deferred = new $.Deferred;
      var that = this;
      setTimeout(function(){
        chrome.tabs.captureVisibleTab( 
          chrome.windows.WINDOW_ID_CURRENT,
          {format:"png"},
          function (src) {
            that._srcList.push(src);
            deferred
              .notify(that._srcList.length / that.numCapture)
              .resolve();
          }
        );
      }, this._delayTime);
      //this._delayTime = 0;
      return deferred;
    },
    progress : function(callback){
      this.onProgress = callback;
      return this;
    },
    done : function(callback){
      this.onDone = callback;
      return this;
    },
    error : function(callback){
      this.onError = callback;
      return this;
    },
    _onDone : function(){
    }
  };
  scope.TabCapture = TabCapture;
})(jQuery, window);