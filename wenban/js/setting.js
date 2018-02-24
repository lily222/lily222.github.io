$(function(){
	//引入头部,阻止异步加载
	$.ajax({
		type:"get",
		url:"../head.html",
		async:false,
		success:function(html){
			$('header').html(html);
		}
	});
	
	if($('#change_password').length>0){
		//修改密码,validation插件
		$('#change_password').validate({
			rules:{
				check_phone:{
					required: true,
		            minlength: 11,
		            maxlength: 11,
		            digits:true
				},
				old_password:{
					required:true
				},
				new_password:{
					required:true,
					minlength: 4,
		            maxlength: 15
				},
				new_password2:{
					required:true,
					equalTo:"#new_password"
				}
			},
			messages:{
				check_phone:{
					required:"电话号码不能为空",
		   			minlength:"请输入正确的电话号码",
		   			maxlength:"请输入正确的电话号码",
		   			digits:"请输入正确的电话号码"
				},
				old_password:{
					required:"密码不能为空"
				},
				new_password:{
					required:"密码不能为空",
					minlength:"密码不能小于4个",
					maxlength:"密码不能大于15个"
				},
				new_password2:{
					required:"密码不能为空",
					equalTo:"与上面密码不符"
				}
			},
			errorPlacement: function(error, element) {   //修改错误提示样式
		      if ( element.is(":radio") ){
		      	 error.appendTo( element.parent());
		      }
		      else if ( element.is(":checkbox") ){
		      	error.appendTo ( element.next());
		      }
		      else{
		      	 error.appendTo( element.parent());
		      }
		    },
			submitHandler: function(){
				alert("submitted!");
			}
		});//修改密码页面,validation插件结束
		
	}else{
		//账号设置页面
		
		
		//隐藏手机中间4位
		var phone = $("#phone").text();
		var mphone = phone.substr(3,4);
		var lphone = phone.replace(mphone,"****");
		$('#phone').text(lphone);
		
		/*显示上传图片*/
		$('.change_pic').on("click",function(){
			var obj_url = get_object_url($(".input_file").get(0).files[0]);//获取图片的路径，该路径不是图片在本地的路径
			if(obj_url){
				$('#head_sculpture').find("img").eq(0).attr("src",obj_url);
			}
			console.log("llll:"+obj_url);
		});
		
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
		
	}//账号设置页面结束
	
});
