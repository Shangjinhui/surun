;(function(){
    var vue = new Vue({
        el:'#app',
        data(){
            return {
                textArea:''
            }
        },
        mounted(){
            let id = window.location.href.split('id=')[1].split('&')[0];
            if(id) this.getCon(id)
        },
        methods:{
            getCon(id){
                //该协议接口在客户端；现客户端商家端公用
                this.$loading();
                $.ajax({
					url:'https://demo2.yunmofo.cn/surun_shop/index.php/web/common/get_pages',
					type:'get',
                    data:{id},
                    headers: {
                        'Platform': '2',
                        // 'Authorization': window.TOKEN?window.TOKEN:''
                    },
                    success:res=>{
                        this.textArea = res.data.content;
                    },
                    complete:()=>{
                        this.$loading().close();
                    }
				})
            }
        }
    })
})()