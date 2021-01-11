"use strict";

$(function () {
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
  gameRequest.setGameType(gameName);
  gameRequest.initData(); // 初始获取游戏状态值
  gameTool.getGameSatesCookie() == null ? gameTool.setGameSatesCookie({
    times: 8,
    colsePopup: 0,
    getAD: 0
  }) : '';
  var gameState = gameTool.getGameSatesCookie(); // 统计页面打开
  // 初始化显示次数
  showTimes(gameState.times);
  // 统计页面打开
  gameRequest.clickRedBagNum();
  ggkGame.init(); // 初始化中奖状态

  var isPrize = false; // 按下或触摸刮卡区域事件

  ggkGame.downEvent = function (e) {
    // 判断是否还有游戏次数
    if (gameState.times <= 0) {
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
            ggkGame.openPrize(e, 'win');
          }
        } else {
          isPrize = false;
          ggkGame.openPrize(e, 'no');
        }

        ;
      },
      error: function error(x, t, e) {
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
  init: function init() {
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
    };

    this.coverImg.onerror = function () {
      _this.coverImg.src = _this.coverColor;
      _this.coverImg.onerror = null;
    };

    this.coverImg.crossOrigin = "anonymous";
    this.coverImg.src = this.cardBg.src;
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
