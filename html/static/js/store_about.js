;(function () {

	var app = new Vue({
		el: '#app',
		data: {
			company:plus.getUrlParam('company')?plus.getUrlParam('company'):'',
			info:'',
			isShow:false
		},
		mounted: function () {
			this.getInfo()
		},
		methods:{
			// 品牌故事
			getInfo:function(  )
			{
				var _this=this;
				_this.$loading();
				$._ajax({
					url:  'common/company_story',
					type:'get',
					data:{
						company:_this.company,
					}
				}).done(function(data){
					_this.info=data;
					_this.isShow=true

				}).always(function () {
					_this.$loading().close();
				});
			},






		}
	});
})()

