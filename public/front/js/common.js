// 区域滚动初始化
mui('.mui-scroll-wrapper').scroll({
  indicators: false, //是否显示滚动条
  deceleration: 0.0005 //flick 减速系数，系数越大，滚动速度越慢，滚动距离越小，默认值0.0006
});


// 配置轮播图自动轮播
//获得slider插件对象
var gallery = mui('.mui-slider');
gallery.slider({
  interval: 2000//自动轮播周期，若为0则不自动播放，默认为0；
});


// 作用：专门用于解析地址栏参数(重要)
function getSearch(k) {
  // 获取地址栏的参数
  var search = location.search;  //"?name=pp&age=18&desc=%E5%B1%81"

  // 解码中文
  search = decodeURI(search);  //"?name=pp&age=18&desc=屁"

  // 去掉问号
  // slice(start,end)
  search = search.slice(1);  //"name=pp&age=18&desc=屁"

  // 通过 & 分割成数组
  var arr = search.split("&");  //["name=pp", "age=18", "desc=屁"]

  var obj = {};
  arr.forEach(function (v, i) {   // v 每一项 "name=pp"
    var key = v.split("=")[0];  // name
    var value = v.split("=")[1];  // pp
    // [] 会解析变量  相当于 obj.XX
    obj[key] = value;
  });

  return obj[k];
}