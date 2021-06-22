// 公共头部
var headerTopHtml = '<div class="w-220 fl">\
	<div class="w-100b shadow f-12 pt-17 pb-25 bg-fff mb-20">\
		<a href="center.html" class="h-38 lh-38 pl-30 mb-4 block nav-hover por" :class="nav==0?\'on\':\'\'">个人信息</a>\
		<a href="c_order.html" class="h-38 lh-38 pl-30 mb-4 block nav-hover por" :class="nav==1?\'on\':\'\'">我的订单</a>\
		<a href="c_collection.html" class="h-38 lh-38 pl-30 mb-4 block nav-hover por" :class="nav==2?\'on\':\'\'">我的收藏</a>\
		<a href="c_address.html" class="h-38 lh-38 pl-30 mb-4 block nav-hover por" :class="nav==3?\'on\':\'\'">收货地址</a>\
		<a href="c_integral.html" class="h-38 lh-38 pl-30 mb-4 block nav-hover por" :class="nav==5?\'on\':\'\'">我的积分</a>\
		<a href="c_coupons.html" class="h-38 lh-38 pl-30 mb-4 block nav-hover por" :class="nav==6?\'on\':\'\'">我的优惠券</a>\
		<a href="c_exchange.html" class="h-38 lh-38 pl-30 mb-4 block nav-hover por" :class="nav==7?\'on\':\'\'">我的兑换</a>\
		<a href="c_password.html" class="h-38 lh-38 pl-30 mb-4 block nav-hover por" :class="nav==8?\'on\':\'\'">修改密码</a>\
		<a href="c_information.html" class="h-38 lh-38 pl-30 mb-4 block nav-hover por" :class="nav==9?\'on\':\'\'">消息中心</a>\
	</div>\
	<img src="static/img/center-img1.jpg" class="auto w-93 block h-61 ">\
</div>'

Vue.component('center-nav', {
	template: headerTopHtml,
	props: {
		nav: {
			default: 0
		},
	},
	data: function () {
		return {

		}
	},
	computed:{
	},
	mounted: function () {
		$.checkUser();
	},
	methods: {

	},
	watch:{


	}
})
