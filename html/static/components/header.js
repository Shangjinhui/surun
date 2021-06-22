// 公共头部
var headerTopHtml = '<div class="bgf5f5f5">\
				<div class="wid1190 f-cb lh15 pt10 pb10 fsize12">\
					<div class="fl co8e8e8e">\
						<a href="index.html"  class="fl pr10 co8e8e8e">苏润易购欢迎您！</a>\
						<a href="http://demo2.yunmofo.cn/surun_shop/h5_admin/o_account.html"  class="pl10 pr12  co8e8e8e bor-ri fl hover333">厂家入驻</a>\
						<div @click="goLogin" class="pl12  coe42008 fl cursor" v-if="!info">您好，请登录</div>\
						<el-dropdown class="co8e8e8e ml12 fsize12" @command="infoCommand" v-if="info">\
							<span class="el-dropdown-link cursor">{{info.nickname}} <img src="static/img/head_ico1.png" class="vertical2"></span>\
							<el-dropdown-menu slot="dropdown"><el-dropdown-item v-for="(item,index) in infoList"  v-bind:key="index" :command="index">{{item}}</el-dropdown-item></el-dropdown-menu>\
						</el-dropdown>\
						<a href="register.html" class="pl12 pr12 co8e8e8e bor-ri fl hover333"  target="_blank" v-if="!info">免费注册</a>\
						<el-dropdown class="co8e8e8e ml12 fsize12" @command="infoCommand1">\
							<span class="el-dropdown-link cursor">客户服务 <img src="static/img/head_ico1.png" class="vertical2"></span>\
							<el-dropdown-menu slot="dropdown"><el-dropdown-item v-for="(item,index) in serviceList"  v-bind:key="index" :command="index">{{item}}</el-dropdown-item></el-dropdown-menu>\
						</el-dropdown>\
					</div>\
					<div class="fr co8e8e8e">\
						<div @click="sign" v-if="!isSign" class="pl10 cursor pr10 co8e8e8e bor-ri fl hover333">每日签到</div>\
						<div @click="goList(\'c_order.html\')"  class="pl10 pr10 co8e8e8e bor-ri fl hover333 cursor">我的订单</div>\
						<div @click="goList(\'shopping_cart.html\')" class="pl10 pr10 co8e8e8e bor-ri fl hover333 cursor">购物车</div>\
						<div @click="goList(\'c_collection.html\')" class="pl10 pr10 co8e8e8e bor-ri fl hover333 cursor">收藏夹</div>\
						<a href="points_mall.html" class="pl10 pr10 co8e8e8e bor-ri fl hover333"  target="_blank">积分商城</a>\
						<el-dropdown class="co8e8e8e ml12 fsize12">\
							<span class="el-dropdown-link cursor">苏润易购APP <img src="static/img/head_ico1.png" class="vertical2"></span>\
							<el-dropdown-menu slot="dropdown"><el-dropdown-item></el-dropdown-item></el-dropdown-menu>\
						</el-dropdown>\
					</div>\
				</div>\
			</div>'

Vue.component('header-top', {
	template: headerTopHtml,
	props: {
		nav: {
			default: 0
		},
	},
	data: function () {
		return {
			info:null,
			serviceList:['帮助中心','关于我们'],
			infoList:['个人中心','退出登录'],
			isSign:false
		}
	},
	computed:{
	},
	mounted: function () {
		if(localStorage['userToken']){
			$.checkUser();

			if(localStorage['userInfo']){
				this.info=$.getUser();
			}else{
				this.getInfo();
			}

			if(!localStorage['signTime']||$.fdateTime(new Date(),'yyyy-MM-dd')!=localStorage['signTime']){
				this.getSign()
			}else{
				this.isSign=true
			}
		}
	},
	methods: {
		goLogin:function (  )
		{
			$.toSignin();
		},

		goList:function( e )
		{
			$.checkUser();
			window.location.href=e;
			// window.open(e);
		},

		infoCommand:function( val )
		{
			var _this=this;

			if(val ==0){
				window.location='center.html';
				// window.open("center.html");
			}else{
				_this.$confirm('确定退出登录, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(function(  )
				{
					_this.$loading();
					$._ajax({
						url:  'member/signout',
						type:'post',
						data:JSON.stringify({
							id:_this.info.id
						})
					}).done(function(data){
						window.location.href='index.html';
						localStorage.removeItem('userToken')
						localStorage.removeItem('userInfo')
						localStorage.removeItem('signTime')

					}).always(function () {
						_this.$loading().close();
					});
				}).catch(function(  )
				{

				});
			}
		},

		infoCommand1:function( val )
		{
			var _this=this;

			if(val ==0){
				window.location='hlep.html';
				// window.open("hlep.html");
			}else{
				window.location='about.html';
				// window.open("about.html");

			}
		},

		getInfo:function(  )
		{
			var _this=this;
			_this.$loading();
			$._ajax({
				url:  'member/info',
				type:'get',

			}).done(function(data){
				$.putUser(data);
				_this.info=data
			}).always(function () {
				_this.$loading().close();
			});
		},

		//获取签到状态
		getSign:function(  )
		{
			var _this=this;
			$._ajax({
				url:  'other/signin',
				type:'get',
			}).done(function(data){
				if(data&&data ==1){
					_this.isSign=true;
					localStorage['signTime']=$.fdateTime(new Date(),'yyyy-MM-dd')
				}
			}).always(function () {
			});
		},

		//每日签到
		sign:function(  )
		{
			var _this=this;
			$.checkUser();
			if(_this.isSign){
				return false
			}
			_this.$loading();
			$._ajax({
				url:  'collect/signin',
				type:'get',
			}).done(function(data){
				$.oppo('签到成功');
				_this.isSign=true
			}).always(function () {
				_this.$loading().close();
			});
		},
	},
	watch:{


	}
})


// 首页头部
var homeHeaderHtml = '<div class="header bgfff">\
						<div class="wid1190 header-cen">\
							<div class="f-cb ">\
							<a href="index.html" ><img src="static/img/logo.png" class="fl mt15 ml30"></a>\
							<img src="static/img/head_ico2.png" class="fl mt35 ml58">\
							<div class="fl  ml60 mt25">\
								<div class="pb5" @mouseleave="iptblur">\
									<div class="rel fsize12 header-seach brad20 wid510 ">\
										<div class="lh20 wid70 abs bor-ri center co66 left-0 top-cen">\
											<div class="cursor">{{options[type-1].label}} <img src="static/img/head_ico1.png"  class="vertical2"></div>\
											<div class="w100 abs opa0 top-0 left-0">\
												<el-select v-model="type" placeholder="请选择"><el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option></el-select>\
											</div>\
										</div>\
										<input type="text" autocomplete="off" id="search" v-model="searchTx" placeholder="试一下您心动的关键字吧" @focus="iptfocus"  @keyup.enter="search" class="h35 pl88 pr80 fsize12 brad20 w100 header-seach-ipt">\
										<div class="abs cofff bge42008 brad20 top-0 right-0 center wid70 lh35 fsize16 cursor" @click="search">搜索</div>\
										<div class="abs header-seach-text brad4  pt10 pb10" v-if="!fixTopShow&&focusShow&&searchList&&searchList.length>0"><div v-for="(item,index) in searchList" @click="searchTx=item.name;search()" class="pd15 cursor row1" :class="index==0?\'on\':\'co999\'">{{item.name}}</div></div>\
									</div>\
								</div>\
								<div class="ml12 fsize12"><span v-for="(item,index) in searchTypeList" @click="goList(item)"  class="mr10 cursor hovere42008" :class="index==0?\'coe42008\':\'co66\'">{{item.name}}</span></div>\
							</div>\
							<div @click="goShopCart" class="fr brad20 bor lh36 pr12 pl25 mt25 mr40 f-cb cursor">\
								<img src="static/img/head_ico3.png"  class="vertical-4 mr5">购物车\
								<span class="bge42008 cofff brad20 ml12 fr lh20 mt8 pl5 pr5">{{cartNum}}</span>\
							</div>\
						</div>\
						<div class="f-cb header-nav lh40 mt10 rel">\
							<div class="fl wid198 bge42008 cofff pl25 mr13 cursor" @mouseenter="showNav(1)" @mouseleave="showNav(2);showChildNav()"><img src="static/img/head_ico5.png"  class="vertical-2 mr30 ">所有分类\
								<div class="header-nav-con abs wid198 h400  fsize13" v-if="hnavShow"  :class="navShow?\'\':\'header-nav-con1\'">\
									<div class="abs bgfff f-cb header-nav-hover h400"  v-if="childShow">\
										<div v-for="item in childTypeList" class="f-cb mb10">\
											<div class="fl header-nav-hover-con" v-for="it in item">\
												<div class="bor-bo co33 hovere42008 bold" @click="goList(it)">{{it.name}}</div>\
												<div class="f-cb child-box"><div class="fl co99 mr15 hovere42008" @click="goList(la)" v-for="la in it.more">{{la.name}}</div></div>\
											</div>\
										</div>\
									</div>\
									<div class="f-cb item co66 cursor"  :class="index==navIdx?\'on\':\'\'" v-for="(item,index) in typeList" v-if="index<=9" @mouseenter="showChildNav(item,index)">\
										<div @click="goList(item)"><img src="static/img/head_ico6.png" class="fl mr20 ">{{item.name}}<img src="static/img/head_ico7.png" class="fr"></div>\
									</div>\
									<div class="f-cb item co66 cursor" :class="navIdx==\'more\'?\'on\':\'\'" @mouseenter="showChildNav(\'\',\'more\')">\
										<a href="product_list.html" target="_blank" class="co66"><img src="static/img/head_ico6.png" class="fl mr20">更多定制<img src="static/img/head_ico7.png" class="fr"></a>\
									</div>\
								</div>\
							</div>\
							<div @click="goList(item)" :class="category==item.id?\'coe42008\':\'\'" class="fl rel ml20 cursor header-nav-item hovere42008" v-for="item in navList">{{item.name}}</div>\
						</div>\
					</div>\
					<div class="header-fix bgfff pt10 pb10 bor-bo tra" :class="fixTopShow?\'on\':\'\'">\
						<div class="wid1190">\
							<div class="fl wid198 bge42008 cofff pl25 mr13 cursor por" @mouseenter="showNav(1)" @mouseleave="showNav(2);showChildNav()"><div class="lh40" @mouseenter="showChildNavs"><img src="static/img/head_ico5.png"  class="vertical-2 mr30 ">所有分类</div>\
								<div class="header-nav-con on abs wid198 h400  fsize13" v-if="hnavShow" v-show="hnavShows" :class="navShow?\'\':\'header-nav-con1\'">\
									<div class="abs bgfff f-cb header-nav-hover h400" v-if="childShow">\
										<div v-for="item in childTypeList" class="f-cb mb10">\
											<div class="fl header-nav-hover-con" v-for="it in item">\
												<div class="bor-bo co33 hovere42008 bold">{{it.name}}</div>\
												<div class="f-cb child-box"><div class="fl co99 mr15 hovere42008" @click="goList(la)" v-for="la in it.more">{{la.name}}</div></div>\
											</div>\
										</div>\
									</div>\
									<div class="f-cb item co66 cursor" :class="index==navIdx?\'on\':\'\'" v-for="(item,index) in typeList" v-if="index<=9" @mouseenter="showChildNav(item,index)">\
										<div @click="goList(item)"><img src="static/img/head_ico6.png" class="fl mr20 ">{{item.name}}<img src="static/img/head_ico7.png" class="fr"></div>\
									</div>\
									<div class="f-cb item co66 cursor" :class="navIdx==\'more\'?\'on\':\'\'" @mouseenter="showChildNav(\'\',\'more\')">\
										<a href="product_list.html" target="_blank" class="co66"><img src="static/img/head_ico6.png" class="fl mr20 ">更多定制<img src="static/img/head_ico7.png" class="fr"></a>\
									</div>\
								</div>\
							</div>\
							<div class="rel fl fsize12 header-seach brad20 wid510" style="margin-left:130px;">\
								<div class="lh20 wid70 abs bor-ri center co66 left-0 top-cen">\
									<div class="cursor">{{options[type-1].label}} <img src="static/img/head_ico1.png"  class="vertical2"></div>\
									<div class="w100 abs opa0 top-0 left-0">\
										<el-select v-model="type" placeholder="请选择"><el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option></el-select>\
									</div>\
								</div>\
								<input type="text" autocomplete="off" id="search" v-model="searchTx" placeholder="试一下您心动的关键字吧" @focus="iptfocus"  @keyup.enter="search" class="h40im pl88 pr80 fsize12 brad20 w100 header-seach-ipt">\
								<div class="abs cofff bge42008 brad20 top-0 right-0 center wid70 lh40 fsize16 cursor" @click="search">搜索</div>\
								<div class="abs header-seach-text brad4  pt10 pb10" v-if="fixTopShow&&focusShow&&searchList&&searchList.length>0"><div v-for="(item,index) in searchList" @click="searchTx=item.name;search()" class="pd15 cursor row1" :class="index==0?\'on\':\'co999\'">{{item.name}}</div></div>\
							</div>\
							<div @click="goShopCart" class="fr brad20 bor lh38 pr12 pl25 mr40 f-cb cursor">\
								<img src="static/img/head_ico3.png"  class="vertical-4 mr5">购物车\
								<span class="bge42008 cofff brad20 ml12 fr lh20 mt8 pl5 pr5">{{cartNum}}</span>\
							</div>\
							</div>\
						</div>\
					</div>'

Vue.component('header-home', {
	template: homeHeaderHtml,
	props: {
		nav: {
			default: 0
		},
		navShow:{
			default:false
		},
		category:{
			default:null
		},
	},
	data: function () {
		return {
			hnavShow:false,
			hnavShows:false,
			focusShow:false,
			options: [{
				value: '1',
				label: '宝贝'
			},{
				value: '2',
				label: '店铺'
			}],
			type:plus.getUrlParam('type')?plus.getUrlParam('type'): '1',
			navList:[],
			typeList:[],
			childTypeList:[],
			searchTypeList:[],
			searchList:null,
			childShow:false,
			searchTx:plus.getUrlParam('searchTx')?plus.base64decode(plus.getUrlParam('searchTx')):'',
			cartNum:'',
			fixTopShow:false,
			navIdx:null
		}
	},
	computed:{
	},
	mounted: function () {
		var _this=this;
		this.hnavShow=this.navShow;
		if(localStorage['userToken']){
			$.checkUser();
			this.getNum();
		}

		this.getTopList();
		this.getTypeList();
		this.getSearchType();

		Vue.nextTick(function(  )
		{
			$(window).scroll(function(  )
			{
				_this.focusShow=false;
				var top=$(window).scrollTop();
				if(top>200){
					_this.fixTopShow=true;
				}else{
					_this.fixTopShow=false;

				}
			})
		})
	},
	methods: {
		goShopCart:function(  )
		{
			$.checkUser();
			window.location.href='shopping_cart.html'
		},
		// 获取焦点
		iptfocus:function(  )
		{
			this.focusShow=true;
			this.getSearchList();
		},
		// 失焦
		iptblur:function(  )
		{
			this.focusShow=false;
			var input = document.getElementById("search");
			input.blur();
		},
		// 显示子导航
		showNav:function( e )
		{
			this.hnavShows=false;
			if(!this.navShow){
				this.hnavShow=e==1?true:false;

			}
		},

		//购物车数量
		getNum:function( )
		{
			var _this=this;
			$._ajax({
				url:  'order/cart_number',
				type:'get',
			}).done(function(data){
				_this.cartNum=data.cartNum
			}).always(function () {
			});
		},
		showChildNavs:function(){
			this.hnavShows=true;
		},

		// 显示子集分类
		showChildNav:function( e,idx )
		{
			if(e){

				this.childShow=true;
				var moreList=e.more;

				this.childTypeList=group(moreList, 2);

				function group(array, subGroupLength) {
					var index = 0;
					var newArray = [];
					while(index < array.length) {
						newArray.push(array.slice(index, index += subGroupLength));
					}
					return newArray;
				}

			}else{
				this.childShow=false

			}
			this.navIdx=idx
		},


		//推荐类别
		getTopList:function(  )
		{
			var _this=this;
			$._ajax({
				url:  'common/get_flag_category',
				type:'get',
				data:{
					company:0
				}
			}).done(function(data){
				_this.navList=data
			}).always(function () {
			});

		},

		//首页搜索框下推荐分类
		getSearchType:function(  )
		{
			var _this=this;
			$._ajax({
				url:  'common/search_flag_category',
				type:'get',
				data:{
					company:0
				}
			}).done(function(data){
				_this.searchTypeList=data
			}).always(function () {
			});

		},

		//搜索关键词
		getSearchList:function(  )
		{
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
		search:function(  )
		{
			// if(!this.searchTx){return false;}
			if(this.type ==1){
				// window.location.href='product_list.html?type=1&searchTx='+ plus.base64encode(this.searchTx);
				var href='product_list.html?type=1&searchTx='+ plus.base64encode(this.searchTx);
				window.open(href);
			}else{
				// window.location.href='store_list.html?type=2&searchTx='+ plus.base64encode(this.searchTx);
				var href='store_list.html?type=2&searchTx='+ plus.base64encode(this.searchTx);
				window.open(href);
			}
		},
		//全部类别
		getTypeList:function(  )
		{
			var _this=this;
			$._ajax({
				url:  'common/get_category',
				type:'get',
				data:{
					company:0
				}
			}).done(function(data){
				_this.typeList=data;
			}).always(function () {
			});

		},



		//跳转列表
		goList:function( item )
		{
			var href='product_list.html?category='+plus.base64encode(JSON.stringify(item));
			//window.open(href);
			window.location.href = href;
		}
	},
	watch:{
		searchTx:function( val )
		{
			this.getSearchList();
		},
		type:function( val )
		{
			this.getSearchList();
		},

	}
})


// 头部2
var HeaderHtml1 = '<div class="header bgfff">\
					<div class="wid1190 header-cen">\
						<div class="f-cb ">\
						<a href="index.html"><img src="static/img/logo.png" class="fl mt15 ml30 mr30"></a>\
						<div class="fl fsize24 co99 wid160 lh100">{{headerName}}</div>\
						<div class="fl  ml18 mt35" v-if="navShow">\
							<div class="pb5" @mouseleave="iptblur">\
								<div class="rel fsize12 header-seach brad20 wid510 ">\
									<div class="lh20 wid70 abs bor-ri center co66 left-0 top-cen">\
										<div class="cursor">{{options[ctype-1].label}} <img src="static/img/head_ico1.png"  class="vertical2"></div>\
										<div class="w100 abs opa0 top-0 left-0">\
											<el-select v-model="ctype" placeholder="请选择"><el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option></el-select>\
										</div>\
									</div>\
									<input type="text" autocomplete="off" id="search" v-model="searchTx" placeholder="试一下您心动的关键字吧" @keyup.enter="search" @focus="iptfocus"  class="h35 pl88 pr80 fsize12 brad20 w100 header-seach-ipt">\
									<div class="abs cofff bge42008 brad20 top-0 right-0 center wid70 lh35 fsize16 cursor" @click="search">搜索</div>\
									<div class="abs header-seach-text brad4  pt10 pb10" v-if="focusShow&&searchList"><div v-for="(item,index) in searchList" @click="searchTx=item.name;search()" class="pd15 cursor row1" :class="index==0?\'on\':\'co999\'">{{item.name}}</div></div>\
								</div>\
							</div>\
				 		</div>\
						<div @click="goShopCart" class="fr brad20 bor lh36 pr12 pl25 mt35 f-cb cursor" v-if="navShow">\
							<img src="static/img/head_ico3.png"  class="vertical-4 mr5">购物车\
							<span class="bge42008 cofff brad20 ml12 fr lh20 mt8 pl5 pr5">{{cartNum}}</span>\
						</div>\
					</div>\
					<div class="f-cb header-nav lh40  rel">\
						<div @click="goList(-1)" class="fl wid190 bge42008 cofff  mr10 cursor center">{{headerTx}}</div>\
						<div @click="goList(item)" class="fl rel ml20 header-nav-item hovere42008 cursor" :class="type==item.id?\'coe42008\':\'\'" v-for="item in headerList">{{item.name}}</div>\
						<el-dropdown class=" ml20 header-li" v-if="headerAllList.length>0"  @command="handleCommand">\
							<span class="el-dropdown-link cursor">全部分类 <img src="static/img/head_ico1.png" class="vertical2"></span>\
							<el-dropdown-menu slot="dropdown"><el-dropdown-item v-for="(item,index) in headerAllList"  v-bind:key="index" :command="item.id" :class="type==item.id?\'coe42008 bgf2e5e4\':\'\'">{{item.name}}</el-dropdown-item></el-dropdown-menu>\
						</el-dropdown>\
					</div>\
				</div>\
			</div>'

Vue.component('header-list', {
	template: HeaderHtml1,
	props: {
		nav: {
			default: 0
		},
		navShow:{
			default:true
		},
		headerType:{
			default:''
		},
		headerList:{
			default:[]
		},
		headerAllList:{
			default:[]
		},
		type:{
			default:''
		}
	},
	data: function () {
		return {
			focusShow:false,

			headerName:'',
			headerTx:'',

			options: [{
				value: '1',
				label: '宝贝'
			},{
				value: '2',
				label: '店铺'
			}],
			ctype:'1',
			searchTx:'',
			cartNum:'',
			searchList:[]

		}
	},
	computed:{

	},
	mounted: function () {
		if(this.headerType==1){
			this.headerName='领券中心';
			this.headerTx='为你推荐'
		}else if(this.headerType==2){
			this.headerName='发现';
			this.headerTx='为你推荐'
		}else if(this.headerType==3){
			this.headerName='新品首发';
			this.headerTx='人气新品'
		}else if(this.headerType==4){
			this.headerName='拼团定制';
			this.headerTx='人气新品'
		}else if(this.headerType==5){
			this.headerName='积分商城';
			this.headerTx='为你推荐'
		}else if(this.headerType==6){
			this.headerName='排行榜';
			this.headerTx='人气新品'
		}

		if(localStorage['userToken']){
			$.checkUser();
			this.getNum();
		}

	},
	methods: {
		goShopCart:function(  )
		{
			$.checkUser();
			var href='shopping_cart.html';
			window.location.href='shopping_cart.html'
		},
		// 获取焦点
		iptfocus:function(  )
		{
			this.focusShow=true;
			this.getSearchList();
		},
		// 失焦
		iptblur:function(  )
		{
			this.focusShow=false;
			var input = document.getElementById("search");
			input.blur();
		},

		//购物车数量
		getNum:function( )
		{
			var _this=this;
			$._ajax({
				url:  'order/cart_number',
				type:'get',
			}).done(function(data){
				_this.cartNum=data.cartNum
			}).always(function () {
			});
		},

		//搜索关键词
		getSearchList:function(  )
		{
			var _this=this;
			$._ajax({
				url:  'common/search_keyword',
				type:'get',
				data:{
					type:_this.ctype,
					name:_this.searchTx
				}
			}).done(function(data){
				_this.searchList=data
			}).always(function () {
			});

		},

		// 搜索
		search:function(  )
		{
			// if(!this.searchTx){return false;}
			if(this.ctype ==1){
				var href='product_list.html?type=1&searchTx='+ plus.base64encode(this.searchTx);
				window.open(href);
			}else{
				var href='store_list.html?type=2&searchTx='+ plus.base64encode(this.searchTx);
				window.open(href);
			}
		},

		goList:function( item )
		{
			if(this.headerType==1){
				var href='coupon_list.html?type='+(item ==-1?-1:item.id);
				window.open(href);
			}else if(this.headerType==2){
				if(item !=-1){
					var href='product_list.html?category='+plus.base64encode(JSON.stringify(item));
					window.open(href);
				}
			}else if(this.headerType==3){
				var href='new_list.html?type='+(item ==-1?-1:item.id);
				window.open(href);
			}else if(this.headerType==4){
				var href='group_list.html?type='+(item ==-1?-1:item.id);
				window.open(href);
			}else if(this.headerType==5){
				var href='points_mall.html?type='+(item ==-1?-1:item.id);
				window.open(href);
			}else if(this.headerType==6){
				var href='ranking_list.html?type='+(item ==-1?-1:item.id);
				window.open(href);
			}
		},
		handleCommand:function( command )
		{
			if(this.headerType==1){
				var href='coupon_list.html?type='+command;
				window.open(href);
			}else if(this.headerType==2){

			}else if(this.headerType==3){
				var href='new_list.html?type='+command;
				window.open(href);
			}else if(this.headerType==4){
				var href='group_list.html?type='+command;
				window.open(href);
			}else if(this.headerType==5){
				var href='points_mall.html?type='+command;
				window.open(href);
			}else if(this.headerType==6){
				var href='ranking_list.html?type='+command;
				window.open(href);

			}
		}

	},
	watch:{


	}
})

// 领券中心
var HeaderHtmls2 = '<div class="header bgfff">\
					<div class="wid1190 header-cen">\
						<div class="f-cb ">\
						<a href="index.html"><img src="static/img/logo.png" class="fl mt15 ml15 mr30"></a>\
						<div class="fl fsize24 co99 lh100">{{headerName}}</div>\
					</div>\
					<div class="f-cb">\
						<div class="fl header-nav lh40 wid1120 rel " :class="slideState?\'\':\'h40 ovh\'">\
							<div @click="goList(-1)" class="fl wid160 mr30 bge42008 cofff cursor center">{{headerTx}}</div>\
							<div @click="goList(item)" class="fl mr30 rel header-nav-item hovere42008 cursor" :class="type==item.id?\'coe42008 \':\'\'" v-for="item in headerAllList">{{item.name}}</div>\
						</div>\
						<div class="fr pr20 lh40 arr-top cursor text-none" v-if="isMore" :class="slideState?\'on\':\'\'" @click="navState">更多</div>\
					</div>\
				</div>\
			</div>'

Vue.component('header-lists', {
	template: HeaderHtmls2,
	props: {
		nav: {
			default: 0
		},
		navShow:{
			default:true
		},
		headerType:{
			default:''
		},
		headerList:{
			default:[]
		},
		headerAllList:{
			default:[]
		},
		type:{
			default:''
		}
	},
	data: function () {
		return {
			focusShow:false,
			slideState:false,
			headerName:'',
			headerTx:'',

			options: [{
				value: '1',
				label: '宝贝'
			},{
				value: '2',
				label: '店铺'
			}],
			ctype:'1',
			searchTx:'',
			cartNum:'',
			searchList:[],
			isMore:false
		}
	},
	computed:{

	},
	mounted: function () {
		if(this.headerType==1){
			this.headerName='领券中心';
			this.headerTx='为你推荐'
		}

		if(localStorage['userToken']){
			$.checkUser();
			this.getNum();
		}
		console.log(this.type)
	},
	methods: {
		navState:function(){
			var _this=this;
			_this.slideState=!_this.slideState;
		},
		goShopCart:function(  )
		{
			$.checkUser();
			var href='shopping_cart.html';
			window.open(href);
		},
		// 获取焦点
		iptfocus:function(  )
		{
			this.focusShow=true;
			this.getSearchList();
		},
		// 失焦
		iptblur:function(  )
		{
			this.focusShow=false;
			var input = document.getElementById("search");
			input.blur();
		},

		//购物车数量
		getNum:function( )
		{
			var _this=this;
			$._ajax({
				url:  'order/cart_number',
				type:'get',
			}).done(function(data){
				_this.cartNum=data.cartNum
			}).always(function () {
			});
		},

		//搜索关键词
		getSearchList:function(  )
		{
			var _this=this;
			$._ajax({
				url:  'common/search_keyword',
				type:'get',
				data:{
					type:_this.ctype,
					name:_this.searchTx
				}
			}).done(function(data){
				_this.searchList=data
			}).always(function () {
			});

		},

		// 搜索
		search:function(  )
		{
			// if(!this.searchTx){return false;}
			if(this.ctype ==1){
				var href='product_list.html?type=1&searchTx='+ plus.base64encode(this.searchTx);
				window.open(href);
			}else{
				var href='store_list.html?type=2&searchTx='+ plus.base64encode(this.searchTx);
				window.open(href);
			}
		},

		goList:function( item )
		{
			if(item==-1){
				this.$parent.getList(item);
			}else{
				this.$parent.getList(item.id);
			}

		},
	},
	watch:{
		headerList:function( val )
		{
			var num=0
			for(var key in this.headerList){
				var item=this.headerList[key];
				num=num+item.name.length*14+30
			}
			if(num>930){
				this.isMore=true;
			}
		}

	}
})



// 头部4
var HeaderHtml3 = '<div class="header bgfff">\
					<div class="wid1190 header-cen">\
						<div class="f-cb ">\
						<a href="index.html"><img src="static/img/logo.png" class="fl mt15 ml15 mr30"></a>\
						<div class="fl fsize24 co99 wid160 lh100">{{headerName}}</div>\
						<div class="fl  ml18 mt35" v-if="navShow">\
							<div class="pb5" @mouseleave="iptblur">\
								<div class="rel fsize12 header-seach brad20 wid510 ">\
									<div class="lh20 wid70 abs bor-ri center co66 left-0 top-cen">\
										<div class="cursor">{{options[ctype-1].label}} <img src="static/img/head_ico1.png"  class="vertical2"></div>\
										<div class="w100 abs opa0 top-0 left-0">\
											<el-select v-model="ctype" placeholder="请选择"><el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option></el-select>\
										</div>\
									</div>\
									<input type="text" autocomplete="off" id="search" v-model="searchTx" placeholder="试一下您心动的关键字吧" @keyup.enter="search" @focus="iptfocus"  class="h35 pl88 pr80 fsize12 brad20 w100 header-seach-ipt">\
									<div class="abs cofff bge42008 brad20 top-0 right-0 center wid70 lh35 fsize16 cursor" @click="search">搜索</div>\
									<div class="abs header-seach-text brad4  pt10 pb10" v-if="focusShow&&searchList"><div v-for="(item,index) in searchList" @click="searchTx=item.name;search()" class="pd15 cursor row1" :class="index==0?\'on\':\'co999\'">{{item.name}}</div></div>\
								</div>\
							</div>\
				 		</div>\
						<div @click="goShopCart" class="fr brad20 bor lh36 pr12 pl25 mt35 mr40 f-cb cursor" v-if="navShow">\
							<img src="static/img/head_ico3.png"  class="vertical-4 mr5">购物车\
							<span class="bge42008 cofff brad20 ml12 fr lh20 mt8 pl5 pr5">{{cartNum}}</span>\
						</div>\
					</div>\
					<div class="f-cb">\
						<div class="fl header-nav lh40 wid1120 rel " :class="slideState?\'\':\'h40 ovh\'">\
							<div @click="goList(-1)" class="fl wid160 bge42008 cofff cursor center mr30">{{headerTx}}</div>\
							<div @click="goList(item.id)" :class="type==item.id?\'coe42008 \':\'\'" class="fl mr30 rel header-nav-item hovere42008 cursor" v-for="item in headerList">{{item.name}}</div>\
						</div>\
						<div class="fr pr20 lh40 arr-top cursor text-none" v-if="isMore" :class="slideState?\'on\':\'\'" @click="navState">更多</div>\
					</div>\
				</div>\
			</div>'

Vue.component('header-find', {
	template: HeaderHtml3,
	props: {
		nav: {
			default: 0
		},
		navShow:{
			default:true
		},
		headerType:{
			default:''
		},
		headerList:{
			default:[]
		},
		headerAllList:{
			default:[]
		},
		type:{
			default:''
		},
		categoryClass:{
			default:1
		}
	},
	data: function () {
		return {
			focusShow:false,
			slideState:false,
			headerName:'',
			headerTx:'',

			options: [{
				value: '1',
				label: '宝贝'
			},{
				value: '2',
				label: '店铺'
			}],
			ctype:'1',
			searchTx:'',
			cartNum:'',
			searchList:[],
			isMore:false

		}
	},
	computed:{

	},
	mounted: function () {
		if(this.headerType==1){
			this.headerName='领券中心';
			this.headerTx='为你推荐'
		}else if(this.headerType==2){
			this.headerName='发现';
			this.headerTx='为你推荐'
		}else if(this.headerType==3){
			this.headerName='新品首发';
			this.headerTx='人气新品'
		}else if(this.headerType==4){
			this.headerName='拼团定制';
			this.headerTx='人气新品'
		}else if(this.headerType==5){
			this.headerName='积分商城';
			this.headerTx='为你推荐'
		}else if(this.headerType==6){
			this.headerName='排行榜';
			this.headerTx='人气新品'
		}

		if(localStorage['userToken']){
			$.checkUser();
			this.getNum();
		}

	},
	methods: {
		navState:function(){
			var _this=this;
			_this.slideState=!_this.slideState;
		},
		goShopCart:function(  )
		{
			$.checkUser();
			window.location.href='shopping_cart.html'

		},
		// 获取焦点
		iptfocus:function(  )
		{
			this.focusShow=true;
			this.getSearchList();
		},
		// 失焦
		iptblur:function(  )
		{
			this.focusShow=false;
			var input = document.getElementById("search");
			input.blur();
		},

		//购物车数量
		getNum:function( )
		{
			var _this=this;
			$._ajax({
				url:  'order/cart_number',
				type:'get',
			}).done(function(data){
				_this.cartNum=data.cartNum
			}).always(function () {
			});
		},

		//搜索关键词
		getSearchList:function(  )
		{
			var _this=this;
			$._ajax({
				url:  'common/search_keyword',
				type:'get',
				data:{
					type:_this.ctype,
					name:_this.searchTx
				}
			}).done(function(data){
				_this.searchList=data
			}).always(function () {
			});

		},

		// 搜索
		search:function(  )
		{
			// if(!this.searchTx){return false;}
			if(this.ctype ==1){
				var href='product_list.html?type=1&searchTx='+ plus.base64encode(this.searchTx);
				window.open(href);
			}else{
				var href='store_list.html?type=2&searchTx='+ plus.base64encode(this.searchTx);
				window.open(href);
			}
		},

		goList:function( item )
		{
			console.log(item)
			if(this.categoryClass==1){
				this.$parent.getList(item);
			}else{
				if(this.headerType==1){
					var href='coupon_list.html?type='+(item ==-1?-1:item.id);
					window.open(href);
				}else if(this.headerType==2){
					if(item !=-1){
						var href='product_list.html?category='+plus.base64encode(JSON.stringify(item));
						//window.open(href);
						window.location.href = href;
					}
				}else if(this.headerType==3){
					var href='new_list.html?type='+(item ==-1?-1:item.id);
					window.open(href);
				}else if(this.headerType==4){
					var href='group_list.html?type='+(item ==-1?-1:item.id);
					window.open(href);
				}else if(this.headerType==5){
					var href='points_mall.html?type='+(item ==-1?-1:item.id);
					window.open(href);
				}else if(this.headerType==6){
					var href='ranking_list.html?type='+(item ==-1?-1:item.id);
					window.open(href);
				}
			}
		},
		handleCommand:function( command )
		{
			if(this.headerType==1){
				var href='coupon_list.html?type='+command;
				window.open(href);
			}else if(this.headerType==2){

			}else if(this.headerType==3){
				var href='new_list.html?type='+command;
				window.open(href);
			}else if(this.headerType==4){
				var href='group_list.html?type='+command;
				window.open(href);
			}else if(this.headerType==5){
				var href='points_mall.html?type='+command;
				window.open(href);
			}else if(this.headerType==6){
				var href='ranking_list.html?type='+command;
				window.open(href);

			}
		}

	},
	watch:{

		headerList:function( val )
		{
			var num=0
			for(var key in this.headerList){
				var item=this.headerList[key];
				num=num+item.name.length*14+30
			}
			if(num>930){
				this.isMore=true;
			}
		}
	}
})

// 头部5 积分商城使用
var HeaderHtml4 = '<div class="header bgfff">\
					<div class="wid1190 header-cen">\
						<div class="f-cb ">\
						<a href="index.html"><img src="static/img/logo.png" class="fl mt15 ml15 mr30"></a>\
						<div class="fl fsize24 co99 wid160 lh100">{{headerName}}</div>\
						<div class="fl  ml18 mt35" v-if="navShow">\
							<div class="pb5" @mouseleave="iptblur">\
								<div class="rel fsize12 header-seach brad20 wid510 ">\
									<div class="lh20 wid70 abs bor-ri center co66 left-0 top-cen" style="display:none">\
										<div class="cursor">{{options[ctype-1].label}} <img src="static/img/head_ico1.png"  class="vertical2"></div>\
										<div class="w100 abs opa0 top-0 left-0">\
											<el-select v-model="ctype" placeholder="请选择"><el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option></el-select>\
										</div>\
									</div>\
									<input type="text" autocomplete="off" id="search" v-model="searchTx" placeholder="试一下您心动的关键字吧" @keyup.enter="search" @focus="iptfocus"  class="h35 pl20 pr80 fsize12 brad20 w100 header-seach-ipt">\
									<div class="abs cofff bge42008 brad20 top-0 right-0 center wid70 lh35 fsize16 cursor" @click="search">搜索</div>\
									<div class="abs header-seach-text brad4  pt10 pb10" v-if="focusShow&&searchList"><div v-for="(item,index) in searchList" @click="searchTx=item.name;search()" class="pd15 cursor row1" :class="index==0?\'on\':\'co999\'">{{item.name}}</div></div>\
								</div>\
							</div>\
				 		</div>\
						<div  @click="goShopCart" class="fr brad20 bor lh36 pr12 pl25 mt35 mr40 f-cb cursor" v-if="navShow">\
							<img src="static/img/head_ico3.png"  class="vertical-4 mr5">购物车\
							<span class="bge42008 cofff brad20 ml12 fr lh20 mt8 pl5 pr5">{{cartNum}}</span>\
						</div>\
					</div>\
					<div class="f-cb">\
						<div class="fl header-nav lh40 wid1120 rel " :class="slideState?\'\':\'h40 ovh\'">\
							<div @click="goList(-1)" class="fl wid160 bge42008 cofff cursor center">{{headerTx}}</div>\
							<div @click="goList(item)" class="fl wid160 center rel header-nav-item hovere42008 cursor" :class="type==item.id?\'coe42008\':\'\'" v-for="item in headerList">{{item.name}}</div>\
						</div>\
						<div class="fr pr20 lh40 arr-top cursor text-none" v-if="headerList.length>6" :class="slideState?\'on\':\'\'" @click="navState">更多</div>\
					</div>\
				</div>\
			</div>'

Vue.component('header-finds', {
	template: HeaderHtml4,
	props: {
		nav: {
			default: 0
		},
		navShow:{
			default:true
		},
		headerType:{
			default:''
		},
		headerList:{
			default:[]
		},
		headerAllList:{
			default:[]
		},
		type:{
			default:''
		}
	},
	data: function () {
		return {
			focusShow:false,
			slideState:false,
			headerName:'',
			headerTx:'',

			options: [{
				value: '1',
				label: '宝贝'
			},{
				value: '2',
				label: '店铺'
			}],
			ctype:'1',
			searchTx:'',
			cartNum:'',
			searchList:[]

		}
	},
	computed:{

	},
	mounted: function () {
		if(this.headerType==1){
			this.headerName='领券中心';
			this.headerTx='为你推荐'
		}else if(this.headerType==2){
			this.headerName='发现';
			this.headerTx='为你推荐'
		}else if(this.headerType==3){
			this.headerName='新品首发';
			this.headerTx='人气新品'
		}else if(this.headerType==4){
			this.headerName='拼团定制';
			this.headerTx='人气新品'
		}else if(this.headerType==5){
			this.headerName='积分商城';
			this.headerTx='为你推荐'
		}else if(this.headerType==6){
			this.headerName='排行榜';
			this.headerTx='人气新品'
		}

		if(localStorage['userToken']){
			$.checkUser();
			this.getNum();
		}

	},
	methods: {
		navState:function(){
			var _this=this;
			_this.slideState=!_this.slideState;
		},
		goShopCart:function(  )
		{
			$.checkUser();
			window.location.href='shopping_cart.html'

		},
		// 获取焦点
		iptfocus:function(  )
		{
			this.focusShow=true;
			this.getSearchList();
		},
		// 失焦
		iptblur:function(  )
		{
			this.focusShow=false;
			var input = document.getElementById("search");
			input.blur();
		},

		//购物车数量
		getNum:function( )
		{
			var _this=this;
			$._ajax({
				url:  'order/cart_number',
				type:'get',
			}).done(function(data){
				_this.cartNum=data.cartNum
			}).always(function () {
			});
		},

		//搜索关键词
		getSearchList:function(  )
		{
			var _this=this;
			$._ajax({
				url:  'common/search_keyword',
				type:'get',
				data:{
					type:_this.ctype,
					name:_this.searchTx
				}
			}).done(function(data){
				_this.searchList=data
			}).always(function () {
			});

		},

		// 搜索
		search:function(  )
		{
			// if(!this.searchTx){return false;}
			if(this.ctype ==1){
				var href='product_list.html?type=1&searchTx='+ plus.base64encode(this.searchTx);
				window.open(href);
			}else{
				var href='store_list.html?type=2&searchTx='+ plus.base64encode(this.searchTx);
				window.open(href);
			}
		},

		goList:function( item )
		{
			if(this.headerType==1){
				var href='coupon_list.html?type='+(item ==-1?-1:item.id);
				window.open(href);
			}else if(this.headerType==2){
				if(item !=-1){
					var href='product_list.html?category='+plus.base64encode(JSON.stringify(item));
					window.open(href);
				}
			}else if(this.headerType==3){
				var href='new_list.html?type='+(item ==-1?-1:item.id);
				window.open(href);
			}else if(this.headerType==4){
				var href='group_list.html?type='+(item ==-1?-1:item.id);
				window.open(href);
			}else if(this.headerType==5){
				var href='points_mall.html?type='+(item ==-1?-1:item.id);
				window.open(href);
			}else if(this.headerType==6){
				var href='ranking_list.html?type='+(item ==-1?-1:item.id);
				window.open(href);
			}
		},
		handleCommand:function( command )
		{
			if(this.headerType==1){
				var href='coupon_list.html?type='+command;
				window.open(href);
			}else if(this.headerType==2){

			}else if(this.headerType==3){
				var href='new_list.html?type='+command;
				window.open(href);
			}else if(this.headerType==4){
				var href='group_list.html?type='+command;
				window.open(href);
			}else if(this.headerType==5){
				var href='points_mall.html?type='+command;
				window.open(href);
			}else if(this.headerType==6){
				var href='ranking_list.html?type='+command;
				window.open(href);

			}
		}

	},
	watch:{


	}
})

// <div class="fl fsize16 header-top-fl rel cursor">{{info.name}} <img src="static/img/head_ico1.png" class="ml5 mr10 img1"><img src="static/img/list_ico7.png" @click="goService" class="img2">\
// 店铺头部
var storeHtml = '<div class="store-header bgfff">\
					<div class="store-header-top wid1190 f-cb">\
						<a class="fl logo rel ml33" :href="\'store.html?company=\'+mycompanyId"><img :src="info.logo?info.logo.url:\'\'" class="img-cover block"></a>\
						<div class="fl fsize16 header-top-fl rel cursor">\
							<div>\
								<div class="flex-top">\
									<span>{{info.name}}</span> <img src="static/img/head_ico1.png" class="ml5 mr10 img1 mt8"><img src="static/img/list_ico7.png" @click="goService" class="img2"></img>\
								</div>\
								<div class="fsize12">星级：<div class="store-header-star rel"><div :style="\'width: \'+ info.totalAvg/5*82 +\'px\'"></div></div></div>\
								<div class="fsize12">粉丝数：{{info.collect}}</div>\
							</div>\
							<div class="abs header-top-fl-box bgfff fsize14 co66 lh24 ">\
								<div class="f-cb bor-bof2f4f6 pb10">\
									<img :src="info.logo?info.logo.url:\'\'" class="img-cover fr img">\
									<div class="pt5">服务承诺：正品保障  <span class="fsize12 ml5 in-block ico">正</span></div>\
									<div>客服电话：{{info.kefu}}</div>\
									<div>星级：<div class="store-header-star rel"><div :style="\'width: \'+ info.totalAvg/5*82 +\'px\'"></div></div></div>\
									<div>粉丝数：{{info.collect}}</div>\
								</div>\
								<div class="cofff lh40 f-cb center pt10">\
									<a :href="\'store.html?company=\'+company" target="_blank" class="mr10 cofff header-top-btn fl bg363636 "><span class="list-ico ico1"></span>店铺首页</a>\
									<div class="header-top-btn bge42008 fl" @click="collectInfo"><span class="list-ico  " :class="isCollect==1?\'ico3\':\'ico2\'"></span>{{isCollect==1?\'取消收藏\':\'收藏店铺\'}}</div>\
								</div>\
							</div>\
						</div>\
						<div class="fr mt20 mr30">\
							<div class="mr5 header-top-ipt rel fl"><input type="text" v-model="searchTx" class="w100" @keyup.enter="search(1)"/><div class="bge42008 cofff center cursor btn abs"  @click="search(1)">搜全站</div></div>\
							<div class="cofff center cursor bg00a1ec btn fl" @click="search(2)">搜本店</div>\
						</div>\
					</div>\
					<div class="bg000">\
					<div class="wid1190 f-cb header-nav lh40 mt10 rel fsize16">\
						<div class="fl pr50 cofff  cursor store-header-nav-box bor-ri"><a class="cofff" target="_self" :href="\'store_prolist.html?company=\'+company">所有商品<img src="static/img/head_ico5_1.png"  class="vertical-2 ml12 "></a>\
							<div class="abs store-header-nav f-cb lh24 pt10 pb10">\
								<div class="fl item pd15 mb10" v-for="item in typeList">\
									<div class="co33 bor-bof2f4f6 mb5 fsize14">{{item.name}}</div>\
									<div class="fsize12 co66 hovere42008 " @click="goList(it)" v-for="it in item.more">{{it.name}}</div>\
								</div>\
							</div>\
						</div>\
						<div @click="goList(item)" class="fl cursor cofff rel ml50 header-nav-item hovere42008" v-for="item in navList">{{item.name}}</div>\
					</div>\
					</div>\
				</div>'

Vue.component('header-store', {
	template: storeHtml,
	props: {
		nav: {
			default: 0
		},

		headerType:{
			default:''
		},
		shopCollect:{
			default:''
		},
		storyInfo:{
			default:''
		}
	},
	data: function () {
		return {
			navList:[],
			hnavShow:false,
			company:plus.getUrlParam('company')?plus.getUrlParam('company'): '',
			searchTx:'',
			info:'',
			isCollect:'',
			typeList:[],
			colors:['#e42008', '#e42008', '#e42008', '#e42008', '#e42008'],
			mycompanyId:'',//店铺id
		}

	},
	computed:{
		
	},
	mounted: function () {
		this.mycompanyId = window.location.href.split('company=')[1].split('&')[0];

		if(!this.storyInfo){
			this.getInfo()
		}else{
			this.info=this.storyInfo;
			this.isCollect=this.storyInfo.isCollect
		}
		this.getTypeList()
		this.getTopList()

	},
	methods: {

		// 显示子导航
		showNav:function( e )
		{
			this.hnavShow=e==1?true:false;
		},

		//店铺信息
		getInfo:function(  )
		{
			var _this=this;
			$._ajax({
				url:  'common/company_story',
				type:'get',
				data:{
					company:_this.company
				}
			}).done(function(data){
				_this.info=data;
				_this.isCollect=data.isCollect
			}).always(function () {
			});
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
					id:_this.company,
					type:3//1-收藏商品 2-收藏积分商品 3-收藏店铺
				})
			}).done(function(data){
				_this.isCollect=_this.isCollect==0?1:0;

				_this.$emit('enlarge-text', _this.isCollect)
			}).always(function () {
				_this.$loading().close();
			});
		},



		//推荐类别
		getTopList:function(  )
		{
			var _this=this;
			$._ajax({
				url:  'common/get_flag_category',
				type:'get',
				data:{
					company:_this.company
				}
			}).done(function(data){
				var list=[{id:'',name:'首页'}]
				if(data){
					for(var key in data){
						list.push(data[key])
					}
				}
				list.push({id:'',name:'品牌故事'})
				_this.navList=list
			}).always(function () {

			});

		},

		// 搜索
		search:function( e )
		{
			if(e ==1){
				var href='product_list.html?type=1&searchTx='+ plus.base64encode(this.searchTx);
				//window.open(href);
				window.location.href = href;
			}else{
				var href='store_prolist.html?company='+this.company+'&searchTx='+ plus.base64encode(this.searchTx);
				//window.open(href);
				window.location.href = href;
			}
		},

		//全部类别
		getTypeList:function(  )
		{
			var _this=this;
			$._ajax({
				url:  'common/get_category',
				type:'get',
				data:{
					company:_this.company
				}
			}).done(function(data){
				_this.typeList=data;
			}).always(function(){
			});

		},

		//跳转列表
		goList:function( item )
		{
			if(item.name=='首页'){
				var href='store.html?company='+this.company;
				//window.open(href);
				window.location.href = href;
			}else if(item.name=='品牌故事'){
				var href='store_about.html?company='+this.company;
				window.open(href);
			}else{
				var href='store_prolist.html?company='+this.company+'&category='+plus.base64encode(JSON.stringify(item));
				window.open(href);
			}
		},


		goService:function(  )
		{
			var _this=this;
			ysf('open', {
			});
		}
	},
	watch:{
		shopCollect:function( val )
		{
			this.isCollect=val;
		}

	}
})