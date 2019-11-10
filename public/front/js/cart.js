$(function () {

    function render() {
        // 1. 一进入页面, 发送 ajax 请求, 获取购物车数据
        //   (1) 用户未登录, 后台返回 error 拦截到登录页
        //   (2) 用户已登录, 后台返回 购物车数据, 进行页面渲染
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
            }
        });
    }
    render();
})