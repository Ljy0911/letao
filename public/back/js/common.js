// 开启进度条
// NProgress.start();
// 结束进度条
// NProgress.done();

// 需求：
// 实现在第一个ajax 发送的时候，开启进度条
// 在所有ajax 请求都完成的时候，结束进度条


// ajax 全局事件
// 1. ajaxComplete  当每个 ajax 完成的时候，调用(不管成功还是失败)
// 2. ajaxError     当 ajax 请求失败的时候，调用
// 3. ajaxSuccess   当 ajax 请求成功的时候，调用
// 4. ajaxSend      在每个 ajax 请求发送前，调用
// 5. ajaxStart     在第一个 ajax 发送时，调用
// 5. ajaxStop      在所有的 ajax 请求都完成时，调用


// ajaxStart 在第一个 ajax 发送时，调用
$(document).ajaxStart(function () {
    // 开启进度条
    NProgress.start();
});

// ajaxStop 在所有的 ajax 请求都完成时，调用
$(document).ajaxStop(function () {
    // 结束进度条
    NProgress.done();
});