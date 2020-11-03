;var pubTool = {
  /**
   * rem
   * (以750设计为基准)
   * (750 下 1rem = 100px)
   * (最大100px)
   */
  rem: function(w) {
    var doc = w.document, docEle = doc.documentElement,
      resizeEvt = "orientationchange" in w ? "orientationchange" : "resize",
      designWidth = 750, devWidth = 375, oenRtoP = 100,
      recalc = function() {
        var clientWidth = docEle.clientWidth || devWidth;
        clientWidth > designWidth ? clientWidth = designWidth : "";
        if (clientWidth) {
          var fz = oenRtoP * (clientWidth / designWidth);
          docEle.style.fontSize = fz + "px";
          w.remscale = clientWidth / designWidth;
        };
      };
    doc.addEventListener && (w.addEventListener(resizeEvt, recalc, false), doc.addEventListener("DOMContentLoaded", recalc, false));
    return {
      designWidth: designWidth,
      devWidth: devWidth,
      oenRtoP: oenRtoP,
      setRem: recalc
    };
  }(window),

  /***
   *  浏览器UA信息
   */
  ua: function() {
    var u = navigator.userAgent;
    return {
      ie: u.indexOf('Trident') > -1 || (u.indexOf('compatible') > -1 && u.indexOf('MSIE') > -1),
      edge: u.indexOf('Edge') > -1,
      opera: u.indexOf('Presto') > -1 || u.indexOf('Opera') > -1 || u.indexOf('OPR/') > -1,
      firefox: (u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1 && u.indexOf('Trident') == -1) || u.indexOf('Firefox') > -1,
      safari: u.indexOf('Safari') > -1 && u.indexOf('Chrome') == -1 && u.indexOf('OPR/') == -1,
      webKit: u.indexOf('AppleWebKit') > -1,
      mobile: !!u.match(/AppleWebKit.*Mobile.*/) || u.indexOf('Mobile') > -1,
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
      android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1,
      iPhone: u.indexOf('iPhone') > -1 ,
      iPad: u.indexOf('iPad') > -1,
      wechat: u.indexOf('MicroMessenger') > -1,
      qq: !!u.match(/QQ\/\d/i) || !!u.match(/QQ\//i),
      uc: u.indexOf('UCBrowser') > -1,  // UC浏览器
      quark: u.indexOf('Quark') > -1,  // 夸克浏览器
      oppo: u.indexOf('HeyTapBrowser') > -1,  // oppo浏览器
      baidu: u.indexOf('Baidu') > -1  // 百度浏览器
    };
  }(),

  /**
   * 读取cookie
   * @param {String} name cookie名
   * @returns {String} 返回对应kookie值或null
   */
  getCookie: function(name) {
    var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
    if (arr = document.cookie.match(reg)) {
      return unescape(arr[2]);
    } else {
      return null;
    };
  },

  /**
   * 写入cookie
   * @param {String} key cookie名
   * @param {String} value cookies值
   * @param {Number} date 到期时间(年/月/日 时:分:秒)
   * @param {String} path cookie路径
   */
  setCookie: function(key, value, date, path) {
    var oDate = new Date(date);
    document.cookie = key + '=' + value + ';expires=' + oDate.toUTCString() + ';path=' + path;
  },

  /**
   * 删除cookie
   * @param {String} key cookie名
   * @param {String} path cookie路径
   */
  delCookie: function(key, path) {
    var oDate = new Date();
    oDate.setTime(oDate.getTime() - 1);
    document.cookie = key + '=;expires=' + oDate.toUTCString() + ';path=' + path;
  },

  /**
   * url 参数转 Json
   * @param {String} url url地址
   * @return {JSON} json格式参数
   */
  urlParamsToJson: function(url) {
    var urlParams = url.substr(url.indexOf('?')).substr(1);
    var paramsArr = urlParams.split("&");
    var paramJson = {};

    if ( urlParams != '') {
      for (var i=0; i<paramsArr.length; i++) {
        var pair = paramsArr[i].split("=");
        pair[1] == undefined ? paramJson[pair[0]] = '' : paramJson[pair[0]] = pair[1];
      };
    };
    return paramJson;
  },

  /**
   * 毫秒数转为天-时-分-秒-毫秒对象
   * @param {Number} totalms 总毫秒数
   * @returns {JSON} 返回天,时,分,秒,毫秒对象
   */
  timeCompute: function(totalms) {
    var d,h,m,s,ms;
    d = Math.floor(totalms / 1000 / 60 / 60 / 24);
    h = Math.floor(totalms / 1000 / 60 / 60 % 24);
    m = Math.floor(totalms / 1000 / 60 % 60);
    s = Math.floor(totalms / 1000 % 60);
    ms = Math.floor(totalms % 1000);
    return {day:d, hour:h, minute:m, second:s, millisecond:ms};
  },

  /**
   * 范围随即数
   * @param {*} Min 最小范围
   * @param {*} Max 最大范围
   * @returns {Number} 随机数
   */
  randomNumBoth: function(Min,Max){
    var Range = Max - Min;
    var Rand = Math.random();
    var num = Min + Math.round(Rand * Range);
    return num;
  },

  /**
   * 日期格式化
   * @param {Date} date 需格式化的日期
   * @param {String} fmt 所需的格式
   * @returns {String} 格式化后的日期字符串
   */
  dateFtt: function(date, fmt) {
    var o = {
      "M+" : date.getMonth()+1,
      "d+" : date.getDate(),
      "h+" : date.getHours(),
      "m+" : date.getMinutes(),
      "s+" : date.getSeconds(),
      "q+" : Math.floor((date.getMonth()+3)/3),
      "S+" : date.getMilliseconds()
    };
    if(/(y+)/.test(fmt)) {
      fmt=fmt.replace(RegExp.$1, (date.getFullYear()+"").substr(4 - RegExp.$1.length));
    };
    for(var k in o) {
      if(new RegExp("("+ k +")").test(fmt)) {
        if (k == 'S+') {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1 || RegExp.$1.length==2) ? (o[k]) : (("000"+ o[k]).substr((""+ o[k]).length)));
        } else {
          fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
        };
      };
    };
    return fmt;
  },

  /**
   * 生成uuid
   */
  generateUUID: function() {
    var d = new Date().getTime();
    if (window.performance && typeof window.performance.now === "function") {
      d += performance.now();
    }
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
    return uuid;
  }

};
// 返回键相关数据
var backBtnData = {
  backCouponNum: 1,
  backCouponType: 'https://www.baidu.com',
  backInteractiveUrl: './index2.html',
  openWayFrom: null
};
var gameTool = {
  // 执行返回键落地页
  doBackInteractive: function() {
    var url = backBtnData.backInteractiveUrl;
    if (url != 'null') {
      // 添加标记是返回键打开的
      this.pushHistory()
      url.indexOf('?') > -1 ? url = url + '&openWayFrom=backBtn' : url = url + '?openWayFrom=backBtn';
      // 跳转至返回键落地页
      window.location.href = url;
    } else {
      history.back();
    };
  },
  pushHistory() {
    var url = "#";
    var state = {
      title: "title",
      url: "#"
    };
    window.history.pushState(state, "title", "#");
  },
  backBtnListen: {
    backListening: false,  //是否在监听返回键
    isListenPopstate: false,  //是否在监听popstate
    isSupportListen: false,  // 是否支持监听返回键
    // 各步骤执行下一步延时时间
    nextOutTime: function(){
      var time = {
        interceptNextTime: 0,  //设置拦截页后下一步延时时间
        currentNextTime: 0,  //设置展示页后下一步延时时间
        BackNextTime: 100,  //执行后退后下一步延时时间
        ForwardNextTime: 10  //执行前进后下一步延时时间
      };

      // uc、夸克执行返回操作后延时时间修改为1024毫秒
      if (pubTool.ua.uc || pubTool.ua.quark) {time.BackNextTime = 1024};
      // oppo浏览器执行返回操作后延时时间修改为25毫秒
      if (pubTool.ua.oppo) {time.ForwardNextTime = 25};
      return time;
    }(),

    // 设置返回键拦截页
    setIntercept: function(next) {
      window.history.replaceState('intercept', null);
      setTimeout(function(){
        next != undefined && typeof(next) == "function" && next();
      }, this.nextOutTime.interceptNextTime);
    },
    // 设置新增一条页面记录，用于展示原页面内容
    setCurrent: function(next) {
      window.history.pushState('current', null);
      setTimeout(function(){
        next != undefined && typeof(next) == "function" && next();
      }, this.nextOutTime.currentNextTime);
    },
    // 执行历史记录后退
    doHistoryBack: function(next) {
      window.history.back();
      setTimeout(function(){
        next != undefined && typeof(next) == "function" && next();
      }, this.nextOutTime.BackNextTime);
    },
    // 执行历史记录前进
    doHistoryForward: function(next) {
      window.history.forward();
      setTimeout(function(){
        next != undefined && typeof(next) == "function" && next();
      }, this.nextOutTime.ForwardNextTime);
    },
    // 设置历史记录
    setHistoryRecords: function() {
      var _this = this;

      // 依据当前所在位置设置监听
      if (history.state == 'current') {
        _this.historyBackForward();
      } else if (history.state == 'intercept') {
        _this.setCurrent(function(){
          _this.historyBackForward();
        });
      } else {
        _this.setIntercept(function(){
          _this.setCurrent(function(){
            _this.historyBackForward();
          });
        });
      };
    },
    // 通过执行一次先后退再前进操作，解决部分环境必须和浏览器有交互的问题（腾讯系浏览器暂无法解决）
    historyBackForward: function() {
      var _this = this;

      // 执行后退操作
      _this.doHistoryBack(function() {
        // 执行后退操作后如果是拦截页则进行前进操作
        if (history.state == 'intercept') {
          // 前进后监听popstate
          _this.doHistoryForward(function() {
            _this.setPpopstateListen();
          });
        } else {
          console.log(history.length)
          // 如果历史记录长度小于等于2，则重新设置监听（此方法主要解决清除浏览器记录造成的死循环）
          if (history.length <= 2) {
            _this.setIntercept();
            _this.setHistoryRecords();
          };
        };
      });

    },
    // 设置popstate监听
    setPpopstateListen: function() {
      var _this = this;

      // 设置popstate触发后执行内容
      _this.setpopstateEvent();
      // 如果没有在监听popstate则进行监听
      if (!_this.isListenPopstate) {
        // 监听popstate
        window.addEventListener('popstate', function(e){
          _this.popstateEvent(e);
        }, false);
        _this.isListenPopstate = true;
      };
    },
    // popstate触发后执行内容
    popstateEvent: function(e) {
    },
    // 设置popstate触发后执行内容
    setpopstateEvent: function() {
      // 将popstate触发执行内容赋为监听返回键
      this.popstateEvent = this.listenBack;
      this.backListening = true;
    },
    // 监听是否是返回键
    listenBack: function(e) {
      // 如果回到了监听页面，则说明触发了返回键
      if (history.state == 'intercept') {
        this.cancelListen();
        this.backEvent(e);
      };
    },
    // 触发返回键后执行内容
    backEvent: function() {
    },
    setListen: function(callback) {
      // 非百度浏览器下监听返回键
      if (!pubTool.ua.baidu) {
        // 传入返回键触发后执行内容时将返回键后执行内容覆写
        if (callback != undefined && typeof(callback) == 'function') {
          this.backEvent = callback;
        };
        // 判断设备是否支持监听返回键用到的方法
        if (window.history.replaceState && window.history.pushState) {
          this.isSupportListen  = true;
          this.setHistoryRecords();
        } else {
          this.isSupportListen  = false;
          // 不支持时在控制面版输出警告信息
          console.warn('设备不支持replaceState与pushState');
        };
      };
    },
    // 取消返回键监听
    cancelListen: function() {
      // 将popstate触发后执行内容赋为空
      this.popstateEvent = function() {};
      this.backListening = false;
    },
    // 再次设置返回键监听
    setListenAgain: function(callback) {
      if(this.isSupportListen && !this.backListening) {
        // 传入返回键触发后执行内容时将返回键后执行内容覆写
        if (callback != undefined && typeof(callback) == 'function') {
          this.backEvent = callback;
        };
        this.setHistoryRecords();
      };
    },
    // 继续监听返回键
    listenContinue: function(callback) {
      var _this = this;
      // 传入返回键触发后执行内容时将返回键后执行内容覆写
      if (callback != undefined && typeof(callback) == 'function') {
        this.backEvent = callback;
      };
      // 如果没有在监听则进行继续监听
      if (!_this.backListening) {
        _this.doHistoryForward(function(){
          _this.setpopstateEvent();
        });
      } else{
        _this.doHistoryForward();
      };
    }
  }
};
