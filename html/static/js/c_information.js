;(function () {
	var app = new Vue({
		el: '#app',
		data: {
			nav:9,
	        store_num:1,
	        list:[],
	        pageNo:1,
	        limit:5,
	        total:0,
	        count:0,
	        url:'information/information_list',
			userinfo:'',
		},
		mounted: function () {
			$.checkUser();
			this.getAjax()
			this.userinfo = $.getUser();
		},
		methods:{
			store:function(e){
				var _this=this;
				_this.store_num=e;
				_this.list=null;
				if(e==1){ //系统消息
					_this.url='information/information_list';
					_this.pageNo=1;
					_this.getAjax();
				}else if(e==2){ //平台公告
					_this.url='information/announcement_list';
					_this.pageNo=1;
					_this.getAjax();
				}else{ //互动消息
					_this.getList();
				}

			},
			//
			getAjax:function(){
				var _this=this;
				_this.$loading();
				$._ajax({
					url:_this.url,
					type:'get',
					data:{
						limit:_this.limit,
						pageNo:_this.pageNo,
					}
				}).done(function(data){
						_this.list=data.list;
						_this.total=data.count;
				}).always(function () {
					_this.$loading().close();
				});
			},
			currentPage:function(e){
				var _this=this;
				_this.pageNo=e;
				_this.getAjax();
			},
			// getList:function(){
			// 	information/announcement_list
			// },
			orderInfo:function(item){
				var _this=this;
				var href="c_order_info.html?id="+item.contactId;
				window.open(href);
			},
			getList:function(  )
			{
				var _this=this;
				_this.$loading();
				$._ajax({
					url:'member/interact',
					type:'get',
				}).done(function(data){
					for(var key in data){
						data[key].time=plus.fdateTime(data[key].time,'yyyy-MM-dd hh:mm')
					}
					_this.list=data;
				}).always(function () {
					_this.$loading().close();
				});
			},

			// 跳转客服
			goService:function( item )
			{
				var _this=this;
				//配置客服
				ysf( 'config', {
					uid: _this.userinfo ? _this.userinfo.id : "",
					name: _this.userinfo? _this.userinfo.nickname : '',
					email: _this.userinfo.email ? _this.userinfo.email : '',
					mobile: _this.userinfo ? _this.userinfo.tel : '',
					staffid:item.kefuId,
					groupid:item.kefuGroupId,
					success: function()
					{
						// todo
					},
					error: function()
					{
						// handle error
					}
				} );
				ysf('open', {
				});
			},
		}
	});
})()

