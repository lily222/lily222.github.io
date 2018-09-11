$(function(){
	
	
//	登录后显示个人账户的相关信息
	$('.user_message').on("mouseover",function(){
		$('#user_message_list').stop(true,true);
		$('#user_message_list').show();
	});
	$('.user_message').mouseleave(function(){
		setTimeout(function(){
			$('#user_message_list').stop(true,true);
			$('#user_message_list').slideUp();
		},500);
	});
	
//	平板搜索框
	$('#head_search_button').on("click",click_search_button);
	
	function click_search_button(e){
		var check = $('#head_search').css('display');
		if(check == "none"){
			
			e.preventDefault();
			$("nav").find('form').addClass("clicked_form");
			$('#head_search').focus();
			$('.log').css("display","none");
			$('.user_message').css("display","none");
			
			$(document).on("click",function(event){
				if(event.target !== $('#head_search_button').get(0) && event.target !== $('#head_search').get(0)){
					$("nav").find('form').removeClass("clicked_form");
		//			判断是否登录,选择对应的div显示
		//			$('.log').css("display","block");
					$('.user_message').css("display","block");
				}
			});
		}
	}
	
	
//手机根据是否登录，显示手机菜单。


//手机点击弹出菜单
	$('.little_nav_button').on("click",function(e){
		$('#little_nav_ul').stop(true,true);
		$('#little_nav_ul').slideToggle();
	});

	//查看cookie
	var cookie = $.cookie("keepuser");
	cookie = eval("(" + cookie + ")");
	//头部显示是否登录
	if(cookie){

		$.ajax({
			type:'POST',
			url:'/api/user/message',
			dataType:'json',
			data:{phone:cookie.phone},
			success:function (result) {
				var head_url = result.userHead;
				head_url = "url(" + head_url +")";
				$(".head_portrait").css("background-image",head_url);
				$('.user_message').find("p").eq(0).text(result.userName);
            }
		});
		
		$('.log').hide();
		$('.user_message').show();
		$('.little_log').hide();
		$('.little_user_message').show();
		$('.people_page').attr("href","/user/mypage?userID="+cookie.phone);
	}


	//退出登录
	$(".quit").on("click",function () {
		var quit = confirm("是否要退出登录？");
		if(quit == true){
            $.cookie("keepuser",null,{
                expires:7,
                path:'/'
            });
			window.location.href = "/";
		}
    });
	
});
