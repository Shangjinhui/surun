;(function () {

	var app = new Vue({
		el: '#app',
		data: {
			nav:5,
			point:'',
			pageNo:1,
			limit:10,
			list:null,
			total:0,
			type:'0' ///0全部1收入2支出
		},
		mounted: function () {
			var _this=this;
			$.checkUser();
			_this.getList();
		},
		methods:{
			getList:function(  )
			{
				var _this=this;
				_this.$loading();
				$._ajax({
					url:  'order_integral/user_point',
					type:'post',
					data:JSON.stringify({
						pageNo:_this.pageNo,
						limit:_this.limit,
						type:_this.type
					})
				}).done(function(data){
					_this.list=data.list;
					_this.total=data.count;
					_this.point=data.point;

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

