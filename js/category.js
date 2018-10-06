$(function(){
    var CateDatas;
    var leftScroll ;
    init();
    function init(){
        loadData();
        eventList();
        

       
    }

    //绑定事件 
    function eventList(){
        // 绑定左侧菜单点击事件
        $(".pyg_menu").on("tap","li",function(){
            $(this).addClass("active").siblings().removeClass("active");
            
            var index = $(this).index();
            console.log("绑定事件"+index);
            renderRight(index);
           
            // leftscroll = new IScroll('.left_box',{tap:true});
            leftScroll.scrollToElement(this);
        })
    }

    function loadData(){
        // 获取旧的永久储存的数据
        var localStr = localStorage.getItem("cates");
        // 判断是否存在
        if(!localStr){
            getCateItems() ;
        }else{

            var localData = JSON.parse(localStr);
            if (Date.now() - localData.time > 1000000) {
                // 过期了 
                getCateItems() ;
            }else{
                CateDatas = localData.datas; 
                renderLeft();
                // 默认渲染索引为0 数据
                renderRight(0) ;
            }
        }
        // var cates0 = CateDatas[index].children;
        // var html2 = template("rightTpl",{arr:cates0});
        // 
    }

    // 发送请求获取数据
    function getCateItems(){
        $.get("/categories", function (ret) {
            console.log(ret);
            // console.log(ret.data.cat_id);
            if(ret.meta.status == 200){
                // 给全局变量赋值
                CateDatas = ret.data ;
                console.log(CateDatas);
                var obj = {
                    time : Date.now(),
                    datas:CateDatas
                }
                localStorage.setItem("cates",JSON.stringify(obj));
                renderLeft();
                renderRight(0);
             
            }
        })
    }

    // 渲染左侧的菜单
    function renderLeft(){
        var html = template("leftTpl", { arr: CateDatas });
        $(".pyg_menu").html(html);
        // 初始化 左侧滚动条
        leftScroll = new IScroll(".left_box");
    } 

    // 渲染 右侧的内容
    function renderRight(index){
        var cates0 = CateDatas[index].children ;
        var html2 = template("rightTpl",{arr:cates0})
        $(".right_box").html(html2).hide().fadeIn(200);
        // 懒加载
        mui(document).imageLazyload({
            placeholder: '../images/01.gif'
        });
    
        // 获取到图片的个数
        var nums = $(".right_box img").length;

        //  图片的内容加载 完毕事件
        $(".right_box img").on("load",function(){
            nums-- ;
            if(nums== 0){
                console.log("初始化了n次");
                new IScroll(".right_box");
            }
        })

    }



})