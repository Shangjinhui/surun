;(function () {
	var app = new Vue({
		el: '#app',
		data: {
			nav:2,
        	checkAll: false,
			info:'',
			checkList: [],
	        manage_state:false,
	        // store_num:plus.getUrlParam('store_num')?plus.getUrlParam('store_num'):1,
			store_num:1,
	        typeList:[
	        	{
	        		id:'1',
	        		name:'全部宝贝',
	        		count:0,
	        	},
	        	{
					id:'2',
					name:'失效',
	        		count:0,
	        	},
	        	{
					id:'3',
	        		name:'同店宝贝',
	        		count:0,
	        	}
	        ],
			type:'1',
			kw:'',//关键词

			showCat:false,//全部分类展示

			categoryList:[],
			categoryId:'',//商品分类编号
			oldcategoryId:null,
			list:null,
			id:''

		},
		mounted: function () {
			var _this=this;
			$.checkUser();
			if( localStorage[ 'userInfo' ] )
			{
				_this.info = $.getUser();
			}
			else
			{
				_this.getInfo();
			}
			_this.getList();
		},
		methods:{
			getList:function(  )
			{
				var _this=this;
				var data,url;
				if(_this.store_num==1){
					url =  'collect/goods'
					data=JSON.stringify({
						categoryId:_this.categoryId,
						type:_this.type,
						kw:_this.kw
					})
				}else if(_this.store_num==2){
					url =  'collect/shop'
					data=JSON.stringify({
						kw:_this.kw
					})
				}else{
					url =  'collect/point_goods'
					data=JSON.stringify({
						kw:_this.kw
					})
				}
				_this.$loading();
				$._ajax({
					url: url,
					type:'post',
					data:data
				}).done(function(data){
					if(_this.store_num==1)
					{
						_this.categoryList = data.typeData;
						_this.typeList[ 0 ].count = data.countAll;
						_this.typeList[ 1 ].count = data.countInvalid;
						_this.typeList[ 2 ].count = data.countShop;
					}
					var list=data.infoData;
					for( var key in list )
					{
						list[ key ].checked = false;
						if(_this.store_num==2){
							list[ key ].isShow = false;
						}
					}
					_this.list = list;

				}).always(function () {
					_this.$loading().close();
				});
			},

			store:function(e){
				var _this=this;
				console.log(e)
				// window.location.href='c_collection.html?store_num='+e
				_this.store_num=e;
				console.log(_this.store_num)
				_this.getList();
			},
			//商品分类
			changeType:function(e){
				var _this=this;
				if(_this.categoryId){
					_this.oldcategoryId=_this.categoryId;
				}
				if(e ==1){
					_this.categoryId=_this.oldcategoryId;
				}else{
					_this.categoryId='';
				}
				_this.type=e;
				_this.getList();

			},

			//商品类别
			changeCategory:function( item )
			{
				if(item){
					this.categoryId=item.id;
					this.typeList[0].name=item.name;

				}else{
					this.categoryId='';
					this.typeList[0].name='全部宝贝';
				}
				this.type='1';
				this.getList();
			},

			// 查看详情
			goInfo:function( idx,id,companyId )
			{
				if(this.manage_state){
					this.checkChange(idx);
				}else{
					if(this.store_num==1){
						var href='store_pro.html?id='+id+'&company='+companyId;
						window.open(href);
					}else if(this.store_num==3){
						var href='points_pro.html?id='+id;
						window.open(href);
					}
				}

			},
			goStore:function( id )
			{
				var href='store.html?id='+id;
				window.open(href);
			},

			//批量管理显示
			management:function(){
				var _this=this;
				_this.manage_state=!_this.manage_state;

				var list=this.list;
				for(var key in list){
					list[key].checked=false;
				}
				_this.checkAll=false;
				_this.list = list;
			},

			//全选
			handleCheckAllChange:function(val) {
				var _this=this;
				var list=_this.list;
				for(var key in list){
					var item=list[key];
					if(val){
						list[key].checked=true;
					}else{
						list[key].checked=false;
					}
				}
				this.list=list;


				this.checkAll=val;
			},
			checkChange :function(idx) {
				var _this=this;
				var list=this.list;
				for(var key in list){
					if(key ==idx){
						list[key].checked=!list[key].checked;
					}
				}
				_this.checkAll=false;
				_this.list = list;

		    },

			// 取消收藏
			collectInfo:function( idx,item )
			{
				var _this=this;
				var type;
				var id;
				if(_this.store_num==1){
					type=1;
				}else if(_this.store_num==2){
					type=3;
				}else{
					type=2;
				}
				if(idx ==1){
					var ids=[]
					var list=_this.list;
					for(var key in list){
						if(list[key].checked){
							ids.push(list[key].id)
						}
					}
					console.log(555)
					if(ids.length>0){
						id=ids.join(',')
					}else{
						$.oppo('请选择需要删除的数据');
						return false;
					}
				}else{
					id=item
				}
				_this.$loading();
				$._ajax({
					url:  'collect/cancel_collect',
					type:'post',
					data:JSON.stringify({
						id:id,
						type:type//1-收藏商品 2-收藏积分商品 3-收藏店铺
					})
				}).done(function(data){
					_this.getList();
				}).always(function () {
					_this.$loading().close();
				});
			},

			// 查看热销
			showPro:function( idx )
			{
				this.list[idx].isShow=!this.list[idx].isShow
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

			goService:function( id )
			{
				var _this=this;

				//配置客服
				ysf( 'config', {
					uid: _this.info ? _this.info.id : "",
					name: _this.info? _this.info.nickname : '',
					email: _this.info.email ? _this.info.email : '',
					mobile: _this.info ? _this.info.tel : '',
					groupid:id,
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
			}



		}
	});
})()

