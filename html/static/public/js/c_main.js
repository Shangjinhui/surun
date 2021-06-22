// var API = 'http://demo.yunmofo.cn:8085/';
(function ($) {

	//登录相关
	$.toSignin = window.toSignin = function (back,url) {
		var from = back || (location.pathname + location.search);
		window.location.replace(url||'login.html' + (from ? ('?from=' + plus.base64encode(from)) : ''))

	};
	$.putUser = function (rs) {
		localStorage['userInfo'] = $.base64encode(JSON.stringify(rs))
	}
	$.getUser = function (rs) {
		return rs ? (localStorage['userInfo'] ? JSON.parse(plus.base64decode(localStorage['userInfo']))[rs] : '') : (localStorage['userInfo'] ? JSON.parse(plus.base64decode(localStorage['userInfo'])) : '')
	}
	$.clearUser = function () {
		localStorage.clear()
	}
	$.editUser = function (res, val) {
		var data = JSON.parse($.base64decode(localStorage['yes']))
		data[res] = val
		$.putUser(data)
	}

	$.putToken = function (res) {
		localStorage['yesToken'] = $.base64encode(res.UserName + ':' + res.DynamicToken);
	}


	$.checkUser = function () {
		window.TOKEN = localStorage['userToken'];
		if (window.TOKEN) {
			$.ajaxSetup({
				headers: {
					Authorization: window.TOKEN
				}
			})
		} else {
			$.toSignin()
		}

	}

	$.CountDown = function (obj) {
		var t = 60;
		var timer = setInterval(function () {
			if (t == 0) {
				obj.html('获取验证码');
				obj.removeClass('on')
				clearInterval(timer);
			} else {
				obj.html(t + '秒后重发');
				t--;
			}

		}, 1000)
	}


	$.set_font = function (size) {
		// 计算、转换布局单位
		var html = document.getElementsByTagName('html')[0];
		var designFontSize = 100,
			designWidth = size ? size : 750;
		function setFontSize() {
			var winWidth = document.documentElement.getBoundingClientRect().width;
			var fontSize = winWidth / designWidth * designFontSize;
			if (fontSize > 60) {
				fontSize = 60
			}
			html.style.fontSize = fontSize + 'px';
		}
		setFontSize();
		window.addEventListener('resize', function () {
			setFontSize();
		});
		return this;
	}


	// $.baseUrl = location.origin+'/suncircus/index.php/web/';
	$.baseUrl = location.origin+'/php/index.php/web/';
	window.TOKEN = localStorage['userToken'];


	$._ajax = window._ajax = function (params) {
		return $.ajax({
			headers: {
				'Platform': '2',
				// 'Authorization': window.TOKEN?window.TOKEN:''
			},
			url: this.baseUrl + params.url,
			type: params.type || 'POST', // 默认post方法
			data: params.data || {},
			contentType:params.contentType || 'application/json'
		})
			.then(function (resp) {
				if(typeof resp === 'string'){
					resp = JSON.parse(resp);
				}

				if(resp.returnCode == 0000){
					return resp.data;
				}else if (resp.returnCode == '0014') {
					localStorage.removeItem('userToken')
					localStorage.removeItem('userInfo')
					localStorage.removeItem('signTime')
					$.oppo(resp.msg, function(){
						// window.location.href = 'login.html'
						$.toSignin()
					}, 1);
					return $.Deferred().reject({
						stateCode: 200,
						ReturnCode: resp.returnCode,
						Msg: resp.msg
					});
				}else if (resp.returnCode == '0012') {
					window.location.href='register.html?type=2&unionId='+resp.data.unionId
					return $.Deferred().reject({
						stateCode: 200,
						ReturnCode: resp.returnCode,
						Msg: resp.msg
					});
				}
				else{ // todo 不同returnCode的差异化处理
					$.oppo(resp.msg);
					return $.Deferred().reject({
						stateCode: 200,
						ReturnCode: resp.returnCode,
						Msg: resp.msg
					});
				}
			}, function (error) {
				$.oppo('网络错误');
				return $.Deferred().reject({
					stateCode: error.status
				});
			})
			.always(function () {
			});
	};



	/**正则验证**/

	$.checkNum = function(value,mag){
		var isMob = /^[0-9]*$/; //数字验证
		if(isMob.test(value)){
			return true;
		}else{
			$.oppo(mag?mag:'请输入正确的数字格式');
			return false;
		}
	}
	$.checkQQ = function(value){
		var isMob = /^[1-9][0-9]{4,14}$/; //QQ验证
		if(isMob.test(value)){
			return true;
		}else{
			$.oppo('请输入正确的客服格式');
			return false;
		}
	}


	$.checkMob = function(value){
		var isMob = /^1\d{10}$/; //手机格式验证
		if(isMob.test(value)){
			return true;
		}else{
			$.oppo('请输入正确的手机号码');
			return false;
		}
	}
	$.checkPwd = function(value){
		var isPwd =/[0-9A-Za-z]{6,20}$/; //密码验证
		if(isPwd.test(value)){
			return true;
		}else{
			$.oppo('密码应该为6-20位字符');
			return false;
		}
	}
	$.checkMail = function(value){
		var isMail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/ ;
		if(isMail.test(value)){
			return true;
		}else{
			$.oppo('请输入正确的电子邮箱');
			return false;
		}
	}
	$.checkAcc = function(value){
		var isMail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/ ;
		var isMob = /^1\d{10}$/;
		if(isMail.test(value)||isMob.test(value)){
			return true;
		}else{
			$.oppo('请输入正确的电子邮箱或手机号码');
			return false;
		}
	}

	//身份证
	$.checkIdCard = function(value){
		var isCard = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
		if(isCard.test(value)){
			return true;
		}
		else{
			$.oppo('身份证输入不合法')
			return false;
		}
	}
	// 护照
	$.checkCard = function(value){
		var isCard = /^1[45][0-9]{7}|([P|p|S|s]\d{7})|([S|s|G|g]\d{8})|([Gg|Tt|Ss|Ll|Qq|Dd|Aa|Ff]\d{8})|([H|h|M|m]\d{8，10})$/;
		if(isCard.test(value)){
			return true;
		}
		else{
			$.oppo('护照输入不合法')
			return false;
		}
	}

	$.checkMoney = function(value){
		var isMoney = /^[0-9]+(.[0-9]{1,2})?$/;
		if(isMoney.test(value)){
			return true;
		}
		else{
			$.oppo('请输入正确的格式');//小数点后两位
			return false;
		}
	}
	//验证网址
	$.CheckUrl=function( value )
	{
		var reg=/^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
		if(reg.test(value)){
			return true;
		}
		else{
			$.oppo('请输入正确的网址');
			return false;
		}
	}


	// 时间转换  时间倒计时
	$.saletime2=function(object,timeline,type){
		var _this=this;
		var endtime = timeline;//取结束日期
		var nowtime = new Date().getTime();        //今天的日期(毫秒值)
		var youtime;
		if(type ==1){
			youtime=(endtime-nowtime)/1000;//还有多久(毫秒值)
		}else{
			youtime=(endtime*1000-nowtime)/1000;//还有多久(毫秒值)
		}
		if(youtime<0){
			// window.location.reload();
		}else{
			time(object,youtime);
			function time(obj,youtime){
				var seconds = youtime;
				var minutes = Math.floor(seconds/60);
				var hours = Math.floor(minutes/60);
				var days = Math.floor(hours/24);
				var CDay= days ;
				var CHour= hours % 24;
				var CMinute= minutes % 60;
				var CSecond= Math.floor(seconds%60);//"%"是取余运算，可以理解为60进一后取余数，然后只要余数。
				if (CSecond < 10) {
					CSecond = "0"+CSecond
				};
				if (days < 10) {
					days = "0"+days
				};
				if (CHour < 10) {
					CHour = "0"+CHour
				};
				if (CMinute < 10) {
					CMinute = "0"+CMinute
				};
				if(youtime==0){
					//如果结束日期小于当前日期就提示过期啦
					obj.html(CMinute+":"+CSecond);
					/*toolTips(0, "由于您长时间未接单，订单已被自动取消！", 1,function(){
					 window.location.href="/Repairman/Order";
					 });*/
				}else{
					// console.log('11:'+CMinute+'分钟'+CSecond+'秒')
					// console.log('22:'+days+'天'+CHour+'小时'+CMinute+'分钟'+CSecond+'秒')
					//输出数据
					if(days>0){
						obj.html(days+'天'+CHour+'小时'+CMinute+'分钟'+CSecond+'秒');

					}else{
						if(CHour>0){
							obj.html(CHour+'小时'+CMinute+'分钟'+CSecond+'秒');
						}else{
							obj.html(CMinute+'分钟'+CSecond+'秒');
						}
					}
					// console.log(obj,obj.html());
					youtime--;
					setTimeout(function(){
						time(obj,youtime);
					},1000)
				}
			}
		}
	}
	// 时间转换  时间倒计时
	$.saletime3=function(object,timeline,type){
		var _this=this;
		var endtime = timeline;//取结束日期
		var nowtime = new Date().getTime();        //今天的日期(毫秒值)
		var youtime;
		if(type ==1){
			youtime=(endtime-nowtime)/1000;//还有多久(毫秒值)
		}else{
			youtime=(endtime*1000-nowtime)/1000;//还有多久(毫秒值)
		}
		if(youtime<0){
			// window.location.reload();
		}else{
			time(object,youtime);
			function time(obj,youtime){
				var seconds = youtime;
				var minutes = Math.floor(seconds/60);
				var hours = Math.floor(minutes/60);
				var days = Math.floor(hours/24);
				var CDay= days ;
				var CHour= hours % 24;
				var CMinute= minutes % 60;
				var CSecond= Math.floor(seconds%60);//"%"是取余运算，可以理解为60进一后取余数，然后只要余数。
				if (CSecond < 10) {
					CSecond = "0"+CSecond
				};
				if (days < 10) {
					days = "0"+days
				};
				if (CHour < 10) {
					CHour = "0"+CHour
				};
				if (CMinute < 10) {
					CMinute = "0"+CMinute
				};
				if(youtime==0){
					//如果结束日期小于当前日期就提示过期啦
					obj.html(CMinute+":"+CSecond);
					/*toolTips(0, "由于您长时间未接单，订单已被自动取消！", 1,function(){
					 window.location.href="/Repairman/Order";
					 });*/
				}else{
					// console.log('11:'+CMinute+'分钟'+CSecond+'秒')
					// console.log('22:'+days+'天'+CHour+'小时'+CMinute+'分钟'+CSecond+'秒')
					//输出数据
					// clearTimeout(times);
					// if(days>0){
					// 	obj.html(days+'天'+CHour+'小时'+CMinute+'分钟'+CSecond+'秒');
					// }else{
						if(CHour>0){
							obj.html(CHour+'小时'+CMinute+'分钟'+CSecond+'秒');
						}else{
							obj.html(CMinute+'分钟'+CSecond+'秒');
						}
					// }
					// console.log(obj,obj.html());
					youtime--;
					var times='',state=localStorage['state'];
					if(state){
						times=setTimeout(function(){
							time(obj,youtime);
						},1000)
					}else{
						clearTimeout(times);
						times='';
						return;
					}
					// clearTimeout(times);
				}
			}
		}
	}



})(jQuery)


