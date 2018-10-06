$(function(){
    init();
    function init(){
        var user = $.getUser();
        if(!user){
            // 把当前页面存在 会话存储中
            $.setPage();
            location.href = "login.html";
            return ;
        }
        // 显示购物车页面
        $("body").fadeIn();
        getUserInfo() ;
        eventList() ;
    }


    function eventList(){
        $("#btn_login_out").on("tap",function(){
        // btn_login_out  退出登录 
        /**
         * 1 删除缓存 
         * 2 $.setPage();
         * 3 跳转到登录页面
         */
        mui.confirm("是否要退出","警告",["确定","取消"],function(etype){
            var index = etype.index ;
            if(index == 0 ){
                sessionStorage.clear();
                $.setPage();
                location.href="login.html" ;
            }else if(index == 1){
                // 点取消 不退出
            }
        })
         
        })

    }

    // 获取用户信息
    function getUserInfo(){
        $.get("/my/users/userinfo",function(ret){
            if(ret.meta.status == 200){
                var userinfo = ret.data ;
                //请充值
                $(".phone").text(userinfo.user_tel);
                $(".email").text(userinfo.user_email);
            }else{
                console.log(ret);
            }
        })
    }
         

})