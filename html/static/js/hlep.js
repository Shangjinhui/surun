;(function () {

	var app = new Vue({
		el: '#app',
		data: {
			info:plus.getUrlParam('data')?JSON.parse(plus.base64decode(plus.getUrlParam('data'))):'',
			list:[],
			title_id:'',
			title:'',
			tit_id:'',
			tit:'',
			infos:'',
			num:0,
			subtitle:'',
			subtit:'',
		},
		mounted:function(){
			var _this=this;
			if(_this.info){
				_this.title=_this.info.title;
				_this.title_id=_this.info.title_id;
				_this.tit_id=_this.info.tit_id;
				_this.tit=_this.info.tit;
				_this.subtitle=_this.info.subtitle;
				_this.subtit=_this.info.subtit;
			}
			// $.checkUser();
			_this.getFooter();
			Vue.nextTick(function(){
				$(document).on('click','.nav-list li .title',function(){
					console.log(1111)
					var _th=$(this).parent('li');
					if(_th.hasClass('cur')){
						$(_th).removeClass('cur');
						$(this).find('i').removeClass('on');
						_th.find('.child').stop().slideUp();
					}else{
						$(this).find('i').addClass('on');
						$(_th).addClass('cur');
						_th.find('.child').stop().slideDown();
					}
				})
			})
		},
		methods:{
			getFooter:function(){
				var _this=this;
				$._ajax({
					url: 'other/list',
					type:'get',
					data:{
						id:_this.tit_id
					},
				}).done(function(data){
					_this.list=data.data;
					_this.infos=data.info;
					if(!_this.title_id){
						_this.title=_this.list[0].title;
						_this.title_id=_this.list[0].id;
						_this.tit_id=_this.list[0].list[0].id;
						_this.tit=_this.list[0].list[0].title;
					}
					Vue.nextTick(function(){
						if(_this.num==0){
							$('.nav-list li').eq(_this.subtitle).addClass('cur');
							$('.nav-list li').find('i').addClass('on');
							$('.nav-list li').eq(_this.subtitle).find('.child').stop().slideDown();
						}
						
						_this.num++;
					})
				}).always(function(){
				});
			},
		    handleClick:function(title,id,tit,it){
		    	var _this=this;
		    	_this.title=title;
		    	_this.title_id=id;
		    	_this.tit=tit;
		    	_this.tit_id=it;
		    	_this.getFooter();	
		    },
		},
	});
})()

