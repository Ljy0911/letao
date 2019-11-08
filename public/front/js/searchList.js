$(function () {

    // 1. 获取地址栏传递的关键字 设置给 input
    var key = getSearch("key");
    $(".search-input").val(key);

    // 一进入页面，根据搜索关键字进行页面渲染
    render();
    function render() {
        $.ajax({
            type: "get",
            url: " /product/queryProduct",
            data: {
                proName: $(".search-input").val(),
                page: 1,
                pageSize: 100,
            },
            dataType: "json",
            success: function (info) {
                console.log(info);
                var htmlStr = template("productTpl", info);
                $(".lt-product").html(htmlStr);
            }
        });
    }



    // 功能2: 点击搜索 实现搜索功能
    $(".search-btn").click(function () {
        // 将搜索关键字 追加到本地存储中
        var key = $(".search-input").val();
        if (key.trim() === "") {
            alert("qing");
            return;
        }
        render();
        var history = localStorage.getItem("search_list") || "[]";
        var arr = JSON.parse( history );
        // 删除重复项
        var index = arr.indexOf(key);
        if (index != -1) {
            arr.splice(index,1);
        }
        // 长度限制
        if (arr.length >= 6) {
            // 删除数组最后一项
            arr.pop();
        }
        arr.unshift( key );
        localStorage.setItem("search_list",JSON.stringify(arr));
    });

});