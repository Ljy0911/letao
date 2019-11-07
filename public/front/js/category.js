$(function () {
  
  // 1. 一进入页面 发送ajax请求 获取一级分类数据，进行渲染
  $.ajax({
    type: "get",
    url: " /category/queryTopCategory",
    dataType: "json",
    success: function (info) {
      console.log(info);
      var htmlStr = template("leftTpl", info);
      $(".lt-category-left ul").html(htmlStr);
      // 一进入页面，渲染第一个一级分类所对应的二级分类
      renderSecondById( info.rows[0].id );
    }
  });

  // 2. 点击一级分类渲染二级分类 事件委托
  $(".lt-category-left").on("click", "a",function () {
    // 给自己加上current 移除其他的
    // siblings() 方法返回被选元素的所有同级元素
    // children()方法：获取该元素下的直接子集元素
    // find()方法：获取该元素下的所有子集元素
    $(this).addClass("current").parent().siblings().find("a").removeClass("current");
    
    // 获取 id 通过id进行二级分类渲染
    var id = $(this).data("id");
    renderSecondById(id);
  });


  // 实现一个方法 专门根据一级分类 id 渲染二级分类
  function renderSecondById( id ) {
    $.ajax({
      type: "get",
      url: "/category/querySecondCategory",
      data: {
        id: id
      },
      dataType: "json",
      success: function (info) {
        console.log(info);
        var htmlStr = template("rightTpl",info);
        $(".lt-category-right ul").html(htmlStr);
      }
    });
  }

})