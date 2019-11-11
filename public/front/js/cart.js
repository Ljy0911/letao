$(function () {

    function render() {
        // 1. 一进入页面, 发送 ajax 请求, 获取购物车数据
        //   (1) 用户未登录, 后台返回 error 拦截到登录页
        //   (2) 用户已登录, 后台返回 购物车数据, 进行页面渲染

        setTimeout(function () {
            $.ajax({
                type: "get",
                url: "/cart/queryCart",
                dataType: "json",
                success: function (info) {
                    if (info.error === 400) {
                        // 未登录
                        location.href = "login.html";
                        return;
                    }
                    // 已登录, 可以拿到数据, 通过模板渲染
                    // 注意: 拿到的是数组, template方法参数2要求是一个对象, 需要包装
                    var htmlStr = template("cartTpl", { arr: info });
                    $(".lt-main .mui-table-view").html(htmlStr);

                    // 渲染完成， 需要关闭下拉刷新
                    mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();
                }
            });
        }, 500);


    }

    // 2. 配置下拉刷新
    mui.init({
        pullRefresh: {
            container: ".mui-scroll-wrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            down: {
                auto: true,//可选,默认false.首次加载自动下拉刷新一次
                callback: function () {
                    render();
                } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
            }
        }
    });

    // 3.给删除按钮注册点击事件 
    // (1) 事件委托 并且是 "tap" 
    // (2) 获取按钮中存储的 data-id
    // (3) 发送ajax请求，执行删除
    // (4) 页面重新渲染
    $(".lt-main").on("tap",".btn-del",function () {
        var id = $(this).data("id");
        $.ajax({
            type: "get",
            url: "/cart/deleteCart",
            // 后台要求传的id 是数组形式
            data: {
                id: [ id ],
            },
            dataType: "json",
            success: function (info) {
                if (info.success) {
                    // 执行下拉刷新
                    // render();
                    mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
                }
            }
        });
    });
})