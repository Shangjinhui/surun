;(function () {

	var app = new Vue({
		el: '#app',
		data: {
			searchTx:plus.getUrlParam('searchTx')?plus.base64decode(plus.getUrlParam('searchTx')):'',
			page:1,
			limit:10,
			list:null,
			total:0,
			point:'',//信用
			haveCollect:'',//收藏或购买过
			sale:'',//销量 1-倒序
			goodsList:[]
		},
		mounted: function () {
			this.getList();


		},
		methods:{
			getnav:function(){
				var _this=this;
				if(_this.sale==2){
					_this.sale=1;
				}else if(_this.sale==1){
					_this.sale=2;
				}else{
					_this.sale=1;
				}
				_this.point='';
				_this.getList();
			},
			getList:function(  )
			{
				var _this=this;
				_this.$loading();
				$._ajax({
					url:  'common/company_search',
					type:'get',
					data:{
						limit:_this.limit,
						page:_this.page,
						name:_this.searchTx,
						point:_this.point,
						haveCollect:_this.haveCollect,
						sale:_this.sale
					}
				}).done(function(data){
					_this.list=data.result;
					_this.total=data.count;
					_this.goodsList=data.goods;
				}).always(function () {
					_this.$loading().close();
				});
			},


			// 切翻页
			handleCurrentChange:function(page){
				var _this=this;
				_this.page=page;
				_this.getList();
			},


		}
	});
})()

