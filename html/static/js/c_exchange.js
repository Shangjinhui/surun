;(function () {
	var app = new Vue({
		el: '#app',
		data: {
			nav:7,
			pageNo:1,
			limit:10,
			list:null,
			total:0,
		},
		mounted: function () {
			var _this=this;
			$.checkUser();
			_this.getList();

		},
		methods:{
			getList:function(  )
			{
				var _this=this;
				_this.$loading();
				$._ajax({
					url:  'order_integral/list',
					type:'get',
					data:{
						pageNo:_this.pageNo,
						limit:_this.limit
					}
				}).done(function(data){
					_this.list=data.orders;
					_this.total=data.totalCount;

				}).always(function () {
					_this.$loading().close();
				});
			},

			// 切翻页
			handleCurrentChange:function(page){
				var _this=this;
				_this.pageNo=page;
				_this.getList();
			},

			//提醒发货
			remindInfo:function( item )
			{
				var _this=this;
				_this.$loading();
				$._ajax({
					url:  'order_integral/remind',
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
						url:  'order_integral/confirm',
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

			goReturn:function( item )
			{
				<!--refundType 0默认状态未售后 1-仅退款，2-退货退款-->
				<!--refundStatus 0-未退款 -1-已取消，1-审核中，2-审核通过，3-审核拒绝，4-买家已发货,5-售后完成-->
				if(item.refundStatus==1){
					var href='o_processing_refund.html?ctype=2&id='+item.id+'&type='+item.refundType;
					window.open(href);
				}else if(item.refundStatus==2){
					if(item.refundType==1){
						var href='o_processing_refund.html?ctype=2&id='+item.id+'&type='+item.refundType;
						window.open(href);
					}else{
						var href='o_return_goods.html?ctype=2&id='+item.id;
						window.open(href);
					}
				}else{
					var href='o_return_goods_info.html?ctype=2&id='+item.id;
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



		}
	});
})()

