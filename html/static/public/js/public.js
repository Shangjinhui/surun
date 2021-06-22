;(function (golden, factory) {
    if (typeof module === "object") {
        //export default  factory(golden);
        module.exports = factory(golden)
    } else if (typeof define === "function" && define.amd) {
        define('plus', [], function () {
            return factory(golden);
        });
    } else {
        window.plus = factory(golden)
        if (jQuery) {
            window.$ = $.extend(window.$, factory(golden))
        }
    }


})(window, function () {
    var plus = {}
    //判断是否为微信
    plus.is_weixin = function () {
        var ua = navigator.userAgent.toLowerCase();
        if (ua.match(/micromessenger/i) == "micromessenger") {
            return true;
        } else {
            return false;
        }
    }

    var _black = function () {
        var _this = this
        _this.newhtml = document.createElement('div');
        _this.newhtml.className = 'back-black';

        document.body.appendChild(_this.newhtml)

        _this.close = function () {
            document.body.removeChild(_this.newhtml)
        }
        return _this;

    }
    //弹窗（新）
    function _Alert(option) {
        var a = new _black()
        var _this = this
        var opts = {
            cf: 0,
            title: '提示',
            content: '',
            submit_text: '确定',
            cancel_text: '取消',
            submit_bgcolor: '#fff',
            submit_color: '#333',
            cancel_bgcolor: '#fff',
            cancel_color: '#333',
            submit: function (e) {
            },
            cancel: function (e) {
            }
        }

        _this.createHTML = function (tags, cn, html, to) {
            var newhtml = document.createElement(tags)
            newhtml.className = cn
            newhtml.innerHTML = html
            to.appendChild(newhtml)
            return newhtml
        }

        var opt = $.extend(opts, option)
        _this.htmls = document.createElement('div')
        _this.htmls.className = 'yalert-box'


        _this.createHTML('div', 'yalert-box-top', opt.title, _this.htmls)

        _this.createHTML('div', 'yalert-box-tip', opt.content, _this.htmls)


        var btn = document.createElement('div')
        btn.className = 'yalert-box-btn'
        var y_quxiao = '', y_queding = ''
        if (opts.cf) {
            y_quxiao = _this.createHTML('a', 'yalert-box-submit', opt.cancel_text, btn)
            y_queding = _this.createHTML('a', 'yalert-box-submit', opt.submit_text, btn)
            y_quxiao.style.backgroundColor = opt.cancel_bgcolor
            y_queding.style.backgroundColor = opt.submit_bgcolor
            y_quxiao.style.color = opt.cancel_color
            y_queding.style.color = opt.submit_color

        } else {
            y_queding = _this.createHTML('a', 'yalert-box-submit', opt.submit_text, btn)
            y_queding.style.width = '100%'
            y_queding.style.color = opt.submit_color
        }

        _this.htmls.appendChild(btn)

        if (document.getElementsByTagName('input').length) {
            for (var i = 0; i < document.getElementsByTagName('input').length; i++) {
                document.getElementsByTagName('input')[i].blur()

            }
        }

        if (document.getElementsByTagName('textarea').length) {
            for (var i = 0; i < document.getElementsByTagName('textarea').length; i++) {
                document.getElementsByTagName('textarea')[i].blur()

            }
        }

        document.body.appendChild(_this.htmls)

        y_queding.addEventListener('click', function () {

            if (option.submit) {
                opt.submit(_this)
            } else {
                document.body.removeChild(_this.htmls)

                a.close()
            }
        })

        if (opts.cf) {
            y_quxiao.addEventListener('click', function () {
                if (option.cancel) {
                    opt.cancel(_this)
                } else {
                    document.body.removeChild(_this.htmls)
                    a.close()
                }

            })
        }


        _this.close = function () {
            document.body.removeChild(_this.htmls)
            a.close()

        };

    }

    //弹窗调用
    plus.alert = function (option, title, callback) {

        if (typeof option != 'object' && typeof option == 'string') {

            var opt = {
                title: title,
                content: option,
                submit: callback
            }

            new _Alert(opt)
        } else {
            new _Alert(option)
        }


    }


    //获取URL上参数
    plus.getUrlParam = function (name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return unescape(r[2]);
        return ''
    }

    
    

    plus.getUrlObject = function (url) {
        url = url || location.search
        url = url.split('?')[1] || ''

        if (url) {
            var list = url.split('&')
            if (list && list.length) {
                var object = {}
                for (var i = 0; i < list.length; i++) {
                    var obj = list[i];
                    object[obj.split('=')[0]] = obj.split('=')[1]
                }
                return object
            }

            return ''
        }

        return ''


    }



    //添加全页load
    plus.ADDLOAD = function () {
        var html = '<div class="new-loading">' +
            '<ul class="small-loading">' +
            '<li></li>' +
            '<li></li>' +
            '<li></li>' +
            '<li></li>' +
            '<li></li>' +
            '<li></li>' +
            '<li></li>' +
            '<li></li>' +
            '</ul>' +
            '</div>'
        if (!$('.new-loading').length) {
            $('body').append(html)
        }
    }

    //移除load
    plus.RMLOAD = function () {
        $('.new-loading').remove()
    }
    //页面浮动内容框
    plus.oppo = function (msg, callback, time) {

        var html = '<div class="oppo">' + msg + '</div>';
        $('body').append(html);
        setTimeout(function () {
            $('.oppo').remove()
            if (typeof (callback) == 'function') {
                callback()
            } else {

            }
        }, (time ? time : 2) * 1000)
    }


    //删除HTML里面标签
    plus.DELHTML = function (str) {
        return str ? str.replace(/<[^>].*?>/g, "") : str;
    }

    //base64加密
    plus.base64encode = function (str) {
        var encryptedHexStr = CryptoJS.enc.Utf8.parse(str);
        var words = CryptoJS.enc.Base64.stringify(encryptedHexStr);
        return words
    }
    //base64解密
    plus.base64decode = function (str) {
        var words = CryptoJS.enc.Base64.parse(str);
        words = words.toString(CryptoJS.enc.Utf8);
        return words
    }
    // $.fdate(new Date(''),'yyyy-MM-dd E hh:mm')
    plus.fdate = function (date, fmt) {
        // date=new Date(dates);
		date = new Date(date.replace(/-/g, '/'));
        //fmt=fmts||'yyyy-MM-dd hh:mm';
        var o = {
            "M+": date.getMonth() + 1,
            //月份
            "d+": date.getDate(),
            //日
            "h+": date.getHours() % 12 == 0 ? 12 : date.getHours() % 12,
            //小时
            "H+": date.getHours(),
            //小时
            "m+": date.getMinutes(),
            //分
            "s+": date.getSeconds(),
            //秒
            "q+": Math.floor((date.getMonth() + 3) / 3),
            //季度
            S: date.getMilliseconds()
        };
        var week = {
            "0": "日",
            "1": "一",
            "2": "二",
            "3": "三",
            "4": "四",
            "5": "五",
            "6": "六"
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        }
        if (/(E+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (RegExp.$1.length > 1 ? RegExp.$1.length > 2 ? "星期" : "周" : "") + week[date.getDay() + ""]);
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
            }
        }
        return fmt;
    };
	plus.fdateTime = function (date, fmt) {
		date=new Date(date);
		//fmt=fmts||'yyyy-MM-dd hh:mm';
		var o = {
			"M+": date.getMonth() + 1,
			//月份
			"d+": date.getDate(),
			//日
			"h+": date.getHours() % 12 == 0 ? 12 : date.getHours() % 12,
			//小时
			"H+": date.getHours(),
			//小时
			"m+": date.getMinutes(),
			//分
			"s+": date.getSeconds(),
			//秒
			"q+": Math.floor((date.getMonth() + 3) / 3),
			//季度
			S: date.getMilliseconds()
		};
		var week = {
			"0": "日",
			"1": "一",
			"2": "二",
			"3": "三",
			"4": "四",
			"5": "五",
			"6": "六"
		};
		if (/(y+)/.test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
		}
		if (/(E+)/.test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length > 1 ? RegExp.$1.length > 2 ? "星期" : "周" : "") + week[date.getDay() + ""]);
		}
		for (var k in o) {
			if (new RegExp("(" + k + ")").test(fmt)) {
				fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length));
			}
		}
		return fmt;
	};
    Date.prototype.addDays = function (number) {
        var adjustDate = new Date(this.getTime() + 24 * 60 * 60 * 1e3 * 30 * number);
        //alert("Date" + adjustDate.getFullYear()+"-"+adjustDate.getMonth()+"-"+adjustDate.getDate());
        return;
    };

    //计算距离
    plus.computeDistance = function(p1, p2) {
        var EARTH_RADIUS = 6378137.0 , PI = Math.PI , toRad = Math.PI / 180.0;

        var lat1 = p1.lat * toRad;
        var lat2 = p2.lat * toRad;

        var deltaLon = (p2.lng - p1.lng) * toRad

        return EARTH_RADIUS * Math.acos(
            Math.sin(lat1) * Math.sin(lat2) +
            Math.cos(lat1) * Math.cos(lat2) * Math.cos(deltaLon));
    }

    //计算方位角
    plus.computeHeading = function(from , to){
        var toRad = Math.PI / 180,toDeg = 180 / Math.PI;
        var e=from.lat * toRad,
            f=to.lat * toRad,
            g=to.lng*toRad - from.lng * toRad;
        var r = (Math.atan2(Math.sin(g)*Math.cos(f),Math.cos(e)*Math.sin(f)-Math.sin(e)*Math.cos(f)*Math.cos(g))) * toDeg;

        if(r<0) r+=360;

        return r;
    }

	plus.set_font = function (size) {

		// 计算、转换布局单位
		var html = document.getElementsByTagName('html')[0];
		var designFontSize = 100,
			designWidth = size ? size : 750;

		function setFontSize() {
			var winWidth = document.documentElement.getBoundingClientRect().width;
			var fontSize = winWidth / designWidth * designFontSize;
			if(fontSize>100){
				fontSize=100
			}
			html.style.fontSize = fontSize + 'px';
		}

		setFontSize();
		window.addEventListener('resize', function () {
			setFontSize();
		});

		return this;
	}

    //通过起始点坐标、距离以及航向算出终点坐标。
    //from:LatLng, distance:Number, heading:Number, radius?:Number
    //c,d,e,f
    plus.computeOffset = function(from, dist, heading,radius) {
        var toRad = Math.PI / 180 , toDeg = 180 / Math.PI;
        var EARTH_RADIUS = 6378137;

        var lat1 = from.lat * toRad;
        var lng1 = from.lng * toRad;
        var dByR = dist / (radius || EARTH_RADIUS);
        var lat = Math.asin(
            Math.sin(lat1) * Math.cos(dByR) +
            Math.cos(lat1) * Math.sin(dByR) * Math.cos(heading));
        var lng = lng1 + Math.atan2(
            Math.sin(heading) * Math.sin(dByR) * Math.cos(lat1),
            Math.cos(dByR) - Math.sin(lat1) * Math.sin(lat));
        return {lat:lat * toDeg , lng : lng * toDeg};
    }

	//小于10的格式化函数
	plus.timeFormat=function(param) {
		return param < 10 ? '0' + param : param;
	}

    return plus

});


