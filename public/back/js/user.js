
$(function () {

    var currentPage = 1;
    var pageSize = 5;
    // 1. 一进入页面，发送 ajax 请求，
    // 获取用户列表数据，通过模板引擎渲染
    render();

    function render() {
        $.ajax({
            type: "get",
            url: " /user/queryUser",
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: "json",
            success: function (info) {
                // template( 模板 id，数据对象 )
                // 在模板中可以任意使用 数据对象中的属性
                var htmlStr = template('tpl', info);
                $('tbody').html(htmlStr);

                // 分页初始化
                $('#paginator').bootstrapPaginator({
                    // 配置 bootstrap 版本
                    bootstrapMajorVersion: 3,//默认是2，如果是bootstrap3版本，这个参数必填
                    currentPage: info.page,//当前页
                    totalPages: Math.ceil(info.total / info.size),//总页数
                    onPageClicked: function (event, originalEvent, type, page) {
                        //为按钮绑定点击事件 page:当前点击的按钮值
                        // console.log(page);
                        currentPage = page;
                        render();
                    }
                });
            },

        });
    }


})