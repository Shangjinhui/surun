;(function () {

	var app = new Vue({
		el: '#app',
		data: {
	        num:1,
			id:plus.getUrlParam('id')?plus.getUrlParam('id'):'',
			list:[],
			company:'',
			checked:'',
			totalAvg:0,
			colors:['#d23326','#d23326','#d23326'],
			companyEvaluate:{desStar:null,shipStar:null,serverStar:null},//描述评分  物流评分  服务评分
			state:0,
	        describe: null,
	        logistic: null,
	        attitude: null,
	        desc:'',
        	value: 3.7,
        	same_value:null,
        	textarea: '',
        	
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
					url:  'order/evaluate_index',
					type:'get',
					data:{
						orderId:_this.id,
					}
				}).done(function(data){
					var list=data.orderDetail
					for(var key in list){
						var item=list[key];
						item.score=null;
						item.content='';
						item.photoList=[];
					}
					_this.list=list;
					_this.company=data.company;
					_this.totalAvg=parseFloat(data.company.totalAvg);

					Vue.nextTick(function(  )
					{
						$('.publish-ipt input').on('change', function() {
							var imgData = new FormData();
							var file = $(this)[0].files[0];

							var idx=$(this).data('idx')

							const isLt2M = file.size / 1024 / 1024 < 2;
							if (!isLt2M) {
								$.oppo("上传头像图片大小不能超过 2MB!");
								return false;
							}
							if(!/image\/\w+/.test(file.type)){
								$.oppo("请上传图片!");
								return false;
							}
							var reader = new FileReader();
							reader.readAsDataURL(file);
							reader.onload = function(e){
								//数据流
								imgData.append('file', file);
								$.ajax({
									contentType: false, //不可缺
									processData: false,
									cache: false,
									type: "post",
									url:  $.baseUrl+'upload/files',
									data: imgData,
									headers:{
										Platform: 2
									},
								}).done(function(res) {
									console.log(res)
									if (res.returnCode == "0000"){
										_this.list[idx].photoList.push(res.data)
									}else{
										$.oppo(res.msg);
									}
								});
							}
						});
					})
				}).always(function () {
					_this.$loading().close();
				});
			},

			delImg:function( index,idx )
			{
				var _this=this;
				var list=_this.list;
				for(var key in list){
					if(index ==key){
						var photoList=[]
						for(var it in list[key].photoList){
							var itItem=list[key].photoList[it];
							if(idx !=it){
								photoList.push(itItem)
							}
						}
						list[key].photoList=photoList
					}
				}
				_this.list=list;
			},

			//评论
			evaluate:function(  )
			{
				var _this=this;
				var goodsEvaluate=[]
				var companyEvaluate='';
				for(var key in _this.list){
					var item=_this.list[key];
					if(item.score&&item.content){
						var photo=[];
						if(item.photoList.length>0){
							for(var it in item.photoList){
								photo.push(item.photoList[it].fileId)
							}
							photo=photo.join(',')
						}else{
							photo=''
						}
						goodsEvaluate.push({score:item.score,orderDetailId:item.orderDetailId,isAnonymity:_this.checked?'1':'0',content:item.content,photo:photo})
					}
				}
				var eva=_this.companyEvaluate;
				if(eva.desStar&&eva.shipStar&&eva.serverStar){
					companyEvaluate=_this.companyEvaluate;
				}
				if(goodsEvaluate.length<1){
					if(eva.desStar&&eva.shipStar&&eva.serverStar){

					}else{
						$.oppo('至少评论一个商品或评论店铺');
						return false;
					}
				}
				_this.$loading();
				console.log(JSON.stringify({
					orderId:_this.id,
					companyEvaluate:companyEvaluate,
					goodsEvaluate:goodsEvaluate
				}))
				$._ajax({
					url:  'order/evaluate_order',
					type:'post',
					data:JSON.stringify({
						orderId:_this.id,
						companyEvaluate:companyEvaluate,
						goodsEvaluate:goodsEvaluate
					})
				}).done(function(data){
					$.oppo('评价成功',function(  )
					{
						var href='c_order.html';
						window.open(href);
					},1)
				}).always(function () {
					_this.$loading().close();
				});
			}
		}
	});
})()

