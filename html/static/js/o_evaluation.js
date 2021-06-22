;(function () {

	var app = new Vue({
		el: '#app',
		data: {
			id:plus.getUrlParam('id')?plus.getUrlParam('id'):'',
			list:[],
			dialogVisible: false,
			dialogImageUrl: '',
			uploadUrl:$.baseUrl+'upload/files',
			colors:['#d23326','#d23326','#d23326'],
			score:0,
			content:'',
			photoList:[],
        	checked:false,
        	
		},
		mounted: function () {
			var _this=this;
			$.checkUser();
			_this.getInfo();
		},
		methods:{
			//订单详情
			getInfo:function(  )
			{
				var _this=this;
				_this.$loading();
				$._ajax({
					url:  'order_integral/info',
					type:'get',
					data:{
						orderId:_this.id,
					}
				}).done(function(data){
					_this.list=data.orderGoods;
				}).always(function () {
					_this.$loading().close();
				});
			},

			beforeAvatarUpload:function( file )
			{
				var _this=this;
				const isLt2M = file.size / 1024 / 1024 < 2;
				if (!isLt2M) {
					$.oppo('上传头像图片大小不能超过 2MB!')
					return false;
				}
				if(!/image\/\w+/.test(file.type)){
					$.oppo('请上传图片!')
					return false;
				}
			},
			imgSuccess:function( response, file, fileList){
				this.photoList=fileList
			},
			//图片选择
			handleRemove:function(file, fileList) {
				this.photoList=fileList
			},
		    handlePictureCardPreview:function(file) {
		        this.dialogImageUrl = file.url;
		        console.log( this.dialogImageUrl)
		        this.dialogVisible = true;
		    },
			//评论
			evaluate:function(  )
			{
				var _this=this;
				if(!_this.content){
					$.oppo('请输入评价内容');
					return false;
				}
				if(!_this.score){
					$.oppo('请选择评分');
					return false;
				}

				var photo=[]

				if(_this.photoList){
					for(var key in _this.photoList){
						var item =_this.photoList[key];
						photo.push(item.response.data.fileId)
					}
				}
				var evaluates=[]
				evaluates.push(
					{ "orderDetailId":_this.list[0].id,
						"score":_this.score,
						"content":_this.content,
						"isAnonymity":_this.checked?'1':'0',
						"photo":_this.photoList.length>0?photo.join(','):''
					}
				)
				_this.$loading();
				$._ajax({
					url:  'order_integral/evaluate',
					type:'post',
					data:JSON.stringify({
						orderId:_this.id,
						evaluates:evaluates
					})
				}).done(function(data){
					$.oppo('评价成功',function(  )
					{
						var href='c_exchange.html';
						// window.open(href);
						window.location.href=href
					},1)
				}).always(function () {
					_this.$loading().close();
				});
			}
		}
	});
})()

