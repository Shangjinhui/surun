;(function () {

	var app = new Vue({
		el: '#app',
		data: {
			id:plus.getUrlParam('id')?plus.getUrlParam('id'):'', //订单id
			ctype:plus.getUrlParam('ctype')?plus.getUrlParam('ctype'):'', //1普通商品 2积分商品
			info:'',
		},
		mounted: function () {
			var _this=this;
			$.checkUser();
			_this.getInfo();
		},
		methods:{
			//订单详情
			getInfo:function(  )
			{
				var _this=this;
				var url,data;
				if(_this.ctype==1){
					url = 'order/order_goods';
					data ={orderDetailId:_this.id} ;
				}else{
					url = 'order_integral/info';
					data ={orderId:_this.id};

				}
				_this.$loading();
				$._ajax({
					url:  url,
					type:'get',
					data:data
				}).done(function(data){
					if(_this.ctype==1){
						_this.info=data.orderDetail
					}else{
						if(data.orderGoods&&data.orderGoods.length>0){
							_this.info=data.orderGoods[0];
						}
					}

				}).always(function () {
					_this.$loading().close();
				});
			},
		}
	});
})()

