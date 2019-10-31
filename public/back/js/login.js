$(function () {
    // 1.进行表单校验配置
    // 校验规则：
    //      (1)用户名不能为空,长度为2-6位
    //      (2)用户密码不能为空,长度为6-12位

    // 配置的字段和 input 框中指定的 name 关联，所以必须要给 input 加上 name
    $("#form").bootstrapValidator({
        //配置校验时的图标
        feedbackIcons: {
            valid: 'glyphicon glyphicon-ok',   // 校验成功(字体图标)
            invalid: 'glyphicon glyphicon-remove',  // 校验失败(字体图标)
            validating: 'glyphicon glyphicon-refresh'  // 校验中(字体图标)
        },
        // 配置字段
        fields: {
            username: {
                // 配置校验规则
                validators: {
                    // 非空
                    notEmpty: {
                        // 提示信息
                        message: "用户名不能为空"
                    },
                    stringLength: {
                        min: 2,
                        max: 6,
                        message: "用户名长度必须在 2-6 位"
                    },
                    callback: {
                        message: "用户名不存在"
                    }
                }
            },
            password: {
                validators: {
                    notEmpty: {
                        message: "密码不能为空"
                    },
                    stringLength: {
                        min: 6,
                        max: 12,
                        message: "密码长度必须在 6-12 位"
                    },
                    callback: {
                        message: "密码错误"
                    }
                }
            }
        }
    });


    // 2.登录功能
    // 注册表单验证成功事件
    // 当表单校验成功时，会触发success.form.bv事件，此时会提交表单，
    // 这时候，通常我们需要禁止表单的自动提交，使用ajax进行表单的提交。

    $("#form").on('success.form.bv', function (e) {
        // 阻止默认表单提交
        e.preventDefault();

        //使用ajax提交逻辑
        $.ajax({
            type: "post",
            url: "/employee/employeeLogin",
            data: $('#form').serialize(),
            dataType: "json",
            success: function (info) {
                // console.log(info);
                if (info.success) {
                    // 登录成功,跳转到首页
                    location.href = "index.html";
                }
                if (info.error === 1000) {
                    // NOT_VALIDATED, VALIDATING, INVALID, VALID
                    $('#form').data("bootstrapValidator").updateStatus("username","INVALID","callback");
                }
                if (info.error === 1001) {
                    $('#form').data("bootstrapValidator").updateStatus("password","INVALID","callback");
                }
            }
        })

    });

    // 3. 重置功能
    $('[type="reset"]').click(function () {
        // 调用插件的方法，进行重置
        // resetForm(boolean) 传 true 重置内容以及校验状态
        // resetForm(boolean) 传 false 只重置校验状态   (默认 false)

        // 由于 重置 type="reset" 本身可以重置内容 此处只需要重置校验状态
        // 需要创建实例 $('#form').data("bootstrapValidator")
        $('#form').data("bootstrapValidator").resetForm();
    })
});