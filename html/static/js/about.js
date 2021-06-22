;(function () {

	var app = new Vue({
		el: '#app',
		data: {
			info:'',
			type:plus.getUrlParam('type')?plus.getUrlParam('type'):1, //1关于我们 2单页
			id:plus.getUrlParam('id')?plus.getUrlParam('id'):''
		},
		mounted: function () {
			var _this=this;
			if(_this.type ==2){
				_this.getInfo();
			}else{
				_this.getAbout();

			}

		},
		methods:{

			getInfo:function(  )
			{
				var _this=this;
				_this.$loading();
				$._ajax({
					url:  'common/get_page',
					type:'get',
					data:{
						id:_this.id
					}
				}).done(function(data){
					_this.info=data.link;
				}).always(function () {
					_this.$loading().close();
				});
			},
			getAbout:function(  )
			{
				var _this=this;
				_this.$loading();
				$._ajax({
					url:  'common/about_us',
					type:'get',
				}).done(function(data){
					_this.info=data.content;
				}).always(function () {
					_this.$loading().close();
				});
			},
		},

	});
})()

