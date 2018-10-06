$(function(){
    init();
    function init(){
    
    eventList() ;

    }
    function eventList(){
        // 获取验证码 
        $("#toastBtn") .on("tap",function(){
            // console.log(123);
            // 获取手机号
            var mobile_txt = $("[name='mobile']").val().trim();
            if(!$.checkPhone(mobile_txt)){
                // 非法 
                mui.toast("手机号不正确");
                return ;
            }

            $.post("/users/get_reg_code",{
                mobile:mobile_txt 
            },function(ret){
                // 判断成功
                if(ret.meta.status == 200 ){
                            
                // 开发人偷懒 直接设置值
                $("[name='code']").val(ret.data);
                console.log(ret.data);

                // 禁用按钮
                $("#toastBtn").attr("disabled","disabled");
                // 倒计时
                var times = 5 ;
                // 改变按钮的文本  到0秒才能再去获取
                $("#toastBtn").text(times + "秒再获取");
                    // 开启定时器
                    var timeId = setInterval(function(){
                        times-- ;
                        $("#toastBtn").text(times + "秒再获取");
                        // 时间到了
                        if(times == 0 ){
                            // 暂停定时器
                            clearInterval(timeId);
                            // 重置按钮 移除禁用 改变文本
                            $("#toastBtn").removeAttr("disabled");
                            $("#toastBtn").text("获取验证码");
                        }
                    },1000);
                }
            })
        }) 

        // 点击注册
        $("#register_btn").on("tap",function(){
            console.log(222);
            var mobile_txt = $("[name='mobile']").val().trim();
            var code_txt = $("[name='code']").val().trim();
            var email_txt = $("[name='email']").val().trim();
            var pwd_txt = $("[name='pwd']").val().trim();
            var pwd_txt2 = $("[name='pwd2']").val().trim();
            // 获取 单选框的值 
            var gender_txt = $("[name='gender']:checked").val();
            // console.log(gender_txt);

            // js 打断点!!!!
            // debugger
            // 判断 手机号号码
            if(!$.checkPhone(mobile_txt)){
                // 非法
                mui.toast("手机号不正确");
                return ; 
            }
              // 判断 邮箱
              if(!$.checkEmail(email_txt)){
                // 非法
                mui.toast("邮箱不正确");
                return ; 
            }
              //  验证密码  
              if(pwd_txt.length<6){
                // 非法
                mui.toast("密码太简单了");
                return ; 
            }
              // 判断 两次密码
              if(pwd_txt!=pwd_txt2){
                // 非法
                mui.toast("两次密码不一致");
                return ; 
            }
            console.log("发送注册");

            // 注册 信息参数
            var params = {

                mobile:mobile_txt,
                code:code_txt,
                email:email_txt,
                pwd:pwd_txt,
                gender:gender_txt
            };

            // 发送请求 
            $.post("/users/reg",params,function(ret){
                // console.log(ret);
                // 成功
                if(ret.meta.status == 200){
                    mui.toast(ret.meta.msg);
                    setTimeout(function(){
                        location.href = "login.html" ;

                    },1000);
                }else{
                     // 失败
                     mui.toast(ret.meta.msg);
                }
            })
        })
    }
})