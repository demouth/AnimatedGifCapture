importScripts('LZWEncoder.js', 'NeuQuant.js', 'GIFEncoder.js');

var encoder = new GIFEncoder();
var count = 0;
onmessage = function (e) {
  if (e.data.cmd === "start") {
    var data = e.data.data;
    encoder.setRepeat(data.repeat);
    encoder.setDelay(data.delay);
    encoder.setSize(data.width, data.height);

    encoder.start();
  } else
  if (e.data.cmd === "finish") {
    encoder.finish();
    postMessage({status:'end' , data:encoder.stream().getData()});
    count=0;
  } else 
  if (e.data.cmd === "frame"){
    encoder.addFrame(e.data.data, true);
    count++;
    postMessage({status:'processing',count:count});
  }
};
