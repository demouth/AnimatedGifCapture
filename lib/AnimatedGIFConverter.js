var AnimatedGIFConverter = function(option){
  this.onDone = function (rawData) {};
  this.onProgress = function (progress) {};
  this.option = option;
};
AnimatedGIFConverter.prototype = {
  convert : function(images){
    var option = this.option,
        w = images[0] ? ~~(images[0].width*option.scale) : 0,
        h = images[0] ? ~~(images[0].height*option.scale) : 0;
    this._createGIF(
      {
        images: images,
        delay: option.delay,
        repeat: option.repeat,
        width: w,
        height: h,
        numCapture: option.numCapture
      },
      this.onDone,
      this.onProgress
    );
  },
  done : function(callback){
    this.onDone = callback;
    return this;
  },
  progress : function(callback){
    this.onProgress = callback;
    return this;
  },
  // Array{DOM Image} -> callback(dataURL)
  _createGIF : function(args, callback, progressCallback) {
    var images = args.images || [];
    var numCapture = args.numCapture;
    var option = {
      delay: args.delay || 100,
      repeat: args.repeat || 0,  // default: auto loop
      width: args.width || 400,
      height: args.height || 400
    };
    
    var canvas = document.createElement('canvas');
    var context = canvas.getContext('2d');


    canvas.width = option.width;
    canvas.height = option.height;

    // GIFは透明にできないから白色で塗る
    context.fillStyle = "rgb(255,255,255)";  
    context.fillRect(0, 0, canvas.width, canvas.height);

    var worker = new Worker('../vendor/jsgif/encoder.js');

    worker.postMessage({ cmd: 'start', data: option });

    images.forEach(function (image) {
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      // Workerにフレームのデータを送る
      worker.postMessage({ cmd: 'frame', data: context.getImageData(0, 0, canvas.width, canvas.height).data });
      context.fillRect(0, 0, canvas.width, canvas.height);
    });
    worker.postMessage({ cmd: 'finish' });

    worker.onmessage = function (e) {
      switch(e.data.status){
        case 'end':
          callback(e.data.data);
          break;
        case 'processing':
          progressCallback(e.data.count/numCapture);
          break;
      }
      //callback('data:image/gif;base64,' + encode64(e.data));
    };
  }
};