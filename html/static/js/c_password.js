;(function () {

	var app = new Vue({
		el: '#app',
		data: {
			nav:8,
			submited:true,
			smsCode:'',
			password:'',
			qwdpassword:'',
			info:''
		},
		mounted: function () {
			var _this=this;
			$.checkUser();
			if(localStorage['userInfo']){
				this.info=$.getUser();
			}else{
				this.getInfo();
			}
		},
		methods:{
			getInfo:function(  )
			{
				var _this=this;
				_this.$loading();
				$._ajax({
					url:  'member/info',
					type:'get',
				}).done(function(data){
					_this.info=data;
					$.putUser(data);

				}).always(function () {
					_this.$loading().close();
				});
			},
			//发送短信验证码
			sendSms: function() {
				var _this = this;
				if(!_this.submited){return false}
				if($("#code").html()!='获取验证码'){return false}
				_this.submited=false;
				$._ajax({
					url: 'member/send_sms',
					type:'post',
					data: JSON.stringify({
						phone:_this.info.tel,
						type:2//1注册,2忘记密码，3短信登录，5修改手机-新手机,6商家注册，7商家快捷登陆 8-商家忘记密码 9-商家修改密码,
					}),
				}).done(function(data){
					$.CountDown($("#code"));
					$.oppo('发送验证码成功!')
				}).always(function () {
					_this.submited=true
				});
			},

			//修改密码
			findPwd:function(  )
			{
				var _this=this;
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
						phone:_this.info.tel,
						password:_this.password,
						smsCode:_this.smsCode,
					}),
				}).done(function(data){
					$.oppo('修改成功,请重新登录',function(  )
					{
						_this.backShow=false
						localStorage.removeItem('userToken')
						$.toSignin();
					},1)
				}).always(function () {
					_this.$loading().close();
				});


			},
		}
	});
})()

