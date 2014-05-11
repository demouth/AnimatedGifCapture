var icon = new AppIcon();
var unconnectedData = null;

chrome.browserAction.onClicked.addListener(function(){
  icon.disable();
  
  var settingsLoader = new SettingsLoader().load(function(){
    var settings = settingsLoader.get();
    startCapture(settings);
  });
});
chrome.tabs.onActivated.addListener(function(activeInfo){
  if(unconnectedData) connect(unconnectedData);
});
chrome.windows.onFocusChanged.addListener(function(windowId){
  if(unconnectedData) connect(unconnectedData);
});

function startCapture(settings){
  
  var option = {
    interval: settings.getInterval(),
    numCapture: settings.getNumCapture(),
    repeat: settings.getRepeat(),
    scale: settings.getScale(),
    captureType: settings.getCaptureType(),
    filename: FilenameFormatter.format(settings.getFilename())
  };

  var startTime = null;
  CaptureFactory.get(option)
    .done(function(srcList){
      
      //キャプチャーにかかった時間（ミリ秒）
      option.delay = ((new Date().getTime()/1000) - startTime) / option.numCapture * 1000;
      console.log('lapsed time : ', (new Date().getTime()/1000) - startTime);
      
      new ImageLoader(srcList)
        .done(function(images){
          
          new AnimatedGIFConverter(option)
            .done(function (rawData) {
              connect( {rawData:rawData, filename:option.filename} );
              icon.enable().clearImage().drawDefaultBackground().changeIcon();
            })
            .progress(function(progress){
              icon
                .clearImage()
                .drawProcessingBackground()
                .setProgressProcessingColor()
                .drawProgress(progress)
                .changeIcon();
            })
            .convert(images);
          
        })
        .load();
    })
    .progress(function(progress){
      if(startTime==null) startTime = new Date().getTime()/1000;
      icon
        .clearImage()
        .drawDefaultBackground()
        .setProgressCapturingColor()
        .drawProgress(progress)
        .changeIcon();
    })
    .error(function(){
      icon.enable().clearImage().drawDefaultBackground().changeIcon();
    })
    .startCapture();
  
}

function connect(ob){
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
      chrome.tabs.sendMessage(tabs[0].id, ob, function(response) {
        //response
        if(response===undefined){
          unconnectedData = ob;
        }else{
          unconnectedData = null;
        }
      });
  });
}