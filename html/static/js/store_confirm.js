;(function () {
	var qrcode,timer
	var app = new Vue({
		el: '#app',
		data: {
			ctype:plus.getUrlParam('type')?plus.getUrlParam('type'):1,//1商品  2积分商品
			proInfo:plus.getUrlParam('data')?JSON.parse(plus.base64decode(plus.getUrlParam('data'))):'',//商品下单参数
			groupId:plus.getUrlParam('groupId')?plus.getUrlParam('groupId'):'',//参团id
			goodsSingleId:'',
			goodsId:'',
			quantity:'',
			addressId:'',
			addressInfo:'',//选中地址信息

			addressList:[],
			state:0, //1新增  2修改地址
			province:'',
			city:'',
			area:'',
			contact:'',
			phone:'',
			info:'',
			standby:'',//备用手机
			type:'',//标签 1-家 2-公司 3-其它
			default:'0',//是否默认 1-是 0-否
			list:null,
			detail:'',//其它标签
			id:'',
			isSee:false,
			checked:'',

			provinceList:[],
			cityList:[],
			areaList:[],

			goodInfo:'',
			goodList:[],

			showCup:false,//显示优惠券


			cartIds: "",//购物车id
			isFromCart: "",//是否购物车下单，0否，1是
			isGroup: "",//是否拼团：0否，1是
			singleGoods:'',//	立即下单、拼团商品

			companyCouponList:[],//店铺优惠券列表
			companyCouponNum:0,//店铺优惠券选中数量
			companyCouponPrice:0,//店铺优惠券选中金额
			companyCheck:true,
			platformCouponList:[],//平台优惠券
			platformCouponNum:1,//平台优惠券选中数量
			platformCouponPrice:0,//平台优惠券选中金额
			platformCheck:true,
			platformCouponId:'',//我的平台优惠券id

			payType:1,//支付方式
			commentNum:[],
			paymentCode:'wechatPcPay',//dummyPay:虚拟支付，aliPcPay：支付宝PC支付  wechatPcPay：微信pc支付

			goodsAmount:0, //应付金额

			ewmShow:false
		},
		mounted: function () {
			var _this=this;
			$.checkUser();
			if(localStorage['goodsPro']){
				var info=JSON.parse(localStorage['goodsPro']);
				_this.goodsSingleId=info.goodsSingleId;
				_this.goodsId=info.goodsId;
				_this.quantity=info.quantity;
			}
			_this.getAddressList();
			$.getJSON("static/public/city.json", function (data){
				_this.provinceList=data;
			})
			if(_this.ctype==2){
				_this.getPointInfo();
			}else{
				if(_this.proInfo){

					var data=_this.proInfo;
					_this.cartIds=data.cartIds;
					_this.isFromCart=data.isFromCart;
					_this.isGroup=data.isGroup;
					_this.singleGoods=data.singleGoods;

				}
				_this.getProInfo();
				qrcode=new QRCode(document.getElementById("code"),{
					render: "table", //二维码的生成方式
					width: 200,
					height:200,
					correctLevel:3
				});

			}

			console.log(JSON.stringify(_this.proInfo))
		},
		methods:{
			//	积分商城下单展示页面
			getPointInfo:function(  )
			{
				var _this=this;
				_this.$loading();
				$._ajax({
					url:  'order_integral/buy',
					type:'post',
					data:JSON.stringify({
						goodsSingleId:_this.goodsSingleId,
						goodsId:_this.goodsId,
						quantity:_this.quantity,
					})
				}).done(function(data){
					_this.goodInfo=data;
				}).always(function () {
					_this.$loading().close();
				});
			},

			//	商品下单展示页面
			getProInfo:function(  )
			{
				var _this=this;
				_this.$loading();
				$._ajax({
					url:  'order/orderCalculation',
					type:'post',
					data:JSON.stringify({
						cartIds: _this.cartIds,
						isFromCart: _this.isFromCart,
						isGroup: _this.isGroup,
						singleGoods:_this.singleGoods,
					})
				}).done(function(data){
					_this.goodInfo=data;
					_this.companyCouponPrice=data.companyCoupon;
					_this.platformCouponPrice=data.platformCoupon;
					var goodList=data.list;
					var num=[]
					for(var key in goodList){
						num.push('')
					}
					_this.commentNum=num;
					_this.goodList = goodList;

					if(data.companyCouponList.length>0){
						var list=data.companyCouponList;
						for(var key in list){
							var item =list[key];
							for(var pro in item.list){
								var proitem =item.list[pro];
								if(proitem.isCheck==1){
									_this.companyCouponNum=_this.companyCouponNum+1;
									proitem.isChecked='1'
								}else{
									proitem.isChecked='0';
								}
							}
						}
						_this.companyCouponList=list;
						_this.showCup=true;
					}
					if(data.platformCouponList.length>0){
						var list=data.platformCouponList;
						for(var key in list){
							var item =list[key];
							if(item.isCheck==1){
								item.isChecked='1';
								_this.platformCouponId=item.id;
							}else{
								item.isChecked='0';
							}
						}
						_this.platformCouponList=list;
						_this.showCup=true;
					}

					_this.goodsAmount=data.totalAmount


				}).always(function () {
					_this.$loading().close();
				});
			},


			//获取地址列表
			getAddressList:function(  )
			{
				var _this=this;
				_this.$loading();
				$._ajax({
					url:  'member/my_address',
					type:'get',
				}).done(function(data){
					_this.addressList=data.data;
					if(data.data.length<1){
						_this.state=1;
					}
					if(!_this.addressId){
						for(var key in data.data){
							if(data.data[key].isDefault==1){
								_this.addressId=data.data[key].id;
								_this.addressInfo=data.data[key];
							}
						}
					}

				}).always(function () {
					_this.$loading().close();
				});
			},
			addInfo:function(  )
			{
				var _this=this;
				if(!_this.contact){
					$.oppo('请输入收件人姓名!');
					return false;
				}
				if(!_this.phone){
					$.oppo('请输入手机!');
					return false;
				}
				if(!$.checkMob(_this.phone)){return false;}

				if(!_this.area){
					$.oppo('请选择省市区!');
					return false;
				}
				if(!_this.info){
					$.oppo('请输入详细地址!');
					return false;
				}
				// if(!_this.type){
				// 	$.oppo('请选择标签!');
				// 	return false;
				// }
				if(_this.type==3&&!_this.detail){
					$.oppo('填写其他标签!');
					return false;
				}

				var url,data;
				if(!_this.id){ //新增
					url = 'member/add_address';
					data=JSON.stringify({
						province:_this.province,
						city:_this.city,
						area:_this.area,
						contact:_this.contact,
						phone:_this.phone,
						info:_this.info,
						standby:_this.standby,
						type:_this.type,
						default:_this.checked?'1':'0',
						detail:_this.detail
					})
				}else{
					url = 'member/edit_address';
					data=JSON.stringify({
						province:_this.province,
						city:_this.city,
						area:_this.area,
						contact:_this.contact,
						phone:_this.phone,
						info:_this.info,
						standby:_this.standby,
						type:_this.type,
						default:_this.checked?'1':'0',
						detail:_this.detail,
						id:_this.id

					})
				}
				_this.$loading();
				$._ajax({
					url:url,
					type:'post',
					data: data,
				}).done(function(res){
					$.oppo('操作成功',function(  )
					{
						_this.province='';
						_this.city='';
						_this.area='';
						_this.contact='';
						_this.phone='';
						_this.info='';
						_this.standby='';
						_this.type='';
						_this.checked='';
						_this.detail='';
						_this.id='';
						_this.state=0;
						_this.getAddressList();
					},1)
				}).always(function () {
					_this.$loading().close();
				});

			},
			showAdd:function( val)
			{

				this.type = val.type;
				this.id=val.id;
				this.contact=val.contact;
				this.phone=val.phone;
				this.province=val.provinceId;
				this.isSee=true;
				this.city=val.cityId;
				this.area=val.areaId;
				this.info=val.info;
				this.checked=val.isDefault==1?true:false;
				this.detail=val.detail;
				this.standby=val.standby;
				this.state=2;
			},

			chooseAdd:function( item )
			{
				this.addressId=item.id;
				this.state=0;
				this.addressInfo=item;
				if(this.ctype==1){
					this.getMoney();
				}
			},

			//积分兑换
			pointCreateOrder:function(  )
			{
				var _this=this;
				if(!_this.addressId){
					$.oppo('请选择地址');
					return false;
				}
				_this.$loading();
				$._ajax({
					url:  'order_integral/create_order',
					type:'post',
					data:JSON.stringify({
						addressId:_this.addressId,
						goods:[{
							goodsSingleId:_this.goodsSingleId,
							quantity:_this.quantity
						}]
					})
				}).done(function(data){
					localStorage.removeItem('goodsPro')
					$.oppo('兑换成功',function(  )
					{
						var href='c_exchange.html';
						window.open(href);
					})
				}).always(function () {
					_this.$loading().close();
				});
			},



			//优惠券选择
			changeCoupon:function( cur,index,idx )
			{
				var _this=this;

				if(cur ==1){//店铺优惠券选择
					var list=_this.companyCouponList;
					var newList=[];
					var companyCouponNum=0;
					var companyCouponPrice=0;
					for(var key in list){
						if(key ==index){
							for(var pro in list[key].list){
								var item=list[key].list[pro]
								if(idx==pro){
									item.isChecked=item.isChecked==1?0:1;
								}else{
									item.isChecked=0
								}
							}
						}
						newList.push(list[key])
					}
					for(var key in newList){
						for(var pro in newList[key].list){
							var item=newList[key].list[pro]
							if(item.isChecked==1){
								companyCouponPrice=companyCouponPrice+parseFloat(item.price);
								companyCouponNum=companyCouponNum+1;


							}
						}
					}
					_this.companyCouponPrice=companyCouponPrice;
					_this.companyCouponNum=companyCouponNum;
					_this.companyCouponList=newList;
					_this.companyCheck=false;






				}else{//平台优惠券
					var list=_this.platformCouponList;
					var newList=[];
					for(var key in list){
						var item=list[key];
						if(key ==index){
							if(item.isChecked==1){
								item.isChecked=0;
								_this.platformCouponPrice=0;
								_this.platformCouponNum=0;
								_this.platformCouponId='';
							}else{
								item.isChecked=1;
								_this.platformCouponPrice=item.price;
								_this.platformCouponNum=1;
								_this.platformCouponId=item.id;
							}
						}else{
							item.isChecked=0
						}
						newList.push(item)
					}
					_this.platformCouponList=newList;
					_this.platformCheck=false;

				}

				_this.getMoney();

			},

			// 最优组合选择
			chooseOptimal:function( cur )
			{
				var _this=this;
				if(cur ==1){//店铺优惠券选择
					var list=_this.companyCouponList;
					var newList=[];
					var companyCouponNum=0;
					var companyCouponPrice=0;
					for(var key in list){
						for(var pro in list[key].list){
							var item=list[key].list[pro]
							if(_this.companyCheck){
								item.isChecked=0;
							}else{
								item.isChecked=item.isCheck==1?1:0;
							}
						}
						newList.push(list[key])
					}
					for(var key in newList){
						for(var pro in newList[key].list){
							var item=newList[key].list[pro]
							if(item.isChecked==1){
								companyCouponPrice=companyCouponPrice+parseFloat(item.price);
								companyCouponNum=companyCouponNum+1
							}
						}
					}
					_this.companyCouponPrice=companyCouponPrice;
					_this.companyCouponNum=companyCouponNum;
					_this.companyCouponList=newList;
					_this.companyCheck=!_this.companyCheck;
				}else{
					//平台优惠券
					var list=_this.platformCouponList;
					var newList=[];
					for(var key in list){
						var item=list[key];
						if(_this.platformCheck){
							item.isChecked=0;
						}else{
							item.isChecked=item.isCheck==1?1:0;

						}
						_this.platformCouponPrice=item.isChecked==1?item.price:0;
						_this.platformCouponNum=item.isChecked==1?1:0;
						_this.platformCouponId=item.isChecked==1?item.id:'';
						console.log(_this.platformCouponId)
						newList.push(item)
					}
					_this.platformCouponList=newList;
					_this.platformCheck=!_this.platformCheck;
				}

				_this.getMoney();
			},

			//计算订单金额
			getMoney:function(  )
			{
				var _this=this;
				var companyOrder=[];
				var list=_this.goodList;
				for(var key in list){
					var info={};
					var item=list[key]
					info.companyId=item.companyId; //	店铺id
					info.companyCouponId='';       //   我的店铺优惠券id
					if(_this.companyCouponList.length>0){
						for(var coup in _this.companyCouponList){
							var coupItem=_this.companyCouponList[coup];
							if(coupItem.companyId==item.companyId){
								for(var couplist in coupItem.list){
									var couplistInfo=coupItem.list[couplist];
									if(couplistInfo.isChecked==1){
										info.companyCouponId=couplistInfo.id;
									}
								}
							}
						}
					}
					// console.log(info)

					info.comment=_this.commentNum[key];
					info.isGroup=_this.isGroup;
					info.groupId=_this.groupId;
					info.goodsList=[];
					for(var pro in item.goodsList){
						var proItem=item.goodsList[pro];
						var proInfo={};
						proInfo.cartId=proItem.cartId;	//	购物车id，立即下单传0
						proInfo.goodsId=proItem.goodsId;//	商品id
						proInfo.goodsSingleId=proItem.goodsSingleId;//	商品规格id
						proInfo.quantity=proItem.quantity;//	数量
						proInfo.goodsAttribute=[]
						for(var att in proItem.goodsAttribute){
							var attItem=proItem.goodsAttribute[att];
							proInfo.goodsAttribute.push({goodsAttributeId:attItem.id,goodsAttributeNumber:attItem.number})
						}
						info.goodsList.push(proInfo)
					}

					companyOrder.push(info)
				}
				// console.log(JSON.stringify({
				// 	addressId:_this.addressId,
				// 	platformCouponId:_this.platformCouponId,
				// 	companyOrder:companyOrder
				// }))

				_this.$loading();
				$._ajax({
					url:  'order/order_money',
					type:'post',
					data:JSON.stringify({
						addressId:_this.addressId,
						platformCouponId:_this.platformCouponId,
						companyOrder:companyOrder
					})
				}).done(function(data){
					_this.goodsAmount=data.payFee;
					_this.goodInfo.totalShipFee=data.totalShipFee;
					var list=_this.goodList;
					for(var key in data.order){
						for(var prokey in list){
							if(list[prokey].companyId==data.order[key].companyId){
								list[prokey].shipFee=data.order[key].shipFee
							}
						}
					}
					_this.goodList=list;
				}).always(function () {
					_this.$loading().close();
				});
			},


			//提交订单
			proCreateOrder:function(  )
			{
				var _this=this;
				if(!_this.addressId){
					$.oppo('请选择地址');
					return false;
				}
				var companyOrder=[];
				var list=_this.goodList;
				for(var key in list){
					var info={};
					var item=list[key]
					info.companyId=item.companyId; //	店铺id
					info.companyCouponId='';       //   我的店铺优惠券id
					if(_this.companyCouponList.length>0){
						for(var coup in _this.companyCouponList){
							var coupItem=_this.companyCouponList[coup];
							if(coupItem.companyId==item.companyId){
								for(var couplist in coupItem.list){
									var couplistInfo=coupItem.list[couplist];
									if(couplistInfo.isChecked==1){
										info.companyCouponId=couplistInfo.id;
									}
								}
							}
						}
					}
					info.comment=_this.commentNum[key];
					info.isGroup=_this.isGroup;
					info.groupId=_this.groupId;
					info.goodsList=[];
					for(var pro in item.goodsList){
						var proItem=item.goodsList[pro];
						var proInfo={};
						proInfo.cartId=proItem.cartId;	//	购物车id，立即下单传0
						proInfo.goodsId=proItem.goodsId;//	商品id
						proInfo.goodsSingleId=proItem.goodsSingleId;//	商品规格id
						proInfo.quantity=proItem.quantity;//	数量
						proInfo.goodsAttribute=[]
						for(var att in proItem.goodsAttribute){
							var attItem=proItem.goodsAttribute[att];
							proInfo.goodsAttribute.push({goodsAttributeId:attItem.id,goodsAttributeNumber:attItem.number})
						}
						info.goodsList.push(proInfo)
					}
					companyOrder.push(info)
				}
				console.log(JSON.stringify({
					addressId:_this.addressId,
					platformCouponId:_this.platformCouponId,
					companyOrder:companyOrder
				}))
				// return false;
				_this.$loading();
				$._ajax({
					url:  'order/create_order',
					type:'post',
					data:JSON.stringify({
						addressId:_this.addressId,
						platformCouponId:_this.platformCouponId,
						companyOrder:companyOrder
					})
				}).done(function(data){
					// $.oppo('提交成功',function(  )
					// {
					//
					// })
					_this.payMent(data.orderId)
				}).always(function () {
					// _this.$loading().close();
				});
			},

			//支付
			payMent:function( orderId )
			{
				var _this=this;
				// _this.$loading();
				$._ajax({
					url:  'pay/index',
					type:'post',
					data:JSON.stringify({
						orderId:orderId,
						paymentCode:_this.paymentCode,//dummyPay:虚拟支付，aliPcPay：支付宝PC支付
					})
				}).done(function(data){
					if(_this.payType==2){
						const payDiv = document.getElementById('payDiv');
						if (payDiv) {
							document.body.removeChild(payDiv);
						}
						const div = document.createElement('div');
						div.id = 'payDiv';
						div.innerHTML = data.aliForm;
						document.body.appendChild(div);
						document.getElementById('payDiv').getElementsByTagName('form')[0].submit();
					}else{

						_this.ewmShow=true;
						qrcode.makeCode(data.result)
						// 判断是否支付
						timer = setInterval(function(  )
						{
							_this.judgePay(orderId)
						},1000)

					}

				}).always(function () {
					_this.$loading().close();
				});
			},


			judgePay:function(orderId){
				var _this=this;
				$._ajax({
					url: 'pay/query',
					type:'get',
					data:{
						orderId:orderId,
					}
				}).done(function(data){
					if(data.isPay==1){
						setTimeout(function(  )
						{
							console.log(data.isPay)
							var href='store_success.html?info='+plus.base64encode(JSON.stringify( {
									price:_this.goodsAmount,
									address:_this.addressInfo.province+''+_this.addressInfo.city+''+_this.addressInfo.area+''+_this.addressInfo.info+' '+_this.addressInfo.contact+' '+_this.addressInfo.phone
								}))
							window.location.href=href;
							// window.open(href);
						},2000)
					}

				}).always(function(){
				});
			},


			hideEwm:function(  )
			{
				var href='c_order.html';
				window.open(href);
			},





		},
		watch:{
			province:function( val )
			{
				var _this=this;
				if(_this.isSee){

				}else{
					_this.cityList=[];
					_this.areaList=[];
					_this.city='';
					_this.area='';
				}
				for(var key in _this.provinceList){
					if(val == _this.provinceList[key].oid){
						_this.cityList=_this.provinceList[key].subDistricts;
					}
				}

			},
			city:function( val )
			{
				var _this=this;
				if(_this.isSee){

				}else
				{
					_this.areaList = [];
					_this.area = '';
				}

				_this.isSee=false;
				for(var key in _this.cityList){
					if(val == _this.cityList[key].oid){
						_this.areaList=_this.cityList[key].subDistricts;
					}
				}
			},
			payType:function( val )
			{
				if(val ==1){
					this.paymentCode='wechatPcPay';
				}else if(val ==2){
					this.paymentCode='aliPcPay';
				}
			}
		}
	});
})()

