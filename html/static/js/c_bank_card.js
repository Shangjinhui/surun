;(function () {

	var app = new Vue({
		el: '#app',
		data: {
			nav:4,
			num:1,
			name: '',
			options: [{
	          value: '选项1',
	          label: '黄金糕'
	        }, {
	          value: '选项2',
	          label: '双皮奶'
	        }, {
	          value: '选项3',
	          label: '蚵仔煎'
	        }, {
	          value: '选项4',
	          label: '龙须面'
	        }, {
	          value: '选项5',
	          label: '北京烤鸭'
	        }],
	        value: '',
	        list:[]
		},
		mounted: function () {
			// this.getajax();
		},
		methods:{
			addCark:function(){
				this.num=2;
			},
			deleteCark:function(e){
				this.$confirm('确定删除当前银行卡, 是否继续?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(() => {
		          this.$message({
		            type: 'success',
		            message: '删除成功!'
		          });
		        }).catch(() => {
		          this.$message({
		            type: 'info',
		            message: '已取消删除'
		          });          
		        });
			},
			getajax:function(){
				var _this=this;
				$._ajax({
					url:  'company/company_card_list',
					type:'get',
					data:{}
				}).done(function(data){
					_this.list=data.data;
				}).always(function () {
				});
			},
		}
	});
})()

