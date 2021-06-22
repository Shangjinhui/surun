;(function () {

	var app = new Vue({
		el: '#app',
		data: {
			options:[{
				value: '1',
				label: '宝贝'
			},{
				value: '2',
				label: '店铺'
			}],
			focusShow:false,
			type:plus.getUrlParam('type')?plus.getUrlParam('type'): '1',
			searchTypeList:[],
			searchList:null,
			searchTx:plus.getUrlParam('searchTx')?plus.base64decode(plus.getUrlParam('searchTx')):'',

			list:[],
			coupon_list:[],//领取优惠券列表
			coupon_state:false, //优惠券窗口显示状态
			coupon_status:true, //
			all_checked:false,//是否全选
			money:0, //总价
			quantity:0,
			del_alls:[],//批量删除
			count:0,

		},
		mounted: function () {
			var _this=this;
			$.checkUser();
			_this.getAjax();
			window.carNum=function carNum($this){
		        var value = $this.val();
		        var re = /^[0-9]*[1-9][0-9]*$/ ;
		        if(re.test(value)){
		        	$this.val(parseInt(value));
		        }else{
		        	$this.val(1);
		        }
		    }
		},
		methods:{
			goShopCart:function(){
				$.checkUser();
				var href='shopping_cart.html';
				window.open(href);
			},
			// 获取焦点
			iptfocus:function(){
				this.focusShow=true;
				this.getSearchList();
			},
			// 失焦
			iptblur:function(){
				this.focusShow=false;
				var input = document.getElementById("search");
				input.blur();
			},
			//搜索关键词
			getSearchList:function(){
				var _this=this;
				$._ajax({
					url:  'common/search_keyword',
					type:'get',
					data:{
						type:_this.type,
						name:_this.searchTx
					}
				}).done(function(data){
					_this.searchList=data
				}).always(function () {
				});
			},
			// 搜索
			search:function(){
				if(this.type ==1){
					var href='product_list.html?type=1&searchTx='+ plus.base64encode(this.searchTx);
					window.open(href);
				}else{
					var href='store_list.html?type=2&searchTx='+ plus.base64encode(this.searchTx);
					window.open(href);
				}
			},
			getAjax:function(){
				var _this=this;
				_this.$loading();
				$._ajax({
					url:'order/cart_list',
					type:'get',
					data:{}
				}).done(function(data){
					if(data){

						var list=data.list;
						for(let i=0;i<list.length;i++){
								list[i].checked=false;
							for(let j=0;j<list[i].goodsList.length;j++){
								list[i].goodsList[j].checked=false;
							}
						}
						_this.list=list;
						_this.count=data.count;
					}
				}).always(function(){
					_this.$loading().close();
				});
			},
			//获取优惠券列表
			Coupon_lists:function(id){
				var _this=this;
				_this.$loading();
				$._ajax({
					url:'order/company_coupon',
					type:'get',
					data:{
						companyId:id
					}
				}).done(function(data){
					if(data){
						_this.coupon_list=data.list;
						_this.coupon_state=true;
					}
				}).always(function () {
					_this.$loading().close();
				});
			},
			//单个删除商品状态
			Del_cart_state:function(id){
				var _this=this;
				_this.$confirm('删除该商品, 是否继续?', '提示', {
		          	confirmButtonText: '确定',
		          	cancelButtonText: '取消',
		          	type: 'warning'
		        }).then(() => {
		          	_this.Del_cart(id);
		        }).catch(() => {
		          	          
		        });
			},
			//单个删除商品
			Del_cart:function(id){
				var _this=this;
				_this.$loading();
				$._ajax({
					url:'order/del_cart',
					type:'post',
					data:JSON.stringify({
						cartId:id,
					}),
				}).done(function(data){
					$.oppo('删除成功!');
					_this.Del_sort(id);
				}).always(function(){
					_this.$loading().close();
				});
			},
			//批量删除商品状态
			Del_cart_all_state:function(){
				var _this=this;
				var list=_this.list,array=[];
				for(let i=0;i<list.length;i++){
					for(let j=0;j<list[i].goodsList.length;j++){
						if(list[i].goodsList[j].checked){
							array.push(list[i].goodsList[j].id);
						}       
					}
				}
				if(array.length){
					_this.$confirm('批量删除该商品, 是否继续?', '提示', {
			          	confirmButtonText: '确定',
			          	cancelButtonText: '取消',
			          	type: 'warning'
			        }).then(() => {
			          	_this.Del_cart_all(array);
			        }).catch(() => {
			          	          
			        });
		        }
			},
			//批量删除商品
			Del_cart_all:function(arr){
				var _this=this;
				var array=arr.join(",");
				$._ajax({
					url:'order/del_cart',
					type:'post',
					data:JSON.stringify({
						cartId:array,
					}),
				}).done(function(data){
					$.oppo('批量删除成功!');
					_this.Del_sort(array);
				}).always(function(){
				});
			},
			//删除商品后-列表从新排序，不刷新当前接口
			Del_sort:function(arr){
				var _this=this;
				var array=arr.split(',');
				for(let i=0;i<array.length;i++){
					var list=[];
					for(let j=0;j<_this.list.length;j++){
						var li=[];
						for(let s=0;s<_this.list[j].goodsList.length;s++){
							if(array[i]!=_this.list[j].goodsList[s].id){
								li.push(_this.list[j].goodsList[s]);
							}
						}
						if(li.length>0){
							_this.list[j].goodsList=li;
						}else{
							var del_list=[];
							for(let k=0;k<_this.list.length;k++){
								if(k!=j){
									del_list.push(_this.list[k]);
								}
							}
							_this.list=del_list;
						}
					}
				}
				_this.Single_list_checked_state();
				_this.All_price();
			},
			//加入收藏夹
			Add_collect:function(index,ind,id){
				var _this=this;
				_this.$loading();
				$._ajax({
					url:'collect/add_collect',
					type:'POST',
					data:JSON.stringify({
						id:id,
						type:1,
					}),
				}).done(function(data){
					$.oppo('收藏成功');
					// _this.list[index].goodsList[ind].isCollect='1';
					// index,ind
					_this.getAjax();
				}).always(function (){
				});
			},
			//移出收藏夹
			UnICollect:function(index,ind,id){
				var _this=this;
				_this.$loading();
				$._ajax({
					url:'collect/cancelinfo_collect',
					type:'POST',
					data:JSON.stringify({
						id:id,
						type:1,
					}),
				}).done(function(data){
					$.oppo('已取消收藏');
					// _this.list[index].goodsList[ind].isCollect='0';
					_this.getAjax();
				}).always(function () {
				});
			},
			//优惠券窗口状态
			Coupon_states:function(){
				var _this=this;
				_this.coupon_state=!_this.coupon_state;
			},
			//领取优惠券
			Receive_coupon:function(index,id){
				var _this=this;
				if(!_this.coupon_status){
					return;
				}
				_this.coupon_status=false;
				_this.$loading();
				$._ajax({
					url:'coupon/receive_coupon',
					type:'POST',
					data:JSON.stringify({
						couponId:id,
					}),
				}).done(function(data){
					_this.coupon_list[index].status=1;
					$.oppo('领取成功！');
				}).always(function(){
					_this.$loading().close();
					_this.coupon_status=true;
				});
			},
			//单个列表勾选
			Commodity_checked:function(index,ind){
				var _this=this;
				var list=_this.list;
				_this.del_alls=[];
				_this.list[index].goodsList[ind].checked=!list[index].goodsList[ind].checked;
				for(let i=0;i<_this.list.length;i++){
					var num=0;
					for(let j=0;j<_this.list[i].goodsList.length;j++){
						if(_this.list[i].goodsList[j].checked){
							num++;
							_this.del_alls.push(_this.list[i].goodsList[j].id)
						}
					}
					if(num==_this.list[i].goodsList.length){
						_this.list[i].checked=true;
					}else{
						_this.list[i].checked=false;
					}
				}
				_this.Single_list_checked_state();
			},
			//单个列表勾选
			Single_list_checked:function(e){
				var _this=this;
				var list=_this.list;
				_this.del_alls=[];
				if(list[e].checked){
					for(let i=0;i<list[e].goodsList.length;i++){
						_this.list[e].goodsList[i].checked=false;
					}
					list[e].checked=false;
				}else{
					for(let i=0;i<list[e].goodsList.length;i++){
						_this.list[e].goodsList[i].checked=true;
					}
					list[e].checked=true;
				}

				for(let k=0;k<list.length;k++){ //全选删除
					for(let s=0;s<list[k].goodsList.length;s++){
						if(list[k].checked){
							_this.del_alls.push(_this.list[k].goodsList[s].id)
						}
					}
				}
				_this.Single_list_checked_state();
			},
			//是否可以全选
			Single_list_checked_state:function(){
				var _this=this;
				var list=_this.list,num=0;
				if(!list.length){
					_this.all_checked=false;
					_this.del_alls=[];
					_this.All_price();
					return;
				}
				for(let i=0;i<list.length;i++){
					if(list[i].checked){
						num++;
					}
				}
				if(num==list.length){
					_this.all_checked=true
				}else{
					_this.all_checked=false
				}
				_this.All_price();
			},
			//全选
			all_checkeds:function(){
				var _this=this;
				var list=_this.list;
				_this.del_alls=[];
				if(_this.all_checked){
					for(let i=0;i<list.length;i++){
						_this.list[i].checked=false;
						for(let j=0;j<list[i].goodsList.length;j++){
							_this.list[i].goodsList[j].checked=false;
						}
					}
					_this.del_alls=[];
				}else{
					for(let i=0;i<list.length;i++){
						_this.list[i].checked=true;
						for(let j=0;j<list[i].goodsList.length;j++){
							_this.list[i].goodsList[j].checked=true;
							_this.del_alls.push(_this.list[i].goodsList[j].id)
						}
					}
				}
				_this.all_checked=!_this.all_checked;
				_this.All_price();
			},
			//单个价格--
			Single_price:function(index,ind){
				var _this=this,list=_this.list;
				var price=Number(_this.list[index].goodsList[ind].price)*100;
				var quantity=Number(_this.list[index].goodsList[ind].quantity);
				if(quantity>0){
					_this.list[index].goodsList[ind].totalPrice=(price*quantity)/100
				}else{
					_this.list[index].goodsList[ind].quantity=1;
					_this.list[index].goodsList[ind].totalPrice=(price*1)/100;
				}
				if(_this.list[index].goodsList[ind].checked){
					_this.All_price();
				}
			},
			//总价格
			All_price:function(){
				var _this=this;
				var list=_this.list,qu=0;
				_this.money=0;
				for(let i=0;i<list.length;i++){
					var number=0;
					for(let j=0;j<list[i].goodsList.length;j++){
						if(list[i].goodsList[j].checked){
							var price=Number(list[i].goodsList[j].price)*100;
							var quantity=Number(list[i].goodsList[j].quantity);
							qu=qu+quantity;
							number=number+(price * quantity);
						}       
					}
					_this.money=_this.money+number;
				}
				_this.quantity=qu;
				_this.money=_this.money/100
			},
			//减数量
			Reduce:function(index,ind,number){
				var _this=this;
				var num=Number(number);
				if(num>1){
					_this.list[index].goodsList[ind].quantity=num-1;
					_this.Single_price(index,ind);
				}
			},
			//加数量
			Increase:function(index,ind,number){
				var _this=this;
				var num=Number(number);
				_this.list[index].goodsList[ind].quantity=num+1;
				_this.Single_price(index,ind);
			},
			Submit:function(){
				var _this=this;
				var list=_this.list,array=[];
				for(let i=0;i<list.length;i++){
					for(let j=0;j<list[i].goodsList.length;j++){
						if(list[i].goodsList[j].checked){
							array.push(list[i].goodsList[j].id)
						}       
					}
				}

				if(array&&array.length>0){
					array=array.join(',');
				}else{
					$.oppo('请选择商品！')
					return false;
				}
				var date=JSON.stringify({
					isGroup:'0',
					isFromCart:'1',
					cartIds:array,
					singleGoods:[],
				})
				var data=$.base64encode(date);
				var href="store_confirm.html?type=1&data="+data;
				window.open(href);
			},
			goInfo:function(item){
				if(item.status==1){
					var href='store_pro.html?company='+item.companyId+'&id='+item.goodsId;
					window.open(href);
				}
			},
			collection_all:function(){
				var _this=this;
				var list=_this.list,array=[];
				for(let i=0;i<list.length;i++){
					for(let j=0;j<list[i].goodsList.length;j++){
						if(list[i].goodsList[j].checked){ //去重
							if(array.length>0){
								for(var id in array){
						            if(array[id]!=list[i].goodsList[j].goodsId){
						              if(array.length-1==id){
						                array.push(list[i].goodsList[j].goodsId);
						              }
						            }else{
						              break;
						            }
						        }
							}else{
								array.push(list[i].goodsList[j].goodsId);
							}
						}
					}
				}
				
				if(array.length>0){
					array=array.join(',');
				}else{
					array='';
					$.oppo('请选择商品！');
					return;
				}
				$._ajax({
					url:'collect/add_collect',
					type:'post',
					data:JSON.stringify({
						id:array,
						type:1,
					})
				}).done(function(data){
					if(data){
						$.oppo('收藏成功');
						_this.money=0;
						_this.quantity=0;
						_this.all_checked=false;
						_this.getAjax();
					}
				}).always(function(){
				});
			}
		},
		watch:{
			searchTx:function(val){
				this.getSearchList();
			},
			type:function(val){
				this.getSearchList();
			},
		}
	});
})()

