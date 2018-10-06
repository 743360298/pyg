$(function(){
    // 1 权限验证
       // 未登录 跳转到登录页面
       // 判断回话存储中 有没有永户信息
       //    用户 已经登录 正常执行

    init(); 
    function init(){
        // 权限验证 
        var user= $.getUser();
        if(!user){
            // 把当前页面存在会话存储
            $.setPage() ;
            location.href = "login.html" ;
            return ;
        }

        // 显示购物车页面
        $("body").fadeIn();
        queryCart();
        eventList();
        
    }

     // 查询购物车数据
     // http://api.pyg.ak48.xyz/api/public/v1/my/cart/all
    function queryCart(){
        $.get("/my/cart/all",function (ret){
            console.log(ret);
            if(ret.meta.status == 200){
                // var cart_info = JONS.setPage(ret.data.cart_info);
                var cart_info = JSON.parse(ret.data.cart_info);
                console.log(cart_info);
                var html = template("mainTpl",{obj:cart_info})
                $(".goods_wrap").html(html);

                //  数字输入框 要初始化
                mui(".mui-numbox").numbox();
                countCart() ;
            }
        })  

    }
     

  

    // 绑定事件
    function eventList(){
        // 编辑按钮
        $("#edit_btn").on("tap",function(){
            // console.log(111);
            if($("body").hasClass("editting")){
                $("#edit_btn").text("编辑");
                editGoods();
            }else{
                $("#edit_btn").text("完成");
            }
            $("body").toggleClass("editting");
        })

        // 加减数量的按钮
        $(".goods_wrap").on("tap",".item_numberbox .mui-numbox",function(){
            countCart();
        })

        // 删除按钮 
        $("#delete_btn").on("tap",function(){
            var length = $(".delete_chk:checked").length ;
            if(length== 0 ){
                mui.toast("你还没购买过商品");
                return ;
            }

            // 2 确认框
            mui.confirm("确定要删除吗?", "警告", ["删除", "取消"], function (etype) {
                if(etype.index == 0 ){
                    // 未被选中的li标签数组
                    deleteCart(); 
                } else if(etype.index == 1){
                    // 取消
                    console.log("取消");
                }
            })
        })

        // 生成订单
        $("#create_btn").on("tap",function(){
            // 要生成订单的li标签
            var $li = $(".goods_wrap li");
            if($li.length == 0 ){
                mui.toast("你还没有选购商品");
                return ;
            }   
            // 要发送的参数
            var goodsObj ={
                order_price : $(".price").text() ,
                consignee_addr: "中国日本省东京市",
                goods: []
            };

            for( var i =0; i<$li.length ; i++){
                // js dom 元素
                var li = $li[i];
                var obj = $(li).data("obj");
                var tmpObj = {
                    goods_id : obj.goods_id ,
                    goods_number : $(li).find(".mui-numbox-input").val(), 
                    goods_price:obj.goods_price 
                };
                goodsObj.goods.push(tmpObj);
            }
            console.log(goodsObj);
            // 开始生成订单 
            orderCreate(goodsObj);
        })
    }
 
    // 计算总价格
    function countCart(){
        // 循环 li标签
        // $(".goods_wrap li");
        // li.find("数量标签")
        // li.find("价格标签")

        // 获取单价 输入框的值  单价*数量
        //  $lis jq的伪数组
        var $lis = $(".goods_wrap li"); 
        var total = 0 ;
        for( var i = 0 ; i< $lis.length; i++){
            var li = $lis[i];
            // 绑定到li标签上的购物车数据对象
            var goodsObj = $(li).data("obj");
            // 商品单价
            var price = goodsObj.goods_price ;
            // console.log(price);
            // 数量
            var num = $(li).find(".mui-numbox-input").val();
            total += price * num ;
        }
        // console.log(total);
        // 设置到标签中
        $(".price").text(total);       
    }

    // 删除商品 
    function deleteCart(){
        var $unSelectLis = $(".delete_chk").not(":checked").parents("li");
        // 需要 同步到后台的参数
        var goodsObj = {} ;
        for( var i = 0 ; i < $unSelectLis.length ; i++ ){
            // js 的dom对象
            var li = $unSelectLis[i] ;
            var obj = $(li).data("obj");
            obj.amount = $(li).find(".mui-numbox-input").val() ;
            goodsObj[obj.goods_id] = obj; 
        }
        // 打印不包含有 被删除的数据
        console.log("删除"+ goodsObj);
        //同步
        asyncCart(goodsObj);
    }

    //编辑商品
    function editGoods(){
        // jq 的伪数组 
        var $lis = $(".goods_wrap li");
        // 需要构造的参数
        var goodsObj = {} ;
        for ( var i = 0 ; i<$lis.length ; i++){
            //  li 是一个js的dom元素
            var li = $lis[i] ;
            // 绑在li标签身上的商品对象
            // var obj=li.dataset.obj;
            var obj =$(li).data("obj");
             // 修改对象的购买数量  =  输入框里面的值
            obj.amount = $(li).find(".mui-numbox-input").val() ;

            goodsObj[obj.goods_id] = obj ;
        }
        // 开始同步数据
        asyncCart(goodsObj);
        console.log(goodsObj);
    }


    // 同步购物车
    function asyncCart(params){
        $.post("/my/cart/sync",{
            "infos":JSON.stringify(params)
        },function(ret){
            console.log("同步"+ret);
            if(ret.meta.status == 200 ){
                // 同步成功 刷新数据
                console.log("同步购物车"+ret);
                queryCart() ;
            }else{
                console.log(ret);
                console.log("同步失败");
            }
        })
    }

    // 生成订单
     function orderCreate(params){
        $.post("/my/orders/create",params, function (ret){
            if(ret.meta.status == 200){
                // 给出一个确认框  要不要跳到订单页面     
                mui.confirm("是否要跳转到订单页面", "生成成功", ["跳转", "取消"], function (etype) {
                    var index = etype.index ;
                    if( index == 0){
                         // 跳转页面
                         location.href= "orders.html";
                    }else if(index== 1){ 
                        // 不跳
                        queryCart();
                    }
                })
            }else{
                console.log(ret) ;
            }
        })
     }

})