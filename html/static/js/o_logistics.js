;(function () {

	var app = new Vue({
		el: '#app',
		data: {
			id:plus.getUrlParam('id')?plus.getUrlParam('id'):'', //订单id
			ctype:plus.getUrlParam('ctype')?plus.getUrlParam('ctype'):'', //1普通商品 2积分商品
			info:''
		},
		mounted: function () {
			var _this=this;
			$.checkUser();
			_this.getInfo();
		},
		methods:{
			//详情
			getInfo:function(  )
			{
				var _this=this;
				_this.$loading();
				$._ajax({
					url:  'order/ship_info',
					type:'get',
					data:{
						orderId:_this.id,
						type:_this.ctype
					}
				}).done(function(data){

					_this.info = data;

				}).always(function () {
					_this.$loading().close();
				});
			},
		}
	});
})()

