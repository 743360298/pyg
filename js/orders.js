$(function(){
    init();
    function init(params){
        var user = $.getUser() ;
        if(!user){
            // 把当前页面存到 会话存储中
            $.setPage() ;
            location.href = "login.html" ;
            return ;
        }
        // 显示购物车
        $("body").fadeIn() ;
        queryOrders();

    }

    // 获取订单 数据  type 1，2，3 
    function queryOrders(){
        $.get("/my/orders/all",{
            type:$.getUrl("type")||1 },function(ret){
                if(ret.meta.status==200){
                  var html = template("mainTpl",{arr:ret.data}); 
                  $(".pyg-table").html(html);   
                }else{
                    console.log(ret);
                }

        })
    }

})