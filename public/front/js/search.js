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

        // 添加 mui 确认框
        // message  Type: String   提示对话框上显示的内容
        // title   Type: String    提示对话框上显示的标题
        // btnValue    Type: Array    提示对话框上按钮显示的内容
        // callback    Type: Function    提示对话框上关闭后的回调函数
        // type    Value: 'div'    是否使用h5绘制的对话框
        mui.confirm("你确认要清空历史记录嘛？", "温馨提示", ["取消", "确认"], function (e) {
            // console.log(e);
            // e.index 可以获取点击按钮的索引
            if (e.index === 1) {
                localStorage.removeItem("search_list");
                render();
            }
        });
    });

    // 3. 删除单条历史记录
    // (1) 事件委托绑定点击事件
    // (2) 将下标存在删除按钮中, 点击后获取下标
    // (3) 读取本地存储, 拿到数组
    // (4) 根据下标, 从数组中将该下标的项移除,  splice
    // (5) 将数组转换成 jsonStr
    // (6) 存到本地存储中
    // (7) 重新渲染
    $(".lt-history").on("click", ".btn-del", function () {

        // 添加 mui 确认框
        mui.confirm("你确认要删除该条记录嘛？", "温馨提示", ["取消", "确认"], function (e) {
            // console.log(e);
            // e.index 可以获取点击按钮的索引
            // 外层的 this 指向， 存储在that 中
            var that = this;
            if (e.index === 1) {
                // 获取下标
                var index = $(that).data("index");
                // 获取数组
                var arr = getHistory();
                // 该下标的项移除
                // splice(从哪开始， 删除几项， 添加的项1， 添加的项2,...)
                arr.splice(index, 1);
                // 将数组转换成 jsonStr
                var jsonStr = JSON.stringify(arr);
                // 存到本地存储中
                localStorage.setItem("search_list", jsonStr);
                render();
            }
        });
    });
    // 4. 添加历史记录
    $(".search-btn").click(function () {
        var key = $(".search-input").val().trim();
        if (key === "") {
            alert("qing");
        }
        var arr = getHistory();
        // 去除重复项
        // 长度限制 6
        // 在 arr 中查找与 key 值相等的元素的索引 进行删除
        var index = arr.indexOf(key);
        if (index != -1) {
            // s说明存在重复 需要删除
            arr.splice(index, 1);
        }
        if (arr.length >= 6) {
            // 删除数组最后一项
            arr.pop();
        }
        // 最前面添加
        arr.unshift(key);
        var jsonStr = JSON.stringify(arr);
        localStorage.setItem("search_list", jsonStr);
        render();
        // 清空 输入框
        $(".search-input").val("");
        // 添加跳转
        location.href = "searchList.html?key="+ key;
    });



})