$(function () {

    // 1. 获取地址栏传递的关键字 设置给 input
    var key = getSearch("key");
    $(".search-input").val(key);

    // 一进入页面，根据搜索关键字进行页面渲染
    render();
    function render() {
        $(".lt-product").html('<div class="loading"></div>');
        // 功能3. 排序
        var params = {};
        // 三个必传参
        params.proName = $(".search-input").val();
        params.page = 1;
        params.pageSize = 100;
        // 两个可传可不传
        // (1) 需要根据高亮的 a 判断传那个参
        // (2) 通过箭头判断 升降
        // 价格 price   1 升 2降
        // 库存 num     1 升 2降

        var $current = $(".lt-sort a.current");
        if ($current.length > 0) {
            // 存在高亮的 a 需要排序
            // 获取传给后台的键
            var sortName = $current.data("type");
            // 获取传给后台的值
            var sortValue = $current.find("i").hasClass("fa-angle-down") ? 2 : 1;
            // 添加到 params    []解析变量
            params[sortName] = sortValue;
        }

        setTimeout(function () {
            $.ajax({
                type: "get",
                url: " /product/queryProduct",
                data: params,
                dataType: "json",
                success: function (info) {
                    // console.log(info);
                    var htmlStr = template("productTpl", info);
                    $(".lt-product").html(htmlStr);
                }
            });
        },500);
    }

    // 功能2: 点击搜索 实现搜索功能
    $(".search-btn").click(function () {
        // 将搜索关键字 追加到本地存储中
        var key = $(".search-input").val();
        if (key.trim() === "") {
            mui.toast("请输入搜索关键字", { duration: 'long' });
            return;
        }
        render();
        var history = localStorage.getItem("search_list") || "[]";
        var arr = JSON.parse(history);
        // 删除重复项
        var index = arr.indexOf(key);
        if (index != -1) {
            arr.splice(index, 1);
        }
        // 长度限制
        if (arr.length >= 6) {
            // 删除数组最后一项
            arr.pop();
        }
        arr.unshift(key);
        localStorage.setItem("search_list", JSON.stringify(arr));
    });

    // 功能3： 排序功能
    // 通过属性选择器 给价格 库存 添加解析事件
    // 如果有current 类 切换箭头的方向
    // 如果没有 current 类 添加current类，并且移除兄弟元素的 current
    $(".lt-sort a[data-type]").click(function () {
        if ($(this).hasClass("current")) {
            // 切换两个类的时候
            $(this).find("i").toggleClass("fa-angle-up").toggleClass("fa-angle-down");
        }
        else {
            // 没有current类
            $(this).addClass("current").siblings().removeClass("current");
        }
        // 由于所有的参数都在 render中实时处理好了
        render();
    });

});