;(function () {
	const cityOptions = ['上海', '北京', '广州', '深圳'];
	var app = new Vue({
		el: '#app',
		data: {
			nav:9,
			id:plus.getUrlParam('id')?plus.getUrlParam('id'):'',
			info:'',
		},
		mounted: function () {
			var _this=this;
			$.checkUser();
			_this.getInfo();
		},
		methods:{
			getInfo:function(){
				var _this=this;
				_this.$loading();
				$._ajax({
					url:'information/announcement_detail',
					type:'get',
					data:{
						announcementId:_this.id,
					}
				}).done(function(data){
					_this.info=data.info;
				}).always(function () {
					_this.$loading().close();
				});
			}
		}
	});
})()

