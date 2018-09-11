$(function(){
    //判断是自己的主页还是他人的主页
    (function ($) {
        $.getUrlParam = function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]); return null;
        }
    })(jQuery);

    var userID = $.getUrlParam('userID');
    var cookie = $.cookie('keepuser');
    cookie = eval("("+cookie+")");
    if(cookie && userID == cookie.phone){
        window.location.href = "/user/mypage?userID="+userID;
        // window.location.href = "/";
        // alert("tiaozhuan");
    }



    $.ajax({
        type:"post",
        url:"/api/user/message",
        async:false,
        data:{phone:userID},
        success:function (result) {
            $(".message").find("img").eq(0).attr("src",result.userHead);
            $(".message").find("h3").eq(0).text(result.userName);
            $(".personal_message_top").find("img").eq(0).attr("src",result.userHead);
            $(".user_id").text(result.userID);

            if(result.userAbstract && result.userAbstract != "" ){
                $(".add_introduction").hide();
                $(".user_abstract").text(result.userAbstract).parent().show();
            }
        }
    });

    //渲染书单部分
    $.ajax({
        type:"post",
        url:"/page/personpage/blist",
        async:false,
        data:{userid:userID},
        success:function (result) {
            for(let i=0;i<result.length;i++){
                let time = new Date(result[i].BooklistTime);
                time = time.getFullYear() +'-'+(time.getMonth()+1) +'-'+time.getDate();

                let str = "";
                str = str + '<li>';
                str = str + '<a href="/booklist/page?userID='+result[i].BooklistEditID+'&blistID=' + result[i].BooklistID + '"><img src="' + result[i].BooklistCover + '" /></a>';
                str = str + '<h4>' + result[i].BooklistTitle + '</h4>';
                str = str + '<p>'+time+'</p>';
                str = str + '</li>';

                $("#book_list").find(".content").append(str);
            }
        }
    });
    //渲染书评部分
    $.ajax({
        type:"post",
        url:"/page/personpage/lcomment",
        async:false,
        data:{userid:userID},
        success:function (result) {
            let str = "";
            for(let i=0;i<result.length;i++){
                let time = new Date(result[i].LCommentTime);
                time = time.getFullYear() +'-'+(time.getMonth()+1) +'-'+time.getDate();
                let gradewidth = result[i].LCommentGrade*10;
                gradewidth = gradewidth+"%";
                let $div = $("#none");
                $div.html(result[i].LCommentContent);
                let text = $div.text().substring(0,150);


                str = str + '<li>';
                str = str + '<img src="'+result[i].NovelCover+'" />';
                str = str + '<div class="right">';
                str = str + '<a href="/comment?commentID='+result[i].LCommentID+'" target="_blank"><h4>'+result[i].LCommentTitle+'</h4></a></br>';
                str = str + '<p>对《<a href="/novel?novelID='+result[i].NovelID+'">'+result[i].Novelname+'</a>》评论</p>';
                str = str + '<div class="star_black"><div class="star_yellow" style="width:'+gradewidth+' ;"></div></div>';
                str = str + '<p class="text" >'+text+'</p>';
                str = str + '<label>'+time+'</label>';
                str = str + '</div>';
                str = str + '</li>';
            }
            $("#comment").find(".content").empty().append(str);
        }
    });

    //渲染关注部分
    $.ajax({
        type:"post",
        url:"/page/personpage/attention",
        async:false,
        data:{userid:userID},
        success:function (result) {
            $(".fans_num").text(result.attentionedNum);
            $(".attentNum").text(result.attentionNum);

            for(let i =0 ;i<result.attention.length;i++){
                let str = "";
                str = str + '<li><a href="/user/peoplepage?userID='+result.attention[i].AttentionedUId+'">';
                str = str + '<img src="'+result.attention[i].UserHead+'" />';
                str = str + '<label>'+result.attention[i].Username+'</label>';
                str = str + '</a></li>';

                $(".my_follow").append(str);

            }
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
