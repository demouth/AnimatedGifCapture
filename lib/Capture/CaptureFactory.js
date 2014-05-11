(function ($, scope) {
  var CaptureFactory = function(){
  };
  CaptureFactory.get = function(option){
    
    if(option.captureType == Settings.CAPTURE_TYPE_VISIBLE_TAB){
      return new TabCapture(option);
    }else if(option.captureType == Settings.CAPTURE_TYPE_TAB_STREAM_CAPTURE){
      return new TabStreamCapture(option);
    }
    
    return new DesktopStreamCapture(option);
  };
  scope.CaptureFactory = CaptureFactory;
})(jQuery, window);