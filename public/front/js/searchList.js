$(function () {

    var currentPage = 1;
    var PageSize = 2;
    function render(callback) {
        // $(".lt-product").html('<div class="loading"></div>');
        // 功能3. 排序
        var params = {};
        // 三个必传参
        params.proName = $(".search-input").val();
        params.page = currentPage;
        params.pageSize = PageSize;
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
                    // 真正拿到数据后执行的操作 通过 callback 函数传递进来
                    callback && callback(info);
                }
            });
        }, 500);
    }


    // 1. 获取地址栏传递的关键字 设置给 input
    var key = getSearch("key");
    $(".search-input").val(key);


    // 一进入页面，根据搜索关键字进行页面渲染
    // render();

    // 下拉刷新是对原有数据的覆盖 执行 html 方法
    // 上拉加载是在原有结构的基础上进行追加，追加到后面 执行 append 方法
    mui.init({
        pullRefresh: {
            container: ".mui-scroll-wrapper",//下拉刷新容器标识，querySelector能定位的css选择器均可，比如：id、.class等
            down: {
                auto: true,//可选,默认false.首次加载自动下拉刷新一次
                callback: function () {
                    // 加载第一页的数据
                    currentPage = 1;
                    // 拿到数据后，需要执行的方法不一样，通过回调函数 传进去执行
                    render(function (info) {
                        var htmlStr = template("productTpl", info);
                        $(".lt-product").html(htmlStr);

                        // ajax 结束 需要结束下拉刷新效果 让内容回到顶部
                        // mui('.mui-scroll-wrapper').pullRefresh() 创建的实例
                        // 注意: api 做了更新 文档没更新
                        //   此处使用原型上的  endPulldownToRefresh 方法
                        mui('.mui-scroll-wrapper').pullRefresh().endPulldownToRefresh();

                        // 第一页数据被重新加载之后,又有数据可以上拉加载,需要启用上拉加载
                        mui('.mui-scroll-wrapper').pullRefresh().enablePullupToRefresh();
                    });

                } //必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
            },
            up: {
                callback: function () {
                    // 需要加载下一页的数据 更新当前页
                    currentPage++;
                    render(function (info) {
                        var htmlStr = template("productTpl", info);
                        $(".lt-product").append(htmlStr);

                        // 结束上拉加载
                        // endPullupToRefresh(boolean)
                        // true 没有更多数据 会显示提示语 自动禁用上拉加载 防止发送无效的ajax
                        // false 还有更多数据
                        if (info.data.length === 0) {
                            // 没有更多数据
                            mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(true);
                        }
                        else {
                            mui('.mui-scroll-wrapper').pullRefresh().endPullupToRefresh(false);
                        }
                    });
                }//必选，刷新函数，根据具体业务来编写，比如通过ajax从服务器获取新数据；
            }
        }
    });

    // 功能2: 点击搜索 实现搜索功能
    $(".search-btn").click(function () {
        // 将搜索关键字 追加到本地存储中
        var key = $(".search-input").val();
        if (key.trim() === "") {
            mui.toast("请输入搜索关键字", { duration: 'long' });
            return;
        }
        // 执行一次下拉刷新即可，在下拉刷新回调中，会进行页面渲染
        // render();
        mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();

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


    // mui 认为在下拉刷新和上拉加载容器中，会有 300ms延迟 性能方面不足
    // 禁用了默认的 a 标签的 click 事件  需要通过tap 事件绑定
    // http://ask.dcloud.net.cn/question/8646 文档说明地址
    $(".lt-sort a[data-type]").on("tap", function () {
        // $(".lt-sort a[data-type]").click(function () {

        if ($(this).hasClass("current")) {
            // 切换两个类的时候
            $(this).find("i").toggleClass("fa-angle-up").toggleClass("fa-angle-down");
        }
        else {
            // 没有current类
            $(this).addClass("current").siblings().removeClass("current");
        }
        // 由于所有的参数都在 render中实时处理好了
        // render();
        // 执行一次下拉刷新即可
        mui('.mui-scroll-wrapper').pullRefresh().pulldownLoading();
    });

    // 功能4. 点击每个商品实现页面跳转，注册点击事件，事件委托，tap 事件
    $(".lt-product").on("tap", "a",function () {
        var id = $(this).data("id");
        location.href = "product.html?productId=" + id;
    });
});