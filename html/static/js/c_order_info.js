;(function () {

	var app = new Vue({
		el: '#app',
		data: {
			id:plus.getUrlParam('id')?plus.getUrlParam('id'):'',
			info:'',
			orderInfo:'',
			company:'',
			orderDetail:[],
			userinfo:''
		},
		mounted: function () {
			var _this=this;
			$.checkUser();
			_this.getInfo();
			_this.userinfo = $.getUser();
		},
		methods:{
			goService:function( groupId )
			{
				var _this=this;
				//配置客服
				ysf( 'config', {
					uid: _this.userinfo ? _this.userinfo.id : "",
					name: _this.userinfo? _this.userinfo.nickname : '',
					email: _this.userinfo.email ? _this.userinfo.email : '',
					mobile: _this.userinfo ? _this.userinfo.tel : '',
					groupid:groupId,
					success: function()
					{
						// todo
					},
					error: function()
					{
						// handle error
					}
				} );
				ysf('open', {
				});
			},
			getInfo:function(  )
			{
				var _this=this;
				_this.$loading();
				$._ajax({
					url:  'order/order_info',
					type:'get',
					data:{
						orderId:_this.id,
					}
				}).done(function(data){
					_this.info=data;
					_this.orderInfo=data.orderInfo;
					_this.company=data.company;
					_this.orderDetail=data.orderDetail;
					if(data.orderInfo.status==1){
						$.saletime2($('#order-time1'), data.orderInfo.groupExpireTime,2);
					}else if(data.orderInfo.status==0){
						$.saletime2($('#order-time'), data.orderInfo.expireTime,2);
					}

				}).always(function () {
					_this.$loading().close();
				});
			},

			//提醒发货
			remindInfo:function(  )
			{
				var _this=this;
				_this.$loading();
				$._ajax({
					url:  'order/remind_ship',
					type:'get',
					data:{
						orderId:_this.id,
					}
				}).done(function(data){
					$.oppo('提醒发货成功')
				}).always(function () {
					_this.$loading().close();
				});
			},

			//确认收货
			confirmInfo:function(  )
			{
				var _this=this;
				_this.$confirm('请收到货后，再确认收货', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(function(  )
				{
					_this.$loading();
					$._ajax({
						url:  'order/confirm_order',
						type:'get',
						data:{
							orderId:_this.id,
						}
					}).done(function(data){
						$.oppo('操作成功！');
						_this.getInfo();
					}).always(function () {
						_this.$loading().close();
					});
				}).catch(function(  )
				{

				});

			},

		}
	});
})()

