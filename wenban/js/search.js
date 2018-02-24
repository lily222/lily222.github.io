$(function(){
	//引入头部,阻止异步加载
	$.ajax({
		type:"get",
		url:"../html/head.html",
		async:false,
		success:function(html){
			$('header').html(html);
		}
	});
	
	
	
	$(window).scroll(function(){
		//左侧导航
		if($(this).scrollTop()>190){
			$('.search_nav').addClass("fixed_search_nav");
		}else{
			$('.search_nav').removeClass("fixed_search_nav");
		}
		//返回顶部按钮
		if($(this).scrollTop()>300){
			$('#to_top').show();
			var top = $('#show_more').offset().top;
			if($('#location').offset().top>=top){
				$('#to_top').addClass("down");
			}else{
				$('#to_top').removeClass("down");
			}
		}else{
			$('#to_top').hide();
		}
	});
	
	//导航选项卡
	$('.search_nav').find("li").on("click",function(){
		
		$('.search_nav').find("li").each(function(index){
			$(this).removeClass("active");
			$('.each_content').eq(index).hide();
		});
		
		$(this).addClass("active");
		var content_title = $(this).text();
		$(".search_content").find("h3").eq(0).text("相关"+content_title+"：");
		$('.each_content').eq($(this).index()).show();
	});
	$('.search_nav').find("a").on("click",function(e){
		e.preventDefault();
	});
	
	//返回顶部
	$('#to_top').on("click",function(){
		$('body,html').animate({scrollTop:0},300);
	});
	
});
