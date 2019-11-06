$(function () {
    var currentPage = 1;
    var pageSize = 2;
    // 定义用来存储已上传图片 的数组
    var picArr = [];

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
                        // console.log(arguments);
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
                    tooltipTitles: function (type, page, current) {
                        switch (type) {
                            case "page":
                                return "前往第" + page + "页";
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
                var htmlStr = template("dropdownTpl", info);
                $(".dropdown-menu").html(htmlStr);
            }

        });
    });

    // 3.  给 dropdown-menu 下面的 li a 注册点击事件
    $(".dropdown-menu").on("click", "a", function () {
        var txt = $(this).text();
        $("#dropdownText").text(txt);

        // 设置id 给隐藏域
        var id = $(this).data("id");
        $('[name="brandId"]').val(id);
        // 表单元素 用val
        // 手动重置 二级分类校验状态
        $("#form").data("bootstrapValidator").updateStatus("brandId", "VALID");
    });

    // 4. 文件上传初始化
    // 多文件上传时 插件会遍历选中的图片 发送多次请求到服务器
    // 将来响应多次 每次响应都会调用一次 done 方法
    $("#fileupload").fileupload({
        // 返回的数据格式
        dataType: "json",
        // 文件上传完成时调用的回调函数
        done: function (e, data) {
            // console.log(data.result);

            // 往数组的最前面追加 图片对象
            picArr.unshift(data.result);

            // 往 img 最前面追加 img 元素
            // prepend 往一个div 元素的最前面追加
            // append 往一个div 元素的最后面追加
            $("#imgBox").prepend('<img src="' + data.result.picAddr + '" width="100" alt="" srcset="">');

            // 判断数组长度 如果大于 3 将数组最后一项移除
            if (picArr.length > 3) {
                // 移除 数组最后一项
                picArr.pop();

                // 移除imgBox 中的最后一个图片(两种方法)
                // eq 过滤选择器 获取第n个元素
                $("#imgBox img").eq(-1).remove();
                // $("#imgBox img:last-of-type").remove();
            }
            // console.log(picArr);
            
            // 手动重置 三张图片校验状态
            // 如果图片数组的长度为3  通过校验 
            if (picArr.length === 3) {
                $("#form").data("bootstrapValidator").updateStatus("picStatus", "VALID");
            }

        }
    });

    // 5. 进行表单校验初始化 
    $("#form").bootstrapValidator({
        // 重置排除项
        excluded: [],

        //配置校验时的图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',   // 校验成功(字体图标)
            invalid: 'glyphicon glyphicon-remove',  // 校验失败(字体图标)
            validating: 'glyphicon glyphicon-refresh'  // 校验中(字体图标)
        },

        // 配置字段
        fields: {
            // 选择二级分类
            brandId: {
                validators: {
                    notEmpty: {
                        message: "请选择二级分类"
                    }
                }
            },
            // 产品名称
            proName: {
                validators: {
                    notEmpty: {
                        message: "请输入产品名称"
                    }
                }
            },
            // 商品描述
            proDesc: {
                validators: {
                    notEmpty: {
                        message: "请输入商品描述"
                    }
                }
            },
            // 商品库存
            // 除了非空之外 必须是非零开头
            num: {
                validators: {
                    notEmpty: {
                        message: "请输入商品库存"
                    },
                    //正则校验
                    // /d 表示数字 0-9
                    // + 表示出现一次或多次
                    // * 表示出现0次或多次
                    // ? 表示出现0次或1次
                    regexp: {
                        regexp: /^[1-9]\d*$/,
                        message: '商品库存必须是非零开头的数字'
                    }
                }
            },
            // 商品尺码
            // 除了非空之外 必须是xx-xx 的格式 x为数字
            size: {
                validators: {
                    notEmpty: {
                        message: "请输入商品尺码"
                    },
                    regexp: {
                        regexp: /^\d{2}-\d{2}$/,
                        message: '商品尺码必须是必须是xx-xx的格式,例如： 32-40'
                    }

                }
            },
            // 商品原价
            oldPrice: {
                validators: {
                    notEmpty: {
                        message: "请输入商品原价"
                    }
                }
            },
            // 商品现价
            price: {
                validators: {
                    notEmpty: {
                        message: "请输入商品现价"
                    }
                }
            },
            // 图片校验
            picStatus: {
                validators: {
                    notEmpty: {
                        message: "请选择三张图片"
                    }
                }
            }
        }
    });

    // 6. 阻止默认提交 通过ajax 进行提交
    $("#form").on("success.form.bv", function (e) {
        // 阻止默认表单提交
        e.preventDefault();
        var paramsStr = $("#form").serialize();
        // 拼接上图片的数据
        paramsStr += "&picName1=" + picArr[0].picName + "&picAddr1=" + picArr[0].picAddr;
        paramsStr += "&picName2=" + picArr[1].picName + "&picAddr2=" + picArr[1].picAddr;
        paramsStr += "&picName3=" + picArr[2].picName + "&picAddr3=" + picArr[2].picAddr;
        $.ajax({
            type: "post",
            url: "/product/addProduct",
            data: paramsStr,
            dataType: "json",
            success: function (info) {
                if (info.success) {
                    // 关闭模态框
                    $("#addModal").modal("hide");
                    // 页面重新渲染
                    currentPage = 1;
                    render();
                    
                    $('#form').data("bootstrapValidator").resetForm(true);
                    
                    // 下拉列表 图片 重置
                    $("#dropdownText").text("请选择二级分类");
                    $("#imgBox img").remove();
                }
            }
        });
    });



})