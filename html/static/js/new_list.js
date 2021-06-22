;(function () {
	var app = new Vue({
		el: '#app',
		data: {
			category:[],
			categoryAll:[],
			pageNo:1,
			limit:30,
			list:null,
			total:0,
			type:plus.getUrlParam('type')?plus.getUrlParam('type'):'-1',
			isShow:false
		},
		mounted: function () {
			this.getType()
		},
		methods:{
			// 分类
			getType:function(){
				var _this=this;
				_this.$loading();
				$._ajax({
					url:  'common/other_category',
					type:'get',
					data:{
						type:'1'
					}
				}).done(function(data){
					var list=[]
					if(data){
						for(var key in data){
							if(key<=8){
								list.push(data[key])
							}
						}
					}
					_this.category=list;
					_this.categoryAll=data;
					_this.getList(_this.type);
				}).always(function () {
					_this.$loading().close();
				});
			},
			//产品展示
			getList:function(e){
				var _this=this;
				_this.$loading();
				$._ajax({
					url:  'common/new_hot_goods',
					type:'get',
					data:{
						limit:_this.limit,
						page:_this.pageNo,
						type:'1',//1-新品 2-排行 3-拼团
						name:'',
						cate:e==-1?'':e,
					}
				}).done(function(data){
					_this.list=data.result;
					_this.total=data.count;
					_this.isShow=true;
					_this.type=e;
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


		}
	});
})()

