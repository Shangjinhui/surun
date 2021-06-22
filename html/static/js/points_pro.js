;(function () {

	var app = new Vue({
		el: '#app',
		data: {
			category:[],
			categoryAll:[],
			pageNo:1,
			limit:10,
			list:null,
			total:0,
			id:plus.getUrlParam('id')?plus.getUrlParam('id'):'',

			info:'',
			isCollect:'',
			price:'',
			stock:'',//库存
			typeAttrList:[],//分类
			singleGoods:[],//单品
			goodsSingleId:'',//单品id
			selectArr: [], // 存放被选中的值
			shopItemInfo: {}, // 存放要和选中的值进行匹配的数据
			subIndex: [], // 是否选中 因为不确定是多规格还是但规格，所以这里定义数组来判断
			quantity:1,//数量

			stateList:[
				{id:1,name:'商品详情'},
				{id:2,name:'累计评价'}
			],
			state:1,
			bannerList:[],
			bannerImg:'',
			bigShow:false,

			type:plus.getUrlParam('type')?plus.getUrlParam('type'):-1,
			searchTx:'',
			cartNum:0,
			searchList:[],
			headerList:[],
			slideState:false,
			infos:'',

			isMore:false
		},
		mounted: function () {
			var _this=this;

			_this.getNavType();
			_this.getList();

			if(window.TOKEN){
				_this.getInfos();
			}
		},
		methods:{
			getPointInfo:function(){
				var _this=this;
				_this.$loading();
				$._ajax({
					url:'order_integral/buy',
					type:'post',
					data:JSON.stringify({
						goodsSingleId:_this.goodsSingleId,
						goodsId:_this.id,
						quantity:_this.quantity,
					})
				}).done(function(data){
					_this.goodInfo=data;
				}).always(function () {
					_this.$loading().close();
				});
			},
			// 首页分类,banner展示
			getNavType:function(  )
			{
				var _this=this;
				_this.$loading();
				$._ajax({
					url:  'integral/index',
					type:'get',
				}).done(function(data){
					var num=0
					for(var key in data.category){
						var item=data.category[key];
						num=num+item.name.length*14+30
					}
					if(num>930){
						_this.isMore=true;
					}


					_this.category=data.category;
					_this.categoryAll=data.categoryAll;

					_this.getInfo();


				}).always(function () {
					_this.$loading().close();
				});
			},
			//个人信息
			getInfos:function(){
				var _this=this;
				_this.$loading();
				$._ajax({
					url:  'member/info',
					type:'get',
				}).done(function(data){
					console.log(data)
					_this.infos=data;
				}).always(function () {
					_this.$loading().close();
				});
			},

			getInfo:function(  )
			{
				var _this=this;
				_this.$loading();
				$._ajax({
					url:  'integral/info',
					type:'get',
					data:{
						id:_this.id
					}
				}).done(function(data){
					_this.info=data.info;
					_this.bannerList=data.info.photoInfoUrl;
					_this.bannerImg=data.info.photoInfoUrl[0];
					_this.price=data.info.price;
					_this.stock=parseInt(data.info.stock);
					_this.isCollect=data.info.isCollect;

					_this.singleGoods=data.singleGoods;
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

					//获取单品
					for( var i in _this.singleGoods )
					{
						console.log(_this.singleGoods[ i ].goodsSingleAttrName,_this.singleGoods[ i ])
						_this.shopItemInfo[ _this.singleGoods[ i ].goodsSingleAttrName ] = _this.singleGoods[ i ] // 修改数据结构格式，改成键值对的方式，以方便和选中之后的值进行匹配
					}
					_this.checkItem()


					_this.bannerSwiper();

				}).always(function () {
					_this.$loading().close();
				});
			},

			//鼠标移入事件
			mouseenter:function(  )
			{
				this.bigShow=true;
			},
			//鼠标移出事件
			mouseLeave:function( item )
			{
				this.bigShow=false
			},
			//移动事件
			picMove :function (e)
			{
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
			bannerSwiper:function(  )
			{
				var _this=this;
				Vue.nextTick(function(  )
				{
					$('.gallery-thumbs .swiper-slide').eq(0).addClass('active-nav')
					var previewSwiper = new Swiper('.gallery-thumbs', {
						slidesPerView: 5,
						spaceBetween: 10,
						prevButton:'.swiper-button-prev',
						nextButton:'.swiper-button-next',
						onClick: function() {
							if(previewSwiper.clickedIndex||previewSwiper.clickedIndex==0){
								console.log(111)
								$('.pro-img-small').removeClass('active-nav')
								$('.gallery-thumbs .swiper-slide').eq(previewSwiper.clickedIndex).addClass('active-nav')
								_this.bannerImg=_this.bannerList[previewSwiper.clickedIndex]
							}
						}
					})
				})

			},
			// 规格选择
			specificationBtn: function( name, item, n, event, index )
			{
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
			checkItem: function()
			{
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
				if(_this.shopItemInfo[ result ]){
					var info=_this.shopItemInfo[ result ]
					_this.stock=parseInt(info.stock);
					_this.bannerImg=info.photoUrl;
					_this.price=info.price;
					_this.goodsSingleId=info.id;
					if(_this.quantity>_this.stock){
						_this.quantity=_this.stock;
					}
				}else{
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
				return this.shopItemInfo[ result ] && Number( this.shopItemInfo[ result ].stock ) !== 0 // 匹配选中的数据的库存，若不为空返回true反之返回false
			},
			//兑换
			exchange:function(){
				var _this=this;
				$.checkUser()
				if(window.TOKEN){
					if(!_this.goodsSingleId){
						$.oppo('请选择规格');
						return false;
					}
					if(_this.infos.point<_this.price){
						$.oppo('积分不足');
						return;
					}
					localStorage['goodsPro']=JSON.stringify({
						goodsSingleId:_this.goodsSingleId,
						goodsId:_this.id,
						quantity:_this.quantity
					})
					var href='store_confirm.html?type=2';
					window.open(href);
				}
			},
			// 收藏
			collectInfo:function(  )
			{
				var _this=this;
				$.checkUser();
				_this.$loading();
				$._ajax({
					url:  _this.isCollect==0?'collect/add_collect':'collect/cancel_collect',
					type:'post',
					data:JSON.stringify({
						id:_this.id,
						type:2//1-收藏商品 2-收藏积分商品 3-收藏店铺
					})
				}).done(function(data){
					_this.isCollect=_this.isCollect==0?1:0
				}).always(function () {
					_this.$loading().close();
				});
			},
			// 评价列表
			getList:function(  )
			{
				var _this=this;
				_this.$loading();
				$._ajax({
					url:  'integral/evaluate_info',
					type:'get',
					data:{
						pageNo:_this.pageNo,
						limit:_this.limit,
						id:_this.id
					}
				}).done(function(data){
					_this.list=data.evaluate;
					_this.total=data.count;

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
			goShopCart:function(){
				$.checkUser();
				var href='shopping_cart.html';
				window.open(href);
			},
			//购物车数量
			getNum:function(){
				var _this=this;
				$._ajax({
					url:  'order/cart_number',
					type:'get',
				}).done(function(data){
					_this.cartNum=data.cartNum
				}).always(function () {
				});
			},
			navState:function(){
				var _this=this;
				_this.slideState=!_this.slideState;
			},
			carlist:function(){
				var href='shopping_cart.html';
				window.open(href);
			},
			toGetList:function(){
				var href='points_mall.html?text='+this.searchTx;
				window.open(href);
			},
			goLists:function(e){
				// $.checkUser();
				window.location.href='points_mall.html?type='+e;
				// window.open(e);
			}
		}	
	});
})()

