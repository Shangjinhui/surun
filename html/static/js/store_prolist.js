;(function () {

	var app = new Vue({
		el: '#app',
		data: {
			category:plus.getUrlParam('category')?JSON.parse(plus.base64decode(plus.getUrlParam('category'))):'',
			company:plus.getUrlParam('company')?plus.getUrlParam('company'):'',
			searchTx:plus.getUrlParam('searchTx')?plus.base64decode(plus.getUrlParam('searchTx')):'',
			page:1,
			limit:10,
			list:null,
			total:0,
			sale:'', //销量排序 1-销量降序 2-销量升序 3-收藏降序 4-收藏升序 5-价格降序 6-价格升序 7-口碑降序
			isnew:'', //是否新品 1-是 0-否
			min:plus.getUrlParam('min')?plus.base64decode(plus.getUrlParam('min')):'',
			max:plus.getUrlParam('max')?plus.base64decode(plus.getUrlParam('max')):'',

			storyInfo:'',
			isShow:false
		},
		mounted: function () {
			this.getList();
			this.getStoreInfo();
		},
		methods:{
			getList:function(  )
			{
				var _this=this;
				_this.$loading();
				$._ajax({
					url:  'common/company_goods',
					type:'get',
					data:{
						limit:_this.limit,
						page:_this.page,
						company:_this.company,
						name:_this.searchTx,
						sale:_this.sale,
						new:_this.isnew,
						min:_this.min,
						max:_this.max,
						cate:_this.category?_this.category.id:'',
					}
				}).done(function(data){
					_this.list=data.result;
					_this.total=data.count;
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

			changeSort:function( e )
			{
				if(e ==4){
					this.sale=7;
				}else if(e ==1){
					this.sale=this.sale==1?2:1;
				}else if(e ==2){
					this.sale=this.sale==3?4:3;
				}else if(e ==3){
					this.sale=this.sale==5?6:5;
				}else{
					this.sale=0;
				}
				this.page=1;
				this.isnew=''
				this.getList();
			},

			iptblur:function( e )
			{
				if(e ==1){
					if(!$.checkNum(this.min)){
						this.min ='';
						return false;
					}
					if(this.max&&this.min>=this.max){
						this.min ='';
						return false;
					}
				}else{
					if(!$.checkNum(this.max)){
						this.max ='';
						return false;
					}
					if(this.min&&this.min>=this.max){
						this.max ='';
						return false;
					}
				}

				// this.page=1;
				// this.getList()
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
					_this.isShow=true
				}).always(function () {
					_this.$loading().close();
				});
			},


		},
		watch:{

			
		}
	});
})()

