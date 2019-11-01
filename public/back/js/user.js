
$(function () {
    // 1. 一进入页面，发送 ajax 请求，
    // 获取用户列表数据，通过模板引擎渲染
    $.ajax({
        type: "get",
        url: " /user/queryUser",
        data: {
            page: 1,
            pageSize: 5
        },
        dataType: "json",
        success: function (info) {
            // console.log(info);
            // template( 模板 id，数据对象 )
            // 在模板中可以任意使用 数据对象中的属性
            var htmlStr = template('tpl',info);
            $('tbody').html( htmlStr );
        },
        
    })
})