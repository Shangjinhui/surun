;(function () {

	var app = new Vue({
		el: '#app',
		data: {
			banner:[], //轮播图
			coupon:[], //优惠券列表
			company:[], //品牌列表
			ping:[], //拼团列表
			news:[], //新品首发
			good:[], //人气好货
			ranking:[], //排行榜标题
			ranking_list:[], //排行榜列表
			like:[], //猜你喜欢
			discovery:[], //发现
			page:1,
			status:true, //换一批切换状态
			status_btn:true, //换一批按钮状态
			count:'',
		},
		mounted:function(){
			var _this=this;
			_this.GetAjax();
			_this.Replace();
		},
		methods:{
			GetAjax:function(){
				var _this=this;
				_this.$loading();
				$._ajax({
					url:'common/index',
					type:'get',
				}).done(function(data){
					_this.banner=data.banner;
					_this.coupon=data.coupon;
					_this.discovery=data.discovery;
					_this.good=data.good;
					_this.like=data.like;
					_this.news=data.new;
					_this.ping=data.ping;
					let ar={
						id:'0',
						name:'精选'
					}
					let ranking=data.ranking.category;
					ranking.splice(0,0,ar);
					_this.ranking=ranking;
					let list=data.ranking.list;
					if(list.length>3){
						let num=Math.ceil(list.length/3);
						let k=0;
						for(let i=0;i<num;i++){
							let arr=[];
							for(let j=0;j<3;j++){
								k++;
								if(list[k]){
									arr.push(list[k]);
								}else{
									break;
								}
							}
							_this.ranking_list.push(arr)
						}
					}else{
						_this.ranking_list=list;
					}
					Vue.nextTick(function(){
						if(_this.banner.length>1){
							var mySwiper1 = new Swiper('.swiper1', {
								pagination: '.swiper-pagination1',
								autoplay:4000,
								autoplayDisableOnInteraction: false,
								paginationClickable: true,
								loop:true
							})
						}else{
							var mySwiper1 = new Swiper('.swiper1', {
								autoplayDisableOnInteraction: false,
								paginationClickable: false,
							})
						}
						if(_this.discovery.length>1){
							var mySwiper2 = new Swiper('.swiper2', {
								pagination: '.swiper-pagination2',
								autoplay:5000,
								autoplayDisableOnInteraction: false,
								paginationClickable: true,
								loop:true
							})
						}else{
							var mySwiper2 = new Swiper('.swiper2', {
								autoplayDisableOnInteraction: false,
								paginationClickable: false,
							})
						}
						console.log(_this.ranking_list.length)
						if(_this.ranking_list.length>1){
							var mySwiper3 = new Swiper('.swiper3', {
								pagination: '.swiper-pagination3',
								autoplay:4000,
								autoplayDisableOnInteraction: false,
								paginationClickable: true,
								loop:true
							})
						}else{
							var mySwiper3 = new Swiper('.swiper3', {
								autoplayDisableOnInteraction: false,
								paginationClickable: false,
							})
						}
					})

				}).always(function () {
					_this.$loading().close();
				});
			},
			//换一批
			Replace:function(){
				var _this=this;
				if(!_this.status){
					return;
				}
				_this.status=false;
				_this.$loading();
				$._ajax({
					url:'common/other_logo',
					type:'get',
					data:{
						page:_this.page,
					},
				}).done(function(data){
					_this.company=data.data;
					var count=Math.ceil(data.count/29);
					if(count==1){ //只有一页不能换一批
						_this.status_btn=false;
					}
					if(_this.page+1>count){
						_this.page=1;
					}else{
						_this.page++;
					}
					_this.status=true;
				}).always(function(){
					_this.$loading().close();
				});
			},
			//领取优惠券
			ReceiveCoupon:function(id){
				var _this=this;
				_this.$loading();
				$._ajax({
					url:'coupon/receive_coupon',
					type:'post',
					data:JSON.stringify({
						couponId:id,
					}),
				}).done(function(data){
			        _this.$message({
			          message: '领取成功',
			          type: 'success'
			        });
				}).always(function(){
					_this.$loading().close();
				});
			},
		}
	});
})()

