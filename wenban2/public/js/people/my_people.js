$(function(){
		//获取数据库信息改变显示内容
    var cookie = $.cookie("keepuser");
    cookie = eval("(" + cookie + ")");
	$.ajax({
		type:"post",
		url:"/api/user/message",
		async:false,
		data:{phone:cookie.phone},
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
        data:{userid:$(".user_id").text()},
        success:function (result) {
        	for(let i=0;i<3;i++){
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
        data:{userid:$(".user_id").text()},
        success:function (result) {
            let str = "";
            for(let i=0;i<5;i++){
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
        data:{userid:$(".user_id").text()},
        success:function (result) {
            $(".fans_num").text(result.attentionedNum);
            $(".attentNum").text(result.attentionNum);

            for(let i =0 ;i<6;i++){
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
	// $('#message_board').find(".react").on("click",function(){
	// 	$('body,html').animate({'scrollTop':$('#message_board').offset().top},500);
	// 	var text = $(this).next().find('.commenter').text();
	// 	$('.leave_message').find('textarea').eq(0).text("回复 "+text+"：").focus();
	// });
	
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
		$.ajax({
			type:"post",
			url:"/api/user/changeAbstract",
			async:true,
			dataType:'json',
			data:{abstract:text,phone:cookie.phone}
		});
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

	//显示长评
	for(let i = 0;i<3;i++){
        let $div = $(".comment").find(".text").eq(i);
        let text= $div.text();
        $div.html(text);
        $div.text($div.text());
	}
	//留言功能
	// $(".leave_mes").on("click",function () {
	// 	let text = $(".leave_message").find("textarea").val();
	// 	if(text == ""){
	// 		alert("请输入留言");
	// 	}else{
	// 		let time = new Date();
	// 		time = time.toLocaleDateString() + " " + time.toLocaleTimeString();
	// 		let str = "";
    //
	// 	}
    // });

});
