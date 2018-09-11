$(function(){
	let novelnum = 0,usernum = 0,authornum =0,commentnum=0,blistnum=0;
	/*
	* 渲染页面
	* */

	//搜索小说
	function search_novel(){  //star为已经显示的数据条，num为一页要显示的数据条数
		let starnum = novelnum + "," +3;
		novelnum +=3;
        $.ajax({
            type:"post",
            url:"/page/search/novel",
            async:false,
            data:{searchcontent:$("#search_input").val(),starnum:starnum},
            success:function (result) {
                if(result.mes && novelnum == 3){
                    $(".novel.each_content").empty().append("<h2 style='text-align: center;'>"+result.mes+"</h2>")
                    $("#show_more").hide();
                    $("footer").css("position","absolute").css("bottom","0px").css("left","0px");
                }else if(result.mes){
                    $("#show_more").text("没有更多了");
                }else
                {
                    $("#show_more").show();
                    $("footer").css("position","static");

                    result.forEach(function (item,index) {
                        let gradewidth = item.NovelGrade*10;
                        gradewidth = gradewidth + "%";

                        let str = "";
                        str = str + '<div class="each_novel"><div class="left">';
                        str = str + '<a href="/novel?novelID='+item.NovelID+'"><h4 title="'+item.Novelname+'">'+item.Novelname+'</h4></a></br>';
                        str = str + '<div class="star_black"><div class="star_yellow" style="width: '+item.gradewidth+';"></div></div> ';
                        str = str + '<span class="score">'+item.NovelGrade+'</span>';
                        str = str + '<span>（<i class="comment_num">'+item.NovelGradeNum+'</i>人评价）</span>';
                        str = str + '<span class="editor_name">'+item.Authorname+'</span>';
                        str = str + '<span class="year">'+item.NovelTime+'年</span>';
                        str = str + '<p>'+item.NovelAbstract+'</p>';
                        str = str + '</div><img src="'+item.NovelCover+'" /></div>';

                        $(".novel.each_content").append(str);
                    });
                }
            }
        });
	}
	//搜索用户
	function search_user(){
        let starnum = usernum + "," +3;
        usernum +=3;
        $.ajax({
            type:"post",
            url:"/page/search/user",
            async:false,
            data:{searchcontent:$("#search_input").val(),starnum:starnum},
            success:function (result) {
                if(result.mes && usernum == 3){
                    $(".user.each_content").empty().append("<h2 style='text-align: center;'>"+result.mes+"</h2>")
                    $("#show_more").hide();
                    $("footer").css("position","absolute").css("bottom","0px").css("left","0px");
                }else if(result.mes){
                    $("#show_more").text("没有更多了");
                }else
                {
                    $("#show_more").show();
                    $("footer").css("position","static");
                	result.forEach(function (item,index) {
                        let str = "";
                        str = str + '<div class="each_user"><div class="left">';
                        str = str + '<a href="/user/peoplepage?userID='+item.UserPhone+'"><h4 title="'+item.Username+'">'+item.Username+'</h4></a></br>';
                        str = str + '<span class="fans"><i class="fans_num">'+item.attentionedNum+'</i>人关注</span>';
                        str = str + '<p>'+item.UserAbstract+'</p>';
                        str = str + '</div><img src="'+item.UserHead+'" /></div>';
                        // console.log(item);

                        $(".user.each_content").append(str);
                    });
                }
            }
        });
	}
    //搜索作者
    function search_author(){
        let starnum = authornum + "," +3;
        authornum +=3;
        $.ajax({
            type:"post",
            url:"/page/search/author",
            async:false,
            data:{searchcontent:$("#search_input").val(),starnum:starnum},
            success:function (result) {
                if(result.mes && authornum == 3){
                    $(".editor.each_content").empty().append("<h2 style='text-align: center;'>"+result.mes+"</h2>")
                    $("#show_more").hide();
                    $("footer").css("position","absolute").css("bottom","0px").css("left","0px");
                }else if(result.mes){
                    $("#show_more").text("没有更多了");
                }else
                {
                    $("#show_more").show();
                    $("footer").css("position","static");

                    result.forEach(function (item,index) {
                        let str = "";
                        str = str + '<div class="each_editor"><div class="left">';
                        str = str + '<a href="/author?authorID='+item.AuthorID+'"><h4 title="'+item.Authorname+'">'+item.Authorname+'</h4></a></br>';
                        str = str + '<p>'+item.AuthorAbstract+'</p>';
                        str = str + '<span>作品：<i class="writing">'+item.production+'</i></span>';
                        str = str + '</div><img src="'+item.AuthorHead+'" /></div>';

                        $(".editor.each_content").append(str);
                    });
                }
            }
        });
    }
    //搜索书评
    function search_comment(){
        let starnum = commentnum + "," +3;
        commentnum +=3;
        $.ajax({
            type:"post",
            url:"/page/search/comment",
            async:false,
            data:{searchcontent:$("#search_input").val(),starnum:starnum},
            success:function (result) {
                if(result.mes && commentnum == 3){
                    $(".comment.each_content").empty().append("<h2 style='text-align: center;'>"+result.mes+"</h2>")
                    $("#show_more").hide();
                    $("footer").css("position","absolute").css("bottom","0px").css("left","0px");
                }else if(result.mes){
                    $("#show_more").text("没有更多了");
                }else
                {
                    $("#show_more").show();
                    $("footer").css("position","static");

                    result.forEach(function (item,index) {
                        let str = "";
                        str = str + '<div class="each_comment"><div class="left">';
                        str = str + '<a href="/comment?commentID='+item.LCommentID+'"><h4 title="'+item.LCommentTitle+'">'+item.LCommentTitle+'</h4></a>';
                        str = str + '<p><span>'+item.Username+'</span>&nbsp;评价《<span>'+item.novelname+'</span>》</p>';
                        str = str + '<p>'+item.LCommentContent+'</p>';

                        $(".comment.each_content").append(str);
                    });
                }
            }
        });
    }
    //搜索书单
    function search_booklist(){
        let starnum = blistnum + "," +3;
        blistnum +=3;
        $.ajax({
            type:"post",
            url:"/page/search/blist",
            async:false,
            data:{searchcontent:$("#search_input").val(),starnum:starnum},
            success:function (result) {
                if(result.mes && blistnum == 3){
                    $(".book_list.each_content").empty().append("<h2 style='text-align: center;'>"+result.mes+"</h2>")
                    $("#show_more").hide();
                    $("footer").css("position","absolute").css("bottom","0px").css("left","0px");
                }else if(result.mes){
                    $("#show_more").text("没有更多了");
                }else
                {
                    $("#show_more").show();
                    $("footer").css("position","static");

                    result.forEach(function (item,index) {
                        let tab = item.BooklistTab.trim().replace(/ /g,"、");

                        let str = "";
                        str = str + '<div class="each_book_list"><div class="left">';
                        str = str + '<a href="/booklist/page?userID='+item.BooklistEditID+'&blistID='+item.BooklistID+'"><h4 title="'+item.BooklistTitle+'">'+item.BooklistTitle+'</h4></a></br>';
                        str = str + '<span class="creator">'+item.Username+'&nbsp;（'+item.collectNum+'人收藏）</span></br>';
                        str = str + '<span class="tab">'+tab+'</span>';
                        str = str + '</div><img src="'+item.BooklistCover+'" /></div>';

                        $(".book_list.each_content").append(str);
                    });
                }
            }
        });
    }

    search_novel();
	$(".search_nav").find("li").eq(1).one("click",search_user);
    $(".search_nav").find("li").eq(2).one("click",search_author);
    $(".search_nav").find("li").eq(3).one("click",search_comment);
    $(".search_nav").find("li").eq(4).one("click",search_booklist);

    $("#show_more").on("click",function () {
       let searchtype = $(".search_content").find("h3").text().substr(2,2);
       switch (searchtype){
           case "小说":
               search_novel();
               break;
           case "用户":
               search_user();
               break;
           case "作者":
               search_author();
               break;
           case "书评":
               search_comment();
               break;
           case "书单":
               search_booklist();
               break;
           default:
               console.log("显示更多出现错误");
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
