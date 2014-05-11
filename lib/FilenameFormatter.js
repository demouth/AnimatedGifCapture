(function (scope) {
  'use strict';
  var FilenameFormatter = function () {
    
  };
  /**
   * 
   * @param format string
   * @param d Date 省略可
   */
  FilenameFormatter.format = function (format, d) {
    if (!d) {
      d = new Date();
    }
    var Y = d.getFullYear(),
      M = ("0" + (d.getMonth() + 1)).slice(-2),
      D = ("0" + d.getDate()).slice(-2),
      H = ("0" + d.getHours()).slice(-2),
      I = ("0" + d.getMinutes()).slice(-2),
      S = ("0" + d.getSeconds()).slice(-2);
    var Ys = '{Y}',
      Ms = '{M}',
      Ds = '{D}',
      Hs = '{H}',
      Is = '{I}',
      Ss = '{S}';
    var str = format
      .replace(Ys,Y)
      .replace(Ms,M)
      .replace(Ds,D)
      .replace(Hs,H)
      .replace(Is,I)
      .replace(Ss,S);
    return str+'.gif';
  };
  
  scope.FilenameFormatter = FilenameFormatter;
}(window));