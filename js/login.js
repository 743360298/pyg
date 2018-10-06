$(function(){
    init() ;
    function init(){
        eventList() ;
    }
    function eventList(){
        // 登录按钮  
        $("#login_btn").on("tap",function(){
            // console.log(123);

            var username_txt = $("[name='username']").val().trim() ;
            var password_txt = $("[name='password']").val().trim() ;

            if(!$.checkPhone(username_txt)){
                mui.toast("用户名不合法");
                return ;
            }
            if(password_txt.length<6){
                mui.toast("密码不合法");
                return ;
            }

            // 发送请求到后台 
            $.post("/login",{
                username:username_txt,
                password:password_txt
            },function(ret){
                console.log(ret);

                if(ret.meta.status == 200 ){
                    // 存用户信息到回话存储中
                    // sessionStorage.setItem("username",JSON.stringify(ret.data));
                    $.setUser(ret.data);
                    // 执行跳转页面
                    var page = sessionStorage.getItem("pageName");
                    if(page){
                        location.href = page ;
                    }else{
                        location.href = "../index.html" ;
                    }
                }else{
                    mui.toast(ret.meta.msg) ;   
                }
            })
        })  
    }

})