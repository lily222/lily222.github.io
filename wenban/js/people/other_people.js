$(function(){
	//引入头部,阻止异步加载
	$.ajax({
		type:"get",
		url:"../../html/head.html",
		async:false,
		success:function(html){
			$('header').html(html);
		}
	});
	
	//我的收藏，选项卡
	$('.collect_button').on("click",function(){
		$('.collect_button').each(function(){
			$(this).removeClass("active");
			$(this).next().removeClass("active");
		});
		$(this).addClass("active");
		$(this).next().addClass("active");
	});
	
	//回复留言
	$('#message_board').find(".react").on("click",function(){
		$('body,html').animate({'scrollTop':$('#message_board').offset().top},500);
		var text = $(this).next().find('.commenter').text();
		$('.leave_message').find('textarea').eq(0).text("回复 "+text+"：").focus();
	});
	
	//关注此人
	$('.follow').on("click",function(){
		if($(this).text()=="关注此人"){
			$(this).text("已关注");
		}else{
			$(this).text("关注此人");
		}
	});
	
	
});
