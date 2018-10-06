$(function(){
    var QueryObj = {
        query:"",
        cid: getUrl("id"),
        pagenum:1,
        pagesize:10
    };
      // 总页数
    var totalPage = 1;

    init() ;
    function init(){    
        eventList() ;
            mui.init({
                pullRefresh: {
                    container: ".pyg_view",
                    // 下拉
                    down: {
                        //  触发下拉刷新时自动触发
                        auto: true,
                        callback: function () {
                            // 重置参数
                            QueryObj = {
                                query:"",
                                cid: getUrl("id"),
                                pagenum:1,
                                pagesize:10
                            };
                            
                            searchDate(function(data){
                                var html = template("mainTpl",{arr:data});
                                // 后期可能需要根据需求 加载下一页改成append
                                $(".pyg_list").html(html);
                                // 结束下拉刷新  后面根据需求结束下拉刷新组件  下拉刷新组件 还是上拉加载下一页的组件
                                // console.log("下拉了");
                                mui('.pyg_view').pullRefresh().endPulldownToRefresh();

                                mui('.pyg_view').pullRefresh().refresh(true);
                            });


                        }
                    },
                    // 上拉 
                    up: {
                        //  触发上拉刷新时自动触发
                        callback: function () {
                           // 先判断 有没有下一页
                           if (QueryObj.pagenum >= totalPage) {
                            //    console.log(QueryObj.papenum);
                               console.log(totalPage);
                            console.log('没有数据了');
                            console.log("上拉了")
                            mui('.pyg_view').pullRefresh().endPullupToRefresh(true);

                           }else{
                               QueryObj.pagenum++ ;
                               searchDate(function(data){
                                var html = template("mainTpl",{arr:data});
                                // 追加
                                $(".pyg_list").append(html);
                                // 没有数据 结束上拉 传入 true 否则 传入 false
                                mui('.pyg_view').pullRefresh().endPullupToRefresh(false);
                               })
                           }

                        }
                    }
                }
            });
        
    }

        // 绑定事件  a标签
        function eventList() {  
            $("body").on("tap","a",function(){
                var href = this,href;
                location.href = href ;
            })
        }


        // 获取 商品列表数据
        // http://api.pyg.ak48.xyz/api/public/v1/goods/search
        function searchDate(callback){
            $.get("/goods/search",QueryObj,function(ret){
                // console.log(ret) ;
                if(ret.meta.status == 200){
                    totalPage = Math.ceil(ret.data.total / QueryObj.pagesize);
                    // console.log(ret.data.total) ;
                    // console.log(totalPage) ;
                    callback(ret.data.goods);
    
                }
            })
        }

    

    // 根据getUrl 上key 来获取值
     function getUrl(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURI(r[2]);
        return null;
      }
    //   console.log(getUrl().cid);

      
})

