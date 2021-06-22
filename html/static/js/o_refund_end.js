;(function () {

	var app = new Vue({
		el: '#app',
		data: {
			id:plus.getUrlParam('id')?plus.getUrlParam('id'):'', //订单id
			ctype:plus.getUrlParam('ctype')?plus.getUrlParam('ctype'):'', //1普通商品 2积分商品
			type: plus.getUrlParam('type')?plus.getUrlParam('type'):1,//1 退款  2退货退款
			info:'',
			infoGood:'',
			orderRefund:'',
			refundPhone:'',
			company:''

		},
		mounted: function () {
			var _this=this;
			$.checkUser();
			_this.getInfo();
			_this.getPhone();
		},
		methods:{
			//订单详情
			getInfo:function(  )
			{
				var _this=this;
				var url,data;
				if(_this.ctype==1){
					url = 'order/refund_info';
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
						_this.company=data.company;
						_this.infoGood=data.goods;
						_this.orderRefund=data.detail;
					}else{
						if(data.orderGoods&&data.orderGoods.length>0){
							_this.infoGood=data.orderGoods[0];
						}
						_this.orderRefund=data.orderRefund;
					}
					_this.info = data;

				}).always(function () {
					_this.$loading().close();
				});
			},

			//积分商城退货电话/地址展示
			getPhone:function(  )
			{
				var _this=this;
				_this.$loading();
				$._ajax({
					url:  'other/refund_shop',
					type:'get',
				}).done(function(data){
					_this.refundPhone=data.tel;
				}).always(function () {
					_this.$loading().close();
				});
			},


			//申请平台介入
			consult:function() {
				var _this=this;
				_this.$prompt('请输入备注', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
				}).then(function( res )
				{
					if(!res.value){$.oppo('请输入备注！');return false}
					_this.$loading();
					$._ajax({
						url:  'order/consult',
						type:'post',
						data:JSON.stringify({
							refundId:_this.orderRefund.id,
							comment:res.value
						})
					}).done(function(data){
						$.oppo('操作成功！');
					}).always(function () {
						_this.$loading().close();
					});

				}).catch(function(  )
				{

				});

			}
		}
	});
})()

