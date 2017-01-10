(function($) {
    "use strict"; // Start of use strict
    // $('#user-tip').css({
    //   top: -100,
    //   left: 0,
    // }).slideUp();
    setTimeout(function() {
      $('#user-tip').fadeOut("slow");
    }, 3000);

})(jQuery); // End of use strict

/**
 * Date格式化
 * 用法 ： new Date( -- ).Format("yyyy-MM-dd");
 */
Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,  //月
        "d+": this.getDate(),               //日
        "h+": this.getHours(),          //小
        "m+": this.getMinutes(),        //分
        "s+": this.getSeconds(),        //秒
        "S": this.getMilliseconds()     //毫秒
    };
    if (/(y+)/.test(fmt)){
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    for (var k in o){
        if (new RegExp("(" + k + ")").test(fmt)){
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }
    return fmt;
};
