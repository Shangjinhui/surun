;(function () {

	var app = new Vue({
		el: '#app',
		data: {
			id:plus.getUrlParam('id')?plus.getUrlParam('id'):'',
			info:'',

		},
		mounted: function () {
			var _this=this;
			$.checkUser();
			_this.getInfo();
		},
		methods:{
			getInfo:function(  )
			{
				var _this=this;
				_this.$loading();
				$._ajax({
					url:  'order_integral/info',
					type:'get',
					data:{
						orderId:_this.id,
					}
				}).done(function(data){
					_this.info=data;
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
					url:  'order_integral/remind',
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
						url:  'order_integral/confirm',
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

