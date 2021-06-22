;(function () {
	var timer;
	var app = new Vue({
		el: '#app',
		data: {
			category:[],
			categoryAll:[],
			pageNo:1,
			limit:10,
			list:null,
			total:0,
			type:plus.getUrlParam('type')?plus.getUrlParam('type'):'-1',
			backShow:false,
			time:4,
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
					url:  'coupon/coupon_category',
					type:'get',
				}).done(function(data){
					// var list=[]
					// if(data.list){
					// 	for(var key in data.list){
					// 		if(key<=8){
					// 			list.push(data.list[key])
					// 		}
					// 	}
					// }
					_this.category=data.list;
					_this.categoryAll=data.list;
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
					url:  'coupon/list',
					type:'get',
					data:{
						limit:_this.limit,
						pageNo:_this.pageNo,
						productType:e==-1?'':e,
					}
				}).done(function(data){
					_this.list=data.list;
					_this.total=data.count;
					_this.type=e;
				}).always(function () {
					_this.$loading().close();
				});
			},
			// 切翻页
			handleCurrentChange:function(page){
				var _this=this;
				_this.pageNo=page;
				_this.getList(_this.type);
			},

			//领取优惠券
			receiveCoupon:function( id )
			{
				var _this=this;
				$.checkUser();
				_this.$loading();
				$._ajax({
					url:  'coupon/receive_coupon',
					type:'post',
					data:JSON.stringify({
						couponId:id
					})
				}).done(function(data){
					_this.backShow=true;

					timer=setInterval(function(  )
					{
						if(_this.time>1){
							_this.time=_this.time-1;
						}else{
							_this.backShow=false;
							clearInterval(timer)
						}
					},1000);

				}).always(function () {
					_this.$loading().close();
				});
			},
		}
	});
})()

