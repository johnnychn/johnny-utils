/**
 * 微信分享
 */
let JUtils={};
JUtils.Data={};
JUtils.Cookie={};
JUtils.String={};
JUtils.Css={};
JUtils.Time={};
JUtils.Math={};

/** 绑定事件到dom元素，返回解除绑定的函数
 * @param dom:Element
 * @param event:String
 * @param callback:Function
 * @param useCapture:Boolean 指定事件是否在捕获或冒泡阶段执行
 * @return:Function 解除绑定的函数
 */

JUtils.bindEvent = function (dom, event, callback, useCapture) {
    function remove() {
        dom.removeEventListener(event, icc, useCapture)
    }
    function icc(e) {
        if (callback(e) === true) {
            remove();
        }
    }
    dom.addEventListener(event, icc, useCapture);
    return remove;
};
/*
 * 动态加载 js
 * @src:String js地址
 * @callback:Function js加载成功后的回调函数
 * */
JUtils.getScript = function (src, callback) {
    let head = document.getElementsByTagName("head")[0] || document.documentElement;
    let script = document.createElement("script");
    script.async = "true";
    script.src = src;
    let done = false;
    script.onload = script.onreadystatechange = function () {
        if (!done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
            done = true;
            try {
                callback(script);
            } catch (err) {
                throw (new Error('Script load Error:' + src))
            }
            script.onload = script.onreadystatechange = null;
        }
    };
    head.insertBefore(script, head.firstChild);
};
/*
 * 动态加载 css
 * @src:String css地址
 * @callback:Function css加载成功后的回调函数
 * */
JUtils.getCss = function (src, callback) {
    let head = document.getElementsByTagName("head")[0] || document.documentElement;
    let script = document.createElement("link");
    script.async = "true";
    script.href = src;
    script.rel = 'stylesheet';
    script.type = 'text/css';
    let done = false;
    script.onload = script.onreadystatechange = function () {
        if (!done && (!this.readyState || this.readyState === "loaded" || this.readyState === "complete")) {
            done = true;
            try {
                callback(script);
            } catch (err) {
                throw (new Error('Css load Error:' + src))
            }
            script.onload = script.onreadystatechange = null;
        }
    };

    head.insertBefore(script, head.firstChild);
};
//是否数组
JUtils.Data.isObject = function (arg) {
    return Object.prototype.toString.call(arg) === '[object Object]';
};

//是否数组
JUtils.Data.isNumber = function (arg) {
    return Object.prototype.toString.call(arg) === '[object Number]';
};

//是否数组
JUtils.Data.isArray = function (arg) {
    return Object.prototype.toString.call(arg) === '[object Array]';
};
//是否字符串
JUtils.Data.isString = function (arg) {
    return Object.prototype.toString.call(arg) === '[object String]';
};
//获取Cookie
JUtils.Cookie.get=function (name) {
    let arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg))
        return decodeURI(arr[2]);
    else
        return null;
};
//获取Cookie
JUtils.Cookie.set=function(name, value, time) {
    let strsec = JUtils.Time.sec(time);
    let exp = new Date();
    exp.setTime(exp.getTime() + strsec * 1);
    document.cookie = name + "=" + encodeURI(value) + ";expires=" + exp.toGMTString();
};
//删除Cookie
JUtils.Cookie.del=function (name) {
    let exp = new Date();
    exp.setTime(exp.getTime() - 1);
    let cval = getCookie(name);
    if (cval != null){
        document.cookie = name + "=" + cval + ";expires=" + exp.toGMTString();
    }

};
//字符串转换毫秒
JUtils.Time.sec=function(str) {
    let str1 = str.substring(0, str.length - 1) * 1;
    let str2 = str.substring(str.length - 1,str.length );
    switch (str2){
        case 's':
            return str1 * 1000;
            break;
        case 'm':
            return str1 * 60000;
            break;
        case 'h':
            return str1 * 3600000;
            break;
        case 'd':
            return str1 * 3600000*24;
            break;

    }

};

//字符串替换
JUtils.String.replace = function (str, match, replace_str) {
    return str.replace(new RegExp(match, 'gm'), replace_str);
};

JUtils.Math.degreeRadian=function (degree) {
    return degree/ 180 * Math.PI;
};
JUtils.Math.radianDegree=function (radian) {
    return radian/Math.PI*180 ;
};


//矩形函数


JUtils.Rect=function(x, y, width, height) {
    this.x = x||0;
    this.y = y||0;
    this.width = width||0;
    this.height = height||0;
};
JUtils.Rect.prototype.fixInRec = function ( recBig) {
    let rec=this;
    let obj = {width: 0, height: 0};
    let rad = rec.width / rec.height;
    let radbig = recBig.width / recBig.height;
    if (rad > radbig) {
        obj.width = recBig.width;
        obj.height = obj.width / rad;
    } else {
        obj.height = recBig.height;
        obj.width = obj.height * rad;
    }
    obj.x = (recBig.width - obj.width) / 2;
    obj.y = (recBig.height - obj.height) / 2;
    obj.scale = obj.width / rec.width;
    return obj;
};
JUtils.Rect.prototype.fillInRec = function (recBig) {
    let rec=this;
    let obj = {width: 0, height: 0};
    let rad = rec.width / rec.height;
    let radbig = recBig.width / recBig.height;
    if (rad < radbig) {
        obj.width = recBig.width;
        obj.height = obj.width / rad;
    } else {
        obj.height = recBig.height;
        obj.width = obj.height * rad;
    }
    obj.x = (recBig.width - obj.width) / 2;
    obj.y = (recBig.height - obj.height) / 2;
    obj.scale = obj.width / rec.width;
    return obj;
};


// eval
JUtils.eval = function (v) {
    let eval_str = ('(' + v + ')');
    return new Function('return ' + eval_str)();
};
//简易模版引擎
JUtils.nano = function (template, data) {
    return template.replace(/\{([\w\.]*)\}/g, function (str, key) {
        let keys = key.split("."), v = data[keys.shift()];
        for (let i = 0, l = keys.length; i < l; i++) v = v[keys[i]];
        return (typeof v !== "undefined" && v !== null) ? v : "";
    });
};
/*
 * 为css加入浏览器前缀
 * */
JUtils.Css.fixCss=function(name, attr) {
    let cssObj = {};
    if (!attr || attr === '') {
        return cssObj;
    }
    cssObj[name] = attr;
    cssObj['-webkit-' + name] = attr;
    cssObj['-moz-' + name] = attr;
    cssObj['-ms-' + name] = attr;
    cssObj['-o-' + name] = attr;
    return cssObj;
};
JUtils.Css.css = function (el, obj) {
    if (el&&obj) {
        for (let i in obj) {
            if (el.style) {
                el.style[i] = obj[i];
            }
        }
    }
};


window.JUtils=  JUtils;
module.exports = window.JUtils;