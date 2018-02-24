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
	
	//自我介绍
	var introduction_show;
	$('.add_introduction').on("click",function(){ //添加自我介绍
		introduction_show =0;
		$(this).hide();
		$('.edite_introduction').show();
		$('.edite_introduction').find('textarea').focus();
	});
	$('.edite_introduction').find('.save').on("click",function(){
		$(this).parent().hide();
		var text = $('.edite_introduction').find("textarea").val().trim();
		if(text == ""){
			$('.add_introduction').show();
		}else{
			$('.introduction').find('span').text(text);
			$('.introduction').find("p").eq(1).show();
		}
	});
	$('.edite_introduction').find('.cancel').on("click",function(){
		$(this).parent().hide();
		$('.introduction').find("p").eq(introduction_show).show();
	});
	$('.change_introduction').on("click",function(){ //编辑
		introduction_show = 1;
		$(this).parent().hide();
		var text = $('.introduction').find('span').text();
		$('.edite_introduction').show();
		$('.edite_introduction').find('textarea').text(text).focus();
	});
	
});
