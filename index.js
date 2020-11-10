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
  kefuCss: 'https://interactive-css.oss-cn-beijing.aliyuncs.com/1597803782706_kefu.css',
  // 客服图标地址
  kefuIcon: 'https://interactive-oss.oss-cn-beijing.aliyuncs.com/1597803865250_icon_kefu.png',
  // 客服电话图标
  kefuPhoneIcon: 'https://interactive-oss.oss-cn-beijing.aliyuncs.com/1597803880516_icon_phone.png',
  // 我的奖品页面地址
  myPrizeAddress: '//prize.interactive.lzdata.com.cn/myprize.html',
  // 关闭广告提醒弹窗css
  receiveTipsPopupCss: 'https://interactive-css.oss-cn-beijing.aliyuncs.com/1598673473530_receiveTipsPopup2.css'
};
// 返回键相关数据
var backBtnData = {
  backCouponNum: 0,
  backCouponType: 'null',
  backInteractiveUrl: 'null',
  openWayFrom: null
};

/* 游戏请求方法集合 */
var gameRequest = {
  // 获取地址栏参数
  urlParams: pubTool.urlParamsToJson(window.location.href),
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
    gameStateName: ''
  },
  // 防封系统服务端cookie 标识
  serverCookie: false,

  // 获取sitename Cookie
  getSitename: function(name) {
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
  initSitename: function() {
    var sitename = '';
    if (pubTool.getCookie('serverCookie') == null && this.urlParams.serverCookie == undefined) {
      this.serverCookie = false;
      sitename = this.getSitename('apicookie_' + this.reqData.adSpaceCode);
      return sitename;
    } else {
      this.serverCookie = true;
      sitename = pubTool.getCookie('serverCookie');
      pubTool.delCookie('serverCookie', '/');
      // 如果cookie中获取不到，从url中获取
      if (sitename == null) {
        sitename = this.urlParams.serverCookie;
      };
      return sitename;
    };
  },
  // 初始化数据
  initData: function() {
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
    this.reqData.platLogRequestId = pubTool.getCookie('platLogRequestId') != null ? pubTool.getCookie('platLogRequestId') : '';
    this.reqData.sitename = this.initSitename();
    // 获取返回键相关数据
    backBtnData.openWayFrom = this.urlParams.openWayFrom != undefined ? this.urlParams.openWayFrom : null;
    // backBtnData.backCouponNum = pubTool.getCookie('backCouponNum') != null ? pubTool.getCookie('backCouponNum') : 0;
    // backBtnData.backCouponType = pubTool.getCookie('backCouponType') != null ? pubTool.getCookie('backCouponType') : 'null';
    // backBtnData.backInteractiveUrl = pubTool.getCookie('backInteractiveUrl') != null ? pubTool.getCookie('backInteractiveUrl') : 'null';
    backBtnData.backCouponNum = pubTool.getCookie('backCouponNum') != null ? pubTool.getCookie('backCouponNum') : 0;
    backBtnData.backCouponType = 'ZJD';
    backBtnData.backInteractiveUrl = 'http://api.interactive.lzdata.com.cn/interactive.htm?dateUnix=1600407721417&adSpaceCode=MEDIA200918134201175850&backInteractionType=hot_dog';
    // 设置游戏状态保存的key名
    if (backBtnData.openWayFrom == null) {
      this.reqData.gameStateName = this.reqData.interactiveType + '_state_' + this.reqData.adSpaceCode;
    } else {
      this.reqData.gameStateName = this.reqData.interactiveType + '_state_' + this.reqData.adSpaceCode + '_backBtn';
    };
    setTimeout(function (){
      sessionStorage.setItem("isStop", true);
    },30)
  },
  // 生成requestId
  createRequestId: function() {
    this.reqData.requestId = (Date.parse(new Date())/1000) + '' + pubTool.randomNumBoth(100000, 999999);
    return this.reqData.requestId;
  },
  // 设置requestId
  setRequestId: function(id) {
    this.reqData.requestId = id != undefined ? id : '';
  },
  // 设置游戏类型
  setGameType: function (str) {
    this.reqData.interactiveType = str != undefined ? str : '';
  },
  // post请求封装
  $post: function(obj) {
    var ajaxTimeOut = $.ajax({
      type: "POST",
      url: obj.url,
      data: obj.data,
      timeout : 5000,
      async: true,
      dataType: "json",
      xhrFields: {withCredentials: true},
      crossDomain: true,
      success: function(data) {
        this.showConsole ? console.log(data) : "";
        obj.success(data);
      },
      error: function(XMLHttpRequest,textStatus,errorThrown) {
        this.showConsole ? console.log(XMLHttpRequest,textStatus,errorThrown) : "";
        obj.error(XMLHttpRequest,textStatus,errorThrown);
      },
      complete: function(XMLHttpRequest,status) {
        if (status == 'timeout') {
          ajaxTimeOut.abort();
        };
      }
    });
  },
  // 追加请求参数
  addRequestData: function(obj, data) {
    if (obj != undefined && obj.addData != undefined) {
      for(let key in obj.addData){
        data[key] = obj.addData[key];
      };
    };
    return data;
  },
  /* 点击红包数 */
  clickRedBagNum: function(obj) {
    let that = this,num=60,clInterval;

    // 当页面是从上一页返回时，加载返回形式
    if (that.reqData.platLogRequestId == pubTool.getCookie('oldPlatLogRequestId') && backBtnData.backCouponType != 'null') {
      gameTool.addReturnPopup();
    };

    var countBagNum = function (){
      var tData = {
        adSpaceCode: that.reqData.adSpaceCode,
        sitename: that.reqData.sitename,
        platLogRequestId: that.reqData.platLogRequestId,
        interactiveType: that.reqData.interactiveType,
        domain: that.reqData.domain,
        tinyUrl: that.reqData.tinyUrl,
        bulletinId: that.reqData.bulletinId,
        sys: that.reqData.sys,
        tencent: that.reqData.tencent
      };
      that.reqData.diviceId == '' ? '' : tData.diviceId = that.reqData.diviceId;
      that.reqData.mediaRequestId == '' ? '' : tData.mediaRequestId = that.reqData.mediaRequestId;
      that.addRequestData(obj, tData);

      // 获取旧的 PlatLogRequestId
      var oldPlatLogRequestId = pubTool.getCookie('oldPlatLogRequestId');

      // 如果当前platLogRequestId与旧platLogRequestId不一致，则发送请求
      if (tData.platLogRequestId != oldPlatLogRequestId) {
        that.$post({
          url: requestConfig.domain + '/markClickRedBagNum',
          data: tData,
          success: function(data) {
            console.log(data)
            if (data.code == '000000') {
              // 将返回的返回键形式保存到sessionStorage中
              // if (data.data != null && typeof(data.data) == 'object') {
              //   sessionStorage.setItem("backCoupon", JSON.stringify(data.data));
              //   // 将返回形式添加到页面中
              //   gameTool.addReturnPopup();
              // } else {
              //   // sessionStorage.removeItem("backCoupon");
              // };
              sessionStorage.setItem("backCoupon", '<div class="returnWinPopup"><link href="https://interactive-css.oss-cn-beijing.aliyuncs.com/1603684441087_returnPopupType-02.css" rel="stylesheet"><div class="throwing_eggs type-02"><div class="throwing_eggs_box"><img class="te_ribbon" src="https://interactive-oss.oss-cn-beijing.aliyuncs.com/1599119658666_throwing_eggs_cd.png"><ui class="teggs_list"><li class="eggs1 tc-close-btn"></li><li class="eggs2 tc-close-btn"></li><li class="eggs3 tc-close-btn"></li></ui></div></div><script>var returnPopupScript=document.createElement("script");returnPopupScript.type="text/javascript",returnPopupScript.onload=function(){setReturnPopup()},document.querySelector(".returnWinPopup").append(returnPopupScript),returnPopupScript.src="https://interactive-js.oss-cn-beijing.aliyuncs.com/1602729572915_specialPopupType-02.js"</script></div>');
              // 将返回形式添加到页面中
              gameTool.addReturnPopup();
              // 请求成功，将本次platLogRequestId保存至cookie
              pubTool.setCookie('oldPlatLogRequestId', that.reqData.platLogRequestId, new Date(new Date().toLocaleDateString() + " 23:59:59"), '/');
            };
            (obj != undefined && obj.success != undefined) ? obj.success(data) : "";
          },
          error: function(x,t,e) {
            (obj != undefined && obj.success != undefined) ? obj.error(x,t,e) : "";
            clearInterval(clInterval);
            clInterval = setInterval(function(){
              num-=5;
              countBagNum();
            },2000);
            if(num <= 0){
              clearInterval(clInterval);
            }
          }
        });
      };
    };
    countBagNum();
  },
  /* 活动参与数 */
  clickNum: function(obj) {
    var tData = {
      adSpaceCode: this.reqData.adSpaceCode,
      sitename: this.reqData.sitename,
      platLogRequestId: this.reqData.platLogRequestId,
      domain: this.reqData.domain,
      tinyUrl: this.reqData.tinyUrl,
      bulletinId: this.reqData.bulletinId,
      sys: this.reqData.sys,
      tencent: this.reqData.tencent
    };
    this.addRequestData(obj, tData);
    this.$post({
      url: requestConfig.domain + '/markClickNum',
      data: tData,
      success: function(data) {
        (obj != undefined && obj.success != undefined) ? obj.success(data) : "";
      },
      error: function(x,t,e) {
        (obj != undefined && obj.success != undefined) ? obj.error(x,t,e) : "";
      }
    });
  },
  /* 获取广告 */
  getPlat: function(obj) {
    var tData = {
      dateUnix: this.reqData.dateUnix,
      adSpaceCode: this.reqData.adSpaceCode,
      sitename: this.reqData.sitename,
      referrerUrl: document.referrer,
      platLogRequestId: this.reqData.platLogRequestId,
      interactiveType: this.reqData.interactiveType,
      locationUrl: this.reqData.locationUrl
    };
    this.addRequestData(obj, tData);
    this.$post({
      url: requestConfig.domain + '/plat',
      data: tData,
      success: function(data) {
        if (data.code == '000000' && data.data != undefined) {
          gameRequest.setRequestId(data.data.requestId);
        };
        (obj != undefined && obj.success != undefined) ? obj.success(data) : "";
      },
      error: function(x,t,e) {
        (obj != undefined && obj.success != undefined) ? obj.error(x,t,e) : "";
      }
    });
  },
  /* 获取宝箱链接 */
  findAdInfoByRequest: function (obj) {
    var tData = {};
    this.addRequestData(obj, tData);
    this.$post({
      url: requestConfig.domain + '/findAdInfoByRequestId',
      data: tData,
      success: function (data) {
        (obj != undefined && obj.success != undefined) ? obj.success(data) : "";
      },
      error: function (x, t, e) {
        (obj != undefined && obj.success != undefined) ? obj.error(x, t, e) : "";
      }
    });

  },
  /* 领券量 */
  receiveCoupon: function(obj) {
    var tData = {
      requestId: this.reqData.requestId,
      sitename: this.reqData.sitename
    };
    this.addRequestData(obj, tData);
    this.$post({
      url: requestConfig.domain + '/markReceiveCoupon',
      data: tData,
      success: function(data) {
        (obj != undefined && obj.success != undefined) ? obj.success(data) : "";
      },
      error: function(x,t,e) {
        (obj != undefined && obj.success != undefined) ? obj.error(x,t,e) : "";
      }
    });
  },
  /* 防封系统cookie同步 */
  transCookie: function(obj) {
    var tData = {
      serverCookie: this.reqData.sitename,
      gameType: this.reqData.interactiveType,
      cookieKey: this.reqData.gameStateName,
      cookieData: pubTool.getCookie(this.reqData.gameStateName)
    };
    this.addRequestData(obj, tData);
    this.$post({
      url: requestConfig.transDomain + '/transCookie',
      data: tData,
      success: function(data) {
        (obj != undefined && obj.success != undefined) ? obj.success(data) : "";
      },
      error: function(x,t,e) {
        (obj != undefined && obj.success != undefined) ? obj.error(x,t,e) : "";
      }
    });
  }

};

/* 游戏工具方法集合 */
var gameTool = {
  // 获取游戏状态Cookie
  getGameSatesCookie: function(name) {
    var key = name == undefined ? gameRequest.reqData.gameStateName : name;
    return pubTool.getCookie(key) == null ? null : JSON.parse(window.atob(pubTool.getCookie(key)));
  },
  // 设置游戏状态Cookie
  setGameSatesCookie: function setGameSatesCookie(obj, name) {
    var key = name == undefined ? gameRequest.reqData.gameStateName : name;
    var n = window.btoa(JSON.stringify(obj));
    pubTool.setCookie(key, n, new Date(new Date().toLocaleDateString() + " 23:59:59"), '/');
    if (gameRequest.serverCookie) {gameRequest.transCookie();};
  },
  // 获取元素旋转角度
  getRotate: function(e) {
    var style = getComputedStyle(e, null),
      transform = style.getPropertyValue("-webkit-transform") || style.getPropertyValue("-moz-transform") || style.getPropertyValue("-ms-transform") || style.getPropertyValue("-o-transform") || style.getPropertyValue("transform") || "FAIL",
      matrix = transform != 'none' ? transform.split("(")[1].split(")")[0].split(",") : ['0', '0'],
      i = parseFloat(matrix[0]),
      o = parseFloat(matrix[1]);
    return Math.round(Math.atan2(o, i) * (180 / Math.PI));
  },
  // 添加返回形式
  addReturnPopup: function() {
    var popupData = sessionStorage.getItem("backCoupon");
    if (popupData != null) {
      // popupData = JSON.parse(popupData);
      $('body .returnWinPopup').remove();
      // $('body').append(popupData.content);
      $('body').append(popupData);
    };
  },
  // 执行返回键落地页
  doBackInteractive: function() {
    var url = backBtnData.backInteractiveUrl;
    if (url != 'null') {
      // 添加标记是返回键打开的
      url.indexOf('?') > -1 ? url = url + '&openWayFrom=backBtn' : url = url + '?openWayFrom=backBtn';
      // 跳转至返回键落地页
      window.location.replace(url)
    } else {
      history.back();
    };
  },
  // 游戏中奖弹窗基本对象
  GamePopup: function(config) {
    var _this = this;
    this.$ele = $("");
    this.$closeBtn = $("");
    this.$jumpBtn = $("");
    this.open = "";
    this.close = "";
    // 关闭动画
    this.closeAnimation = function(param) {
      // 计算落点位置
      var x =  pubTool.rem.designWidth * remscale / 2 - 15;
      var y = $(window).height() / 2 - 15;
      var closeAnimitionMask = '<div class="closeAnimition-mask" style="position:fixed;top:0;right:0;bottom:0;left:0;background-color:rgba(0,0,0,.8);z-index: 1000;"></div>';
      var popupObj = {
        myPrize: '',
        popupMask: '',
        popupBody: '',
        before:function(){},
        end: function(){}
      };
      // 合并传入参数
      Object.assign(popupObj, param);
      popupObj.before();
      this.$closeBtn.css('visibility', 'hidden');
      popupObj.popupMask.css('background-color', 'rgba(0,0,0,0)');
      $('.closeAnimition-mask').remove();
      $('body').append(closeAnimitionMask);
      popupObj.myPrize.css('z-index', '1001');
      popupObj.popupBody.css({
        'transform': 'translate('+ x +'px, -'+ y +'px) scale(0)',
        'transition': 'transform 0.8s ease-out'
      });
      setTimeout(function() {
        popupObj.end();
        _this.$closeBtn.css('visibility', '');
        popupObj.popupMask.css('background-color', '');
        popupObj.myPrize.css('z-index', '');
        $('.closeAnimition-mask').remove();
        popupObj.popupBody.css({'transform': '','transition': ''});
      }, 800);
    };
    this.closeClick = function(e) {};
    this.jumpClick = function(e) {};
    Object.assign(this, config);
    this.$closeBtn.click(function(e) {
      _this.closeClick(e);
    });
    this.$jumpBtn.click(function(e) {
      _this.jumpClick(e);
    });
  },
  // 返回形式基本对象
  ReturnPopup:function (config){
    var _this = this;
    this.$ele = $("");
    this.$closeBtn = $("");
    this.$jumpBtn = $("");
    this.popupState = "";
    this.open = "";
    this.close = "";
    this.closeClick = function(e) {};
    this.jumpClick = function(e) {};
    Object.assign(_this,config);
    this.$closeBtn.click(function(e) {
      _this.closeClick(e);
    });
    this.$jumpBtn.click(function(e) {
      _this.jumpClick(e);
    });
  },
  // 客服组件
  userService: {
    init: function() {
      var kefuModule = document.createElement('div');
      var style = '<link rel="stylesheet" href="'+ gameToolConfig.kefuCss +'">';
      var dom = '<div class="kefu-btn"><img src="'+ gameToolConfig.kefuIcon +'"></div><div class="kefu-container"><div class="kefu-mask"></div><div class="kefu-content"><ul class="kefu-list"><li><a class="list-btn" href="tel:'+ gameToolConfig.kefuTel +'"><img class="tel-icon" src="'+ gameToolConfig.kefuPhoneIcon +'"><span class="kefu-tel">'+ gameToolConfig.kefuTel +'</span><span class="kefu-time">(9:00-18:00)</span></a></li></ul><div class="kefu-close-btn">取消</div></div></div>';
      kefuModule.id = "kefu-module";
      kefuModule.innerHTML = style + dom;
      var oldEle = document.getElementById('kefu-module');
      if (oldEle != null) {document.querySelector('body').removeChild(oldEle);};
      document.querySelector('body').appendChild(kefuModule);
      this.listen();
    },
    listen: function() {
      document.querySelector("#kefu-module .kefu-btn").onclick = function(e) {
        document.querySelector("#kefu-module .kefu-container").style.display = "block";
      };
      document.querySelector("#kefu-module .kefu-mask").onclick = function(e) {
        e.stopPropagation();
        e.preventDefault();
        document.querySelector("#kefu-module .kefu-container").style.display = "none";
      };
      document.querySelector("#kefu-module .kefu-close-btn").onclick = function(e) {
        e.stopPropagation();
        e.preventDefault();
        document.querySelector("#kefu-module .kefu-container").style.display = "none";
      };
    }
  },
  // 宝箱
  treasureChest: {
    init: function () {
      let containerDom = `<div class="incentive-icon-container">
                                   <div class="chest-container">
                                            <div class="chest">
                                                <div class="chest"></div>
                                                <div class="chest-star"></div>
                                          </div>
                                      <div class="chest-title">
                                      <div class="chest-title-text">
                                        <span class="chest-count"></span>/<span class="chest-maxCount">7</span>
                                      <div>
                                  </div>
                              </div>
                          </div>
                  </div>
                  <div class="incentive-tips">太棒了！还差 <span></span> 块宝箱碎片就能打开啦~</div>
            </div>`;
      $('.incentive-container').children().remove();
      $('.incentive-container').append(containerDom);
    },
  },
  // 提示条
  toast: function(text, time) {
    var defaults={
      text:'提示信息',
      time:'3000',
    };
    text != undefined ? defaults.text = text : "";
    time != undefined ? defaults.time = time : "";
    var $template = $('<div class="gToast">'+defaults.text+'</div>');
    $template.css({"display":"none", "max-width":"80%", "font-size":"14px", "color":"#FFF", "text-align":"center", "background-color":"rgba(0,0,0,0.7)", "border-radius":"5px", "padding":"10px 15px", "position":"fixed", "left":"50%", "bottom":"20%", "z-index":"9999", "-ms-transform":"translateX(-50%)", "-moz-transform":"translateX(-50%)", "-webkit-transform":"translateX(-50%)", "transform":"translateX(-50%)"});
    var $body=$('body');
    var timer;
    $('.gToast').remove();
    $body.append($template);
    $template.fadeIn(200);
    if(defaults.time != 0){
      timer=setTimeout(function(){
        clearTimeout(timer);
        $template.fadeOut(400, function(){$template.remove();});
      },defaults.time);
    };
  },
  // 我的奖品
  myPrize: {
    myPrizeEle: '',
    init: function(name) {
      this.myPrizeEle = $(name)[0];
    },
    addClick: function() {
      $(this.myPrizeEle).click(function(e) {
        e.stopPropagation();
        e.preventDefault();
        window.location.href = gameToolConfig.myPrizeAddress + '?adSpaceCode=' + gameRequest.reqData.adSpaceCode + '&sitename=' + gameRequest.reqData.sitename;
      });
    },
    show: function(name) {
      this.init(name);
      this.addClick();
      $(this.myPrizeEle).show();
    },
    hide: function() {
      $(this.myPrizeEle).show();
    }
  },
  // 关闭广告提醒弹窗
  closeIntercept: {
    init: function() {
      var popopDom = '<div class="receiveTipsPopup"><link rel="stylesheet" href="'+ gameToolConfig.receiveTipsPopupCss +'">' +
        '<div class="receive-mask"><div class="receive-container"><div class="receive-light"></div><div class="receive-bg">' +
        '<div id="receiveCloseBtn" typ="close" class="receive-close-btn"></div><div id="receiveTakeBtn" typ="take" class="receive-take-btn"></div>' +
        '</div></div></div</div>';
      $('body .receiveTipsPopup').remove();
      $('body').append(popopDom);
    },
    show: function(data) {
      var prizeInfo = data,_this = this;
      $('.receiveTipsPopup .receive-mask').css('display', "block");
      $('.receiveTipsPopup #receiveCloseBtn,.receiveTipsPopup #receiveTakeBtn').off('click').click(function(e) {
        e.stopPropagation();
        e.preventDefault();
        var btnTpe = $(e.currentTarget).attr('typ');
        var event = btnTpe == 'take' ? 'closepop_receive_coupon' : 'closepop_giveup_receive_coupon';
        // 统计领券量
        gameRequest.receiveCoupon({
          addData: {
            event: event
          },
          success: function(data) {
            if (data.code == '000000') {
              _this.hide();
              btnTpe == 'take' ? window.location.href = prizeInfo.link : '';
            } else {
              gameTool.toast(data.msg);
            };
          },
          error: function(x,t,e) {
            gameTool.toast('网络好像有点问题，请稍后再试吧~');
          }
        });
      });
    },
    hide: function() {
      $('.receiveTipsPopup .receive-mask').css('display', "none");
      $('.receiveTipsPopup #receiveCloseBtn,.receiveTipsPopup #receiveTakeBtn').off('click');
    }
  },
  // 返回键监听
  backBtnListen: {
    backListening: false,  //是否在监听返回键
    isListenPopstate: false,  //是否在监听popstate
    isSupportListen: false,  //是否支持监听返回键
    // 各步骤执行下一步延时时间
    nextOutTime: function(){
      var time = {
        startNextTime: 100,  //开始设置返回键监听操作延时时间
        interceptNextTime: 0,  //设置拦截页后下一步延时时间
        currentNextTime: 0,  //设置展示页后下一步延时时间
        BackNextTime: 200,  //执行后退后下一步延时时间
        ForwardNextTime: 50  //执行前进后下一步延时时间
      };

      // uc、夸克执行返回操作后延时时间修改为1100毫秒
      if (pubTool.ua.uc || pubTool.ua.quark) {time.BackNextTime = 1100};
      // oppo浏览器执行返回操作后延时时间修改为100毫秒
      if (pubTool.ua.oppo) {time.BackNextTime = 100};
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
      // 初始化设置
      var isStop = sessionStorage.getItem("isStop");
      setTimeout(function(){
        // 依据当前所在位置设置监听
        if (history.state == 'current') {
          if (!isStop){
            _this.historyBackForward();
          }
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
      }, this.nextOutTime.startNextTime);
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
    // 设置返回键监听
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
