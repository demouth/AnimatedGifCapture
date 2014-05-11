var settingsLoader = new SettingsLoader();
settingsLoader.load(init);

function i18n(){
  $('[data-i18n]').each(function() {
    var t = $(this);
    t.text(chrome.i18n.getMessage(t.data('i18n')));
  });
}

function i18nimage(){
  $('[data-i18nimage]').each(function() {
    var image = $(this);
    image.attr('src','images/'+chrome.i18n.getMessage(image.data('i18nimage')));
  });
}

function init(){
  
  i18n();
  i18nimage();
  
  var settings = settingsLoader.get();
  
  $("#captureFrameRate").slider({
    formater:function(val){
      var format = ' frame';
      if(val>1) format+='s';
      format+=' / second';
      return val+format;
    },
    min: settings.getCaptureFrameRateMin(),
    max: settings.getCaptureFrameRateMax()
  }).on('slideStop',function(e){
    settings.setCaptureFrameRate(e.value);
    settings.save();
  });
  
  $("#captureSeconds").slider({
    formater:function(val){
      var format = ' second';
      if(val>1) format+='s';
      return val+format;
    },
    min: settings.getCaptureSecondsMin(),
    max: settings.getCaptureSecondsMax()
  }).on('slideStop',function(e){
    settings.setCaptureSeconds(e.value);
    settings.save();
  });
  
  $("#scale").slider({
    formater:function(val){
      val = ~~(val*100);
      return val+'%';
    },
    min: settings.getScaleMin(),
    max: settings.getScaleMax()
  }).on('slideStop',function(e){
    settings.setScale(e.value);
    settings.save();
  });
  
  $('#limitterForCaptureFrameRate')
    .on('change',function(){
      var checked = !$(this).prop('checked');
      settings.setCaptureFrameRateLimit(checked);
      settings.save();
      $("#captureFrameRate")
        .slider('setAttribute', 'max', settings.getCaptureFrameRateMax())
        .slider('setValue', settings.getCaptureFrameRate());
    });
  
  $('#limitterForCaptureSeconds')
    .on('change',function(){
      var checked = !$(this).prop('checked');
      settings.setCaptureSecondsLimit(checked);
      settings.save();
      $("#captureSeconds")
        .slider('setAttribute', 'max', settings.getCaptureSecondsMax())
        .slider('setValue', settings.getCaptureSeconds());
    });
  
  $('#limitterForScale')
    .on('change',function(){
      var checked = !$(this).prop('checked');
      settings.setScaleLimit(checked);
      settings.save();
      $("#scale")
        .slider('setAttribute', 'max', settings.getScaleMax())
        .slider('setValue', settings.getScale());
    });
  
  
  $('#numLoop').on('keyup change',function(){
    var min = ~~$(this).attr('min');
    var max = ~~$(this).attr('max');
    var repeat = ~~$(this).val();
    if(repeat<min) repeat=min;
    if(repeat>max) repeat=max;
    
    settings.setRepeat(repeat);
    settings.save();
  }).on('focusout',function(){
    $(this).val(settings.getRepeat());
  });
  $('#loopForever').on('change',function(){
    var disabled = false;
    var repeat = 1;
    var repeat4Disp = repeat;
    if($(this).prop('checked')){
      disabled = true;
      repeat = 0;
      repeat4Disp = '';
    }
    $('#numLoop').val(repeat4Disp).prop({'disabled':disabled});
    settings.setRepeat(repeat);
    settings.save();
  });
  
  $('#filename').on('keyup change',function(){
    settings.setFilename($(this).val());
    settings.save();
  });
  
  $('#captureType').on('change',function(){
    settings.setCaptureType(~~$(this).val());
    settings.save();
  });
  
  setInterval(function(){
    $('#filenameExample').text(
      FilenameFormatter.format($('#filenameFormatExample').text())
    );
  },1000);
  
  
  $('#reset').on('click',function(){
    settings.clear();
    setToDOM(settings);
  });
  
  setToDOM(settings);
}

function setToDOM(settings){
  $('#captureFrameRate').slider('setValue', settings.getCaptureFrameRate());
  $('#captureSeconds').slider('setValue', settings.getCaptureSeconds());
  $('#scale').slider('setValue', settings.getScale());
  
  $('#limitterForCaptureFrameRate').prop('checked', !settings.getCaptureFrameRateLimit()).change();
  $('#limitterForCaptureSeconds').prop('checked', !settings.getCaptureSecondsLimit()).change();
  $('#limitterForScale').prop('checked', !settings.getScaleLimit()).change();
  
  if(settings.getRepeat()===0){
    $('#loopForever').prop({'checked':true});
    $('#numLoop').val(0).prop({'disabled':true});
  }else{
    $('#numLoop').val(settings.getRepeat());
  }
  
  $('#filename').val(settings.getFilename());
  
  $('#captureType').val(settings.getCaptureType());
}
