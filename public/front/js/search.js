$(function () {
    // 注意： 要进行本地存储 localStorage 操作，进行历史记录管理
    // 需要约定一个键名 key  search_list (操作的是同一个 key )
    // 将来通过 search_list 进行读取设置操作

    // 将来下面三句话, 可以放在控制台执行, 进行假数据初始化
    // var arr = [ "耐克", "李宁", "新百伦", "耐克王", "阿迪王" ];
    // var jsonStr = JSON.stringify( arr );
    // localStorage.setItem( "search_list", jsonStr );

    // 1. 列表渲染功能
    // 从本地存储中读取历史记录 jsonStr ==> 数组 --> 通过模板渲染
    // 从本地存储中读取历史记录，以数组的形式返回
    render();

    // 读取历史记录 以历史记录形式返回
    function getHistory() {
        // 如果没有读取到数据， 默认初始化成一个空数组
        var history = localStorage.getItem("search_list") || '[]';
        var arr = JSON.parse(history);
        return arr;
    }
    // 读取数组进行页面渲染
    function render() {
        var arr = getHistory();
        // template( 模板id，数据对象);
        var htmlStr = template("historyTpl", { arr: arr });
        $(".lt-history").html(htmlStr);
    }

    // 2. 清空历史记录
    // (1) 点击事件
    // (2) 清空历史记录 removeItem 
    // (3) 页面重新渲染
    $(".lt-history").on("click", ".btn-empty", function () {
        localStorage.removeItem("search_list");
        render();
    });

})