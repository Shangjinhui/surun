;(function () {
	var app = new Vue({
		el: '#app',
		data: {
			category:[],
			categoryAll:[],
			pageNo:1,
			limit:10,
			list:null,
			total:0,
			isShow:false,
			type:plus.getUrlParam('type')?plus.getUrlParam('type'):'-1',
		},
		mounted: function () {
			if(localStorage['userToken']){
				$.checkUser();
			}
			this.getType()
		},
		methods:{
			// 分类
			getType:function(){
				var _this=this;
				_this.$loading();
				$._ajax({
					url:  'common/get_flag_category',
					type:'get',
					data:{
						company:'0'
					}
				}).done(function(data){
					_this.category=data;
					_this.getList();
				}).always(function () {
					_this.$loading().close();
				});
			},
			//产品展示
			getList:function(){
				var _this=this;
				_this.$loading();
				$._ajax({
					url:  'common/discovery_list',
					type:'get',
					data:{
						limit:_this.limit,
						page:_this.pageNo,
					}
				}).done(function(data){
					_this.list=data.data;
					_this.total=data.count;
					_this.isShow=true;
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
			// 收藏
			collectInfo:function( item ){
				var _this=this;
				$.checkUser();
				_this.$loading();
				$._ajax({
					url:  item.collect==0?'collect/add_collect':'collect/cancel_collect',
					type:'post',
					data:JSON.stringify({
						id:item.companyId,
						type:3//1-收藏商品 2-收藏积分商品 3-收藏店铺
					})
				}).done(function(data){
					_this.getList()
				}).always(function () {
					_this.$loading().close();
				});
			},
		}
	});
})()

