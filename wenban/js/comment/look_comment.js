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
	
	//书评有用还是没用
	var good = 0;  //没有点击有用
	var bad = 0; //没有点击没用
	$('.good_bad').find('a').eq(0).on("click",function(){
		if(good == 0){
			$(this).css("background","#E5E5E5");
			good = 1;
			$(this).next().off("click");
			var num = parseInt($(this).find('span').text()) + 1;
			$(this).find('span').text(num);
		}
	});
	$('.good_bad').find('a').eq(1).on("click",function(){
		if(bad==0){
			$(this).css("background","#E5E5E5");
			bad = 1;
			$(this).prev().off("click");
			var num = parseInt($(this).find('span').text()) + 1;
			$(this).find('span').text(num);
		}
	});
	
	//功能：收藏
	$('.collect').on("click",function(){
		$(this).css("background","#E5E5E5");
		var num = parseInt($(this).find('span').eq(0).text())+1;
		$(this).find('span').text(num);
		
		$(this).off("click");
	});
	//功能：分享
	var clipboard = new Clipboard('.shear');
	clipboard.on('success', function (e) {
		$(".shear_message").show().fadeOut(3000);		
	  	e.clearSelection();
	});
	clipboard.on('error', function (e) {
	  $(".shear_message").text("复制不成功！").show().fadeOut(2000);
	});
	$('.shear').on("click",function(e){
		e.preventDefault();
		$(".shear").val("");
		var copy_text = "文瓣长评：“";
		copy_text = copy_text+$('#middle_left').find('h2').text()+"” ";
		copy_text = copy_text+window.location.href;
		$(this).attr("data-clipboard-text",copy_text);
	});
	//功能：删除
	$('.delete').on("click",function(){
		var r=confirm("是否要删除该长评？");
		if(r==true){
			alert("删除");
		}
	});
	
	
	//如果该长评是自己的长评，则显示相关功能
	  //功能：收藏
	if(1 == 1){
		$('.collect').off("click");
		$('.collect').css("background","#E5E5E5");
		$('.collect').attr("disabled","disabled");
		$('.collect').css("cursor","not-allowed");
		$('.collect').css("cursor","-ms-not-allowed");
		
		$('.edit').css("display","inline-block");
		
		$('.delete').css("display","inline-block");
	}
	
	
	//评论
	//点击评论出现编辑框
	$('.react').on("click",function(){
		$('.edite_right').find("div").eq(0).html("评论：")
		$('.edite').show();
		$('.edite').find("textarea").eq(0).focus();
		$('html,body').animate({scrollTop: $('#footer').offset()},2000);
	});
	//点击回复出现编辑框
	$('.reactive').on("click",function(){

		var reactive_people = $(this).parent().find('.name').text();
//		alert($(this).parent().find('.name').text());
		$('.edite_right').find("div").eq(0).html("回复&nbsp;<span>"+reactive_people+"</span>：");
		$('.edite').show();
		$('.edite').find("textarea").eq(0).focus();
		$('html,body').animate({scrollTop: $('#footer').offset()},1000);
	});
	//取消编辑框
	$('.cancel').on("click",function(){
		$('.edite').fadeOut();
	});
	
	
});
