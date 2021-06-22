;(function () {
	var timer;
	var app = new Vue({
		el: '#app',
		data: {
			sub:1,
			checked:false,
			phone: '',
			password: '',
			qwdpassword:'',
			smsCode:'',
			submited:true,
			code:plus.getUrlParam('code')?plus.getUrlParam('code'):'',

			appImg:'',
			appKey:''


		},
		mounted: function () {
			var swiper = new Swiper('.swiper-container', {
		        pagination: '.swiper-pagination',
		        paginationClickable: true,
		        centeredSlides: true,
		        autoplay: 5000,
		        autoplayDisableOnInteraction: false,
		        loop: true,
		        speed:1000,
		    });

			if(localStorage['userPhone']){
				var info=JSON.parse(plus.base64decode(localStorage['userPhone']));
				this.phone=info.phone;
				this.password=info.password;
				this.checked=true;
			}
			if(this.code){
				this.wxLogin()
			}

			this.getQrcode();
		},
		methods:{
			switchFun:function(e){
				this.sub=e;
			},

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
						type:2//1注册,2忘记密码，3短信登录，5修改手机-新手机,6商家注册，7商家快捷登陆 8-商家忘记密码 9-商家修改密码,
					}),
				}).done(function(data){
					$.CountDown($("#code"));
					$.oppo('发送验证码成功!')
				}).always(function () {
					_this.submited=true
				});
			},

			//找回密码
			findPwd:function(  )
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
				_this.$loading();
				$._ajax({
					url: 'member/find_password',
					type:'post',
					data: JSON.stringify({
						phone:_this.phone,
						password:_this.password,
						smsCode:_this.smsCode,
					}),
				}).done(function(data){
					$.oppo('修改成功,请重新登录',function(  )
					{
						_this.sub = 2;
					})
				}).always(function () {
					_this.$loading().close();
				});


			},


			//账号登录
			login:function(  )
			{
				var _this=this;
				if(!_this.phone){
					$.oppo('请输入手机号!')
					return false;
				}
				if(!$.checkMob(_this.phone)){
					return false;
				}
				if(!_this.password){
					$.oppo('请输入密码!')
					return false;
				}

				_this.$loading();
				$._ajax({
					url: 'member/signin',
					type:'post',
					data: JSON.stringify({
						phone:_this.phone,
						password:_this.password,
					}),
				}).done(function(data){
					if(_this.checked){
						localStorage['userPhone'] = $.base64encode(JSON.stringify({
							phone:_this.phone,
							password:_this.password,
						}))
					}else{
						localStorage.removeItem('userPhone')
					}
					localStorage['userToken']=data.token;
					if(plus.getUrlParam('from')){
						window.location.href =plus.base64decode(plus.getUrlParam('from'));
					}
					else{
						window.location.href='index.html';
					}
				}).always(function () {
					_this.$loading().close();
				});


			},

			//微信登录
			wxLogin:function(  )
			{
				var _this = this;
				if(!_this.submited){return false;}
				$._ajax({
					url: 'member/wx_login',
					type:'post',
					data: JSON.stringify({
						wxcode:_this.code
					} )
				}).done(function(res){
					localStorage['userToken']=res.token;
					window.location.href='index.html';
				}).always(function () {
					_this.submited=true;
				});
			},



			//app扫码登录pc端生成二维码（二分钟更换一次）
			getQrcode:function(  )
			{
				var _this = this;
				$._ajax({
					url: 'member/get_qrcode',
					type:'get',
				}).done(function(res){
					_this.appImg=$.baseUrl+'qr/index?d='+res.url;
					_this.appKey=res.key;
					clearInterval(timer)
					setTimeout(function(  )
					{
						_this.getQrcode();
					},120000)

					timer=setInterval(function(  )
					{
						_this.appLogin();
					},1000)
				}).always(function () {
				});
			},

			appLogin:function(  )
			{
				var _this = this;
				if(!_this.submited||_this.sub!=1){return false}
				_this.submited=false
				$._ajax({
					url: 'member/app_do_login',
					type:'post',
					data:JSON.stringify({
						key:_this.appKey
					})
				}).done(function(res){
					if(res.token){
						clearInterval(timer);
						localStorage['userToken']=res.token;
						if(plus.getUrlParam('from')){
							window.location.href =plus.base64decode(plus.getUrlParam('from'));
						}
						else{
							window.location.href='index.html';
						}
					}

				}).always(function () {
					_this.submited=true
				});
			}


		}
	});
})()

