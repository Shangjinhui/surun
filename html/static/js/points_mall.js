;(function () {

	var app = new Vue({
		el: '#app',
		data: {
			bannerList:[],
			category:[],
			categoryAll:[],
			pageNo:1,
			limit:10,
			list:null,
			total:0,
			type:plus.getUrlParam('type')?plus.getUrlParam('type'):-1,
			searchTx:plus.getUrlParam('text')?plus.getUrlParam('text'):'',
			cartNum:0,
			searchList:[],
			headerList:[],
			slideState:false,
			isMore:false ,//是否显示更多
		},
		mounted: function () {
			this.getBanner();
			if(localStorage['userToken']){
				$.checkUser();
				this.getNum();
			}
		},
		methods:{
			// 首页分类,banner展示
			getBanner:function(){
				var _this=this;
				_this.$loading();
				$._ajax({
					url:  'integral/index',
					type:'get',
				}).done(function(data){
					_this.bannerList=data.banner;
					var num=0
					for(var key in data.category){
						var item=data.category[key];
						num=num+item.name.length*14+30
					}
					if(num>930){
						_this.isMore=true;
					}
					_this.category=data.category;
					_this.categoryAll=data.categoryAll;
					Vue.nextTick(function(  )
					{
						var mySwiper1 = new Swiper('.swiper1', {
							pagination: '.swiper-pagination1',
							autoplay:5000,
							autoplayDisableOnInteraction: false,
							paginationClickable: true,
							loop:true
						})
					})

					_this.getList();


				}).always(function () {
					_this.$loading().close();
				});
			},
			goLists:function(e){
				if(e==-1){
					this.type=e;
				}else{
					this.type=e.id;
				}
				
				this.getList();
			},
			//产品展示
			getList:function(){
				var _this=this;
				_this.$loading();
				$._ajax({
					url:  'integral/list',
					type:'post',
					data:JSON.stringify({
						word:_this.searchTx,
						limit:_this.limit,
						pageNo:_this.pageNo,
						type:_this.type,
					})
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
				_this.getList();
			},
			goShopCart:function(){
				$.checkUser();
				var href='shopping_cart.html';
				window.open(href);
			},
			//购物车数量
			getNum:function(){
				var _this=this;
				$._ajax({
					url:  'order/cart_number',
					type:'get',
				}).done(function(data){
					_this.cartNum=data.cartNum
				}).always(function () {
				});
			},
			// //搜索关键词
			// getSearchList:function(){
			// 	var _this=this;
			// 	$._ajax({
			// 		url:  'common/search_keyword',
			// 		type:'get',
			// 		data:{
			// 			type:_this.ctype,
			// 			name:_this.searchTx
			// 		}
			// 	}).done(function(data){
			// 		_this.searchList=data
			// 	}).always(function () {
			// 	});
			// },
			navState:function(){
				var _this=this;
				_this.slideState=!_this.slideState;
			},
			carlist:function(){
				var href='shopping_cart.html';
				window.open(href);
			},
		}
	});
})()

