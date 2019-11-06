$(function () {
    var currentPage = 1;
    var pageSize = 2;

    render();
    function render() {

        $.ajax({
            type: "get",
            url: " /product/queryProductDetailList",
            data: {
                page: currentPage,
                pageSize: pageSize
            },
            dataType: "json",
            success: function (info) {
                // console.log(info);
                var htmlStr = template("productTpl", info);
                $(".lt-content tbody").html(htmlStr);

                // 分页初始化
                $("#paginator").bootstrapPaginator({
                    // 配置 bootstrap 版本
                    bootstrapMajorVersion: 3,//默认是2，如果是bootstrap3版本，这个参数必填
                    currentPage: info.page,//当前页
                    totalPages: Math.ceil(info.total / info.size),//总页数
                    // 配置按钮大小
                    size: "normal",
                    // 配置按钮文本
                    // 每个按钮在初始化的时候，都会调用一次此函数，通过返回值进行文本设置
                    // 参数1： type  ( 取值 page first last prev next)
                    // 参数2： page  指当前按钮所指向的页码
                    // 参数3：  current  表示当前页
                    itemTexts: function (type, page, current) {
                        console.log(arguments);
                        switch (type) {
                            case "page":
                                return page;
                            case "first":
                                return "首页";
                            case "last":
                                return "尾页";
                            case "prev":
                                return "上一页";
                            case "next":
                                return "下一页";
                        }
                    },
                    // 配置 title 提示信息
                    // 每个按钮在初始化的时候，都会调用一次此函数，通过返回值设置title
                    tooltipTitles: function (type,  page,  current) {
                        switch (type) {
                            case "page":
                                return "前往第"+page+"页";
                            case "first":
                                return "首页";
                            case "last":
                                return "尾页";
                            case "prev":
                                return "上一页";
                            case "next":
                                return "下一页";
                        }
                    },
                    // 使用Bootstrap的提示框组件
                    useBootstrapTooltip: true,

                    // 给页码添加点击事件
                    onPageClicked: function (event, originalEvent, type, page) {
                        //为按钮绑定点击事件 page:当前点击的按钮值
                        // console.log(page);
                        currentPage = page;
                        render();
                    }
                })
            }
        });
    }

    // 2. 点击添加商品 显示模态框
    $("#addBtn").click(function () {
        $("#addModal").modal("show");

        // 发送ajax请求 请求所有的二级分类数据 进行下拉列表渲染
        // 通分页接口，模拟获取全局数据
        $.ajax({
            type: "get",
            url: "/category/querySecondCategoryPaging",
            data: {
                page: 1,
                pageSize: 100,
            },
            dataType: "json",
            success: function (info) {
                // console.log(info);
                var htmlStr = template("dropdownTpl",info);
                $(".dropdown-menu").html(htmlStr);
            }

        });
    });

    // 3.  给 dropdown-menu 下面的 li a 注册点击事件
    $(".dropdown-menu").on("click","a",function () {
        var txt = $(this).text();
        $("#dropdownText").text(txt);

        // 设置id 给隐藏域
        var id = $(this).data("id");
        $('[name="brandId"]').val(id);
        // 表单元素 用val
    });


})