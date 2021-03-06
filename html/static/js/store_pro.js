;(function () {
	var times='';
	var app = new Vue({
		el: '#app',
		data: {
			stateList:[
				{id:1,name:'商品详情'},
				{id:2,name:'累计评价'},
				{id:3,name:'问答专区'},
			],
			id:plus.getUrlParam('id')?plus.getUrlParam('id'):'',
			company:plus.getUrlParam('company')?plus.getUrlParam('company'):'',
			category:[],
			categoryAll:[],
			state:1,
			bannerList:[],
			bannerImg:'',
			bigShow:false,
			bigType:'',     //轮播点击图片的类型
			info:'',//详情信息
			companys:'',//店铺信息
			price:'',
			originPrice:'',
			stock:'',//库存
			typeAttrList:[], //分类
			subIndex: [], // 是否选中 因为不确定是多规格还是但规格，所以这里定义数组来判断
			singleGoods:[],//单品
			goodsSingleId:'',//单品id
			selectArr: [], // 存放被选中的值
			shopItemInfo: {}, // 存放要和选中的值进行匹配的数据
			quantity:1,//数量
			coupon:[],
			coupon_state:false, //优惠券领取窗口状态
			coupon_status:true, //防止同时多次点击领取
			min:0,
			max:10000,
			province:'浙江省',
			city:'杭州市',
			goodsSingle:[],//自定义列表
			goodsSingles:[],//自定义列表对比- 拼团时需要对比，若自定义数据被改动，无法拼团
			list:[], //厂家推荐列表
			Epage:1,
			Qpage:1,
			limit:5,
			Ecount:0,
			Qcount:0,
			evaluate_List:[], //评价列表
			isCollect:'0', //商品是否收藏
			shopCollect:'0', //店铺是否收藏
			group_list:[], //拼团列表
			like:[],//看了又看
			question_list:[],//问答列表
			q_state:false, //问答弹窗状态
			texts:'',
			keyword:'',//关键字
			min_price:'',
			max_price:'', 
			common:[],//商品分类
			group_button:true,
			Q_A:[
				{
					title:'说出你的问题，他们会帮你解答',
					name:'提问'
				},
				{
					title:'',
					name:'回答'
				}
			],
			Q_num:0,
			Question_id:false,
			Join_state:false,
			Join_info:{
				expireTime: "",
				groupNumber: "",
				id: "",
				totalNumber: "",
				user:[
					{
						nickname: "",
						avatar: {
							id: '', 
							url: ""
						}
					}
				]
			},
			Join_infos:{
				expireTime: "",
				groupNumber: "",
				id: "",
				totalNumber: "",
				user:[
					{
						nickname: "",
						avatar: {
							id: '', 
							url: ""
						}
					}
				]
			},
			showState:false,
			storyInfo:'',
			isShow:false,
			numt:0,
			group_tims:0,
			buyGoods:true,
			numery:1.5,
			colors:['#e42008', '#e42008', '#e42008', '#e42008', '#e42008'],
			groupId:''
		},
		mounted:function(){
			var _this=this;
			if(localStorage['userToken']){
				$.checkUser();
			}
			_this.getInfo();
			_this.getMap();
			// _this.GroupList();
			_this.EvaluateList();
			_this.get_Category();
			_this.getStoreInfo();
			_this.Question_list();
		},
		methods:{
			onEnlargeText:function( e )
			{
				this.shopCollect=e
			},
			//标题切换
			Title_switch:function(e){
				var _this=this;
				_this.state=e;
				if(e==2){
					_this.EvaluateList();
				}else if(e==3){
					_this.Question_list();
				}
			},
			//鼠标移入事件
			mouseenter:function(){
				if(this.bigType != 'video') this.bigShow=true;
			},
			//鼠标移出事件
			mouseLeave:function(item){
				if(this.bigType != 'video') this.bigShow=false
			},
			//移动事件
			picMove :function (e){
				if(this.bigType == 'video') return;
				//获取鼠标此时可视区域的横纵坐标,去掉父亲的margin值
				var box=$('#box');

				var x = e.clientX - box.offset().left;
				var y = e.clientY - box.offset().top;

				//设置鼠标在遮挡层的中间显示
				var mask= $('.mask');
				var small= $('.pro-img-big');
				var big= $('.pro-img-big-bx');
				var bigImg= $('.pro-img-big-bx div');

				x = x - mask.width() / 2;
				y = y - mask.height() / 2;

				//设置横纵坐标的最小值
				x = x < 0 ? 0 : x;
				y = y < 0 ? 0 : y;

				//设置横纵坐标的最大值
				x = x > small.width() - mask.width() ? small.width() - mask.width() : x;
				y = y > small.height() - mask.height()?small.height() - mask.height() : y;

				//赋值给遮挡层
				mask.css("left", x + "px");
				mask.css("top", y + "px");


				//遮挡层的移动距离/大图的移动距离=遮挡层移动的最大距离/大图最大的移动距离
				//大图的移动距离=遮挡层的移动距离*大图最大的移动距离/遮挡层移动的最大距离

				//大图的最大的移动距离
				var maxX = bigImg.width() - big.width();
				var maxY = bigImg.height() - big.height();

				//求大图的移动距离
				var bigImgX = x * maxX / (small.width() - mask.width());
				var bigImgY = y * maxY / (small.height() - mask.height());

				bigImg.css("marginLeft", -bigImgX + "px");
				bigImg.css("marginTop", -bigImgY + "px");
			},
			// 轮播图
			bannerSwiper:function(){
				var _this=this;
				this.$nextTick(function(){
					console.log($('.gallery-thumbs .swiper-slide'),'--------')
					$('.gallery-thumbs .swiper-slide').eq(0).addClass('active-nav')
					var previewSwiper = new Swiper('.gallery-thumbs', {
						slidesPerView: 5,
						spaceBetween: 10,
						prevButton:'.swiper-button-prev',
						nextButton:'.swiper-button-next',
						onClick: function() {

							if(previewSwiper.clickedIndex||previewSwiper.clickedIndex==0){
								$('.pro-img-small').removeClass('active-nav')
								$('.gallery-thumbs .swiper-slide').eq(previewSwiper.clickedIndex).addClass('active-nav')
								_this.bannerImg=_this.bannerList[previewSwiper.clickedIndex].url;
								_this.bigType = _this.bannerList[previewSwiper.clickedIndex].type||'';
							}
						}
					})
				})
			},
			// 规格选择
			specificationBtn: function( name, item, n, event, index ){
				var _this = this
				if( _this.selectArr[ n ] !== item )
				{
					_this.selectArr[ n ] = item
					_this.subIndex[ n ] = index
				}
				else
				{
					_this.selectArr[ n ] = ''
					_this.subIndex[ n ] = -1 // 去掉选中的颜色
				}
				_this.checkItem()
			},
			checkItem: function(){
				var _this = this
				var option = _this.typeAttrList
				var result = [] // 定义数组存储被选中的值
				for( var i in option )
				{
					result[ i ] = _this.selectArr[ i ] ? _this.selectArr[ i ] : ''
				}
				for( var i in option )
				{
					var last = result[ i ] // 把选中的值存放到字符串last去
					for( var k in option[ i ].valueList )
					{
						result[ i ] = option[ i ].valueList[ k ].name // 赋值，存在直接覆盖，不存在往里面添加name值
						option[ i ].valueList[ k ].isShow = _this.isMay( result ) // 在数据里面添加字段isShow来判断是否可以选择

					}
					result[ i ] = last // 还原，目的是记录点下去那个值，避免下一次执行循环时避免被覆盖
				}
				// console.log(_this.shopItemInfo[ result ])
				if(_this.shopItemInfo[ result ]){
					var info=_this.shopItemInfo[ result ]
					_this.price=info.price;
					_this.originPrice=info.originPrice;
					_this.goodsSingleId=info.id;
				}else{
					_this.price=_this.info.price;
					_this.originPrice='';
					_this.goodsSingleId='';
				}
				_this.$forceUpdate() // 重绘
			},
			isMay: function( result )
			{
				for( var i in result )
				{
					if( result[ i ] === '' )
					{
						return true // 如果数组里有为空的值，那直接返回true
					}
				}
				return this.shopItemInfo[ result ]// 匹配选中的数据的库存，若不为空返回true反之返回false
			},
			//地图定位
			getMap:function(){
				var _this=this;
				var geolocation = new BMap.Geolocation();
		        var gc = new BMap.Geocoder();
		        geolocation.getCurrentPosition(function (r) {
		            if (this.getStatus() == BMAP_STATUS_SUCCESS) {
		                var pt = r.point;
		                gc.getLocation(pt, function (rs) {
		                    var addComp = rs.addressComponents;
		                    _this.province = addComp.province;
		                    _this.city = addComp.city;
		                });
		            }
		            else {
		                alert("定位失败");
		            }
		        }, { enableHighAccuracy: true });
			},
			//详情列表
			getInfo:function(){
				var _this=this;
				_this.$loading();
				$._ajax({
					url:  'common/info',
					type:'get',
					data:{
						id:_this.id,
						company:_this.company,
					}
				}).done(function(data){
					_this.companys=data.company;
					_this.info=data.info;
					if(data.info.isAssemble==1){
						_this.GroupList();
					}
					let swiperList = [];
					if(data.info.video&&data.info.video.id){
						swiperList.unshift({...data.info.video,type:'video'});
						_this.bigType = 'video';
					}
					if(data.info.photoUrl){
						swiperList.push(...data.info.photoUrl)
					}
					if(swiperList.length>0){
						_this.bannerList=swiperList
						_this.bannerImg=swiperList[0].url;
					}
					let list=data.goodsSingleAttribute;
					if(list){
						for(let i=0;i<list.length;i++){
							list[i].num=0;
							list[i].nums=list[i].value;
						}
					}

					_this.like=data.like;
					_this.isCollect=data.info.isCollect;
					_this.goodsSingle=list;
					_this.price=data.info.price;
					_this.shopCollect=data.info.shopCollect;
					_this.singleGoods=data.singleGoods;
					_this.coupon=data.coupon;
					var typeAttrList=data.typeAttrList;
					//赋值分类
					for(var key in typeAttrList){
						var value=typeAttrList[key].value.split(',');
						var valueList=[];
						for(var it in value){
							valueList.push({name:value[it]})
						}
						typeAttrList[key].valueList=valueList;
					}
					_this.typeAttrList=typeAttrList;
					// //获取单品
					for( var i in _this.singleGoods )
					{
						_this.shopItemInfo[ _this.singleGoods[ i ].goodsSingleAttrName ] = _this.singleGoods[ i ] // 修改数据结构格式，改成键值对的方式，以方便和选中之后的值进行匹配
					}
					_this.checkItem();
					let timer = setTimeout(()=>{
						_this.bannerSwiper();
						clearTimeout(timer);
					},800)
					
					_this.Recommend();
					

				}).always(function () {
					_this.$loading().close();
				});
			},
			// 商品分类
			get_Category:function(){
				var _this=this;
				$._ajax({
					url:'common/get_category',
					type:'get',
					data:{
						company:_this.company
					}
				}).done(function(data){
					if(data){
						var arr=[];
						for(let i=0;i<data.length;i++){
							data[i].state=false;
							arr.push(data[i]);
						}
						_this.common=arr;
					}
				}).always(function () {
				});
			},
			//商品分类切换事件
			Categorys:function(e){
				var _this=this;
				_this.common[e].state=!_this.common[e].state;
			},
			//商品分类事件
			Category_link:function(e){
				var _this=this;
				var category=JSON.stringify({
					id:e,
				})
				category=$.base64encode(category);
				var href="store_prolist.html?category="+category+"&company="+_this.company;
				window.open(href);
			},
			// 厂家推荐
			Recommend:function(){
				var _this=this;
				_this.$loading();
				$._ajax({
					url:'common/company_flag_goods',
					type:'get',
					data:{
						page:1, 
						limit:8, 
						company:_this.info.companyId, //商家id
						name:_this.info.name, //商品名称
					},
				}).done(function(data){
					_this.list=data.result;
				}).always(function () {
					_this.$loading().close();
				});
			},
			// 评价列表
			EvaluateList:function(){
				var _this=this;
				$._ajax({
					url:'common/evaluate_info',
					type:'get',
					data:{
						id:_this.id,
						pageNo:_this.Epage,
						limit:_this.limit,
					},
				}).done(function(data){
					_this.Ecount=data.count;
					_this.evaluate_List=data.evaluate;
				}).always(function(){
				});
			},
			ECurrentPage:function(e){
				var _this=this;
				_this.Epage=e;
				_this.EvaluateList();
			},
			//拼团列表
			GroupList:function(){
				var _this=this;
				$._ajax({
					url:'common/group_list',
					type:'get',
					data:{
						id:_this.id, 
					},
				}).done(function(data){
					_this.group_list=data.list;
					_this.group_tims=data.time;
					if(data.list.length>0){
						_this.GroupLists();
						var t=setTimeout(function(){
							clearTimeout(t);
							_this.GroupList();
						},10500)
					}
				}).always(function () {
				});
			},
			GroupLists:function(){
				var _this=this;
				var list=_this.group_list;
				if(list.length>0){
					for(let i=0;i<list.length;i++){
						_this.group_list[i].createTime=_this.countdown(list[i].expireTime);
					}
				}
				times=setTimeout(function(){
					clearTimeout(times);
					_this.group_tims++;
					_this.GroupLists();
				},1000);
			},
			countdown:function(e){
				var _this=this;
			  	const end = e;
			  	var nowtime = new Date().getTime(); 
			  	const now = _this.group_tims*1000;
			  	// 相差的毫秒数
			  	const time = (end*1000 - now)/1000;
			  	let day,hour,minute,second;
			  	// 计算时分秒数
			  	if(now==end){
			  		day = '00';
					hour = '00';
					minute = '00';
					second = '00';
			  	}else{
				  	day = Math.floor(time / (24 * 3600));
					hour = Math.floor((time/3600) % 24);
					minute = (Math.floor(time/60))%60;
					second = Math.floor(time%60);
				}
				return day + "天" + hour + "时" + minute + "分" + second + "秒";
			},
			Join_show:function(item){
				var _this=this;
				if(localStorage['userToken']){
					_this.Join_state=!_this.Join_state;
					_this.Join_info=item;
					localStorage['state']='1';
					$.saletime3($('#join'),_this.Join_info.expireTime,2);
				}else{
					$.checkUser();
				}
			},	
			Join_hidess:function(){
				var _this=this;
				localStorage['state']='';
				_this.groupId='';
				var time=setTimeout(function(){
					clearTimeout(time);
					_this.Join_state=!_this.Join_state;
					_this.Join_info=_this.Join_infos;
				},500)
			},
			Join:function(){
				var _this=this;
				_this.groupId=_this.Join_info.id;
				if(!_this.goodsSingleId){
					var time=setTimeout(function(){
						clearTimeout(time);
						_this.numt=1;
						_this.buyGoods=!_this.buyGoods;
						localStorage['state']='';
						_this.Join_state=!_this.Join_state;
					},500)
					$.oppo('请选择商品规格');
					return
				}
				if(!_this.quantity){
					var time=setTimeout(function(){
						clearTimeout(time);
						_this.numt=1;
						_this.buyGoods=!_this.buyGoods;
						localStorage['state']='';
						_this.Join_state=!_this.Join_state;
					},500)
					$.oppo('请选择数量');
					return
				}
				var singleGoods={
					goodsSingleId:_this.goodsSingleId,
					quantity:_this.quantity,
					goodsAttribute:[]
				};
				var list=_this.goodsSingle,array=[];
				if(list){
					for(let i=0;i<list.length;i++){
						if(list[i].num>0){
							var arr={
								id:list[i].id,
								number:list[i].num
							}
							array.push(arr)
						}
					}
				}
				singleGoods.goodsAttribute=array;
				var date=JSON.stringify({
					isGroup:'1',
					isFromCart:'0',
					cartIds:'',
					singleGoods:singleGoods,
				})
				var data=$.base64encode(date);
				var href="store_confirm.html?type=1&data="+data+'&groupId='+_this.groupId;
				window.open(href);
			},
			//问答专区-问题列表
			Question_list:function(){
				var _this=this;
				$._ajax({
					url:'common/question_list',
					type:'get',
					data:{
						id:_this.id,
						page:_this.Qpage,
						limit:_this.limit,
					},
				}).done(function(data){
					_this.Qcount=data.count;
					_this.question_list=data.data;
				}).always(function () {
				});
			},
			QCurrentPage:function(e){
				var _this=this;
				_this.Qpage=e;
				_this.Question_list();
			},
			// 未选规格确认按钮
			bugBtn:function(){
				var _this=this;
				if(!_this.goodsSingleId){
					$.oppo('请选择商品规格');
					_this.buyGoods=false;
					return 
				}
				if(!_this.quantity){
					$.oppo('请选择数量');
					_this.buyGoods=false;
					return 
				}
				if(_this.numt=='1' && _this.groupId==''){ //立即拼团
					_this.Group_buys('1');
				}else if(_this.numt=='1' && _this.groupId){ //参与拼团
					_this.Join();
				}else if(_this.numt=='0'){
					_this.Make_buy('0');
				}else{
					_this.addCart();
				}
			},
			//添加购物车-需要遍历是否有自定义属性
			addCart:function(){
				var _this=this;
				if(localStorage['userToken']){
					_this.numt='';
					if(!_this.goodsSingleId){
						$.oppo('请选择商品规格');
						_this.buyGoods=false;
						return 
					}
					if(!_this.quantity){
						$.oppo('请选择数量');
						_this.buyGoods=false;
						return 
					}
					var list=_this.goodsSingle,array=[];
					if(list){
						for(let i=0;i<list.length;i++){
							if(list[i].num!=0){
								var arr={
									id:list[i].id,
									number:list[i].num
								}
								array.push(arr)
							}
						}
					}
					_this.$loading();
					$._ajax({
						url:'order/add_cart',
						type:'POST',
						data:JSON.stringify({
							goodsId:_this.id,
							goodsSingleId:_this.goodsSingleId,
							quantity:_this.quantity,
							goodsAttribute:array,
						}),
					}).done(function(data){
						$.oppo('成功加入购物车');
						_this.buyGoods=true;
					}).always(function () {
						_this.$loading().close();
					});
				}else{
					$.checkUser();
				}
			},
			//立即购买
			Buy:function(e){
				var _this=this;
				if(!_this.goodsSingleId){
					$.oppo('请选择商品规格');
					return 
				}
				if(!_this.quantity){
					$.oppo('请选择数量');
					return
				}
				var singleGoods={
					goodsSingleId:_this.goodsSingleId,
					quantity:_this.quantity,
					goodsAttribute:[]
				};

				var list=_this.goodsSingle,array=[];
				if(list){
					for(let i=0;i<list.length;i++){
						if(list[i].num>0){
							var arr={
								id:list[i].id,
								number:list[i].num
							}
							array.push(arr)
						}
					}
				}
				singleGoods.goodsAttribute=array;
				var date=JSON.stringify({
					isGroup:e,
					isFromCart:'0',
					cartIds:'',
					singleGoods:singleGoods,
				})
				var data=$.base64encode(date);
				var href="store_confirm.html?type=1&data="+data;
				window.open(href);
			},
			//单独定制-必须要有自定义属性
			Make_buy:function(e){
				var _this=this;
				if(localStorage['userToken']){
					_this.numt=e;
					if(!_this.goodsSingleId){
						$.oppo('请选择商品规格');
						_this.buyGoods=false;
						return 
					}
					if(!_this.quantity){
						$.oppo('请选择数量');
						_this.buyGoods=false;
						return 
					}
					_this.Buy(e);
					// if(this.goodsSingles.length>0){
					// }else{
					// 	$.oppo('请填写自定义属性')
					// }
				}else{
					$.checkUser();
				}
			},
			changs:function(e){
				console.log(e)
			},
			//拼团商品-不能有自定义属性
			Group_buys:function(e){
				var arr=[];
				console.log(e)
				var _this=this;
				if(localStorage['userToken']){
					if(_this.goodsSingles.length>0){
						return 
					}
					_this.numt=e;
					if(!_this.goodsSingleId){
						$.oppo('请选择商品规格');
						_this.buyGoods=false;
						return 
					}
					if(!_this.quantity){
						$.oppo('请选择数量');
						_this.buyGoods=false;
						return
					}
					if(!this.goodsSingles.length>0){
						this.Buy(e);
					}
				}else{
					$.checkUser();
				}
			},
			// 自定义属性监听-拼团
			Change_buy:function(index,item,event){//index 第几个，item值
				var _this=this;
				var list=_this.goodsSingle;
				list[index].value=parseInt(list[index].nums)+item;
				if(list[index].num==0){
					if(_this.goodsSingles.includes(index)){
						var arr=[];
						for(let i=0;i<_this.goodsSingles.length;i++){
							if(index!=_this.goodsSingles[i]){
								arr.push(_this.goodsSingles[i])
							}
						}
						_this.goodsSingles=arr;
					}
				}else{
					if(!_this.goodsSingles.includes(index)){
						_this.goodsSingles.push(index);
					}
				}
				if(_this.goodsSingles.length>0){
					_this.group_button=false;
				}else{
					_this.group_button=true;
				}
			},
			//收藏店铺
			SCollect:function(){
				var _this=this;
				if(localStorage['userToken']){
					_this.$loading();
					$._ajax({
						url:'collect/add_collect',
						type:'POST',
						data:JSON.stringify({
							id:_this.company,
							type:3,
						}),
					}).done(function(data){
						$.oppo('收藏成功');
						_this.shopCollect='1';
					}).always(function () {
						_this.$loading().close();
					});
				}else{
					$.checkUser();
				}
			},
			//取消收藏店铺
			UnCollect:function(){
				var _this=this;
				if(localStorage['userToken']){
					_this.$loading();
					$._ajax({
						url:'collect/cancel_collect',
						type:'POST',
						data:JSON.stringify({
							id:_this.company,
							type:3,
						}),
					}).done(function(data){
						$.oppo('已取消收藏');
						_this.shopCollect='0';
					}).always(function () {
						_this.$loading().close();
					});
				}else{
					$.checkUser();
				}
			},
			//收藏商品
			ICollect:function(){
				var _this=this;
				if(localStorage['userToken']){
					_this.$loading();
					$._ajax({
						url:'collect/add_collect',
						type:'POST',
						data:JSON.stringify({
							id:_this.id,
							type:1,
						}),
					}).done(function(data){
						$.oppo('收藏成功');
						_this.isCollect='1';
					}).always(function () {
						_this.$loading().close();
					});
				}else{
					$.checkUser();
				}
			},
			//取消收藏商品
			UnICollect:function(){
				var _this=this;
				if(localStorage['userToken']){
					_this.$loading();
					$._ajax({
						url:'collect/cancelinfo_collect',
						type:'POST',
						data:JSON.stringify({
							id:_this.id,
							type:1,
						}),
					}).done(function(data){
						$.oppo('已取消收藏');
						_this.isCollect='0';
					}).always(function () {
						_this.$loading().close();
					});
				}else{
					$.checkUser();
				}
			},
			//搜索关键字
			Search_keyword:function(){
				var _this=this;
				var keyword=$.base64encode(_this.keyword);
				var min_price=$.base64encode(_this.min_price);
				var max_price=$.base64encode(_this.max_price);
				var href="store_prolist.html?searchTx="+keyword+'&min='+min_price+'&max='+max_price+'&company='+_this.company;
				//window.open(href);
				window.location.href = href;
			},
			//问答专区-提问状态
			Question_state:function(){
				var _this=this;
				_this.Q_num=0;
				_this.q_state=!_this.q_state;
				_this.texts='';
			},
			//问答专区-回复状态
			Question_reply_state:function(id,content){
				var _this=this;
				_this.Q_num=1;
				_this.q_state=!_this.q_state;
				_this.texts='';
				_this.Q_A[1].title=content;
				_Question_id=id;
			},
			//回答/提问
			Release_problem:function(){
				var _this=this,reply=0;
				if(_this.Q_num!=0){ //不为0时是回复
					reply=_Question_id
				}
				if(!_this.texts){
					$.oppo('内容不能为空');
					return;
				}
				_this.$loading();
				$._ajax({
					url:'common/add_question',
					type:'POST',
					data:JSON.stringify({
						id:_this.id,
						reply:reply, //提问为0
						content:_this.texts,
					}),
				}).done(function(data){
					if(reply==0){
						_this.Qpage=1;
					}
					_this.q_state=false;
					_this.Question_list();
				}).always(function () {
					_this.$loading().close();
				});
			},
			Coupon_states:function(){
				var _this=this;
				if(localStorage['userToken']){
					_this.coupon_state=!_this.coupon_state;
				}else{
					$.checkUser();
				}
			},
			//领取优惠券
			Receive_coupon:function(index,id){
				var _this=this;
				if(!_this.coupon_status){
					return;
				}
				_this.coupon_status=false;
				$._ajax({
					url:'coupon/receive_coupon',
					type:'POST',
					data:JSON.stringify({
						couponId:id,
					}),
				}).done(function(data){
					$.oppo('领取成功！');
					var num=Number(_this.coupon[index].personCan);
					_this.coupon[index].can=0;
				}).always(function () {
					_this.coupon_status=true;
				});
			},
			showTiggle:function(){
				var _this=this;
				_this.showState=!_this.showState;
			},
			//店铺信息
			getStoreInfo:function(  )
			{
				var _this=this;
				$._ajax({
					url:  'common/company_story',
					type:'get',
					data:{
						company:_this.company
					}
				}).done(function(data){
					_this.storyInfo=data;
					//console.log(_this.storyInfo)
					_this.isShow=true
				}).always(function () {
				});
			},
			//店铺信息
			linnkShare:function(  )
			{
				var _this=this;
				$._ajax({
					url:  'common/share_point',
					type:'get',
					data:{
						id:_this.id
					}
				}).done(function(data){
					
				}).always(function () {
				});
			},
		}
	});
})()

