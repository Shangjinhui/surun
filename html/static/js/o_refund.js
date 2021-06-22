;(function () {

	var app = new Vue({
		el: '#app',
		data: {
			id:plus.getUrlParam('id')?plus.getUrlParam('id'):'', //订单id
			ctype:plus.getUrlParam('ctype')?plus.getUrlParam('ctype'):'', //1普通商品 2积分商品
	        type: plus.getUrlParam('type')?plus.getUrlParam('type'):1,//1 退款  2退货退款
			isEdit: plus.getUrlParam('isEdit')?plus.getUrlParam('isEdit'):'',//普通商品修改退款

			info:'',
			infoGood:'',
			reasonList:[],
			refundPhone:'',//平台电话
			refundAddress:'',//退货地址
			reason:'',//售后原因
			reason_info:'',//售后说明
			shipType:'0',//货物状态
			dialogVisible: false,
			dialogImageUrl: '',
			uploadUrl:$.baseUrl+'upload/files',
			photoList:[],
			amount:'',//金额
			company:'',
			refundId:''

		},
		mounted: function () {
			var _this=this;
			$.checkUser();
			_this.getInfo();
			_this.getReason();
			_this.getPhone();

			if(_this.isEdit==1){
				_this.getResInfo();
			}
		},
		methods:{

			//订单详情
			getInfo:function(  )
			{
				var _this=this;
				var url,data;
				if(_this.ctype==1){
					url = 'order/order_goods';
					data ={orderDetailId:_this.id} ;
				}else{
					url = 'order_integral/info';
					data ={orderId:_this.id};

				}
				_this.$loading();
				$._ajax({
					url:  url,
					type:'get',
					data:data
				}).done(function(data){
					if(_this.ctype==1){
						_this.company=data.company;
						_this.infoGood=data.orderDetail;
						_this.amount=data.orderDetail.payFee;
					}else{
						if(data.orderGoods&&data.orderGoods.length>0){
							_this.infoGood=data.orderGoods[0];
						}
						_this.amount=data.goodsAmount;
						_this.info = data

					}

				}).always(function () {
					_this.$loading().close();
				});
			},

			//售后订单详情
			getResInfo:function(  )
			{
				var _this=this;
				_this.$loading();
				$._ajax({
					url:  'order/refund_info',
					type:'get',
					data:{
						orderDetailId:_this.id
					}
				}).done(function(data){
					_this.reason=data.detail.reason;
					_this.reason_info=data.detail.reasonComment;
					_this.shipType=data.detail.shipType;
					_this.type=data.detail.type;
					_this.refundId=data.detail.id;

					if (data.detail.refundPhoto && data.detail.refundPhoto.length) {
						data.detail.refundPhoto.forEach(function(v,index){
							_this.photoList.push({
								url: v.url,
								id:v.id
							})
						})
					}

				}).always(function () {
					_this.$loading().close();
				});
			},


			//退款原因
			getReason:function(  )
			{
				var _this=this;
				_this.$loading();
				$._ajax({
					url:  'other/refund_reason',
					type:'get',
				}).done(function(data){
					_this.reasonList=data;
				}).always(function () {
					_this.$loading().close();
				});
			},

			//积分商城退货电话/地址展示
			getPhone:function(  )
			{
				var _this=this;
				_this.$loading();
				$._ajax({
					url:  'other/refund_shop',
					type:'get',
				}).done(function(data){
					_this.refundPhone=data.tel;
					_this.refundAddress=data.addr;
				}).always(function () {
					_this.$loading().close();
				});
			},

			refundOrder:function(  )
			{
				if(this.ctype==1){
					this.refundProOrder();
				}else{
					this.refundIntOrder();
				}
			},

			//积分商品退货退款
			refundIntOrder:function(  )
			{
				var _this=this;
				var photo=[]

				if(_this.photoList){
					for(var key in _this.photoList){
						var item =_this.photoList[key];
						photo.push(item.response.data.fileId)
					}
				}
				if(!_this.reason){
					$.oppo('请选择退款原因');
					return false
				}

				// return false
				_this.$loading();
				$._ajax({
					url:  'order_integral/refund_order',
					type:'post',
					data:JSON.stringify({
						orderId:_this.id,
						type:_this.type,
						shipType:_this.type==1?_this.shipType:'',
						reason:_this.reason,
						reason_info:_this.reason_info,
						photo:_this.photoList.length>0?photo.join(','):'',
					})
				}).done(function(data){
					var href='o_processing_refund.html?ctype='+_this.ctype+'&id='+_this.id+'&type='+_this.type;
					// window.open(href);
					window.location.href=href
				}).always(function () {
					_this.$loading().close();
				});
			},

			//商品退货退款
			refundProOrder:function(  )
			{
				var _this=this;
				var photo=[]
				if(_this.photoList&&_this.photoList.length>0){
					_this.photoList.forEach(function(v){
						if (v.response) {
							var data = v.response.data;
							photo.push(data.fileId)
						}else{
							photo.push(v.id)
						}
					})
				}

				if(!_this.reason){
					$.oppo('请选择退款原因');
					return false
				}

				var url,data;
				if(_this.isEdit==1){//修改
					url='order/edit_refund';
					data=JSON.stringify({
						refundId:_this.refundId,
						type:_this.type,
						shipType:_this.type==1?_this.shipType:'1',
						amount:_this.amount,
						reason:_this.reason,
						reasonComment:_this.reason_info,
						refundPhoto:_this.photoList.length>0?photo.join(','):'',
					})
				}else{
					url='order/refund_order';
					data=JSON.stringify({
						orderId:_this.infoGood.orderId,
						orderDetailId:_this.id,
						type:_this.type,
						shipType:_this.type==1?_this.shipType:'1',
						amount:_this.amount,
						reason:_this.reason,
						reasonComment:_this.reason_info,
						refundPhoto:_this.photoList.length>0?photo.join(','):'',
					})
				}
				_this.$loading();
				$._ajax({
					url:  url,
					type:'post',
					data:data
				}).done(function(data){
					var href='o_processing_refund.html?ctype='+_this.ctype+'&id='+_this.id+'&type='+_this.type;
					// window.open(href);
					window.location.href=href
				}).always(function () {
					_this.$loading().close();
				});
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
				console.log( this.dialogImageUrl)
				this.dialogVisible = true;
			},
		}
	});
})()

