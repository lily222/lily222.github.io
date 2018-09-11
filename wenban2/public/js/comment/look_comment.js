$(function(){
	//渲染长评内容
	var text = $("#comment_content").text();
	$("#comment_content").html(text);

	//获取url的长评id
    (function ($) {
        $.getUrlParam = function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]); return null;
        }
    })(jQuery);
    var commentID = $.getUrlParam('commentID');

	//书评有用还是没用
	var good = 0;  //没有点击有用
	var bad = 0; //没有点击没用
	var $good_bad = $('.good_bad').find('a')
    $good_bad.eq(0).on("click",good_click);
    $good_bad.eq(1).on("click",bad_click);
	function good_click(){
        if(good == 0){
            $(this).css("background","#E5E5E5");
            good = 1;
            $good_bad.eq(1).off("click");
            var num = parseInt($(this).find('span').text()) + 1;
            $(this).find('span').text(num);
        }else {
            $(this).css("background","#fff");
            good=0;
            $good_bad.eq(1).on("click",bad_click);
            let num = parseInt($(this).find('span').text()) - 1;
            $(this).find('span').text(num);
		}
	}
	function bad_click(){
        if(bad==0){
            $(this).css("background","#E5E5E5");
            bad = 1;
            $(this).prev().off("click");
            var num = parseInt($(this).find('span').text()) + 1;
            $(this).find('span').text(num);
        }else {
            $(this).css("background","#fff");
            bad = 0;
            $good_bad.eq(0).on("click",good_click);
            var num = parseInt($(this).find('span').text()) - 1;
            $(this).find('span').text(num);
		}
	}

	
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
            $.ajax({
                type:"post",
                url:"/api/comment/delete",
                async:false,
                data:{commentid:commentID},
                success:function (result) {
					alert(result.mes);
					window.location.href= "/";
                }
            });
		}
	});



	
	//如果该长评是自己的长评，则显示相关功能
	  //功能：收藏
	let cookie = $.cookie("keepuser");
	cookie = eval("("+cookie+")");
	let editor = $("#userID").text();
	if(cookie && cookie.phone == editor){
		$('.edit').css("display","inline-block");
		$('.delete').css("display","inline-block");
	}else {
        $('.collect').off("click");
        $('.collect').css("background","#E5E5E5");
        $('.collect').attr("disabled","disabled");
        $('.collect').css("cursor","not-allowed");
        $('.collect').css("cursor","-ms-not-allowed");
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
