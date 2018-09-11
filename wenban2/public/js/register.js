$(function(){
	//引入头部,阻止异步加载
	$.ajax({
		type:"get",
		url:"../public/html/head.html",
		async:false,
		success:function(html){
			$('header').html(html);
		}
	});


	/*表单验证*/
	$("#user_phone").on("blur",phone_validate);
	$("#user_name").on("blur",name_validate);
	$("#password").on("blur",password_validate);
	$("#password2").on("blur",password2_validate);

	function phone_validate() {
		$this = $("#user_phone");
        var phone = $this.val().trim();
        if(phone == ""){
            error_message($this,"手机号码不能为空");
        }else if(isNaN(phone)){
            error_message($this,"请输入正确手机号码");
        }else if(phone.length != 11){
            error_message($this,"请输入正确手机号码");
        }else {
            $.ajax({
                type:'post',
                url:'/api/user/register/phone',
                data:{
                    phone:$('#user_phone').val()
                },
                dataType:'json',
                success:function (result) {
                    if(result.mes == "手机号码已注册"){
                        error_message($("#user_phone"),"该手机号码已注册");
					}else{
                        if($this.next()){
                            $this.next().remove();
                        }
					}
                }
            });
        }
    }
    function name_validate() {
        $this = $("#user_name");
        var name = $this.val().trim();
        if(name == ""){
            error_message($this,"用户名不能为空");
        }else {
            if($this.next()){
                $this.next().remove();
            }
        }
    }
    function password_validate() {
        $this = $("#password");
        var password = $this.val().trim();
        if(password == ""){
            error_message($this,"密码不能为空");
        }else if(password.length < 6 || password.length > 15){
            error_message($this,"请输入6-15英文字母和数字");
        }else if(/([a-zA-Z]+[0-9]+|[0-9]+[a-zA-Z])/.exec(password)){
            if($this.next()){
                $this.next().remove();
            }
        }else{
            error_message($this,"请输入英文字母和数字");
        }
    }
    function password2_validate() {
        $this = $("#password2");
        var password2 = $this.val().trim();
        if(password2 == ""){
            error_message($this,"密码不能为空");
        }else if(password2 != $("#password").val().trim()){
            error_message($this,"与上面密码不同");
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

    //提交表单
	$(".submit_btn").on("click",function () {
        phone_validate();
        name_validate();
        password_validate();
        password2_validate();
        var error = $("#register_form").find(".error");
        if(error.length == 0){
            $.ajax({
                type:'post',
                url:'/api/user/register',
                data:{
                    phone:$('#user_phone').val().trim(),
					name:$("#user_name").val().trim(),
					password:$("#password").val().trim()
                },
                dataType:'json',
                success:function (result) {
                	if(result.mes == '注册成功'){
                		alert('注册成功，请登录账号！');
                		window.location.href = "./login";
					}
                }
            });
		}
    });
	
});
