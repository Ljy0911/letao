$(function () {

    var currentPage = 1;
    var pageSize = 5;
    // 1. 一进入页面发送 ajax 请求 获取数据 模板渲染
    render();
    function render() {
        $.ajax({
            type: "get",
            url: "/category/querySecondCategoryPaging",
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: "json",
            success: function (info) {
                // console.log(info);
                var htmlStr = template("secondTpl", info);
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

        // 点击添加分类按钮时，发送ajax请求 获取 一级分类全部数据 通过模板引擎渲染
        // 通过  page: 1, pageSize: 100 模拟获取全部数据分类数据的接口
        $.ajax({
            type: "get",
            url: "/category/queryTopCategoryPaging",
            data: {
                page: 1,
                pageSize: 100
            },
            dataType: "json",
            success: function (info) {
                // console.log(info);
                var htmlStr = template("dropdownTpl", info);
                $('.dropdown-menu').html(htmlStr);
            }

        });
    });

    // 3. 通过事件委托 给dropdown-menu 下面的所有a 绑定点击事件
    $(".dropdown-menu").on("click", "a", function () {
        var txt = $(this).text();
        $("#dropdownText").text(txt);

        // 获取选中的id
        var id = $(this).data("id");
        // 设置谁input
        $('[name="categoryId"]').val(id);

        // 将隐藏域校验状态，设置成校验成功状态 updateStatus
        // updateStatus(字段名，校验状态，校验规则)
        $('#form').data("bootstrapValidator").updateStatus("categoryId", "VALID");

    });

    // 4. 进行文件上传初始化
    $("#fileupload").fileupload({
        // 配置返回的数据格式
        dataType: "json",
        // 图片上传完成后会调用 done 回调函数
        // data: 图片上传后的对象，
        // 通过data.result.picAddr 可以获取上传后的图片地址
        done: function (e, data) {
            // console.log(data.result.picAddr);
            var imgUrl = data.result.picAddr;
            $("#imgBox img").attr("src", imgUrl);

            // 将图片地址设置给 input
            $('[name="brandLogo"]').val(imgUrl);
            // 手打重置 将隐藏域校验状态，设置成校验成功状态 updateStatus
            $('#form').data("bootstrapValidator").updateStatus("brandLogo", "VALID");

        }
    });
    // 5. 表单校验初始化
    $('#form').bootstrapValidator({
        // 指定不校验的类型，默认为[':disabled', ':hidden', ':not(:visible)'],可以不设置
        // 我们需要对隐藏域进行校验，所有不需要将隐藏域排除到校验范围外
        excluded: [],

        //配置校验时的图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',   // 校验成功(字体图标)
            invalid: 'glyphicon glyphicon-remove',  // 校验失败(字体图标)
            validating: 'glyphicon glyphicon-refresh'  // 校验中(字体图标)
        },
        // 配置字段
        fields: {
            // categoryId 分类id 
            // brandName 二级分类名称
            // brandLogo 图片地址
            categoryId: {
                validators: {
                    notEmpty: {
                        message: "请选择一级分类"
                    }
                }
            },
            brandName: {
                validators: {
                    notEmpty: {
                        message: "请输入二级分类"
                    }
                }
            },
            brandLogo: {
                validators: {
                    notEmpty: {
                        message: "请选择图片"
                    }
                }
            },

        }
    });
    // 6. 注册表单校验成功事件 阻止默认提交 通过ajax 提交
    $("#form").on('success.form.bv', function (e) {
        // 阻止默认表单提交
        e.preventDefault();

        //使用ajax提交逻辑
        $.ajax({
            type: "post",
            url: " /category/addSecondCategory",
            data: $('#form').serialize(),
            dataType: "json",
            success: function (info) {
                // console.log(info);
                if (info.success) {
                    // 关闭模态框
                    $("#addModal").modal("hide");
                    // 重新渲染第一页
                    currentPage = 1;
                    render();
                    // 重置模态框 校验状态 文本内容
                    $('#form').data("bootstrapValidator").resetForm(true);
                    // 手动重置 文本内容 图片路径
                    $('#dropdownText').text("请选择一级分类");
                    $("#imgBox img").attr("src","./images/none.png");
                }

            }
        })

    });

})