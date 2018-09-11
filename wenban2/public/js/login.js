$(function(){
	//引入头部,阻止异步加载
	// $.ajax({
	// 	type:"get",
	// 	url:"../public/html/head.html",
	// 	async:false,
	// 	success:function(html){
	// 		$('header').html(html);
	// 	}
	// });

	//表单验证
    $("#user").on("blur",phone_validate);
    $("#password").on("blur",password_validate);

    function phone_validate() {
        $this = $("#user");
        var phone = $this.val().trim();
        if(phone == ""){
            error_message($this,"手机号码不能为空");
        }else if(isNaN(phone)){
            error_message($this,"请输入正确手机号码");
        }else if(phone.length != 11){
            error_message($this,"请输入正确手机号码");
        }else{
            if($this.next()){
                $this.next().remove();
            }
        }
    }
    function password_validate() {
        $this = $("#password");
        var name = $this.val().trim();
        if(name == ""){
            error_message($this,"密码不能为空");
        }else {
            if($this.next()){
                $this.next().remove();
            }
        }
    }
    function error_message(ev,tip) {
        if(ev.next()){
            ev.next().remove();
        }
        ev.parent().append("<span class='error'>"+ tip +"</span>");
    }

    //表单提交
	$("#submit").on("click",function () {
        phone_validate();
        password_validate();
        var phone = $('#user').val().trim();
        var password = $("#password").val().trim();
        var error = $("#login_form").find(".error");
        if(error.length == 0){
        	$.ajax({
				type:"POST",
				url:"/api/user/login",
				dataType:'json',
				data:{
                    phone:phone,
                    password:password
                },
				success:function (result) {
					if(result.mes == "密码错误"){
                        $("#error").text("密码错误").css("display","block");
					}else if(result.mes == "账号不存在"){
						$("#error").text("账号不存在").css("display","block");
					}else{
					    $.cookie("keepuser",JSON.stringify({phone:phone, password:password}),{
					        expires:7,
                            path:'/'
                        });
					    alert('登录成功！  返回首页');
					    window.location.href = "/";
					}

                }
			});
		}
    });
});
