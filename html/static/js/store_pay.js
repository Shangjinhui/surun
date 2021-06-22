;(function () {
	var qrcode,timer
	var app = new Vue({
		el: '#app',
		data: {
			orderId:plus.getUrlParam('orderId')?plus.getUrlParam('orderId'):'',
			orderInfo:'',
			orderDetail:[],
			company:'',
			info:'',

			payType:1,//支付方式
			paymentCode:'wechatPcPay',//dummyPay:虚拟支付，aliPcPay：支付宝PC支付
			ewmShow:false

		},
		mounted: function () {
			var _this=this;
			$.checkUser();
			_this.getInfo();
			qrcode=new QRCode(document.getElementById("code"),{
				render: "table", //二维码的生成方式
				width: 200,
				height:200,
				correctLevel:3
			});
		},
		methods:{
			//订单详情
			getInfo:function(  )
			{
				var _this=this;
				_this.$loading();
				$._ajax({
					url:  'order/order_info',
					type:'get',
					data:{
						orderId:_this.orderId,
					}
				}).done(function(data){
					_this.info=data;
					_this.orderInfo=data.orderInfo;
					_this.company=data.company;
					_this.orderDetail=data.orderDetail;

					if(data.orderInfo.status!=0){
						var href='c_order.html';
						window.open(href);
					}

				}).always(function () {
					_this.$loading().close();
				});
			},


			//支付
			payMent:function(  )
			{
				var _this=this;
				// _this.$loading();
				$._ajax({
					url:  'pay/index',
					type:'post',
					data:JSON.stringify({
						orderId:_this.orderId,
						paymentCode:_this.paymentCode,//dummyPay:虚拟支付，aliPcPay：支付宝PC支付
					})
				}).done(function(data){
					if(_this.payType==2){
						const payDiv = document.getElementById('payDiv');
						if (payDiv) {
							document.body.removeChild(payDiv);
						}
						const div = document.createElement('div');
						div.id = 'payDiv';
						div.innerHTML = data.aliForm;
						document.body.appendChild(div);
						document.getElementById('payDiv').getElementsByTagName('form')[0].submit();
					}else{
						console.log(111)
						// window.location.href='store_success.html?info='+plus.base64encode(JSON.stringify( {
						// 		price:_this.orderInfo.payFee,
						// 		address:_this.orderInfo.province+''+_this.orderInfo.city+''+_this.orderInfo.area+''+_this.orderInfo.info+' '+_this.orderInfo.contact+' '+_this.orderInfo.phone
						// 	}))
						_this.ewmShow=true;
						qrcode.makeCode(data.result)
						// 判断是否支付
						timer = setInterval(function(  )
						{
							_this.judgePay()
						},1000)
					}

				}).always(function () {
					_this.$loading().close();
				});
			},



			judgePay:function(){
				var _this=this;
				$._ajax({
					url: 'pay/query',
					type:'get',
					data:{
						orderId:_this.orderId,
					}
				}).done(function(data){
					if(data.isPay==1){
						setTimeout(function(  )
						{
							var href='store_success.html?info='+plus.base64encode(JSON.stringify( {
									price:_this.orderInfo.payFee,
									address:_this.orderInfo.province+''+_this.orderInfo.city+''+_this.orderInfo.area+''+_this.orderInfo.info+' '+_this.orderInfo.contact+' '+_this.orderInfo.phone
								}))
							window.open(href);
						},2000)
					}

				}).always(function(){
				});
			},


			hideEwm:function(  )
			{
				this.ewmShow=false;
				clearInterval(timer)
			},


		},
		watch:{
			payType:function( val )
			{
				if(val ==1){
					this.paymentCode='wechatPcPay';
				}else if(val ==2){
					this.paymentCode='aliPcPay';
				}
			}
		}
	});
})()

