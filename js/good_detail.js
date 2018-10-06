$(function(){

    var GoodsItem ;

    init();
    function init(){
        eventList() ;
        getDetail(); 
    }
    function eventList(){
        $(".add_btn").on("tap",function () {
            /* 
            1 弹出提示 
               重新登录 
            2 跳转页面
              location.href="login.html??";
             */
      
            //  1 弹出提示 在mui中  提示框 
            // var username = sessionStorage.getItem("username");
            var userinfoStr = $.getUser();
            if(!userinfoStr){
                mui.toast("未登录");
                setTimeout(function(){
                     // 把当前的路径存到会话存储中
                    //  sessionStorage.setItem("pageName",location.href);
                    $.setPage();
                     location.href="login.html";
                },1000);
            }else{
                // 否则指的是不需要执行任何操作
                // console.log("构造参数 发送请求");
                console.log(GoodsItem);
                
                // 构造参数构造参数构造参数构造参数
                var params = {
                    // cat_id:GoodsItem.cat_id,
                    cat_id:GoodsItem.cat_id,
                    // 必须要补上的
                    goods_id:GoodsItem.goods_id	,	
                    goods_name:GoodsItem.goods_name,
                    goods_number:GoodsItem.goods_number,
                    goods_price:GoodsItem.goods_price,
                    goods_small_logo:GoodsItem.goods_small_logo,
                    goods_weight:GoodsItem.goods_weight
                };

                // 是否需要对userinfo 做个判断 是否存在 ???
                $.post("/my/cart/add",{
                    info:JSON.stringify(params)
                },function(ret){
                    console.log(ret);
                    if(ret.meta.status == 200){
                        // .confirm( message, title, btnValue, callback [, type] )
                        mui.confirm("是否要跳转到购物车?", "添加成功", ["跳转", "取消"], function (etype) {
                             // arguments   可以获取方法上的参数
                             if(etype.index == 0 ){
                                // 跳转
                                location.href="cart.html";
                             }else if(etype.index == 1){
                                // 取消 什么都不做 
                             }
                        });
                    }else{
                        // token过期了 ......
                        mui.toast(ret.meta.msg);
                    }
                      
                })
            }
           
          })
    }

  // 获取商品的详情数据
    function getDetail(){
        $.get("/goods/detail",{goods_id:$.getUrl("goods_id")},function (ret) {
            // console.log(ret);
            if(ret.meta.status == 200){
                GoodsItem = ret.data ; 
                var html = template("mainTpl",ret.data);
                $(".pyg_view").html(html);
                // console.log(html);
                    //获得slider插件对象 初始化
                var gallery = mui('.mui-slider');
                gallery.slider({
                interval:1000//自动轮播周期，若为0则不自动播放，默认为0；
                });
            }
           })
        }


})