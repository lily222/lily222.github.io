$(function(){
	//引入头部,阻止异步加载
	$.ajax({
		type:"get",
		url:"head.html",
		async:false,
		success:function(html){
			$('header').html(html);
		}
	});
	
	//validation插件
	$('#register_form').validate({
		rules:{
			user:{
				required: true,
	            minlength: 11,
	            maxlength: 11,
	            digits:true
			},
			password:{
				required:true,
				minlength: 4,
	            maxlength: 15,	            
				onlyLetterNumber:true
			},
			password2:{
				required:true,
				equalTo:"#passdword"
			},
			identifying_code:{
				required:true
			},
			check_code:{
				required:true
			}
		},
		messages:{
			user:{
				required:"电话号码不能为空",
	   			minlength:"请输入正确的电话号码",
	   			maxlength:"请输入正确的电话号码",
	   			digits:"请输入正确的电话号码"
			},
			password:{
				required:"密码不能为空",
				onlyLetterNumber:"请输入英文字母、数字",
				minlength:"密码不能小于4个",
				maxlength:"密码不能大于15个"
			},
			password2:{
				required:"密码不能为空",
				equalTo:"与上面密码不符"
			},
			identifying_code:{
				required:"验证码不能为空"
			},
			check_code:{
				required:"校验码不能为空"
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
	});
	
});
