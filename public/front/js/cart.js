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
                    console.log(info);
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
    $(".lt-main").on("tap", ".btn-del", function () {
        var id = $(this).data("id");
        $.ajax({
            type: "get",
            url: "/cart/deleteCart",
            // 后台要求传的id 是数组形式
            data: {
                id: [id],
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

    // 4. 编辑功能
    $(".lt-main").on("tap", ".btn-edit", function () {
        // html5 中 dataset 可以一次性获取所有的 自定义属性
        var obj = this.dataset;

        // 生成 htmlStr
        var htmlStr = template("editTpl", obj);

        // mui 将 \n 换行标记 解析成 <br>
        // 需要将 \n 去掉
        htmlStr = htmlStr.replace(/\n/g, "");

        // 弹出确认框
        // 确认框的内容支持传递 html  模板
        mui.confirm(htmlStr, "编辑商品", ["确认", "取消"], function (e) {
            if (e.index === 0) {
                // 点击确认 获取尺码 数量 id 进行ajax 提交
                var size = $(".lt-size span.current").text();
                var num = $(".mui-numbox-input").val();
                var id = obj.id;
                $.ajax({
                    type: "post",
                    url: "/cart/updateCart",
                    data: {
                        id: id,
                        size: size,
                        num: num,
                    },
                    dataType: "json",
                    success: function (info) {
                        console.log(info);
                        if (info.success) {
                            mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
                        }
                    }
                });
            }
        });
        // 进行数字框 初始化
        mui(".mui-numbox").numbox();

    });
    // 5. 让尺码可以选择
    $("body").on("click", ".lt-size span", function () {
        $(this).addClass("current").siblings().removeClass("current");
    });



})