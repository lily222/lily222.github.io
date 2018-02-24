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
	$('#login_form').validate({
		rules:{
	        user:{
	            required: true,
	            minlength: 11,
	            maxlength: 11,
	            digits:true
	        },
	        password:{
	            required: true
	        }
	   	},
	   	messages:{
	   		user:{
	   			required:"账号不能为空",
	   			minlength:"请输入正确的电话号码",
	   			maxlength:"请输入正确的电话号码",
	   			digits:"请输入正确的电话号码"
	   		},
	   		password:{
	   			required:"密码不能为空"
	   		}
	   	}
	});
	
});
