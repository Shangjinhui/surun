;(function () {
	var app = new Vue({
		el: '#app',
		data: {
			id:plus.getUrlParam('id')?plus.getUrlParam('id'):'',
			company:plus.getUrlParam('company')?plus.getUrlParam('company'):'',
			ids:plus.getUrlParam('question')?plus.getUrlParam('question'):'', //问题id
			info:'',//详情信息
			Qpage:1,
			limit:10,
			Qcount:0,
			question_list:[],//问答列表
			q_state:false, //问答弹窗状态
			texts:'',
			group_button:true,
			Q_A:[
				{
					title:'说出你的问题，他们会帮你解答',
					name:'提问'
				},
				{
					title:'',
					name:'回答'
				}
			],
			Q_num:0,
			Question_id:'',//回复id
			content:'',
			reply:[],
		},
		mounted: function () {
			var _this=this;
			$.checkUser();
			_this.getInfo();
			_this.QuestionList();


		},
		methods:{
			//详情列表
			getInfo:function(){
				var _this=this;
				_this.$loading();
				$._ajax({
					url:  'common/info',
					type:'get',
					data:{
						id:_this.id,
						company:_this.company,
					}
				}).done(function(data){
					_this.info=data.info;
				}).always(function () {
					_this.$loading().close();
				});
			},
			//问答专区-问题列表
			QuestionList:function(){
				var _this=this;
				_this.$loading();
				$._ajax({
					url:'common/question_detail',
					type:'get',
					data:{
						id:_this.ids,
						page:_this.Qpage,
						limit:_this.limit,
					},
				}).done(function(data){
					_this.Qcount=data.replyCount;
					_this.question_list=data;
					_this.reply=data.reply;
				}).always(function () {
					_this.$loading().close();
				});
			},
			QCurrentPage:function(e){
				var _this=this;
				_this.Qpage=e;
				_this.QuestionList();
			},
			//问答专区-回复状态
			Question_reply_state:function(id,content){
				var _this=this;
				_this.q_state=!_this.q_state;
				_this.texts='';
				_this.content=content;
				_Question_id=id;
			},
			//回答/提问
			Release_problem:function(){
				var _this=this;
				if(!_this.texts){
					$.oppo('内容不能为空');
					return;
				}
				_this.$loading();
				$._ajax({
					url:'common/add_question',
					type:'POST',
					data:JSON.stringify({
						id:_this.id,
						reply:_this.ids, //提问为0
						content:_this.texts,
					}),
				}).done(function(data){
					_this.Qpage=1;
					_this.q_state=false;
					_this.Question_list();
				}).always(function () {
					_this.$loading().close();
				});
			},
		}
	});
})()

