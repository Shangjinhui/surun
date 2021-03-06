var myFooterHtml = '<div>\
		<div class="footer bgfff">\
			<div class="wid1190">\
				<div class="footer-top fsize16 f-cb">\
					<div class="fl wid330"><div><img src="static/img/foot_ico4.png" alt="">厂家直营　正品保证</div></div>\
					<div class="fl wid330"><div><img src="static/img/foot_ico5.png" alt="">品牌　品质　品位</div></div>\
					<div class="fl wid320"><div><img src="static/img/foot_ico6.png" alt="">品质生活　个性定制</div></div>\
					<div class="fr wid205"><div><img src="static/img/foot_ico7.png" alt="">拼团定制　畅选无忧</div></div>\
				</div>\
				<div class="f-cb lh24 co99 footer-nav pt30 pb50">\
					<div class="fl" :class="{wid190:index!=4,wid170:index==4}" v-for="(item,index) in list">\
						<div class="co33">{{item.title}}</div>\
						<div class="tt" v-for="(it,ind) in item.list">\
							<div class="cursor" :class="hoverLine==it.title?\'on\':\'\'" @mouseenter="hoverLine=it.title" @mouseleave="hoverLine=\'\'" @click="link_page(item.title,item.id,it.title,it.id,index,ind)" >{{it.title}}</div>\
						</div>\
					</div>\
					<div class="fr fsize12  ml40">\
						<img src="static/img/ewm.jpg" class="block mb5 wid100">\
						<div class="center lh18">扫一扫  下载APP</div>\
					</div>\
					<div class="fr fsize12  ">\
						<img src="static/img/ewm.jpg" class="block mb5 wid100">\
						<div class="center lh18">扫一扫  加关注</div>\
					</div>\
				</div>\
			</div>\
			<div class="bg363636 center cofff pt20 pb10">\
				<div class="wid1190 fsize12 lh24">\
					<div class="opa6">\
						<a class="cofff" v-for="(item,index) in friendLink" :key="index" :href="item.content"><span v-if="index!=0"> | </span>{{item.title}}</a>\
					</div>\
					<div class="opa6">隐私政策-苏润易购</div>\
					<div class="opa6">苏润云商版权所有©2019   浙ICP备16011111号-6</div>\
					<div class="opa6">消费者维权热线：400-880-8090 |  浙公网安备 3112340459号 | 出版物经营许可证 | 增值电信业务经营许可证</div>\
					<div class="mt-10">\
						<img src="static/img/center-img37.png" alt="" class="mr-15"><img src="static/img/center-img38.png" alt=""  class="mr-15"><img src="static/img/center-img39.png" alt="">\
					</div>\
				</div>\
			</div>\
		</div>\
   </div>'

Vue.component('my-footer', {
    template: myFooterHtml,
    props: ['noShow','current'],
    data: function () {
        return {
            info:'',
			name:'',
			phone:'',
			content:'',
			fixTopShow:false,
			list:[],
			hoverLine:'',     //加下划线突出
			friendLink:[]     //友情链接列表
        }
    },
    computed:{

    },
    mounted: function () {

    	/*var _this=this;
        if(localStorage['bottomInfo']){
        	if(location.pathname=='/surun_copyright/html/index.html'){
				_this.getBottom();
			}else{
				_this.info = JSON.parse(localStorage['bottomInfo'])
			}
        }else{
			_this.getBottom();
        }

		*/
		this.getFooter();
		//获取友情链接
		this.getFriendLink();
    },
    methods: {
		getFriendLink(){
			const that = this;
			$._ajax({
				url:'common/get_links',
				type:'get',
			}).done(function(data){
				that.friendLink = data||[];
				
			}).always(function () {
			});
		},
		//	底部栏
		getBottom:function(  )
		{
			var _this = this;
			$._ajax({
				url: 'common/bottom',
				type:'get'
			}).done(function(data){
				_this.info = data;
				localStorage['bottomInfo'] =JSON.stringify(data);
			}).always(function () {

			});
		},

        //平台反馈
		feedback:function(  )
		{
			var _this=this;
			if(!_this.name){
				$.oppo('请输入您的姓名');
				return false;
			}
			if(!_this.phone){
				$.oppo('请输入您的联系方式');
				return false;
			}
			if(!$.checkMob(_this.phone)){return false;}
			if(!_this.content){
				$.oppo('请输入您的建议或意见');
				return false;
			}
			_this.$loading();
			$._ajax({
				url: 'common/feedback',
				type:'post',
				data:JSON.stringify({
					name:_this.name,
					phone:_this.phone,
					content:_this.content
				})
			}).done(function(data){
				_this.name='';
				_this.phone='';
				_this.content='';
				$.oppo('提交成功');
			}).always(function () {
				_this.$loading().close();
			});
		},

		goService:function(  )
		{
			ysf('open', {
				templateId:123
			});
		},
		getFooter:function(){
			var _this=this;
			$._ajax({
				url: 'other/list',
				type:'get',
				data:{
					id:''
				},
			}).done(function(data){
				_this.list=data.data;
			}).always(function () {
			});
		},
		link_page:function(title,id,tit,it_id,subtitle,subtit){
			var data=JSON.stringify({
				title_id:id,
				title:title,
				tit_id:it_id,
				tit:tit,
				subtitle:subtitle,
				subtit:subtit,
			});
			data=$.base64encode(data);
			//window.location.href="hlep.html?data="+data;
			var href="hlep.html?data="+data;
			window.open(href);
		}
    }
})


var fixedHtml = '<div class="fixed-top center fsize12 co66" :style="\'right:\'+rightIn">\
						<div @click="goInfo()" v-if="!onlyService&&!info"><img src="static/img/fix_ico1.png" alt=""><div>登录</div></div>\
						<div @click="goInfo(\'center.html\')" v-if="!onlyService&&info"><img src="static/img/fix_ico1.png" alt=""><div>个人中心</div></div>\
						<div @click="sign" v-if="!onlyService&&!isSign"><img src="static/img/fix_ico2.png" alt=""><div>签到</div></div>\
						<div @click="goInfo(\'shopping_cart.html\')" v-if="!onlyService" class="rel"><img src="static/img/fix_ico3.png" alt=""><div><span class="abs num" v-if="cartNum>0">{{cartNum}}</span>购物车</div></div>\
						<div @click="goInfo(\'c_collection.html\')" v-if="!onlyService"><img src="static/img/fix_ico4.png" alt=""><div>收藏</div></div>\
						<div @click="goService "><img src="static/img/fix_ico5.png" alt=""><div>客服</div></div>\
						<div v-if="fixTopShow&&!onlyService" @click="fixTop"><img src="static/img/fix_ico6.png" alt=""><div>回顶部</div></div>\
					</div>'

Vue.component('fixed-top', {
	template: fixedHtml,
	props: {
		onlyService:{
			default:false
		},
		groupId:{
			default:''
		}
	},
	data: function () {
		return {
			fixTopShow:false,
			rightIn:'',
			info:'',
			isSign:false,
			cartNum:null

		}
	},
	computed:{

	},
	mounted: function () {
		var _this=this;
		// if(document.body.offsetWidth>1370){
		// 	_this.rightIn= (document.body.offsetWidth-1190)/2-76+'px'
		// }else{
		// 	_this.rightIn='5%'
		// }

		Vue.nextTick(function(  )
		{
			$(window).scroll(function(  )
			{
				var top=$(window).scrollTop();
				if(top>400){
					_this.fixTopShow=true;
				}else{
					_this.fixTopShow=false;

				}
			})
		})

		if(localStorage['userToken'])
		{
			if( localStorage[ 'userInfo' ] )
			{
				_this.info = $.getUser();
			}
			else
			{
				_this.getInfo();
			}

			if(!localStorage['signTime']||$.fdateTime(new Date(),'yyyy-MM-dd')!=localStorage['signTime']){
				this.getSign()
			}else{
				this.isSign=true
			}

			this.getNum();


		}



		//配置客服
		ysf( 'config', {
			uid: _this.info ? _this.info.id : "",
			name: _this.info? _this.info.nickname : '',
			email: _this.info.email ? _this.info.email : '',
			mobile: _this.info ? _this.info.tel : '',
			groupid:_this.groupId?_this.groupId:'398415660',
			success: function()
			{
				// todo
			},
			error: function()
			{
				// handle error
			}
		} );



	},
	methods: {
		goInfo:function( e )
		{
			$.checkUser();
			if(e){
				// window.location.href=e;
				window.open(e);
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

		fixTop:function(  )
		{
			Vue.nextTick(function(  )
			{
				$( "html,body" ).stop().animate( { "scrollTop": 0 }, 800 );
			})
		},

		goService:function(  )
		{
			var _this=this;
			ysf('open', {
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


	}
})