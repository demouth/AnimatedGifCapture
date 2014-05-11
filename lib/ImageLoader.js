//@see http://jquery-master.net/blog/preload_promise/
(function ($, global) {
  var ImageLoader = function(imageSrcList){
    this.imageSrcList = imageSrcList;
    this.images = [];
    this.onDone = function(images){};
  };
  ImageLoader.prototype = {
    load:function(){
      var that = this;
      var promise;

      // 画像の先読み関数。promiseを返す。
      function preload() {
        var promises = [],
          retDefer = $.Deferred(),
          imgs = $.map(arguments, function (val) {
              return val;
          });
        $.each(imgs, function () {
          var img = new Image(),
            defer = $.Deferred();
          that.images.push(img);
          img.onload = function () {
            defer.resolve();
            defer = null;
          };
          img.onerror = function () {
            defer.reject();
            defer = null;
          };
          img.src = this; //ここのthisは、それぞれの画像ファイル名
          promises.push(defer.promise());
        });

        $.when.apply(null, promises).done(function () {
          retDefer.resolve();
        });

        $.when.apply(null, promises).fail(function () {
          retDefer.reject();
        });
        return retDefer.promise();
      }
      
      // 画像の先読みを指示し、promiseを受け取る
      promise = preload(this.imageSrcList);
      //if(this.imageSrcList.length===0)promise.resolve();

      // 全て無事読み込みが完了した時の処理
      // promise.done(this.done.bind(this));
      promise.done(
        (function(){
          this.onDone.bind(this)(this.images);
        }).bind(this)
      );
      // 画像が1つでも読み込み失敗した時の処理
      promise.fail(this.fail);
    },
    done : function(callback){
      this.onDone = callback;
      return this;
    },
    fail:function(){
    }
  };
  global.ImageLoader = ImageLoader;
})(jQuery,window);
