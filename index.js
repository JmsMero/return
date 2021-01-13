"use strict";

;
var pubTool = {
  /**
   * rem
   * (以750设计为基准)
   * (750 下 1rem = 100px)
   * (最大100px)
   */
  rem: function (w) {
    var doc = w.document,
      docEle = doc.documentElement,
      resizeEvt = "orientationchange" in w ? "orientationchange" : "resize",
      designWidth = 750,
      devWidth = 375,
      oenRtoP = 100,
      recalc = function recalc() {
        var clientWidth = docEle.clientWidth || devWidth;
        clientWidth > designWidth ? clientWidth = designWidth : "";

        if (clientWidth) {
          var fz = oenRtoP * (clientWidth / designWidth);
          docEle.style.fontSize = fz + "px";
          w.remscale = clientWidth / designWidth;
        }

        ;
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
  ua: function () {
    var u = navigator.userAgent;
    return {
      ie: u.indexOf('Trident') > -1 || u.indexOf('compatible') > -1 && u.indexOf('MSIE') > -1,
      edge: u.indexOf('Edge') > -1,
      opera: u.indexOf('Presto') > -1 || u.indexOf('Opera') > -1 || u.indexOf('OPR/') > -1,
      firefox: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1 && u.indexOf('Trident') == -1 || u.indexOf('Firefox') > -1,
      safari: u.indexOf('Safari') > -1 && u.indexOf('Chrome') == -1 && u.indexOf('OPR/') == -1,
      webKit: u.indexOf('AppleWebKit') > -1,
      mobile: !!u.match(/AppleWebKit.*Mobile.*/) || u.indexOf('Mobile') > -1,
      ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
      android: u.indexOf('Android') > -1 || u.indexOf('Adr') > -1,
      iPhone: u.indexOf('iPhone') > -1,
      iPad: u.indexOf('iPad') > -1,
      wechat: u.indexOf('MicroMessenger') > -1,
      qq: !!u.match(/QQ\/\d/i) || !!u.match(/QQ\//i),
      qqBrowser: u.indexOf('MQQBrowser') > -1,
      // QQ浏览器
      uc: u.indexOf('UCBrowser') > -1,
      // UC浏览器
      quark: u.indexOf('Quark') > -1,
      // 夸克浏览器
      oppo: u.indexOf('HeyTapBrowser') > -1,
      // oppo浏览器
      baidu: u.indexOf('Baidu') > -1,
      // 百度浏览器
      iqiyi: !!u.match(/iqiyi/i) // 爱奇艺

    };
  }(),

  /**
   * 读取cookie
   * @param {String} name cookie名
   * @returns {String} 返回对应kookie值或null
   */
  getCookie: function getCookie(name) {
    var arr,
      reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");

    if (arr = document.cookie.match(reg)) {
      return unescape(arr[2]);
    } else {
      return null;
    }

    ;
  },

  /**
   * 写入cookie
   * @param {String} key cookie名
   * @param {String} value cookies值
   * @param {Number} date 到期时间(年/月/日 时:分:秒)
   * @param {String} path cookie路径
   */
  setCookie: function setCookie(key, value, date, path) {
    var oDate = new Date(date);
    document.cookie = key + '=' + value + ';expires=' + oDate.toUTCString() + ';path=' + path;
  },

  /**
   * 删除cookie
   * @param {String} key cookie名
   * @param {String} path cookie路径
   */
  delCookie: function delCookie(key, path) {
    var oDate = new Date();
    oDate.setTime(oDate.getTime() - 1);
    document.cookie = key + '=;expires=' + oDate.toUTCString() + ';path=' + path;
  },

  /**
   * url 参数转 Json
   * @param {String} url url地址
   * @return {JSON} json格式参数
   */
  urlParamsToJson: function urlParamsToJson(url) {
    var urlParams = url.substr(url.indexOf('?')).substr(1);
    var paramsArr = urlParams.split("&");
    var paramJson = {};

    if (urlParams != '') {
      for (var i = 0; i < paramsArr.length; i++) {
        var pair = paramsArr[i].split("=");
        pair[1] == undefined ? paramJson[pair[0]] = '' : paramJson[pair[0]] = pair[1];
      }

      ;
    }

    ;
    return paramJson;
  },

  /**
   * 毫秒数转为天-时-分-秒-毫秒对象
   * @param {Number} totalms 总毫秒数
   * @returns {JSON} 返回天,时,分,秒,毫秒对象
   */
  timeCompute: function timeCompute(totalms) {
    var d, h, m, s, ms;
    d = Math.floor(totalms / 1000 / 60 / 60 / 24);
    h = Math.floor(totalms / 1000 / 60 / 60 % 24);
    m = Math.floor(totalms / 1000 / 60 % 60);
    s = Math.floor(totalms / 1000 % 60);
    ms = Math.floor(totalms % 1000);
    return {
      day: d,
      hour: h,
      minute: m,
      second: s,
      millisecond: ms
    };
  },

  /**
   * 范围随即数
   * @param {*} Min 最小范围
   * @param {*} Max 最大范围
   * @returns {Number} 随机数
   */
  randomNumBoth: function randomNumBoth(Min, Max) {
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
  dateFtt: function dateFtt(date, fmt) {
    var o = {
      "M+": date.getMonth() + 1,
      "d+": date.getDate(),
      "h+": date.getHours(),
      "m+": date.getMinutes(),
      "s+": date.getSeconds(),
      "q+": Math.floor((date.getMonth() + 3) / 3),
      "S+": date.getMilliseconds()
    };

    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }

    ;

    for (var k in o) {
      if (new RegExp("(" + k + ")").test(fmt)) {
        if (k == 'S+') {
          fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 || RegExp.$1.length == 2 ? o[k] : ("000" + o[k]).substr(("" + o[k]).length));
        } else {
          fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
        }

        ;
      }

      ;
    }

    ;
    return fmt;
  },

  /**
   * 生成uuid
   */
  generateUUID: function generateUUID() {
    var d = new Date().getTime();

    if (window.performance && typeof window.performance.now === "function") {
      d += performance.now();
    }

    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = (d + Math.random() * 16) % 16 | 0;
      d = Math.floor(d / 16);
      return (c == 'x' ? r : r & 0x3 | 0x8).toString(16);
    });
    return uuid;
  }
};
"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

;
var requestConfig = {
  // 游戏广告相关请求域名
  domain: '//api.interactive.lzdata.com.cn',
  // 防封系统cookie同步请求域名
  transDomain: '//trans.lalahxs.cn',
  // 是否显示console信息
  showConsole: false
};
var gameToolConfig = {
  // 客服号码
  kefuTel: '4000011320',
  // 客服组件css
  kefuCss: 'https://interactive-css.angpi.cn/1597803782706_kefu.css',
  // 客服图标地址
  kefuIcon: 'https://interactive-oss.angpi.cn/1597803865250_icon_kefu.png',
  // 客服电话图标
  kefuPhoneIcon: 'https://interactive-oss.angpi.cn/1597803880516_icon_phone.png',
  // 我的奖品页面地址
  myPrizeAddress: '//prize.lalahxs.cn/myprize.html',
  // 关闭广告提醒弹窗css
  receiveTipsPopupCss: 'https://interactive-css.angpi.cn/1608604050522_receiveTipsPopup2.css'
}; // 返回键相关数据

var backBtnData = {
  backCouponNum: 0,
  backCouponType: 'null',
  backInteractiveUrl: 'null',
  openWayFrom: null,
  openType: 'backButton' // 返回键形式标识

};
/* 游戏请求方法集合 */

var gameRequest = {
  // 获取地址栏参数
  urlParams: pubTool.urlParamsToJson(window.location.href),
  // 从页面响应头中取数据
  responseData: responseHeaderData,
  // 部分请求所需参数
  reqData: {
    adSpaceCode: '',
    sitename: '',
    requestId: '',
    dateUnix: '',
    interactiveType: '',
    diviceId: '',
    mediaRequestId: '',
    platLogRequestId: '',
    domain: '',
    tinyUrl: '',
    bulletinId: '',
    sys: '',
    tencent: '',
    locationUrl: window.location.href,
    gameStateName: '',
    backInteractiveType: ''
  },
  // 防封系统服务端cookie 标识
  serverCookie: false,
  // 获取sitename Cookie
  getSitename: function getSitename(name) {
    return pubTool.getCookie(name);
  },

  /*
  // 设置sitename Cookies
  setSitename: function(str) {
    var uuid = str == undefined ? pubTool.generateUUID() : str;
    pubTool.setCookie('sitename', uuid, new Date(new Date().toLocaleDateString() + " 23:59:59"), '/');
  },
  */
  // 初始化sitename
  initSitename: function initSitename() {
    var sitename = '';

    if (pubTool.getCookie('serverCookie') == null && this.urlParams.serverCookie == undefined) {
      this.serverCookie = false;
      sitename = this.getSitename('apicookie_' + this.reqData.adSpaceCode);
      return sitename;
    } else {
      this.serverCookie = true;
      sitename = pubTool.getCookie('serverCookie');
      pubTool.delCookie('serverCookie', '/'); // 如果cookie中获取不到，从url中获取

      if (sitename == null) {
        sitename = this.urlParams.serverCookie;
      }

      ;
      return sitename;
    }

    ;
  },
  // 初始化数据
  initData: function initData() {
    this.reqData.interactiveType = window.gameType;
    this.reqData.adSpaceCode = this.urlParams.adSpaceCode != undefined ? this.urlParams.adSpaceCode : '';
    this.reqData.dateUnix = this.urlParams.dateUnix != undefined ? this.urlParams.dateUnix : '';
    this.reqData.diviceId = this.urlParams.diviceId != undefined ? this.urlParams.diviceId : '';
    this.reqData.mediaRequestId = this.urlParams.mediaRequestId != undefined ? this.urlParams.mediaRequestId : '';
    this.reqData.domain = this.urlParams.domain != undefined ? this.urlParams.domain : '';
    this.reqData.tinyUrl = this.urlParams.tinyUrl != undefined ? this.urlParams.tinyUrl : '';
    this.reqData.bulletinId = this.urlParams.bulletinId != undefined ? this.urlParams.bulletinId : '';
    this.reqData.sys = this.urlParams.sys != undefined ? this.urlParams.sys : '';
    this.reqData.tencent = this.urlParams.tencent != undefined ? this.urlParams.tencent : '';
    this.reqData.backInteractiveType = this.urlParams.backInteractiveType != undefined ? this.urlParams.backInteractiveType : 'null';
    this.reqData.sitename = this.initSitename(); // 设置游戏状态保存的key名

    this.reqData.gameStateName = this.reqData.interactiveType + '_state_' + this.reqData.adSpaceCode; // 获取cookie中的platLogRequestId

    this.reqData.platLogRequestId = pubTool.getCookie('platLogRequestId') != null ? pubTool.getCookie('platLogRequestId') : ''; // 防封模式，某些浏览器从响应头获取信息

    if (gameRequest.serverCookie && gameRequest.responseData.getFromHeader) {
      var temp = gameRequest.responseData.req.getResponseHeader('platLogRequestId');
      var couponNum = gameRequest.responseData.req.getResponseHeader('backCouponNum');
      var couponType = gameRequest.responseData.req.getResponseHeader('backCouponType');
      var interactiveUrl = gameRequest.responseData.req.getResponseHeader('backInteractiveUrl');
      this.reqData.platLogRequestId = temp != null ? temp : '';
      backBtnData.backCouponNum = couponNum || 0;
      backBtnData.backCouponType = couponType || 'null';
      backBtnData.interactiveUrl = interactiveUrl || 'null';
    } else {
      backBtnData.backCouponNum = pubTool.getCookie('backCouponNum') != null ? pubTool.getCookie('backCouponNum') : 0;
      backBtnData.backCouponType = pubTool.getCookie('backCouponType') != null ? pubTool.getCookie('backCouponType') : 'null';
      backBtnData.backInteractiveUrl = pubTool.getCookie('backInteractiveUrl') != null ? pubTool.getCookie('backInteractiveUrl') : 'null';
    }

    ; // 获取是否返回键落地页

    backBtnData.openWayFrom = this.urlParams.openWayFrom != undefined ? this.urlParams.openWayFrom : null; // 返回键落地页游戏状态key名追加 _backBtn 标识

    backBtnData.openWayFrom != null ? this.reqData.gameStateName = this.reqData.interactiveType + '_state_' + this.reqData.adSpaceCode + '_backBtn' : "";
  },
  // 生成requestId
  createRequestId: function createRequestId() {
    this.reqData.requestId = Date.parse(new Date()) / 1000 + '' + pubTool.randomNumBoth(100000, 999999);
    return this.reqData.requestId;
  },
  // 设置requestId
  setRequestId: function setRequestId(id) {
    this.reqData.requestId = id != undefined ? id : '';
  },
  // 设置游戏类型
  setGameType: function setGameType(str) {
    this.reqData.interactiveType = str != undefined ? str : '';
  },
  // 动态加载script
  loadScript: function loadScript(url, callback){
    var script = document.createElement ("script")
    script.type = "text/javascript";
    if (script.readyState){
      script.onreadystatechange = function(){
        if (script.readyState == "loaded" || script.readyState == "complete"){
          script.onreadystatechange = null;
          callback();
        }
      };
    } else {
      script.onload = function(){
        callback();
      };
    }
    script.src = url;
    document.querySelector('.specialWinPopup').appendChild(script);
  },
  // post请求封装
  $post: function $post(obj) {
    var ajaxTimeOut = $.ajax({
      type: "POST",
      url: obj.url,
      data: obj.data,
      timeout: 5000,
      async: true,
      dataType: "json",
      xhrFields: {
        withCredentials: true
      },
      crossDomain: true,
      success: function success(data) {
        this.showConsole ? console.log(data) : "";
        obj.success(data);
      },
      error: function error(XMLHttpRequest, textStatus, errorThrown) {
        this.showConsole ? console.log(XMLHttpRequest, textStatus, errorThrown) : "";
        obj.error(XMLHttpRequest, textStatus, errorThrown);
      },
      complete: function complete(XMLHttpRequest, status) {
        if (status == 'timeout') {
          ajaxTimeOut.abort();
        }

        ;
      }
    });
  },
  // 追加请求参数
  addRequestData: function addRequestData(obj, data) {
    if (obj != undefined && obj.addData != undefined) {
      for (var key in obj.addData) {
        data[key] = obj.addData[key];
      }

      ;
    }

    ;
    return data;
  },

  /* 点击红包数 */
  clickRedBagNum: function clickRedBagNum(obj) {
    var that = this,
      num = 60,
      clInterval; // 当页面是从上一页返回时，加载返回形式

    if (that.reqData.platLogRequestId == pubTool.getCookie('oldPlatLogRequestId') && backBtnData.backCouponType != 'null') {
      gameTool.addReturnPopup();
    }

    ;

    var countBagNum = function countBagNum() {
      var tData = {
        adSpaceCode: that.reqData.adSpaceCode,
        sitename: that.reqData.sitename,
        platLogRequestId: that.reqData.platLogRequestId,
        interactiveType: that.reqData.interactiveType,
        domain: that.reqData.domain,
        tinyUrl: that.reqData.tinyUrl,
        bulletinId: that.reqData.bulletinId,
        sys: that.reqData.sys,
        tencent: that.reqData.tencent,
        backInteractiveType: that.reqData.backInteractiveType
      };
      that.reqData.diviceId == '' ? '' : tData.diviceId = that.reqData.diviceId;
      that.reqData.mediaRequestId == '' ? '' : tData.mediaRequestId = that.reqData.mediaRequestId;
      that.addRequestData(obj, tData); // 获取旧的 PlatLogRequestId

      var oldPlatLogRequestId = pubTool.getCookie('oldPlatLogRequestId'); // 如果当前platLogRequestId与旧platLogRequestId不一致，则发送请求

      if (tData.platLogRequestId != oldPlatLogRequestId) {
        that.$post({
          url: requestConfig.domain + '/markClickRedBagNum',
          data: tData,
          success: function success(data) {
            if (data.code == '000000') {
              // 将返回的返回键形式保存到sessionStorage中
              if (data.data != null && _typeof(data.data) == 'object') {
                sessionStorage.setItem("backCoupon", JSON.stringify(data.data)); // 将返回形式添加到页面中

                gameTool.addReturnPopup();
              } else {
                sessionStorage.removeItem("backCoupon");
              }

              ; // 请求成功，将本次platLogRequestId保存至cookie

              pubTool.setCookie('oldPlatLogRequestId', that.reqData.platLogRequestId, new Date(new Date().toLocaleDateString() + " 23:59:59"), '/');
            }

            ;
            obj != undefined && obj.success != undefined ? obj.success(data) : "";
          },
          error: function error(x, t, e) {
            obj != undefined && obj.success != undefined ? obj.error(x, t, e) : "";
            clearInterval(clInterval);
            clInterval = setInterval(function () {
              num -= 5;
              countBagNum();
            }, 2000);

            if (num <= 0) {
              clearInterval(clInterval);
            }
          }
        });
      }

      ;
    };

    countBagNum();
  },

  /* 活动参与数 */
  clickNum: function clickNum(obj) {
    var tData = {
      adSpaceCode: this.reqData.adSpaceCode,
      sitename: this.reqData.sitename,
      platLogRequestId: this.reqData.platLogRequestId,
      domain: this.reqData.domain,
      tinyUrl: this.reqData.tinyUrl,
      bulletinId: this.reqData.bulletinId,
      sys: this.reqData.sys,
      tencent: this.reqData.tencent,
      backInteractiveType: this.reqData.backInteractiveType
    };
    this.addRequestData(obj, tData);
    this.$post({
      url: requestConfig.domain + '/markClickNum',
      data: tData,
      success: function success(data) {
        obj != undefined && obj.success != undefined ? obj.success(data) : "";
      },
      error: function error(x, t, e) {
        obj != undefined && obj.success != undefined ? obj.error(x, t, e) : "";
      }
    });
  },

  /* 获取广告 */
  getPlat: function getPlat(obj) {
    var tData = {
      dateUnix: this.reqData.dateUnix,
      adSpaceCode: this.reqData.adSpaceCode,
      sitename: this.reqData.sitename,
      referrerUrl: document.referrer,
      platLogRequestId: this.reqData.platLogRequestId,
      interactiveType: this.reqData.interactiveType,
      locationUrl: this.reqData.locationUrl,
      backInteractiveType: this.reqData.backInteractiveType
    };
    this.addRequestData(obj, tData);
    this.$post({
      url: requestConfig.domain + '/plat',
      data: tData,
      success: function success(data) {
        if (data.code == '000000' && data.data != undefined) {
          gameRequest.setRequestId(data.data.requestId);
        }

        ;
        obj != undefined && obj.success != undefined ? obj.success(data) : "";
      },
      error: function error(x, t, e) {
        obj != undefined && obj.success != undefined ? obj.error(x, t, e) : "";
      }
    });
  },

  /* 获取宝箱链接 */
  findAdInfoByRequest: function findAdInfoByRequest(obj) {
    var tData = {};
    this.addRequestData(obj, tData);
    this.$post({
      url: requestConfig.domain + '/findAdInfoByRequestId',
      data: tData,
      success: function success(data) {
        obj != undefined && obj.success != undefined ? obj.success(data) : "";
      },
      error: function error(x, t, e) {
        obj != undefined && obj.success != undefined ? obj.error(x, t, e) : "";
      }
    });
  },

  /* 领券量 */
  receiveCoupon: function receiveCoupon(obj) {
    var tData = {
      requestId: this.reqData.requestId,
      sitename: this.reqData.sitename
    };
    this.addRequestData(obj, tData);
    this.$post({
      url: requestConfig.domain + '/markReceiveCoupon',
      data: tData,
      success: function success(data) {
        obj != undefined && obj.success != undefined ? obj.success(data) : "";
      },
      error: function error(x, t, e) {
        obj != undefined && obj.success != undefined ? obj.error(x, t, e) : "";
      }
    });
  },

  /* 防封系统cookie同步 */
  transCookie: function transCookie(obj) {
    var tData = {
      serverCookie: this.reqData.sitename,
      gameType: this.reqData.interactiveType,
      cookieKey: this.reqData.gameStateName,
      cookieData: pubTool.getCookie(this.reqData.gameStateName)
    }; // 返回键落地页时，追加返回键落地页标识

    backBtnData.openWayFrom != null ? tData.openType = backBtnData.openType : "";
    this.addRequestData(obj, tData);
    this.$post({
      url: requestConfig.transDomain + '/transCookie',
      data: tData,
      success: function success(data) {
        obj != undefined && obj.success != undefined ? obj.success(data) : "";
      },
      error: function error(x, t, e) {
        obj != undefined && obj.success != undefined ? obj.error(x, t, e) : "";
      }
    });
  }
};
/* 游戏工具方法集合 */

var gameTool = {
  // 获取游戏状态Cookie
  getGameSatesCookie: function getGameSatesCookie(name) {
    var key = name == undefined ? gameRequest.reqData.gameStateName : name;
    var data = pubTool.getCookie(key);
    data != null ? data = JSON.parse(window.atob(data)) : "";

    if (gameRequest.serverCookie && gameRequest.responseData.getFromHeader && data == null) {
      var temp = gameRequest.responseData.req.getResponseHeader(key);
      temp != null ? data = JSON.parse(window.atob(temp)) : "";
    }

    ;
    return data;
  },
  // 设置游戏状态Cookie
  setGameSatesCookie: function setGameSatesCookie(obj, name) {
    var key = name == undefined ? gameRequest.reqData.gameStateName : name;
    var n = window.btoa(JSON.stringify(obj));
    pubTool.setCookie(key, n, new Date(new Date().toLocaleDateString() + " 23:59:59"), '/');

    if (gameRequest.serverCookie) {
      gameRequest.transCookie();
    }

    ;
  },
  // 获取元素旋转角度
  getRotate: function getRotate(e) {
    var style = getComputedStyle(e, null),
      transform = style.getPropertyValue("-webkit-transform") || style.getPropertyValue("-moz-transform") || style.getPropertyValue("-ms-transform") || style.getPropertyValue("-o-transform") || style.getPropertyValue("transform") || "FAIL",
      matrix = transform != 'none' ? transform.split("(")[1].split(")")[0].split(",") : ['0', '0'],
      i = parseFloat(matrix[0]),
      o = parseFloat(matrix[1]);
    return Math.round(Math.atan2(o, i) * (180 / Math.PI));
  },
  // 添加返回形式
  addReturnPopup: function addReturnPopup() {
    var popupData = sessionStorage.getItem("backCoupon");

    if (popupData != null) {
      popupData = JSON.parse(popupData);
      $('body .returnWinPopup').remove();
      $('body').append(popupData.content);
    }

    ;
  },
  // 执行返回键落地页
  doBackInteractive: function doBackInteractive() {
    var url = backBtnData.backInteractiveUrl;

    if (url != 'null') {
      // 添加标记是返回键打开的
      url.indexOf('?') > -1 ? url = url + '&openWayFrom=backBtn&openType=' + backBtnData.openType : url = url + '?openWayFrom=backBtn&openType=' + backBtnData.openType; // 跳转至返回键落地页

      window.location.replace(url);
    } else {
      history.back();
    }

    ;
  },
  // 游戏中奖弹窗基本对象
  GamePopup: function GamePopup(config) {
    if (typeof Object.assign != 'function') {
      Object.assign = function(target) {
        'use strict';
        if (target == null) {
          throw new TypeError('Cannot convert undefined or null to object');
        }

        target = Object(target);
        for (var index = 1; index < arguments.length; index++) {
          var source = arguments[index];
          if (source != null) {
            for (var key in source) {
              if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
              }
            }
          }
        }
        return target;
      };
    };
    var _this = this;
    this.$ele = $("");
    this.$closeBtn = $("");
    this.$jumpBtn = $("");
    this.open = "";
    this.close = ""; // 关闭动画

    this.closeAnimation = function (param) {
      // 计算落点位置
      var x = pubTool.rem.designWidth * remscale / 2 - 15;
      var y = $(window).height() / 2 - 15;
      var closeAnimitionMask = '<div class="closeAnimition-mask" style="position:fixed;top:0;right:0;bottom:0;left:0;background-color:rgba(0,0,0,.8);z-index: 1000;"></div>';
      var popupObj = {
        myPrize: '',
        popupMask: '',
        popupBody: '',
        before: function before() {},
        end: function end() {}
      }; // 合并传入参数

      Object.assign(popupObj, param);
      popupObj.before();
      this.$closeBtn.css('visibility', 'hidden');
      popupObj.popupMask.css('background-color', 'rgba(0,0,0,0)');
      $('.closeAnimition-mask').remove();
      $('body').append(closeAnimitionMask);
      popupObj.myPrize.css('z-index', '1001');
      popupObj.popupBody.css({
        'transform': 'translate(' + x + 'px, -' + y + 'px) scale(0)',
        'transition': 'transform 0.8s ease-out'
      });
      setTimeout(function () {
        popupObj.end();

        _this.$closeBtn.css('visibility', '');

        popupObj.popupMask.css('background-color', '');
        popupObj.myPrize.css('z-index', '');
        $('.closeAnimition-mask').remove();
        popupObj.popupBody.css({
          'transform': '',
          'transition': ''
        });
      }, 800);
    };

    this.closeClick = function (e) {};

    this.jumpClick = function (e) {};

    Object.assign(this, config);
    this.$closeBtn.click(function (e) {
      _this.closeClick(e);
    });
    this.$jumpBtn.click(function (e) {
      _this.jumpClick(e);
    });
  },
  // 返回形式基本对象
  ReturnPopup: function ReturnPopup(config) {
    var _this = this;
    if (typeof Object.assign != 'function') {
      Object.assign = function(target) {
        'use strict';
        if (target == null) {
          throw new TypeError('Cannot convert undefined or null to object');
        }

        target = Object(target);
        for (var index = 1; index < arguments.length; index++) {
          var source = arguments[index];
          if (source != null) {
            for (var key in source) {
              if (Object.prototype.hasOwnProperty.call(source, key)) {
                target[key] = source[key];
              }
            }
          }
        }
        return target;
      };
    };
    this.$ele = $("");
    this.$closeBtn = $("");
    this.$jumpBtn = $("");
    this.popupState = "";
    this.open = "";
    this.close = "";

    this.closeClick = function (e) {};

    this.jumpClick = function (e) {};

    Object.assign(_this, config);
    this.$closeBtn.click(function (e) {
      _this.closeClick(e);
    });
    this.$jumpBtn.click(function (e) {
      _this.jumpClick(e);
    });
  },
  // 客服组件
  userService: {
    init: function init() {
      var kefuModule = document.createElement('div');
      var style = '<link rel="stylesheet" href="' + gameToolConfig.kefuCss + '">';
      var dom = '<div class="kefu-btn"><img src="' + gameToolConfig.kefuIcon + '"></div><div class="kefu-container"><div class="kefu-mask"></div><div class="kefu-content"><ul class="kefu-list"><li><a class="list-btn" href="tel:' + gameToolConfig.kefuTel + '"><img class="tel-icon" src="' + gameToolConfig.kefuPhoneIcon + '"><span class="kefu-tel">' + gameToolConfig.kefuTel + '</span><span class="kefu-time">(9:00-18:00)</span></a></li></ul><div class="kefu-close-btn">取消</div></div></div>';
      kefuModule.id = "kefu-module";
      kefuModule.innerHTML = style + dom;
      var oldEle = document.getElementById('kefu-module');

      if (oldEle != null) {
        document.querySelector('body').removeChild(oldEle);
      }

      ;
      document.querySelector('body').appendChild(kefuModule);
      this.listen();
    },
    listen: function listen() {
      document.querySelector("#kefu-module .kefu-btn").onclick = function (e) {
        document.querySelector("#kefu-module .kefu-container").style.display = "block";
      };

      document.querySelector("#kefu-module .kefu-mask").onclick = function (e) {
        e.stopPropagation();
        e.preventDefault();
        document.querySelector("#kefu-module .kefu-container").style.display = "none";
      };

      document.querySelector("#kefu-module .kefu-close-btn").onclick = function (e) {
        e.stopPropagation();
        e.preventDefault();
        document.querySelector("#kefu-module .kefu-container").style.display = "none";
      };
    }
  },
  // 宝箱
  treasureChest: {
    init: function init() {
      var containerDom = "<div class=\"incentive-icon-container\">\n                                   <div class=\"chest-container\">\n                                            <div class=\"chest\">\n                                                <div class=\"chest\"></div>\n                                                <div class=\"chest-star\"></div>\n                                          </div>\n                                      <div class=\"chest-title\">\n                                      <div class=\"chest-title-text\">\n                                        <span class=\"chest-count\"></span>/<span class=\"chest-maxCount\">7</span>\n                                      <div>\n                                  </div>\n                              </div>\n                          </div>\n                  </div>\n                  <div class=\"incentive-tips\">\u592A\u68D2\u4E86\uFF01\u8FD8\u5DEE <span></span> \u5757\u5B9D\u7BB1\u788E\u7247\u5C31\u80FD\u6253\u5F00\u5566~</div>\n            </div>";
      $('.incentive-container').children().remove();
      $('.incentive-container').append(containerDom);
    }
  },
  // 提示条
  toast: function toast(text, time) {
    var defaults = {
      text: '提示信息',
      time: '3000'
    };
    text != undefined ? defaults.text = text : "";
    time != undefined ? defaults.time = time : "";
    var $template = $('<div class="gToast">' + defaults.text + '</div>');
    $template.css({
      "display": "none",
      "max-width": "80%",
      "font-size": "14px",
      "color": "#FFF",
      "text-align": "center",
      "background-color": "rgba(0,0,0,0.7)",
      "border-radius": "5px",
      "padding": "10px 15px",
      "position": "fixed",
      "left": "50%",
      "bottom": "20%",
      "z-index": "9999",
      "-ms-transform": "translateX(-50%)",
      "-moz-transform": "translateX(-50%)",
      "-webkit-transform": "translateX(-50%)",
      "transform": "translateX(-50%)"
    });
    var $body = $('body');
    var timer;
    $('.gToast').remove();
    $body.append($template);
    $template.fadeIn(200);

    if (defaults.time != 0) {
      timer = setTimeout(function () {
        clearTimeout(timer);
        $template.fadeOut(400, function () {
          $template.remove();
        });
      }, defaults.time);
    }

    ;
  },
  // 我的奖品
  myPrize: {
    init: function init(name) {
      this.myPrizeEle = $(name)[0];
    },
    addClick: function addClick() {
      $(this.myPrizeEle).click(function (e) {
        e.stopPropagation();
        e.preventDefault();
        window.location.href = gameToolConfig.myPrizeAddress + '?adSpaceCode=' + gameRequest.reqData.adSpaceCode + '&sitename=' + gameRequest.reqData.sitename;
      });
    },
    show: function show(name) {
      this.init(name);
      this.addClick();
      $(this.myPrizeEle).show();
    },
    hide: function hide() {
      $(this.myPrizeEle).hide();
    }
  },
  // loading效果
  loading: {
    init: function init() {
      var loadingDom = "<div class=\"loading-box\">\n                     <div class=\"loading-content\">\n                        <img class=\"loading-gif\" src=\"https://interactive-oss.angpi.cn/1605854627287_loading\">\n                     </div>\n            </div>";
      $('body .loading-box').remove();
      $('body').append(loadingDom);
    },
    show: function show() {
      if (!pubTool.ua.quark && pubTool.ua.iPhone || !pubTool.ua.iPhone) {
        $('.loading-box .loading-content').css('display', "block");
      }
    },
    hide: function hide() {
      $('.loading-box .loading-content').fadeOut("slow");
    }
  },
  // 关闭广告提醒弹窗
  closeIntercept: {
    init: function init() {
      var popopDom = '<div class="receiveTipsPopup"><link rel="stylesheet" href="' + gameToolConfig.receiveTipsPopupCss + '">' + '<div class="receive-mask"><div class="receive-container"><div class="receive-light"></div><div class="receive-bg">' + '<div id="receiveCloseBtn" typ="close" class="receive-close-btn"></div><div id="receiveTakeBtn" typ="take" class="receive-take-btn"></div>' + '</div></div></div</div>';
      $('body .receiveTipsPopup').remove();
      $('body').append(popopDom);
    },
    show: function show(data) {
      var prizeInfo = data,
        _this = this;

      $('.receiveTipsPopup .receive-mask').css('display', "block");
      $('.receiveTipsPopup #receiveCloseBtn,.receiveTipsPopup #receiveTakeBtn').off('click').click(function (e) {
        e.stopPropagation();
        e.preventDefault();
        var btnTpe = $(e.currentTarget).attr('typ');
        var event = btnTpe == 'take' ? 'closepop_receive_coupon' : 'closepop_giveup_receive_coupon'; // 统计领券量

        gameRequest.receiveCoupon({
          addData: {
            event: event
          },
          success: function success(data) {
            if (data.code == '000000') {
              if (event == 'closepop_receive_coupon') {
                gameTool.loading.show();
              }

              _this.hide();

              btnTpe == 'take' ? window.location.href = prizeInfo.link : '';
            } else {
              gameTool.toast(data.msg);
            }

            ;
          },
          error: function error(x, t, e) {
            gameTool.toast('网络好像有点问题，请稍后再试吧~');
          }
        });
      });
    },
    hide: function hide() {
      $('.receiveTipsPopup .receive-mask').css('display', "none");
      $('.receiveTipsPopup #receiveCloseBtn,.receiveTipsPopup #receiveTakeBtn').off('click');
    }
  },
  // 返回键监听
  backBtnListen: {
    backListening: false,
    //是否在监听返回键
    isListenPopstate: false,
    //是否在监听popstate
    isSupportListen: false,
    //是否支持监听返回键
    // 各步骤执行下一步延时时间
    nextOutTime: function () {
      var time = {
        startNextTime: 100,
        //开始设置返回键监听操作延时时间
        interceptNextTime: 0,
        //设置拦截页后下一步延时时间
        currentNextTime: 0,
        //设置展示页后下一步延时时间
        BackNextTime: 200,
        //执行后退后下一步延时时间
        ForwardNextTime: 50,
        //执行前进后下一步延时时间
        doForwardAgainTime: 200 //再次执行前进延时时间

      }; // uc、夸克执行返回操作后延时时间修改为1100毫秒

      if (pubTool.ua.uc || pubTool.ua.quark) {
        time.interceptNextTime = 300;
        time.currentNextTime = 100;
      }

      ; // oppo浏览器执行返回操作后延时时间修改为100毫秒

      if (pubTool.ua.oppo) {
        time.BackNextTime = 100;
      }

      ; // 爱奇艺下再次执行前进延时改为400毫秒

      if (pubTool.ua.iqiyi) {
        time.doForwardAgainTime = 400;
      }

      ;
      return time;
    }(),
    // 设置返回键拦截页
    setIntercept: function setIntercept(next) {
      window.history.replaceState('intercept', null);
      setTimeout(function () {
        next != undefined && typeof next == "function" && next();
      }, this.nextOutTime.interceptNextTime);
    },
    // 设置新增一条页面记录，用于展示原页面内容
    setCurrent: function setCurrent(next) {
      window.history.pushState('current', null);
      setTimeout(function () {
        next != undefined && typeof next == "function" && next();
      }, this.nextOutTime.currentNextTime);
    },
    // 执行历史记录后退
    doHistoryBack: function doHistoryBack(next) {
      window.history.back();
      setTimeout(function () {
        next != undefined && typeof next == "function" && next();
      }, this.nextOutTime.BackNextTime);
    },
    // 执行历史记录前进
    doHistoryForward: function doHistoryForward(next) {
      window.history.forward();
      setTimeout(function () {
        next != undefined && typeof next == "function" && next();
      }, this.nextOutTime.ForwardNextTime);
    },
    // 设置历史记录
    setHistoryRecords: function setHistoryRecords() {
      var _this = this;

      setTimeout(function () {
        // 依据当前所在位置设置监听
        // UC 或 夸克浏览器 只设置 state，不进行前进后退
        if (pubTool.ua.uc || pubTool.ua.quark) {
          if (history.state == 'current') {
            if (history.length <= 1) {
              _this.setIntercept(function () {
                _this.setCurrent(function () {
                  _this.setPpopstateListen();
                });
              });
            } else {
              _this.setPpopstateListen();
            }

            ;
          } else if (history.state == 'intercept') {
            _this.setCurrent(function () {
              _this.setPpopstateListen();
            });
          } else {
            _this.setIntercept(function () {
              _this.setCurrent(function () {
                _this.setPpopstateListen();
              });
            });
          }

          ;
        } else {
          if (history.state == 'current') {
            _this.historyBackForward();
          } else if (history.state == 'intercept') {
            _this.setCurrent(function () {
              _this.historyBackForward();
            });
          } else {
            _this.setIntercept(function () {
              _this.setCurrent(function () {
                _this.historyBackForward();
              });
            });
          }

          ;
        }

        ;
      }, this.nextOutTime.startNextTime);
    },
    // 通过执行一次先后退再前进操作，解决部分环境必须和浏览器有交互的问题（腾讯系浏览器暂无法解决）
    historyBackForward: function historyBackForward() {
      var _this = this; // 执行后退操作


      _this.doHistoryBack(function () {
        // 执行后退操作后如果是拦截页则进行前进操作
        if (history.state == 'intercept') {
          // 前进后监听popstate
          _this.doHistoryForward(function () {
            _this.setPpopstateListen();
          });
        } else if (history.state == 'current' && pubTool.ua.qqBrowser) {
          // QQ浏览器下，后退不生效时直接监听
          _this.setPpopstateListen();
        } else if (history.state == 'current' && pubTool.ua.iqiyi) {
          // 爱奇艺下，后退不是监听页时延时再次判断
          setTimeout(function () {
            if (history.state == 'intercept') {
              // 前进后监听popstate
              _this.doHistoryForward(function () {
                _this.setPpopstateListen();
              });
            }

            ;
          }, _this.nextOutTime.doForwardAgainTime);
        } else {
          // 如果历史记录长度小于等于1，则重新设置监听（此方法主要解决清除浏览器记录造成的死循环）
          if (history.length <= 1) {
            _this.setIntercept();

            _this.setHistoryRecords();
          }

          ;
        }

        ;
      });
    },
    // 设置popstate监听
    setPpopstateListen: function setPpopstateListen() {
      var _this = this; // 设置popstate触发后执行内容


      _this.setpopstateEvent(); // 如果没有在监听popstate则进行监听


      if (!_this.isListenPopstate) {
        // 监听popstate
        window.addEventListener('popstate', function (e) {
          _this.popstateEvent(e);
        }, false);
        _this.isListenPopstate = true;
      }

      ;
    },
    // popstate触发后执行内容
    popstateEvent: function popstateEvent(e) {},
    // 设置popstate触发后执行内容
    setpopstateEvent: function setpopstateEvent() {
      // 将popstate触发执行内容赋为监听返回键
      this.popstateEvent = this.listenBack;
      this.backListening = true;
    },
    // 监听是否是返回键
    listenBack: function listenBack(e) {
      // 如果回到了监听页面，则说明触发了返回键
      if (history.state == 'intercept') {
        this.cancelListen();
        this.backEvent(e);
      }

      ;
    },
    // 触发返回键后执行内容
    backEvent: function backEvent() {},
    // 设置返回键监听
    setListen: function setListen(callback) {
      // 非百度浏览器下监听返回键
      if (!pubTool.ua.baidu) {
        // 传入返回键触发后执行内容时将返回键后执行内容覆写
        if (callback != undefined && typeof callback == 'function') {
          this.backEvent = callback;
        }

        ; // 判断设备是否支持监听返回键用到的方法

        if (window.history.replaceState && window.history.pushState) {
          this.isSupportListen = true;
          this.setHistoryRecords();
        } else {
          this.isSupportListen = false; // 不支持时在控制面版输出警告信息

          console.warn('设备不支持replaceState与pushState');
        }

        ;
      }

      ;
    },
    // 取消返回键监听
    cancelListen: function cancelListen() {
      // 将popstate触发后执行内容赋为空
      this.popstateEvent = function () {};

      this.backListening = false;
    },
    // 再次设置返回键监听
    setListenAgain: function setListenAgain(callback) {
      if (this.isSupportListen && !this.backListening) {
        // 传入返回键触发后执行内容时将返回键后执行内容覆写
        if (callback != undefined && typeof callback == 'function') {
          this.backEvent = callback;
        }

        ;
        this.setHistoryRecords();
      }

      ;
    },
    // 继续监听返回键
    listenContinue: function listenContinue(callback) {
      var _this = this; // 传入返回键触发后执行内容时将返回键后执行内容覆写


      if (callback != undefined && typeof callback == 'function') {
        this.backEvent = callback;
      }

      ; // 如果没有在监听则进行继续监听

      if (!_this.backListening) {
        _this.doHistoryForward(function () {
          _this.setpopstateEvent();
        });
      } else {
        _this.doHistoryForward();
      }

      ;
    }
  }
};
