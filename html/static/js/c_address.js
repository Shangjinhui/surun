;(function () {

	var app = new Vue({
		el: '#app',
		data: {
			nav:3,

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

			provinceList:[],
			cityList:[],
			areaList:[],

	        checked:false,
			isSee:false

		},
		mounted: function () {
			var _this=this;
			$.checkUser();
			_this.getList();
			$.getJSON("static/public/city.json", function (data){
				_this.provinceList=data;
			})
		},
		methods:{

			//获取列表
			getList:function(  )
			{
				var _this=this;
				_this.$loading();
				$._ajax({
					url:  'member/my_address',
					type:'get',
				}).done(function(data){
					_this.list=data.data;
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
						_this.getList();
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
					this.default=val.isDefault;
					this.detail=val.detail;
					this.standby=val.standby;


			},


			//设置默认地址
			setDefault:function(e){
				var _this=this;
				_this.$loading();
				$._ajax({
					url:'member/default_address',
					type:'get',
					data: {
						id:e
					},
				}).done(function(res){
					$.oppo('操作成功',function(  )
					{
						_this.getList();
					},1)
				}).always(function () {
					_this.$loading().close();
				});
			},
			deleteInfo:function(e){
				var _this=this;
				_this.$confirm('确定删除当前地址, 是否继续?', '提示', {
		          confirmButtonText: '确定',
		          cancelButtonText: '取消',
		          type: 'warning'
		        }).then(function(  )
				{
					_this.$loading();
					$._ajax({
						url:'member/del_address',
						type:'get',
						data: {
							id:e
						},
					}).done(function(res){
						$.oppo('操作成功',function(  )
						{
							_this.getList();
						},1)
					}).always(function () {
						_this.$loading().close();
					});
				}).catch(function(  )
				{
					
				});
			}
		},
		watch:{
			province:function( val )
			{
				var _this=this;

				console.log()
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
			}
		}
	});
})()

