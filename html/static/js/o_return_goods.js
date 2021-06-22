;(function () {

	var app = new Vue({
		el: '#app',
		data: {
			id:plus.getUrlParam('id')?plus.getUrlParam('id'):'', //订单id
			ctype:plus.getUrlParam('ctype')?plus.getUrlParam('ctype'):'', //1普通商品 2积分商品
			info:'',
			infoGood:'',
			orderRefund:'',
			refundPhone:'',

			shipList:[],
			shipName:'',//物流公司
			shipNo:'',//物流单号
			shipPhone:'',//联系电话

			company:''
		},
		mounted: function () {
			var _this=this;
			$.checkUser();
			_this.getInfo();
			_this.getPhone();
			_this.getShip();
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

			//物流公司
			getShip:function(  )
			{
				var _this=this;
				_this.$loading();
				$._ajax({
					url:  'other/ship_company',
					type:'get',
				}).done(function(data){
					_this.shipList=data;
				}).always(function () {
					_this.$loading().close();
				});
			},

			refundInfo:function(  )
			{
				var _this=this;
				if(!_this.shipName){
					$.oppo('请输入物流公司');
					return false
				}
				if(!_this.shipNo){
					$.oppo('请输入物流单号');
					return false
				}
				// if(!_this.shipPhone){
				// 	$.oppo('请输入联系电话');
				// 	return false
				// }
				// if(!$.checkMob(_this.shipPhone)){return false;}

				var url,data;
				if(_this.ctype==1){
					url = 'order/refund_ship';
					data = JSON.stringify({
						refundId:_this.orderRefund.id,
						shipName:_this.shipName,
						shipNo:_this.shipNo,
					})
				}else{
					url = 'order_integral/refund';
					data = JSON.stringify({
						orderId:_this.id,
						shipName:_this.shipName,
						shipNo:_this.shipNo,
						// shipPhone:_this.shipPhone,
					})
				}
				_this.$loading();
				$._ajax({
					url: url ,
					type:'post',
					data:data
				}).done(function(data){
					var href='o_return_goods_info.html?ctype='+_this.ctype+'&id='+_this.id;
					// window.open(href);
					window.location.href=href
				}).always(function () {
					_this.$loading().close();
				});

			}


		}
	});
})()

