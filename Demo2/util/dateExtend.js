/**
 * 对Date的扩展，将 Date 转化为指定格式的String
 * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)可以用 1-2 个占位符
 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字)
 * eg:
 * (new Date()).format("yyyy-MM-dd hh:mm:ss.S")==> 2006-07-02 08:09:04.423      
 * (new Date()).format("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04      
 * (new Date()).format("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04      
 * (new Date()).format("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04      
 * (new Date()).format("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18  
 * (new Date()).format("yyyy-MM-ddTHH:mm:sszzz") ==> 2018-07-10T12:10:11+08:00
 */

Date.prototype.format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1,  //月份
        "d+": this.getDate(),       //日
        "h+": this.getHours() % 12 == 0 ? 12 : this.getHours() % 12, //小时
        "H+": this.getHours(),      //小时
        "m+": this.getMinutes(),    //分
        "s+": this.getSeconds(),    //秒
        "q+": Math.floor((this.getMonth() + 3) / 3), //季度
        "S": this.getMilliseconds(), //毫秒
    };
    var week = {
        "0": "一",
        "1": "二",
        "2": "三",
        "3": "四",
        "4": "五",
        "5": "六",
        "6": "天"
    };
    if (/(y+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, (this.getFullYear().toString()).substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(fmt)) {
        fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "星期" : "周") : "") + week[this.getDay().toString()]);
    }

    if (/(sszzz)/.test(fmt)) {
        var seconds = ("00" + this.getSeconds()).substr(this.getSeconds().toString().length);
        var timezone = this.getTimezoneOffset() / 60;
        var strTimezone = ("00" + Math.abs(timezone)).substr(Math.abs(timezone).toString().length) + ":00";
        strTimezone = (timezone < 0 ? "+" : "-") + strTimezone;
        fmt = fmt.replace(RegExp.$1, seconds+strTimezone);
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(fmt)) {
            var value = o[k].toString();
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? value : (("00" + value).substr(value.length)));
        }
    }
    return fmt;
}  