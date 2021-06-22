;(function () {

	var app = new Vue({
		el: '#app',
		data: {
			id:plus.getUrlParam('id')?plus.getUrlParam('id'):'', //订单id
			ctype:plus.getUrlParam('ctype')?plus.getUrlParam('ctype'):'', //1普通商品 2积分商品
			type: plus.getUrlParam('type')?plus.getUrlParam('type'):1,//1 退款  2退货退款,
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

						//-2-审核拒绝，-1-已取消，1-审核中，2-审核通过，3-买家已发货,4-售后完成
						if(_this.orderRefund.refundStatus==-2||_this.orderRefund.refundStatus==4){//审核拒绝  售后完成
							var href='o_refund_end.html?ctype=1&id='+_this.id+'&type='+_this.type;
							window.open(href);
						}else if(_this.orderRefund.refundStatus==2){//审核通过
							if(_this.type==2){
								var href='o_return_goods.html?ctype=1&id='+_this.id;
								window.open(href);
							}
						}
						if(_this.type==1&&_this.orderRefund.refundStatus==2){
							$.saletime2($('#order-time2'), _this.orderRefund.payExpireTime,2);
						}else{
							console.log(111)
							$.saletime2($('#order-time1'), _this.orderRefund.checkExpireTime,2);
						}


					}else{
						if(data.orderGoods&&data.orderGoods.length>0){
							_this.infoGood=data.orderGoods[0];
						}
						_this.amount=data.goodsAmount
						_this.orderRefund=data.orderRefund;
						$.saletime2($('#order-time'), new Date(data.orderRefund.endTime),1);


						//0-未退款 -1-已取消，1-审核中，2-审核通过，3-审核拒绝，4-买家已发货,5-售后完成
						if(data.refundStatus==3||data.refundStatus==5){//审核拒绝  售后完成
							var href='o_refund_end.html?ctype=2&id='+_this.id+'&type='+_this.type;
							// window.open(href);
							window.location.href=href
						}else if(data.refundStatus==2&&data.orderRefund.type==2){
							//审核通过
							var href='o_return_goods.html?ctype=2&id='+_this.id;
							// window.open(href);
							window.location.href=href
						}


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

			//撤销申请
			cancelRefund:function(  )
			{
				var _this=this;
				var url,data;
				if(_this.ctype==1){
					url='order/refund_cancel';
					data = { refundId:_this.orderRefund.id }
				}else{
					url='order_integral/cancel_refund'
					data = { orderId:_this.id }
				}
				_this.$loading();
				$._ajax({
					url:  url,
					type:'get',
					data:data
				}).done(function(data){
					$.oppo('撤销成功',function(  )
					{
						if(_this.ctype==1){
							var href='c_order.html';
							// window.open(href);
							window.location.href=href
						}else{
							var href='c_exchange.html';
							// window.open(href);
							window.location.href=href
						}
					});

				}).always(function () {
					_this.$loading().close();
				});
			},
		}
	});
})()

