
chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    
    var filename = request.filename;
    
    //@see http://blog.agektmr.com/2013/09/canvas-png-blob.html
    // 空の Uint8Array ビューを作る
    var buffer = new Uint8Array(request.rawData.length);
    // Uint8Array ビューに 1 バイトずつ値を埋める
    for (var i = 0; i < request.rawData.length; i++) {
      buffer[i] = request.rawData.charCodeAt(i);
    }
    // Uint8Array ビューのバッファーを抜き出し、それを元に Blob を作る
    var blob = new Blob([buffer.buffer], {type: 'image/gif'});

    var a = document.createElement('A');
    a.href = window.URL.createObjectURL(blob);
    //a.textContent = 'link';
    a.setAttribute('download', filename);
    a.click();
    
    window.URL.revokeObjectURL(a.href);
    sendResponse({farewell: "goodbye"});
  }
);
