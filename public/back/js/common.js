// 开启进度条
// NProgress.start();
// 结束进度条
// NProgress.done();

// 需求：
// 实现在第一个ajax 发送的时候，开启进度条
// 在所有ajax 请求都完成的时候，结束进度条


// ajax 全局事件
// 1. ajaxComplete  当每个 ajax 完成的时候，调用(不管成功还是失败)
// 2. ajaxError     当 ajax 请求失败的时候，调用
// 3. ajaxSuccess   当 ajax 请求成功的时候，调用
// 4. ajaxSend      在每个 ajax 请求发送前，调用
// 5. ajaxStart     在第一个 ajax 发送时，调用
// 5. ajaxStop      在所有的 ajax 请求都完成时，调用


// ajaxStart 在第一个 ajax 发送时，调用
$(document).ajaxStart(function () {
    // 开启进度条
    NProgress.start();
});

// ajaxStop 在所有的 ajax 请求都完成时，调用
$(document).ajaxStop(function () {
    // 结束进度条
    NProgress.done();
});

// 登录拦截功能 (登录页不需要校验)
// 前后分离 前端不知道该用户是否登录
// 发送ajax 请求 查询用户状态
// (1) 已登录 什么也不做，用户可以进行访问
// (2) 未登录 拦截到登录页

// 判断是否是登录页 不是登录页就需要登录拦截
if (location.href.indexOf("login.html") === -1) {
    $.ajax({
        type: "get",
        url: "/employee/checkRootLogin",
        gataType: "json",
        success: function (info) {
            // console.log(info);
            if (info.success) {
                // 已登录，让用户继续访问
                // console.log("已登陆");
            }
            if (info.error === 400) {
                // 未登录，拦截到登录页
                location.href = "login.html";
            }
        }

    })
}








$(function () {

    // 1. 分类管理的切换功能
    $('.nav .category').click(function () {
        // slideDown() 方法通过使用滑动效果，显示隐藏的被选元素
        // slideUp() 通过使用滑动效果，隐藏被选元素，如果元素已显示出来的话
        // slideToggle() 方法通过使用滑动效果（高度变化）来切换元素的可见状态
        $('.nav .child').stop().slideToggle();
    });

    // 2. 左侧侧边栏切换功能
    $('.icon-menu').click(function () {
        $('.lt-aside').toggleClass('hidemenu');
        $('.lt-topbar').toggleClass('hidemenu');
        $('.lt-main').toggleClass('hidemenu');
    });
    // 3. 点击topbar退出功能，弹出模态框
    $('.icon-logout').click(function () {
        $('#logoutModal').modal("show");
    });
    // 4.点击模态框退出按钮
    $('#logoutBtn').click(function () {
        // 发送 Ajax 请求，进行退出
        $.ajax({
            type: "get",
            url: "/employee/employeeLogout",
            dataTyoe: "json",
            success: function (info) {
                // console.log(info);
                if (info.success) {
                    // 退出成功,跳转到登录页
                    location.href = "login.html";
                }
            }
        })
    });
})