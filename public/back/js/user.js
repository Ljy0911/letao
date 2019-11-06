
$(function () {

    var currentPage = 1; // 当前页
    var pageSize = 5; // 每页多少条

    var currentId;
    var isDelete;
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
                // console.log(info);
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
    
    // 2. 点击启用按钮显示模态框 通过事件委托
    $('tbody').on("click", ".btn", function () {
        $('#userModal').modal("show");
        // 获取用户id
        currentId = $(this).parent().data("id");
        isDelete = $(this).hasClass("btn-danger") ? 0 : 1;
    });

    // 3. 点击确认，发送ajax请求，修改用户状态
    $('#submitBtn').click(function () {

        $.ajax({
            type: "post",
            url: "/user/updateUser",
            data: {
                id: currentId,
                isDelete: isDelete
            },
            dataType: "json",
            success: function (info) {
                // 关闭模态框
                // 重新渲染页面
                if (info.success) {
                    $('#userModal').modal("hide");
                    render();
                }
            }

        });
    })

})