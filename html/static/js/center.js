;(function () {

	var app = new Vue({
		el: '#app',
		data: {
			code:plus.getUrlParam('code')?plus.getUrlParam('code'):'',

			nav:0,
			isShow:false,
        	imageUrl: 'static/img/center-img3.jpg',
			avatar:null,
			nickname: '',
			birthday:'',
			truename:'',
			sex:'',
			phone:'',
			province:'',
			city:'',
			area:'',
			provinceList:[],
			cityList:[],
			areaList:[],
			avatarId:'',

			isSee:false,

			uploadUrl:$.baseUrl+'upload/files',
			isSign:false,

			backShow:false,
			submited:true,

			newPhone:'',
			newSmsCode:'',
			bindWechat:0,//绑定微信
			unbindShow:false,

		},
		mounted: function () {
			var _this=this;
			$.checkUser();
			$.getJSON("static/public/city.json", function (data){
				_this.provinceList=data;

				_this.getInfo();

			})


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
					_this.nickname=data.nickname;
					_this.birthday=data.birthday;
					_this.truename=data.truename;
					_this.sex=data.sex;
					_this.phone=data.phone;
					_this.isSee=true;
					_this.avatar=data.avatar;
					_this.province=data.province;
					_this.city=data.city;
					_this.area=data.area;
					_this.bindWechat=data.bindWechat;
					$.putUser(data);
					_this.getSign()


					if(_this.code&&_this.bindWechat==0){
						_this.wxLogin()
					}

				}).always(function () {
					_this.$loading().close();
				});
			},

			handleAvatarSuccess:function(res, file) {
		        this.avatar = file.url;
				this.avatarId = file.response.data.fileId;

		    },
			beforeAvatarUpload:function( file )
			{
				var _this=this;
				const isLt2M = file.size / 1024 / 1024 < 2;
				if (!isLt2M) {
					this.$message.error('上传头像图片大小不能超过 2MB!');
					return false;
				}
				if(!/image\/\w+/.test(file.type)){
					this.$message.error('请上传图片!');
					return false;
				}
			},

			editInfo:function(  )
			{
				var _this=this;
				_this.$loading();
				$._ajax({
					url:  'member/info',
					type:'post',
					data:JSON.stringify({
						nickname:_this.nickname,
						birthday:_this.birthday,
						name:_this.truename,
						sex:_this.sex,
						avatar:_this.avatarId,
						province:_this.province,
						city:_this.city,
						area:_this.area,
					})
				}).done(function(data){
					$.oppo('修改成功');
					_this.getInfo()
				}).always(function () {
					_this.$loading().close();
				});
			},

			//每日签到
			sign:function(  )
			{
				var _this=this;
				if(_this.isSign){
					return false
				}
				_this.$loading();
				$._ajax({
					url:  'collect/signin',
					type:'get',
				}).done(function(data){
					$.oppo('签到成功');
					_this.isSign = true;
				}).always(function () {
					_this.$loading().close();
				});
			},
			//获取签到状态
			getSign:function(  )
			{
				var _this=this;
				_this.$loading();
				$._ajax({
					url:  'other/signin',
					type:'get',
				}).done(function(data){
					if(data&&data ==1)
					{
						_this.isSign = true;
					}
					_this.isShow=true
				}).always(function () {
					_this.$loading().close();
				});
			},

			//发送短信验证码
			sendSms: function() {
				var _this = this;
				if(!_this.submited){return false}
				if(!_this.newPhone){
					$.oppo('请输入手机号!')
					return false;
				}
				if(!$.checkMob(_this.newPhone)){
					return false;
				}
				if($("#code").html()!='获取验证码'){return false}
				_this.submited=false;
				$._ajax({
					url: 'member/send_sms',
					type:'post',
					data: JSON.stringify({
						phone:_this.newPhone,
						type:10//1注册,2忘记密码，3短信登录，5修改手机-新手机,6商家注册，7商家快捷登陆 8-商家忘记密码 9-商家修改密码,
					}),
				}).done(function(data){
					$.CountDown($("#code"));
					$.oppo('发送验证码成功!')
				}).always(function () {
					_this.submited=true
				});
			},

			//修改手机号
			editPhone:function(  )
			{
				var _this=this;
				if(!_this.newPhone){
					$.oppo('请输入手机号!')
					return false;
				}
				if(!$.checkMob(_this.newPhone)){
					return false;
				}
				if(!_this.newSmsCode){
					$.oppo('请输入验证码!')
					return false;
				}
				_this.$loading();
				$._ajax({
					url: 'member/phone',
					type:'post',
					data: JSON.stringify({
						newPhone:_this.newPhone,
						newSmsCode:_this.newSmsCode,
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

			//微信绑定
			wxLogin:function(  )
			{
				var _this = this;
				_this.$loading();
				$._ajax({
					url: 'member/bind_wx',
					type:'post',
					data: JSON.stringify({
						wxcode:_this.code,
						type:1
					} )
				}).done(function(res){
					_this.bindWechat=1
				}).always(function () {
					_this.$loading().close();

				});
			},

			//解除绑定微信
			unbindWx:function(  )
			{
				var _this = this;
				_this.$loading();
				$._ajax({
					url: 'member/cancel_wechat',
					type:'get'
				}).done(function(res){
					_this.bindWechat=0;
					_this.unbindShow=false;
				}).always(function () {
					_this.$loading().close();

				});
			},


		},
		watch:{
			province:function( val )
			{
				var _this=this;
				if(_this.isSee){
				}else{
					_this.cityList=[];
					_this.areaList=[];
					_this.city='';
					_this.area='';
				}

				for(var key in _this.provinceList){
					if(val == _this.provinceList[key].oid){
						_this.cityList=_this.provinceList[key].subDistricts;
					}
				}

			},
			city:function( val )
			{
				var _this=this;
				if(_this.isSee){

				}else
				{
					_this.areaList = [];
					_this.area = '';
				}

				_this.isSee=false;
				for(var key in _this.cityList){
					if(val == _this.cityList[key].oid){
						_this.areaList=_this.cityList[key].subDistricts;
					}
				}
			}
		}
	});
})()

