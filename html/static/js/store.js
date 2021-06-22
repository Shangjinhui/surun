;(function () {

	var app = new Vue({
		el: '#app',
		data: {
			company:plus.getUrlParam('company')?plus.getUrlParam('company'):'',
			searchTx:plus.getUrlParam('searchTx')?plus.base64decode(plus.getUrlParam('searchTx')):'',

			page:1,
			limit:10,
			list:null,
			total:0,
			bannerList:[],

			storyInfo:'',
			isShow:false

		},
		mounted: function () {
			var _this=this;
			_this.getStoreInfo();


		},
		methods:{
			//商家推荐列表
			getList:function(  )
			{
				var _this=this;
				$._ajax({
					url:  'common/company_flag_goods',
					type:'get',
					data:{
						limit:_this.limit,
						page:_this.page,
						company:_this.company,
						name:_this.searchTx
					}
				}).done(function(data){
					_this.list=data.result;
					_this.total=data.count;
					_this.bannerList=data.banner;

					Vue.nextTick(function(  )
					{
						if(_this.bannerList.length>0){
							var mySwiper1 = new Swiper('.swiper1', {
								pagination: '.swiper-pagination1',
								autoplay:5000,
								autoplayDisableOnInteraction: false,
								paginationClickable: true,
								loop:true
							})
						}


					})

				}).always(function () {
				});
			},


			// 切翻页
			handleCurrentChange:function(page){
				var _this=this;
				_this.page=page;
				_this.getList();
			},


			goInfo:function( item )
			{
				if(item.type ==1){
					var href=item.link;
					window.open(href);
				}else if(item.type ==2){
					var href='store_pro.html?company='+this.company+'&id='+item.link;
					window.open(href);
				}else{
					var href='about.html?type=2&id='+item.id
					window.open(href);
				}
			},


			//店铺信息
			getStoreInfo:function(  )
			{
				var _this=this;
				_this.$loading();
				$._ajax({
					url:  'common/company_story',
					type:'get',
					data:{
						company:_this.company
					}
				}).done(function(data){
					_this.storyInfo=data;
					_this.isShow=true;
					_this.getList();

				}).always(function () {
					_this.$loading().close();
				});
			},

		}
	});
})()

