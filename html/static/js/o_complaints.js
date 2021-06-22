;(function () {

	var app = new Vue({
		el: '#app',
		data: {
			id:plus.getUrlParam('id')?plus.getUrlParam('id'):'', //订单id
			state:1, //投诉进度1,2,3
			infoGood:'',
			company:'',
			typeList:[],
			complaintType:'',//投诉类型
			reasonList:[],
			complaintReason:'',//投诉原因
			complaintComment:'',//投诉说明
			phone:'',
			photoList:[],
			uploadUrl:$.baseUrl+'upload/files',
			dialogImageUrl: '',
        	dialogVisible: false,
			isShow:false,
			info:''

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
					url:  'order/order_goods',
					type:'get',
					data:{orderDetailId:_this.id}
				}).done(function(data){
					_this.company=data.company;
					_this.infoGood=data.orderDetail;
					if(data.orderDetail.isComplaint==1){
						_this.getComplaintInfo()
					}else{
						_this.state =1;
						_this.isShow=true
					}

					if(_this.state ==1){
						_this.getReason()
					}

				}).always(function () {
					_this.$loading().close();
				});
			},

			//	投诉商家详情
			getComplaintInfo:function(  )
			{
				var _this=this;

				_this.$loading();
				$._ajax({
					url:  'order/complaint_info',
					type:'get',
					data:{orderDetailId:_this.id}
				}).done(function(data){
					if(data.complaintInfo.status==0){
						_this.state=2;
					}else{
						_this.state=3;
					}
					_this.isShow=true;
					_this.info = data.complaintInfo;
				}).always(function () {
					_this.$loading().close();
				});
			},

			//投诉原因
			getReason:function(  )
			{
				var _this=this;
				_this.$loading();
				$._ajax({
					url:  'other/complaint_reason',
					type:'get',
				}).done(function(data){
					_this.typeList=data.reason;

				}).always(function () {
					_this.$loading().close();
				});
			},

			//投诉
			complaintOrder:function(  )
			{
				var _this = this;
				if( !_this.complaintType )
				{
					$.oppo( '请选择投诉类型' );
					return false;
				}
				if( !_this.complaintReason )
				{
					$.oppo( '请选择投诉原因' );
					return false;
				}
				if( !_this.phone )
				{
					$.oppo( '请输入联系电话' );
					return false;
				}
				if(!$.checkMob(_this.phone)){return false}
				var photo = []
				if( _this.photoList )
				{
					for( var key in _this.photoList )
					{
						var item = _this.photoList[ key ];
						photo.push( item.response.data.fileId )
					}
					photo=photo.join(',')
				}else{
					photo=''
				}
				_this.$loading();
				$._ajax( {
					url: 'order/complaint_order',
					type: 'post',
					data: JSON.stringify( {
						orderDetailId: _this.id,
						complaintType: _this.complaintType,
						complaintReason:_this.complaintReason,
						complaintComment:_this.complaintComment,
						phone:_this.phone,
						photo:photo
					} )
				} ).done( function( data )
				{
					$.oppo( '提交成功', function()
					{
						_this.state=2;
						_this.getComplaintInfo()
					}, 1 )
				} ).always( function()
				{
					_this.$loading().close();
				} );
			},


			beforeAvatarUpload:function( file )
			{
				var _this=this;
				const isLt2M = file.size / 1024 / 1024 < 2;
				if (!isLt2M) {
					this.$message.error('上传头像图片大小不能超过 2MB!');
					return false;
				}
				if(!/image\/\w+/.test(file.type)){
					this.$message.error('请上传图片!');
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
				this.dialogVisible = true;
			},
		},
		watch:{
			complaintType:function( val )
			{
				for(var key in this.typeList){
					var item=this.typeList[key];
					if(item.type == val ){
						this.reasonList=item.reason
					}
				}
			}
		}
	});
})()

