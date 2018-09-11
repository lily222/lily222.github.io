$(function(){


	if($('#change_password').length>0){
		//修改密码页面

        /*表单验证*/
        $("#check_phone").on("blur",phone_validate);
        $("#old_password").on("blur",old_password_validate);
        $("#new_password").on("blur",new_password_validate);
        $("#new_password2").on("blur",new_password2_validate);

		function phone_validate() {
            $this = $("#check_phone");
            var phone = $this.val().trim();
            var cookie= eval("(" + $.cookie("keepuser") + ")");
            if(!cookie){
                error_message($this,"请登录后再进行账号设置");
			}else if(phone == ""){
                error_message($this,"手机号码不能为空");
            }else if(isNaN(phone)){
                error_message($this,"请输入正确手机号码");
            }else if(phone.length != 11){
                error_message($this,"请输入正确手机号码");
            }else if(phone != cookie.phone){
            	error_message($this,"手机号与本账号绑定的不符");
            }else {
                if($this.next()){
                    $this.next().remove();
                }
            }
        }
        function old_password_validate() {
            $this = $("#old_password");
            var old_password = $this.val().trim();
            var cookie= eval("(" + $.cookie("keepuser") + ")");
            if(old_password == ""){
                error_message($this,"密码不能为空");
            }else if(old_password != cookie.password){
                error_message($this,"密码错误");
			}else {
                if($this.next()){
                    $this.next().remove();
                }
            }
        }
        function new_password_validate() {
            $this = $("#new_password");
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
        function new_password2_validate() {
            $this = $("#new_password2");
            var password2 = $this.val().trim();
            if(password2 == ""){
                error_message($this,"密码不能为空");
            }else if(password2 != $("#new_password").val().trim()){
                error_message($this,"与上面密码不同");
            }else {
                if($this.next()){
                    $this.next().remove();
                }
            }
        }

        //错误信息的提示
        function error_message(ev,tip) {
            if(ev.next()){
                ev.next().remove();
            }
            ev.parent().append("<span class='error'>"+ tip +"</span>");
        }

        //提交表单
        $(".submit_btn").on("click",function () {
            phone_validate();
            old_password_validate();
            new_password_validate();
            new_password2_validate();
            var error = $("#change_password").find(".error");
            if(error.length == 0){
                $.ajax({
                    type:'post',
                    url:'/api/user/changePassword',
                    data:{
                        phone:$('#check_phone').val().trim(),
                        new_password:$("#new_password").val().trim()
                    },
                    dataType:'json',
                    success:function (result) {
                        if(result.mes == '修改成功'){
                            alert('注册成功，请重新登录！');
                            $.cookie("keepuser",null,{
                            	expires:7,
								path:'/'
							});
                            window.location.href = "/user/login";
                        }else{
                            alert("修改失败");
						}
                    },
					error:function (result) {
						alert("修改失败");
                    }
                });
            }
        });


		//修改密码页面结束
		
	}else{
		//账号设置页面
        //查看cookie
        var cookie = $.cookie("keepuser");
        cookie = eval("(" + cookie + ")");
        //发送登录用户的信息
        if(cookie) {
            $.ajax({
                type: "POST",
                url: "/api/user/message",
                dataType: "json",
                data: {phone: cookie.phone},
                success: function (result) {
                    var head_url = result.userHead;
                    $("#head_sculpture").find("img").eq(0).attr("src",head_url);
                    $('#name').val(result.userName);
                },
                error:function () {
                    console.log("fasongshibai");
                }
            });
        }


        //隐藏手机中间4位
		var phone = cookie.phone;
		var mphone = phone.substr(3,4);
		var lphone = phone.replace(mphone,"****");
		$('#phone').text(lphone);
		$('.phone').val(phone);
		
		/*显示上传图片*/
		$('.change_pic').on("click",function(){
			var file = $(".input_file").get(0).files[0];
			var obj_url = get_object_url(file);//获取图片的路径，该路径不是图片在本地的路径
			if(obj_url){
				$('#head_sculpture').find("img").eq(0).attr("src",obj_url);
			}
		});

        //submit不跳转
        $("#middle").on("submit",sub);
        function sub() {
            // jquery 表单提交
            $("#middle").ajaxSubmit(function(message) {
                // 对于表单提交成功后处理，message为返回内容
                alert(message.mes);
            });
            return false; // 必须返回false，否则表单会自己再做一次提交操作，并且页面跳转
        }
		//建立一個可存取到該file的url
		function get_object_url(file){
			var url = null;
			if(window.createObjectURL!=undefined){ //basic
				url=window.createObjectURL(file);
			}else if(window.URL!=undefined){  // mozilla(firefox)
				url=window.URL.createObjectURL(file);
			}else if(window.webkitURL!=undefined){   // webkit or chrome
				url=window.webkitURL.createObjectURL(file);
			}
			return url;
		}

		//只修改了名号
        $(".chenge_name").on("click",function () {
            $.ajax({
                type:'post',
                dataType:'json',
                url:'/api/user/changeName',
                data:{
                    phone:$('.phone').val(),
                    name:$('#name').val()
                },
                success:function (data) {
                    alert(data.mes);
                }
            });
        });




    }//账号设置页面结束



});
