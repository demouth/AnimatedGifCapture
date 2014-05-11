var SettingsLoader = function(){

};

SettingsLoader.prototype = {
  settings : null,
  load : function(callback){
    var that = this;
    chrome.storage.sync.get(
      Settings.getDefault(),
      function(items) {
        that.settings = new Settings(items);
        callback && callback.bind(that).call();
      }
    );
    return this;
  },
  get : function(){
    return this.settings;
  }
};