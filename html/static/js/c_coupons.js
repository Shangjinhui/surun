;(function () {

	var app = new Vue({
		el: '#app',
		data: {
			nav:6,
			pageNo:1,
			limit:10,
			list:null,
			total:0,
			type:'', //	1待使用，2已使用，3已失效
			info:''
		},
		mounted: function () {
			$.checkUser();
			this.getList()
		},
		methods:{
			getList:function(  )
			{
				var _this=this;
				_this.$loading();
				$._ajax({
					url:  'coupon/my_coupon',
					type:'get',
					data:{
						limit:_this.limit,
						pageNo:_this.pageNo,
						type:_this.type,
					}
				}).done(function(data){
					_this.list=data.list;
					_this.total=data.count;
					_this.info=data;
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


			goList:function( item )
			{
				if(item.status==1){
					if(item.ctype==3){ //1店铺全商品，2店铺部分商品，3平台全商品
						var href='product_list.html';
						window.open(href);
					}else{
						var href='store.html?company='+item.companyId;
						window.open(href);
					}
				}
			}
		}
	});
})()

