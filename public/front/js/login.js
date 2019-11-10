$(function () {
    // 登录功能
    // 1. 给登录按钮注册点击事件
    // 2. 获取用户名和密码
    // 3. 发送 ajax 进行登录验证
    //   (1) 登录成功
    //      拦截过来的，跳回去
    //      直接访问的，跳转到个人中心页
    //   (2) 登录失败
    //      提示用户 

    $("#loginBtn").click(function () {
        var username = $("#username").val().trim();
        var password = $("#password").val().trim();
        if (username === "") {
            mui.toast("请输入用户名");
            return;
        }
        if (password === "") {
            mui.toast("请输入密码");
            return;
        }

        // 发送请求
        $.ajax({
            type: "post",
            url: "/user/login",
            data: {
                username: username,
                password: password
            },
            dataType: "json",
            success: function (info) {
                // 登录失败
                if (info.error === 403) {
                    mui.toast("用户名或密码错误");
                    return;
                }
                // 登录成功
                //    1. 拦截过来的，跳回去
                //    2. 直接访问的，跳转到个人中心页
                if (info.success) {
                    if (location.search.indexOf("retUrl") > -1) {
                        // 拦截过来的
                        // 所有参数
                        var retUrl = location.search;  //?retUrl=http://localhost:3000/front/product.html?productId=5"
                        retUrl = retUrl.replace("?retUrl=","");  //"http://localhost:3000/front/product.html?productId=5"
                        location.href = retUrl;
                    }
                    else {
                        // 直接访问的
                        location.href = "user.html";
                    }
                }
            }
        });
    });
});