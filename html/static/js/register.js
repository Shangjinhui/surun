;(function () {
	var app = new Vue({
		el: '#app',
		data: {
			phone: '',
			password: '',
			qwdpassword:'',
			smsCode:'',
			checked:false,
			submited:true,
			type:plus.getUrlParam('type')?plus.getUrlParam('type'):1, //1注册  2绑定手机号
			unionId:plus.getUrlParam('unionId')?plus.getUrlParam('unionId'):'',
			checked:false,
		},
		mounted: function () {
			var _this=this;
			var swiper = new Swiper('.swiper-container', {
		        pagination: '.swiper-pagination',
		        paginationClickable: true,
		        centeredSlides: true,
		        autoplay: 5000,
		        autoplayDisableOnInteraction: false,
		        loop: true,
		        speed:1000,
		    });

		},
		methods:{
			//发送短信验证码
			sendSms: function() {
				var _this = this;
				if(!_this.submited){return false}
				if(!_this.phone){
					$.oppo('请输入手机号!')
					return false;
				}
				if(!$.checkMob(_this.phone)){
					return false;
				}
				if($("#code").html()!='获取验证码'){return false}
				_this.submited=false;
				$._ajax({
					url: 'member/send_sms',
					type:'post',
					data: JSON.stringify({
						phone:_this.phone,
						type:1//1注册,2忘记密码，3短信登录，5修改手机-新手机,6商家注册，7商家快捷登陆 8-商家忘记密码 9-商家修改密码,
					}),
				}).done(function(data){
					$.CountDown($("#code"));
					$.oppo('发送验证码成功!')
				}).always(function () {
					_this.submited=true
				});
			},

			//注册
			register:function(  )
			{
				var _this=this;
				if(!_this.phone){
					$.oppo('请输入手机号!')
					return false;
				}
				if(!$.checkMob(_this.phone)){
					return false;
				}
				if(!_this.smsCode){
					$.oppo('请输入验证码!')
					return false;
				}
				if(!_this.password||!_this.qwdpassword){
					$.oppo('请输入密码!')
					return false;
				}
				if(_this.password!=_this.qwdpassword){
					$.oppo('两次密码输入不一致!')
					return false;
				}
				if(!_this.checked){
					$.oppo('请仔细阅读并同意平台协议!');
					return false;
				}
				_this.$loading();
				$._ajax({
					url: 'member/signup',
					type:'post',
					data: JSON.stringify({
						phone:_this.phone,
						password:_this.password,
						smsCode:_this.smsCode,
					}),
				}).done(function(res){
					$.oppo('注册成功,请重新登录',function(  )
					{
						history.go(-1);
					})
				}).always(function () {
					_this.$loading().close();
				});


			},

			bindPhone:function(  )
			{
				var _this=this;
				if(!_this.phone){
					$.oppo('请输入手机号!')
					return false;
				}
				if(!$.checkMob(_this.phone)){
					return false;
				}
				if(!_this.smsCode){
					$.oppo('请输入验证码!')
					return false;
				}
				_this.$loading();
				$._ajax({
					url: 'member/bind_phone',
					type:'post',
					data: JSON.stringify({
						phone:_this.phone,
						smsCode:_this.smsCode,
						unionId:_this.unionId
					}),
				}).done(function(res){
					localStorage['userToken']=res.token;
					window.location.href='index.html';
				}).always(function () {
					_this.$loading().close();
				});


			}

		}
	});
})()

