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
                var htmlStr = template("secondTpl",info);
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
                var htmlStr = template("dropdownTpl",info);
                $('.dropdown-menu').html(htmlStr);
            }

        });
    });

    // 3. 通过事件委托 给dropdown-menu 下面的所有a 绑定点击事件
    $(".dropdown-menu").on("click","a",function () {
        var txt = $(this).text();
        $("#dropdownText").text(txt);

        // 获取选中的id
        var id = $(this).data("id");
        // 设置谁input
        $('[name="categoryId"]').val(id);
    });

    // 4. 进行文件上传初始化
    $("#fileupload").fileupload({
        // 配置返回的数据格式
        dataType: "json",
        // 图片上传完成后会调用 done 回调函数
        // data: 图片上传后的对象，
        // 通过data.result.picAddr 可以获取上传后的图片地址
        done: function ( e, data ) {
            // console.log(data.result.picAddr);
            var imgUrl = data.result.picAddr;
            $("#imgBox img").attr("src",imgUrl);

            // 将图片地址设置给 input
            $('[name="brandLogo"]').val(imgUrl);
        }
    });


})