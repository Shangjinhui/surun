;(function () {
	var app = new Vue({
		el: '#app',
		data: {
			category:[],
			categoryAll:[],
			list:null,
			id:plus.getUrlParam('id')?plus.getUrlParam('id'):'',
			info:'',
			isShow:false,
			type:plus.getUrlParam('type')?plus.getUrlParam('type'):'-1',
		},
		mounted: function () {
			this.getType();
			this.getInfo()
		},
		methods:{

			// 分类
			getType:function(  )
			{
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
				}).always(function () {
					_this.$loading().close();
				});
			},


			getInfo:function(  )
			{
				var _this=this;
				_this.$loading();
				$._ajax({
					url:  'common/discovery_detail',
					type:'get',
					data:{
						id:_this.id,
					}
				}).done(function(data){
					_this.info=data;
					_this.isShow=true;

					Vue.nextTick(function(  )
					{
						var mySwiper1 = new Swiper('.swiper1', {
							pagination: '.swiper-pagination1',
							autoplay:4000,
							autoplayDisableOnInteraction: false,
							paginationClickable: true,
							loop:true
						})
					})
				}).always(function () {
					_this.$loading().close();
				});
			},



		}
	});
})()

