$(function () {
    var currentPage = 1; // 当前页
    var pageSize = 5; // 每页条数
    // 1. 一进入页面发送 ajax 请求 获取数据 模板渲染
    render();
    function render() {
        $.ajax({
            type: "get",
            url: "/category/queryTopCategoryPaging",
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: "json",
            success: function (info) {
                console.log(info);
                var htmlStr = template("tpl", info);
                $("tbody").html(htmlStr);

                // 分页初始化
                $("#paginator").bootstrapPaginator({
                    bootstrapMajorVersion: 3,//默认是2，如果是bootstrap3版本，这个参数必填
                    currentPage: info.page,//当前页
                    totalPages: Math.ceil(info.total / info.size),//总页数

                    onPageClicked: function (event, originalEvent, type, page) {
                        //为按钮绑定点击事件 page:当前点击的按钮值
                        currentPage = page;
                        render();
                    }
                })
            }
        });
    }

    // 2. 点击添加分类按钮 显示模态框
    $("#addBtn").click(function () {
        $("#addModal").modal("show");
    });

    // 3. 使用表单校验插件 实现表单校验
    $("#form").bootstrapValidator({
        //配置校验时的图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',   // 校验成功(字体图标)
            invalid: 'glyphicon glyphicon-remove',  // 校验失败(字体图标)
            validating: 'glyphicon glyphicon-refresh'  // 校验中(字体图标)
        },
        // 配置字段
        fields: {
            categoryName: {
                validators: {
                    notEmpty: {
                        message: "一级分类不能为空"
                    }
                }
            }
        }
    });
    // 4. 校验成功 阻止默认提交
    $('#form').on("success.form.bv", function (e) {
        e.preventDefault();
        $.ajax({
            type: "post",
            url: " /category/addTopCategory",
            data: $("#form").serialize(),
            dataType: "json",
            success: function (info) {
                // console.log(info);
                if (info.success) {
                    // 1. 关闭模态框
                    $("#addModal").modal("hide");
                    // 2. 重新渲染第一页
                    currentPage = 1;
                    render();
                    // 3. 表单重置
                    // 传参 true 不仅重置校验状态 还重置内容
                    $('#form').data("bootstrapValidator").resetForm(true);
                }
            }
        });

    })

})