var myFooterHtml = '<div>\
						<div class="footer bgfff">\
							<div class="c-999 center cofff pt20 pb10">\
								<div class="wid1190 fsize12 lh24">\
									<div class="opa6">隐私政策-苏润易购</div>\
									<div class="opa6">苏润云商版权所有©2019   浙ICP备16011111号-6</div>\
									<div class="opa6">消费者维权热线：400-880-8090 |  浙公网安备 3112340459号 | <a class="c-999" :href="friendLink">友情链接</a> | 出版物经营许可证 | 增值电信业务经营许可证</div>\
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
			friendLink:''
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
		})*/
		//获取友情链接
		this.getFriendLink();
    },
    methods: {
		getFriendLink(){
			$.ajax({
				url:'https://demo2.yunmofo.cn/surun_shop/index.php/web/common/get_pages',
				type:'get',
				data:{id:52},
				headers: {
					'Platform': '2',
					// 'Authorization': window.TOKEN?window.TOKEN:''
				},
				success:res=>{
					this.friendLink = res.data.content;
				},
				complete:()=>{
				}
			})
		},
		fixTop:function(  )
		{
			Vue.nextTick(function(  )
			{
				$( "html,body" ).stop().animate( { "scrollTop": 0 }, 800 );
			})
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
		}
    }
})