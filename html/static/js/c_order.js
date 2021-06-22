;(function () {
	var app = new Vue({
		el: '#app',
		data: {
			nav:1,
			searchTitle:'',
			status:'',//-1已取消，0待付款，1拼团中，2待发货，3待收货，4已完成
			orderType:plus.getUrlParam('orderType')?plus.getUrlParam('orderType'):'',//状态栏，'':所有订单，0：待付款，2：待发货，3待收货,4待评价
			orderTime:'1',//时间筛选，1近三个月，2今年，3去年，4去年以前
			statusList:[
				{id:'',name:'全部'},
				{id:'-1',name:'已取消'},
				{id:'0',name:'待付款'},
				{id:'1',name:'拼团中'},
				{id:'2',name:'待发货'},
				{id:'3',name:'待收货'},
				{id:'4',name:'已完成'},
			],
			timeList:[
				{id:1,name:'近三个月'},
				{id:2,name:'今年'},
				{id:3,name:'去年'},
				{id:4,name:'去年以前'},
			],
			pageNo:1,
			limit:10,
			list:null,
			total:0,
			checkAll:false,
			checkList:[],
			info:'',
			userinfo:'',
		},
		mounted: function () {
			var _this=this;
			$.checkUser();
			if(_this.orderType==5){
				_this.getRefundList();

			}else{
				_this.getList();

			}
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
			// 订单列表
			getList:function(  )
			{
				var _this=this;
				_this.$loading();
				$._ajax({
					url:  'order/order_list',
					type:'get',
					data:{
						pageNo:_this.pageNo,
						limit:_this.limit,
						searchTitle:_this.searchTitle,
						status:_this.status,
						orderType:_this.orderType,
						orderTime:_this.orderTime,
					}
				}).done(function(data){
					_this.list=data.list;
					_this.total=data.count;
					_this.info=data;

				}).always(function () {
					_this.$loading().close();
				});
			},

			// 售后订单
			getRefundList:function(  )
			{
				var _this=this;
				_this.$loading();
				$._ajax({
					url:  'order/order_refund',
					type:'get',
					data:{
						pageNo:_this.pageNo,
						limit:_this.limit,
					}
				}).done(function(data){
					_this.list=data.list;
					_this.total=data.count;

				}).always(function () {
					_this.$loading().close();
				});
			},

			// 切翻页
			handleCurrentChange:function(page){
				var _this=this;
				_this.pageNo=page;
				if(_this.orderType==5){
					_this.getRefundList();

				}else{
					_this.getList();

				}
			},

			changeType:function( val )
			{
				// if(val){
				// 	window.location.href='c_order.html?orderType='+val
				// }else{
				// 	window.location.href='c_order.html'
				// }
				this.orderType=val;
				this.pageNo=1;

				this.getList();


			},



			//提醒发货
			remindInfo:function( item )
			{
				var _this=this;
				_this.$loading();
				$._ajax({
					url:  'order/remind_ship',
					type:'get',
					data:{
						orderId:item,
					}
				}).done(function(data){
					$.oppo('提醒发货成功')
				}).always(function () {
					_this.$loading().close();
				});
			},

			//确认收货
			confirmInfo:function( item )
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
							orderId:item,
						}
					}).done(function(data){
						$.oppo('操作成功！');
						_this.getList();
					}).always(function () {
						_this.$loading().close();
					});
				}).catch(function(  )
				{

				});

			},

			//取消订单
			cancelInfo:function( item )
			{
				var _this=this;
				_this.$confirm('确定要取消该订单吗？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(function(  )
				{
					_this.$loading();
					$._ajax({
						url:  'order/cancel_order',
						type:'get',
						data:{
							orderId:item,
						}
					}).done(function(data){
						$.oppo('操作成功！');
						_this.getList();
					}).always(function () {
						_this.$loading().close();
					});
				}).catch(function(  )
				{

				});

			},

			//删除订单
			delInfo:function( item )
			{
				var _this=this;
				_this.$confirm('确定要删除该订单吗？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(function(  )
				{
					_this.$loading();
					$._ajax({
						url:  'order/del_order',
						type:'get',
						data:{
							orderId:item,
						}
					}).done(function(data){
						$.oppo('操作成功！');
						_this.pageNo=1;
						_this.getList();
					}).always(function () {
						_this.$loading().close();
					});
				}).catch(function(  )
				{

				});

			},

			goReturn:function( item )
			{
				<!--type 1-仅退款，2-退货退款-->
				<!--refundStatus 	-2-审核拒绝，-1-已取消，0未退款，1-审核中，2-审核通过，3-买家已发货,4-售后完成-->
				var id=''
				if(this.orderType==5){
					id=item.orderDetailsId
				}else{
					id=item.orderDetailId
				}
				if(item.refundStatus==1){
					var href='o_processing_refund.html?ctype=1&id='+id+'&type='+item.type;
					window.open(href);
				}else if(item.refundStatus==2){
					if(item.type==1){
						var href='o_processing_refund.html?ctype=1&id='+id+'&type='+item.type;
						window.open(href);
					}else{
						var href='o_return_goods.html?ctype=1&id='+id;
						window.open(href);
					}
				}else if(item.refundStatus==3){
					var href='o_return_goods_info.html?ctype=1&id='+id;
					window.open(href);
				}else{
					var href='o_refund_end.html?ctype=1&id='+id+'&type='+item.type;
					window.open(href);
				}
			},

			//撤销申请
			cancelRefund:function( id )
			{
				var _this=this;
				_this.$loading();
				$._ajax({
					url: 'order_integral/cancel_refund',
					type:'get',
					data:{
						orderId:id
					}
				}).done(function(data){
					$.oppo('撤销成功',function(  )
					{
						_this.getList()
					});

				}).always(function () {
					_this.$loading().close();
				});
			},


		},
		watch:{
			status:function( val )
			{
				this.pageNo=1;
				this.getList()
			},
			orderTime:function( val )
			{
				this.pageNo=1;
				this.getList()
			}
		}
	});
})()

