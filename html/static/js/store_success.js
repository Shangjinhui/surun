;(function () {

	var app = new Vue({
		el: '#app',
		data: {
			info:plus.getUrlParam('info')?JSON.parse(plus.base64decode(plus.getUrlParam('info'))):'',

		},
		mounted: function () {
			var _this=this;
			$.checkUser();

		},
		methods:{




		},
		watch:{

		}
	});
})()

