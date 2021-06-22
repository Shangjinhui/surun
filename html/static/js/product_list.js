
;(function () {
	var app = new Vue({
		el: '#app',
		data: {
			category:plus.getUrlParam('category')?JSON.parse(plus.base64decode(plus.getUrlParam('category'))):'',
			selectList:[],
			arrays:[], //存储选中状态
			crowds:[
				{
					id:'1',
					name:'男士'
				},
				{
					id:'2',
					name:'女士'
				},
				{
					id:'3',
					name:'情侣'
				},
				{
					id:'4',
					name:'儿童'
				},
				{
					id:'0',
					name:'通用'
				},
			], // 适用人群 Applicable people
			crowd:'0',
			ages:[
				{
					id:'1',
					name:'3岁以下'
				},
				{
					id:'2',
					name:'3-8岁'
				},
				{
					id:'3',
					name:'8-13岁'
				},
				{
					id:'4',
					name:'13-18岁'
				},
				{
					id:'5',
					name:'18-30岁'
				},
				{
					id:'6',
					name:'30-40岁'
				},
				{
					id:'7',
					name:'40-50岁'
				},
				{
					id:'8',
					name:'50岁以上'
				},
				{
					id:'0',
					name:'通用'
				},
			], // 适用年龄 Applicable age
			page:1,
			limit:10,
			min:'',
			max:'',
			sale:'', //1是倒叙
			price:'', //价格排序 1-降序 2-升序
			people:'0',
			age:'0',
			name:'',
			cate:'',
			init_Sort:true,
			searchTx:plus.getUrlParam('searchTx')?plus.base64decode(plus.getUrlParam('searchTx')):'',
			list:[],
			count:0,
			pState:false,

			info:''
		},
		mounted: function(){
			var _this=this;
			_this.getajax();
			// Vue.nextTick(function(){})
			window.carNum=function carNum($this){
		        var value = $this.val();
		        var re = /^[0-9]*[1-9][0-9]*$/;
		        if(re.test(value)){
		        	$this.val(parseInt(value));
		        }else{
		        	$this.val();
		        }
		    }
		    $('#app').on('click',function(event){
		    	event.stopPropagation();
		    	var time=setTimeout(function(){
		    		clearTimeout(time);
		    		_this.pState=false;
		    	},150)
		    })
		    $('#app').on('click','.price_input',function(event){
		    	event.stopPropagation();
				_this.pState=true;
		    })

			if(localStorage['userToken'])
			{
				if( localStorage[ 'userInfo' ] )
				{
					_this.info = $.getUser();
				}
			}


		},
		methods:{

			goService:function( groupId )
			{
				var _this=this;
				//配置客服
				ysf( 'config', {
					uid: _this.info ? _this.info.id : "",
					name: _this.info? _this.info.nickname : '',
					email: _this.info.email ? _this.info.email : '',
					mobile: _this.info ? _this.info.tel : '',
					groupid:groupId,
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

			getajax:function(){
				var _this=this;
				$._ajax({
					url:'common/get_attr',
					type:'get',
					data:{
						id:_this.category.id?_this.category.id:'', 
					},
				}).done(function(data){
					if(data.length>0){
						var array=data;
						for(let i=0;i<data.length;i++){
							var value=[];
							array[i].isMultiple=true;
							array[i].more=false;
							for(let key in data[i].value){ //改变数据结构
								var obj={
									name:'',
									state:false,
								}
								obj.name=data[i].value[key];
								value.push(obj);
							}
							data[i].value=value;
							var arr={ 
								id:data[i].id,
								value:[]
							}
							_this.arrays.push(arr); //创建一个新的选中容器结构
						}
						_this.selectList=array;
						var list=this.selectList;
						var newList=[]
						for(var key in list){
							var item=list[key];
							var wid=0;
							for(var listkey in item.list){
								var listitem=item.list[listkey];
								wid=wid+listitem.length*14+30
							}
							if(wid>944){
								item.isMore=true;
								item.isShow=false;
							}else{
								item.isMore=false;
								item.isShow=false;
							}
							newList.push({
								name:item.name,
								isMultiple:item.isMultiple,
								isMore:item.isMore,
								list:item.list,
								isShow:item.isShow
							})
						}
						this.selectList=newList;
					}
					_this.getlist();
				}).always(function(){
				});
			},
			getlist:function(){
				var _this=this,attr='',att=[];
				for(let i=0;i<_this.arrays.length;i++){
					var arr=_this.arrays[i].id+'#',val=[];
					for(let j=0;j<_this.arrays[i].value.length;j++){
						val.push(_this.arrays[i].value[j])
					}
					if(val.length){
						val=val.join('/');
						arr=arr+val;
						att.push(arr);
					}
				}
				if(att.length){
					var attrs=att.join('&');
					attr=_this.encode(attrs);
				}
				var name = '';
				if(_this.searchTx){
					name = _this.searchTx;
				}
				var data={
					page:_this.page,	//页码	String	true
					limit:_this.limit,	//条数	String	true
					min:_this.min,	//最小价格	String	true
					max:_this.max,	//最大价格	String	true
					sale:_this.sale,	//销量排序	String	true
					price:_this.price,	//价格排序 1-降序 2-升序	String	true
					people:_this.crowd,	//适用人群	String	true
					age:_this.age,		//适用年龄	String	true
					attr:attr,	//属性 （例：12#白色/黑色&16#M/L）	String	true
					name:name,	//名称	String	true
					cate:_this.category.id,	//类别
				}
				$._ajax({
					url:'common/goods_list',
					type:'get',
					data:data,
				}).done(function(data){
					if(data){
						_this.list=data.result;
						_this.count=data.count;
					}
				}).always(function(){
				});
			},
			//页面排序
			sort:function(e){
				var _this=this;
				if(e==1){
					_this.init_Sort=true;
					_this.sale='';
					_this.price='';
				}else if(e==2){
					if(_this.sale==2){
						_this.sale=1;
					}else if(_this.sale==1){
						_this.sale=2;
					}else{
						_this.sale=1;
					}
					_this.init_Sort=false;
					_this.price='';
				}else{
					if(_this.price==2){
						_this.price=1;
					}else if(_this.price==1){
						_this.price=2;
					}else{
						_this.price=1;
					}
					_this.init_Sort=false;
					_this.sale='';
				}
				console.log(_this.sale)
				_this.getlist();
			},
			//是否多选
			toggleMore:function(e){
				var _this=this,list=_this.selectList[e].value;
				_this.selectList[e].more=!_this.selectList[e].more;
				if(!_this.selectList[e].more){
					_this.arrays[e].value=[];
					list.forEach((item,index)=>{
					    _this.selectList[e].value[index].state=false;
					})
				}
			},
			//筛选
			multiple:function(item,ind,index){
				var _this=this,value=_this.selectList[index].value,list=_this.selectList;
				if(list[index].more){ //多选
					var array=_this.arrays[index].value;
					_this.selectList[index].value[ind].state=!_this.selectList[index].value[ind].state; //先改变状态-再根据状态添加删除
					if(_this.selectList[index].value[ind].state){ //选中
						_this.arrays[index].value.push(_this.selectList[index].value[ind].name);
					}else{
						var arr=[];
						array.forEach((it) => {
						    if(it!=item.name){
						    	arr.push(it);
						    }
						})
						_this.arrays[index].value=arr;
					}
				}else{//单选
					for(var i=0;i<value.length;i++){
						if(i==ind){
							_this.selectList[index].value[ind].state=!_this.selectList[index].value[ind].state;
							if(list[index].value[ind].state){
								_this.arrays[index].value=[];
								_this.arrays[index].value.push(_this.selectList[index].value[ind].name);
							}else{
								_this.arrays[index].value=[];
							}
						}else{
							_this.selectList[index].value[i].state=false;
						}
					}
				}
				_this.getlist();
			},
			// 查看更多
			showMore:function(idx){
				this.selectList[idx].isShow=!this.selectList[idx].isShow
			},
			encode : function (string){
				return escape(this._utf8_encode(string));
			}
			,
			// public method for url decoding
			decode : function (string){
				return this._utf8_decode(unescape(string));
			}
			,
			// private method for UTF-8 encoding
			_utf8_encode : function (string){
				string = string.replace(/\r\n/g,"\n");
				var utftext = "";
				for (var n = 0; n < string.length; n++){
					var c = string.charCodeAt(n);
					if (c < 128){
						utftext += String.fromCharCode(c);
					}
					else
					if((c > 127) && (c < 2048)){
						utftext += String.fromCharCode((c >> 6) | 192);
						utftext += String.fromCharCode((c & 63) | 128);
					}
					else{
						utftext += String.fromCharCode((c >> 12) | 224);
						utftext += String.fromCharCode(((c >> 6) & 63) | 128);
						utftext += String.fromCharCode((c & 63) | 128);
					}
				}
				return utftext;
			}
			,
			// private method for UTF-8 decoding
			_utf8_decode : function (utftext){
				var string = "";
				var i = 0;
				var c = c1 = c2 = 0;
				while ( i < utftext.length ){
					c = utftext.charCodeAt(i);
					if (c < 128){
						string += String.fromCharCode(c);
						i++;
					}
					else
					if((c > 191) && (c < 224)){
						c2 = utftext.charCodeAt(i+1);
						string += String.fromCharCode(((c & 31) << 6) | (c2 & 63));
						i += 2;
					}
					else{
						c2 = utftext.charCodeAt(i+1);
						c3 = utftext.charCodeAt(i+2);
						string += String.fromCharCode(((c & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
						i += 3;
					}
				}
				return string;
			},
		},
		watch:{
			crowd:function( val )
			{
				this.page=1
				this.getlist();
			},
			age:function( val )
			{
				this.page=1
				this.getlist();
			}
		}
	});
})()

