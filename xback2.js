"use strict";

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

;
$(function () {
  var _gameTool$setGameSate;

  // 游戏名称
  var gameName = gameType; // 中奖奖品信息

  var awardInfo = {
    name: "",
    img: "",
    link: ""
  }; // 显示可用次数

  function showTimes(num) {
    $('.times span').text(num);
  }

  ; // 显示网络错误弹窗

  function showNetworkError() {
    $('.errormodal .error_close,.errormodal .error_btn').off('click').on('click', function (e) {
      ggkGame.reset();
      $('.errormodal').hide();
    });
    $('.errormodal').show();
  }

  ; // 显示次数超限弹窗

  function showRecommendmodal() {
    $('.recommendmodal .close').off('click').on('click', function (e) {
      ggkGame.reset();
      $('.recommendmodal').hide();
    });
    $('.recommendmodal').show();
  }

  ; // 显示未中奖弹窗

  function showThanksmodal() {
    $('.thanksmodal .thanks-modal-close,.thanksmodal .thanks-btn-b').off('click').on('click', function (e) {
      ggkGame.reset();
      $('.thanksmodal').hide();
    });
    $('.thanksmodal').show();
  }

  ; // 显示关闭广告提醒弹窗

  function receiveTipsPopupShow(data) {
    gameTool.closeIntercept.show(data); // 点击取消按钮显示集奖第二个动画及翻倍模式

    $('.receiveTipsPopup #receiveCloseBtn').click(function () {
      collectPrize.showShake();
      switchGameDoubleModel();
    });
  }

  ; // 点击弹窗关闭按钮计数

  function clickPopupCloseCount() {
    gameState.colsePopup += 1;
    gameTool.setGameSatesCookie(gameState);
  }

  ; // 弹窗样式升级

  function zpUpgrade() {
    $('.bg_spots').css('display', 'block');
    $('.core-tc-light').css('display', 'block');
    $('.D105').addClass('inspire-D');
    localGamePopup.doubleModel = true;
  }

  ; // 游戏切换到翻倍模式

  function switchGameDoubleModel(direct) {
    function directOpen() {
      $('body').addClass('inspire');
      zpUpgrade();
      ggkGame.replaceCanvas();
    }

    ;

    function animationOpen() {
      $('.upgrade-container').show();
      zpUpgrade();
      ggkGame.replaceCanvas();
      setTimeout(function () {
        $('body').addClass('inspire');
      }, 1200);
      setTimeout(function () {
        $('.upgrade-container').hide();
      }, 2000);
    }

    ;

    if (gameState.gameDouble) {
      if (direct != undefined) {
        directOpen();
        return;
      }

      ;

      if (gameState.backBtn && gameState.getAD == 1 || !gameState.backBtn && gameState.getAD == 2) {
        animationOpen();
      } else {
        directOpen();
      }

      ;
    }

    ;
  }

  ; // 启用专属弹窗方法

  function setPersonalGamePopup() {
    personalGamePopup.openAfter = function () {
      // 显示集奖
      setTimeout(function () {
        collectPrize.autoCollect(1);
      }, 600);
    };

    personalGamePopup.closeEvent = function (e) {
      var _this = this;

      ggkGame.reset();
      clickPopupCloseCount();
      prizeModalPopup = localGamePopup;
      collectPrize.showShake(); // 第二次点击关闭按钮或返回键发券，显示关闭广告提醒弹窗

      if (gameState.colsePopup == 2 || awardInfo.getEvent == 'back') {
        gameTool.closeIntercept.show(awardInfo);
        $('.receiveTipsPopup #receiveCloseBtn').click(function () {
          // 非关闭提醒弹窗下显示集奖第二个动画及翻倍模式切换
          switchGameDoubleModel();
        });

        _this.close();
      } else {
        // 非第一次执行关闭动画
        this.closeAnimation({
          myPrize: $('.my-prize'),
          popupMask: $('.specialWinPopup .mask'),
          popupBody: $('.specialWinPopup .tc-container'),
          before: function before() {},
          end: function end() {
            _this.close();
          }
        });
      }

      ;
    };

    personalGamePopup.jumpEvent = function (e) {
      var _this = this; // 统计领券量


      gameRequest.receiveCoupon({
        addData: {
          event: awardInfo.getEvent + '_receive_coupon'
        },
        success: function success(data) {
          gameTool.loading.show();
          ggkGame.reset();

          _this.close();

          prizeModalPopup = localGamePopup;
          switchGameDoubleModel(true);
          window.location.href = awardInfo.link;
        },
        error: function error(x, t, e) {
          gameTool.toast('网络好像有点问题，请稍后再试吧~');
        }
      });
    };

    personalGamePopup.popupType = 'personal';
    prizeModalPopup = personalGamePopup;
    ggkGame.openPrize(ggkGame.eleEvent, 'win');
  }

  ;
  window.setPersonalGamePopup = setPersonalGamePopup; // 初始化本地弹窗

  var localGamePopup = new gameTool.GamePopup({
    popupType: 'local',
    doubleModel: false,
    // 是否为翻倍弹窗
    $ele: $('.D105'),
    $closeBtn: $('.D105 .pclose'),
    $jumpBtn: $('.D105 .pbtn'),
    open: function open(awardData) {
      this.awardData = awardData;
      $('.D105 .pimg').attr('src', this.awardData.img);
      $('.D105 .pname').text(this.awardData.name); // 添加翻倍弹窗样式

      if (this.doubleModel) {
        this.$ele.addClass('inspire-D');
      } else {
        this.$ele.removeClass('inspire-D');
      }

      ;
      this.$ele.show(); // 显示集奖

      setTimeout(function () {
        collectPrize.autoCollect(1);
      }, 600);
    },
    close: function close() {
      ggkGame.reset();
      this.$ele.hide();
      $('.D105 .pimg').attr('src', '');
      $('.D105 .pname').text('');
    },
    closeClick: function closeClick(e) {
      var _this = this;

      clickPopupCloseCount();
      collectPrize.showShake(); // 第二次点击关闭按钮或返回键发券，显示关闭广告提醒弹窗

      if (gameState.colsePopup == 2 || this.awardData.getEvent == 'back') {
        receiveTipsPopupShow(this.awardData);
        $('.receiveTipsPopup #receiveCloseBtn').click(function () {
          // 非关闭提醒弹窗下显示集奖第二个动画及翻倍模式切换
          switchGameDoubleModel();
        });

        _this.close();
      } else {
        // 非第一次执行关闭动画
        this.closeAnimation({
          myPrize: $('.my-prize'),
          popupMask: $('.D105'),
          popupBody: $('.D105 .container'),
          before: function before() {},
          end: function end() {
            _this.close();
          }
        });
      }

      ;
    },
    jumpClick: function jumpClick(e) {
      var _this = this; // 统计领券量


      gameRequest.receiveCoupon({
        addData: {
          event: _this.awardData.getEvent + '_receive_coupon'
        },
        success: function success(data) {
          gameTool.loading.show();

          _this.close();

          switchGameDoubleModel(true);
          window.location.href = _this.awardData.link;
        },
        error: function error(x, t, e) {
          gameTool.toast('网络好像有点问题，请稍后再试吧~');
        }
      });
    }
  }); // 默认启用本地中奖弹窗

  var prizeModalPopup = localGamePopup; // 集碎片

  var collectPrize = {
    $prizeEle: $(),
    setPrizeEle: function setPrizeEle(prizeNum) {
      return this.$prizeEle = $('.collect-list .collect-' + prizeNum);
    },
    claerPrizeEle: function claerPrizeEle() {
      this.$prizeEle = $();
    },
    getPrizeCount: function getPrizeCount(prizeNum) {
      if (prizeNum == undefined) {
        return parseInt(this.$prizeEle.find('.collect-progress').attr('pro'));
      } else {
        return parseInt($('.collect-list .collect-' + prizeNum + ' .collect-progress').attr('pro'));
      }

      ;
    },
    setPrizeCount: function setPrizeCount(count, prizeNum) {
      if (prizeNum == undefined) {
        this.$prizeEle.find('.collect-progress').attr('pro', count);
      } else {
        $('.collect-list .collect-' + prizeNum + ' .collect-progress').attr('pro', count);
      }

      ;
    },
    showlight: function showlight() {
      this.$prizeEle.addClass('light');
    },
    hideLight: function hideLight() {
      this.$prizeEle.removeClass('light');
    },
    shake: function shake() {
      var _this = this;

      this.$prizeEle.addClass('shake');
      setTimeout(function () {
        _this.$prizeEle.removeClass('shake');

        _this.claerPrizeEle();
      }, 1000);
    },
    showShake: function showShake() {
      this.hideLight();

      var _this = this;

      setTimeout(function () {
        _this.shake();
      }, 400);
    },
    collect: function collect(addend, prizeNum) {
      var _this = this;

      if (typeof addend == 'number' && typeof prizeNum == 'number') {
        this.setPrizeEle(prizeNum);
        var prizeCount = this.getPrizeCount() + addend;
        this.showlight();
        setTimeout(function () {
          gameState.collect['p' + prizeNum] = prizeCount;
          gameTool.setGameSatesCookie(gameState);

          _this.setPrizeCount(prizeCount);
        }, 900);
      }

      ;
    },
    autoCollect: function autoCollect(addend) {
      var prize1 = this.getPrizeCount(1),
        prize2 = this.getPrizeCount(2);
      var prizeNum = 0;

      if (prize1 <= 3 && prize2 <= 3) {
        prizeNum = pubTool.randomNumBoth(1, 2);
      } else {
        if (Math.abs(prize1 - prize2) > 1) {
          prize1 > prize2 ? prizeNum = 2 : prizeNum = 1;
        } else {
          prizeNum = pubTool.randomNumBoth(1, 2);
        }

        ;
      }

      ;

      if (typeof addend == 'number') {
        this.collect(addend, prizeNum);
      }

      ;
    }
  }; // 初始化返回发券展示形式

  var returnDisplayForm = {
    popupState: 'unload'
  }; // 设置返回发券展示形式内容

  function setReturnPopup() {
    personalReturnPopup.tempData = null;

    personalReturnPopup.openBefore = function () {
      // 请求广告
      gameRequest.getPlat({
        addData: {
          event: 'backing_out_type'
        },
        success: function success(data) {
          personalReturnPopup.tempData = {};

          if (data.code == "000000") {
            gameState.getAD += 1;
            gameState.gameDouble = true;
            gameState.backBtn = true;
            gameTool.setGameSatesCookie(gameState);
            awardInfo.img = data.data.materialLink;
            awardInfo.link = data.data.adLink;
            awardInfo.name = data.data.materialDesc;
            awardInfo.getEvent = 'back';

            if (data.data.adExclusivePop != undefined) {
              personalReturnPopup.tempData.popupType = 'personal';
              $('.specialWinPopup').remove();
              $('body').append(data.data.adExclusivePop);
            } else {
              localGamePopup.doubleModel = true;
              personalReturnPopup.tempData.popupType = 'local';
              prizeModalPopup = localGamePopup;
            }

            ;
          } else {
            personalReturnPopup.tempData.popupType = 'noPopup';
            gameTool.toast('获取数据异常');
          }

          ;
        },
        error: function error(x, t, e) {
          personalReturnPopup.tempData = {};
          personalReturnPopup.tempData.popupType = 'noPopup';
          gameTool.toast('网络好像有点问题，请稍后再试吧~');
        }
      });
    };

    personalReturnPopup.closeEvent = function (e) {
      var _this = this,
        times = 300;

      var intervalId = '';
      intervalId = setInterval(function () {
        times--;

        if (personalReturnPopup.tempData != null) {
          // 判断广告请求是否结束
          if (personalReturnPopup.tempData.popupType == 'noPopup') {
            // 判断是否请求到广告
            _this.close();

            clearInterval(intervalId);
          } else {
            // 判断弹窗类型，如果是专属弹窗，必须等专属弹窗加载完毕后打开
            if (personalReturnPopup.tempData.popupType = 'local' || (personalReturnPopup.tempData.popupType = 'personal' && prizeModalPopup.popupType == 'personal')) {
              _this.close();

              prizeModalPopup.open(awardInfo);
              clearInterval(intervalId);
            }

            ;
          }

          ;
        }

        ;

        if (times <= 0) {
          clearInterval(intervalId);
        }

        ;
      }, 50);
    };

    personalReturnPopup.popupState = 'loaded';
    returnDisplayForm = personalReturnPopup;
  }

  ;
  window.setReturnPopup = setReturnPopup; // 显示发券展示形式

  function showReturnForm() {
    var intervalId = '',
      times = 500;
    personalReturnPopup.popupState = 'loaded';
    intervalId = setInterval(function () {
      times--;

      if (returnDisplayForm.popupState == 'loaded') {
        returnDisplayForm.open();
        clearInterval(intervalId);
      }

      ;

      if (times <= 0) {
        clearInterval(intervalId);
      }

      ;
    }, 50);
  }

  ; // 是否缓存

  window.addEventListener('pageshow', function (e) {
    if (e.persisted || window.performance && window.performance.navigation.type == 2) {
      gameTool.loading.hide();
    }
  }, false); // 初始化游戏请请求数据

  gameRequest.setGameType(gameName);
  gameRequest.initData(); // 初始获取游戏状态值

  gameTool.getGameSatesCookie() == null ? gameTool.setGameSatesCookie((_gameTool$setGameSate = {
    times: 8,
    colsePopup: 0,
    getAD: 0,
    collect: {
      p1: 0,
      p2: 0
    },
    gameDouble: false,
    backBtn: false
  }, _defineProperty(_gameTool$setGameSate, "getAD", 0), _defineProperty(_gameTool$setGameSate, "isDynamicEffect", true), _gameTool$setGameSate)) : '';
  var gameState = gameTool.getGameSatesCookie(); // 统计页面打开

  gameRequest.clickRedBagNum(); // 客服按钮初始化

  gameConfig.kefu ? gameTool.userService.init() : ""; // 我的奖品按钮初始化

  gameTool.myPrize.show('.my-prize'); // 插入loading

  gameTool.loading.init(); // 初始化是否加载关闭广告弹窗提醒

  gameState.colsePopup <= 1 ? gameTool.closeIntercept.init() : ''; // 页面不是通过返回键打开且有返回形式或返回落地页时监听返回键

  if (backBtnData.openWayFrom != 'backBtn') {
    if (backBtnData.backCouponType != 'null' || backBtnData.backInteractiveUrl != 'null') {
      // 监听返回键
      gameTool.backBtnListen.setListen(function () {
        // 判断是否配置返回发券样式
        if (backBtnData.backCouponType == 'null') {
          // 未配置返回发券样式时执行去返回键落地页操作
          gameTool.doBackInteractive();
        } else {
          if (gameState.getAD > 0) {
            if (backBtnData.backCouponNum == gameState.getAD) {
              // 继续监返回键
              gameTool.backBtnListen.listenContinue(function () {
                // 执行去返回键落地页操作
                gameTool.doBackInteractive();
              }); // 显示发券展示形式

              showReturnForm();
            } else {
              // 执行去返回键落地页操作
              gameTool.doBackInteractive();
            }

            ;
          } else {
            // 执行去返回键落地页操作
            gameTool.backBtnListen.listenContinue(function () {
              if (backBtnData.backCouponNum == gameState.getAD) {
                gameTool.backBtnListen.listenContinue(function () {
                  // 执行去返回键落地页操作
                  gameTool.doBackInteractive();
                }); // 显示发券展示形式

                showReturnForm();
              } else {
                gameTool.doBackInteractive();
              }
            });
            showReturnForm();
          }

          ;
        }

        ;
      });
    }

    ;
  } else {
    gameTool.backBtnListen.setListen(function () {
      window.history.go(-1);
    });
  } // 初始化显示次数


  showTimes(gameState.times); // 规则按钮点击

  $('#ggk-rule-btn').click(function () {
    $('#ggk-rule-modal').show();
  }); // 规则弹窗关闭按钮点击

  $('#ggk-rule-modal .rule_close').click(function () {
    $("#ggk-rule-modal").hide();
  }); // 初始化集奖状态

  collectPrize.setPrizeCount(gameState.collect.p1, 1);
  collectPrize.setPrizeCount(gameState.collect.p2, 2); // 初始化游戏的翻倍模式

  switchGameDoubleModel(); // 游戏初始化

  ggkGame.init(gameState.gameDouble); // 初始化中奖状态

  var isPrize = false; // 按下或触摸刮卡区域事件

  ggkGame.downEvent = function (e) {
    // 判断是否还有游戏次数
    if (gameState.times <= 0) {
      showRecommendmodal();
      ggkGame.canStart = false;
    } else {
      ggkGame.canStart = true;
    }

    ;
  }; // 首次按下或触摸刮卡区域事件


  ggkGame.firstDownEvent = function (e) {
    // 统计活动参与数
    gameRequest.clickNum(); // 获取广告

    gameRequest.getPlat({
      addData: {
        event: 'interacvite_game_type'
      },
      success: function success(data) {
        if (data.code == '000000') {
          gameState.getAD += 1;
          gameState.getAD >= 2 ? gameState.gameDouble = true : "";
          gameTool.setGameSatesCookie(gameState);
          awardInfo.img = data.data.materialLink;
          awardInfo.link = data.data.adLink;
          awardInfo.name = data.data.materialDesc;
          awardInfo.getEvent = 'interacvite';
          isPrize = true;

          if (data.data.adExclusivePop != undefined && data.data.adExclusivePop.indexOf('specialWinPopup') > -1) {
            ggkGame.eleEvent = e;
            $('.specialWinPopup').remove();
            $('body').append(data.data.adExclusivePop);
          } else {
            prizeModalPopup = localGamePopup;
            ggkGame.openPrize(e, 'win');
          }

          ;
        } else {
          isPrize = false;
          ggkGame.openPrize(e, 'no');
        }

        ;
      },
      error: function error(x, t, e) {
        showNetworkError();
      }
    });
  }; // 刮卡结束后事件


  ggkGame.endEvent = function (e) {
    // 单次游戏结束后处理
    gameState.times <= 0 ? gameState.times = 0 : gameState.times -= 1;
    gameTool.setGameSatesCookie(gameState);
    showTimes(gameState.times); // 判断serverCookie是否需要发送

    if (gameRequest.serverCookie) {
      gameRequest.transCookie();
    }

    ; // 显示中奖结果

    if (isPrize) {
      prizeModalPopup.open(awardInfo);
    } else {
      showThanksmodal();
    }

    ;
  };
});
/* 游戏功能主体 */

var ggkGame = {
  canvas: $('#card_canvas')[0],
  ctx: null,
  coverImg: new Image(),
  cardBg: $('.card_bg')[0],
  cardBgUpgrade: $('.card_bg_upgrade')[0],
  coverColor: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAnYAAAGUAQMAAACC/v2uAAAABlBMVEUAAADU09LtLwEHAAAAAXRSTlMAQObYZgAAAIlJREFUeNrtzLENAAAEADCJ/2/mAiaTtAc0gEXWHZ/P5/P5fD6fz+fz+Xw+n8/n8/l8Pp/P5/P5fD6fz+fz+Xw+n8/n8/l8Pp/P5/P5fD6fz+fz+Xw+n8/n8/l8Pp/P5/P5fD6fz+fz+Xw+n8/n8/l8Pp/P5/P5fD6fz+fz+Xw+n8/n8/m+fMCkAU2SGpGQIMjgAAAAAElFTkSuQmCC',
  showAllPercent: 35,
  radius: 45,
  pixelRatio: 1,
  fadeId: '',
  autoId: '',
  AnimationFrameId: '',
  isDown: false,
  done: false,
  firstdown: true,
  isAuto: false,
  scratchEnd: false,
  prizeResult: null,
  canStart: true,
  // 初始化游戏对象和事件
  init: function init(isUpgrade) {
    $('.hand').show();

    var _this = this;

    this.ctx = this.canvas.getContext('2d');
    this.offsetX = this.canvas.getBoundingClientRect().left;
    this.offsetY = this.canvas.getBoundingClientRect().top;
    this.ctx.globalCompositeOperation = "source-over";

    this.coverImg.onload = function () {
      _this.ctx.drawImage(_this.coverImg, 0, 0);

      _this.ctx.globalCompositeOperation = 'destination-out';
      $(_this.cardBg).hide();
      $(_this.cardBgUpgrade).hide();
    };

    this.coverImg.onerror = function () {
      _this.coverImg.src = _this.coverColor;
      _this.coverImg.onerror = null;
    };

    this.coverImg.crossOrigin = "anonymous";

    if (isUpgrade) {
      this.coverImg.src = this.cardBgUpgrade.src;
    } else {
      this.coverImg.src = this.cardBg.src;
    }

    ;
    this.addEvent(); // AnimationFrame 兼容

    if (!Date.now) Date.now = function () {
      return new Date().getTime();
    };

    (function () {
      'use strict';

      var vendors = ['webkit', 'moz'];

      for (var i = 0; i < vendors.length && !window.requestAnimationFrame; ++i) {
        var vp = vendors[i];
        window.requestAnimationFrame = window[vp + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vp + 'CancelAnimationFrame'] || window[vp + 'CancelRequestAnimationFrame'];
      }

      ;

      if (/iP(ad|hone|od).*OS 6/.test(window.navigator.userAgent) || !window.requestAnimationFrame || !window.cancelAnimationFrame) {
        var lastTime = 0;

        window.requestAnimationFrame = function (callback) {
          var now = Date.now();
          var nextTime = Math.max(lastTime + 16, now);
          return setTimeout(function () {
            callback(lastTime = nextTime);
          }, nextTime - now);
        };

        window.cancelAnimationFrame = clearTimeout;
      }

      ;
    })();
  },
  // 监听触摸或鼠标事件
  addEvent: function addEvent() {
    this.canvas.addEventListener('touchstart', this.eventDown.bind(this), {
      passive: false
    });
    this.canvas.addEventListener('touchmove', this.eventMove.bind(this), {
      passive: false
    });
    this.canvas.addEventListener('touchend', this.eventUp.bind(this), {
      passive: false
    });
    this.canvas.addEventListener('mousedown', this.eventDown.bind(this), {
      passive: false
    });
    this.canvas.addEventListener('mousemove', this.eventMove.bind(this), {
      passive: false
    });
    this.canvas.addEventListener('mouseup', this.eventUp.bind(this), {
      passive: false
    });
    this.canvas.addEventListener('mouseleave', this.eventLeave.bind(this), {
      passive: false
    });
  },
  // 重置游戏
  reset: function reset() {
    $('.hand').show();
    $('.result-show').removeClass('jump').show();
    $(this.canvas).removeClass('hide');
    $('.core .boom').hide();
    clearTimeout(this.autoId);
    this.cancelAutoScratch();
    this.done = false;
    this.firstdown = true;
    this.isAuto = false;
    this.scratchEnd = false;
    this.prizeResult = null;
    this.canStart = true;
    this.ctx.globalCompositeOperation = "source-over";
    this.ctx.drawImage(this.coverImg, 0, 0);
    this.ctx.globalCompositeOperation = 'destination-out';
  },
  // 重画canvas
  replaceCanvas: function replaceCanvas() {
    $('.hand').show();
    $('.result-show').removeClass('jump').show();
    $(this.canvas).removeClass('hide');
    $('.core .boom').hide();
    clearTimeout(this.autoId);
    this.cancelAutoScratch();
    this.done = false;
    this.firstdown = true;
    this.isAuto = false;
    this.scratchEnd = false;
    this.prizeResult = null;
    this.canStart = true;
    this.init(true);
  },
  // 按下事件
  eventDown: function eventDown(e) {
    e.stopPropagation();
    e.preventDefault();
    this.isDown = true;
    this.downEvent(e);

    if (this.firstdown && this.canStart) {
      this.firstdown = false;
      $('.hand').hide();
      $('.result-show').addClass('jump');
      this.scratch(e);
      this.firstDownEvent(e);
    }

    ;
  },
  // 抬起事件
  eventUp: function eventUp(e) {
    e.stopPropagation();
    e.preventDefault();
    this.isDown = false;

    var _this = this;

    if (!this.done && this.canStart) {
      if (this.getFilledPercentage() > this.showAllPercent && !this.isAuto) {
        this.scratchEnd = true;
        this.openPrize(e);
      } else {
        if (!this.isAuto) {
          this.isAuto = true;
          clearTimeout(this.autoId);
          this.autoId = setTimeout(function () {
            _this.autoScratch(e);
          }, 800);
        }

        ;
      }

      ;
    }

    ;
  },
  // 离开事件（仅限鼠标触发）
  eventLeave: function eventLeave(e) {
    e.stopPropagation();
    e.preventDefault();
    this.isDown = false;
  },
  // 移动事件
  eventMove: function eventMove(e) {
    e.stopPropagation();
    e.preventDefault();

    if (this.canStart) {
      this.scratch(e);
    }

    ;
  },
  // 计算绘画坐标
  computeAxis: function computeAxis(x, y) {
    var l = x - this.canvas.getBoundingClientRect().left,
      t = y - this.canvas.getBoundingClientRect().top;
    l = l <= 0 ? 0 : l;
    t = t <= 0 ? 0 : t;
    return {
      x: l / window.remscale,
      y: t / window.remscale
    };
  },
  // 获取刮开区域占比
  getFilledPercentage: function getFilledPercentage() {
    var imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    var pixels = imgData.data;
    var transPixels = [];

    for (var i = 0; i < pixels.length; i += 4) {
      if (pixels[i + 3] < 128) {
        transPixels.push(pixels[i + 3]);
      }

      ;
    }

    ;
    return (transPixels.length / (pixels.length / 4) * 100).toFixed(2);
  },
  // 绘制刮过区域
  guka: function guka(x, y) {
    var _this = this;
    _this.ctx.beginPath();
    _this.ctx.arc(x * _this.pixelRatio, y * _this.pixelRatio, _this.radius * _this.pixelRatio, 0, Math.PI * 2);
    _this.ctx.fill();
    _this.ctx.closePath();
  },
  // 进行刮卡操作及计算
  scratch: function scratch(e, till) {
    if (this.isDown && !this.done || till == 'till') {
      if (e.changedTouches) {
        e = e.changedTouches[e.changedTouches.length - 1];
      }

      ;
      var axis = this.computeAxis(e.clientX, e.clientY);
      this.guka(axis.x, axis.y);
    }

    ;
  },
  // 自动刮卡动画
  autoScratch: function autoScratch(e) {
    var loca = [[590, 60], [50, 120], [590, 160], [45, 230], [590, 280], [50, 320]];

    var _this = this;

    var progress = 0;
    var arr = []; // 计算坐标

    function math(from, to) {
      var w = Math.abs(to[0] - from[0]),
        h = Math.abs(to[1] - from[1]),
        len = Math.pow(Math.pow(w, 2) + Math.pow(h, 2), 1 / 2);

      for (var i = 1; i < len; i += 30) {
        var t = [];
        from[0] < to[0] ? t.push(from[0] + w / len * i) : t.push(from[0] - w / len * i);
        from[1] < to[1] ? t.push(from[1] + h / len * i) : t.push(from[1] - h / len * i);
        arr.push(t);
      }

      ;
    }

    ;

    for (var j = 0; j < loca.length - 1; j++) {
      arr.push(loca[j]);
      math(loca[j], loca[j + 1]);
    }

    ;
    arr.push(loca[loca.length - 1]); // 渲染自动刮卡效果

    function renderScratch() {
      if (progress < arr.length) {
        _this.guka(arr[progress][0], arr[progress][1]);

        _this.AnimationFrameId = window.requestAnimationFrame(renderScratch);
      } else {
        _this.autoScratchEnded(e);
      }

      ;
      progress++;
    }

    ; // 第一帧渲染

    _this.AnimationFrameId = window.requestAnimationFrame(renderScratch);
  },
  // 自动刮卡结束事件
  autoScratchEnded: function autoScratchEnded(e) {
    this.isAuto = false;
    this.scratchEnd = true;
    this.openPrize(e);
  },
  cancelAutoScratch: function cancelAutoScratch() {
    window.cancelAnimationFrame(this.AnimationFrameId);
  },
  // 刮开全部区域
  scratchAll: function scratchAll(e) {
    var _this = this;

    this.done = true;
    $('.result-show').removeClass('jump').hide();
    $('.core .boom').show();
    clearTimeout(this.fadeId);
    this.fadeId = setTimeout(function () {
      $(_this.canvas).addClass('hide');
      $(_this.canvas).off("webkitTransitionEnd").one('webkitTransitionEnd', function () {
        _this.ctx.fillRect(0, 0, _this.canvas.width, _this.canvas.height);
      });

      _this.scratchAllEnd(e);

      $('.core .boom').hide();
    }, 800);
  },
  // 全部刮开后事件
  scratchAllEnd: function scratchAllEnd(e) {
    this.endEvent(e);
  },
  // 红包打开动画并全部刮开
  openPrize: function openPrize(e, result) {
    result == undefined ? '' : this.prizeResult = result;
    this.prizeResult != null && this.scratchEnd ? this.scratchAll(e) : '';
  },
  // 鼠标按下或触摸后事件
  downEvent: function downEvent(e) {
    this.canStart = true;
  },
  // 首次鼠标按下或触摸后事件
  firstDownEvent: function firstDownEvent(e) {
    this.openPrize(e, 'win');
  },
  // 单次刮卡结束后处理
  endEvent: function endEvent(e) {}
};
