$(function () {

    // 1. 获取地址栏的 productId 发送ajax 进行渲染
    var productId = getSearch("productId");
    $.ajax({
        type: "get",
        url: " /product/queryProductDetail",
        data: {
            id: productId
        },
        dataType: "json",
        success: function (info) {
            // console.log(info);
            var htmlStr = template("productTpl", info);
            $(".lt-main .mui-scroll").html(htmlStr);

            // 手动进行轮播初始化
            // 获得slider插件对象
            var gallery = mui('.mui-slider');
            gallery.slider({
                interval: 5000 //自动轮播周期，若为0则不自动播放，默认为0；
            });

            // 手动初始化 数字框
            mui(".mui-numbox").numbox();
        }
    });

    // 2. 让尺码可以选中
    $(".lt-main").on("click",".lt-size span",function () {
       $(this).addClass("current").siblings().removeClass("current"); 
    });

    // 3. 加入购物车功能

    // (1) 添加点击事件
    // (2) 收集 尺码 数量 产品id 发送 ajax 请求
    $("#addCart").click(function () {
        var size = $(".lt-size span.current").text();
        var num = $(".mui-numbox-input").val();
        if ( !size ) {
            mui.toast("请选择尺码");
            return;
        }
        // 发送 ajax
        $.ajax({
            type: "post",
            url: "/cart/addCart",
            data: {
                productId: productId,
                num: num,
                size: size
            },
            dataType: "json",
            success: function (info) {
                console.log(info);
                // 加入购物车操作 需要登录
                // 将来登录完成 还需要 跳转回来
                // (1) 未登录
                if ( info.error === 400 ) {
                    location.href = "login.html?retUrl="+ location.href;
                }
                // (2) 已登录 加入成功 ,提示用户
                if ( info.success ) {
                    mui.confirm("添加成功", "温馨提示",["去购物车","继续浏览"],function ( e ) {
                        if ( e.index === 0) {
                            location.href = "cart.html";
                        }
                    })
                }


            }
        });
        

    });
})