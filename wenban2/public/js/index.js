$(function(){

		/*轮播图开始*/
//移动出现翻页按钮,停止翻页
$('.carousel').hover(function(){
	$('#carousel_turn_button').stop(true,true);
	$('#carousel_turn_button').fadeIn();
	clearInterval(loop);
},function(){
	$('#carousel_turn_button').stop(true,true);
	$('#carousel_turn_button').fadeOut();
	 loop = setInterval(nextPage,5000);
});


var show_index = 1;
//	翻到下一页
	function nextPage(e){
		
		var imgs = $('.show_img').find("li");
		if(show_index==4){
			show_index=1;
		}else{
			show_index++;
		}
		
		imgs.eq(2).children("img").attr("src","/public/img/carousel/carousel_"+show_index+"_01.gif");//更换下一页的图片
		imgs.eq(3).children("img").attr("src","/public/img/carousel/carousel_"+show_index+"_02.gif");
		
//		alert("3");
//		e.preventDefault();
		imgs.eq(1).addClass('turn_left1');
		imgs.eq(2).addClass('turn_left2');
		imgs.eq(2).on('animationend webkitAnimationEnd oAnimationEnd',function(){
			var img_left_src=imgs.eq(2).children("img").attr("src");
			var img_right_src=imgs.eq(3).children("img").attr("src");
			imgs.eq(0).children("img").attr("src",img_left_src);
			imgs.eq(1).children("img").attr("src",img_right_src);
			imgs.eq(1).removeClass();
			imgs.eq(2).removeClass();
			//修改小点
			var spot=$('#carousel_spot').find('li');
			var spot_index=show_index-1;
			spot.each(function(){
				$(this).removeClass();
			})
			spot.eq(spot_index).addClass('active');
		});
		
	}
	
//	翻到上一页
	function prevousPage(e){
		var imgs = $('.show_img').find("li");
		if(show_index==1){
			show_index=4;
		}else{
			show_index--;
		}
		
		imgs.eq(2).children("img").attr("src","/public/img/carousel/carousel_"+show_index+"_01.gif");//更换下一页的图片
		imgs.eq(3).children("img").attr("src","/public/img/carousel/carousel_"+show_index+"_02.gif");
//		e.preventDefault();
		imgs.eq(0).addClass('turn_right1');
		imgs.eq(3).addClass('turn_right2');
		imgs.eq(3).on('animationend webkitAnimationEnd oAnimationEnd',function(){
			var img_left_src=imgs.eq(2).children("img").attr("src");
			var img_right_src=imgs.eq(3).children("img").attr("src");
			imgs.eq(0).children("img").attr("src",img_left_src);
			imgs.eq(1).children("img").attr("src",img_right_src);
			imgs.eq(0).removeClass();
			imgs.eq(3).removeClass();
			//修改小点
			var spot=$('#carousel_spot').find('li');
			var spot_index=show_index-1;
			spot.each(function(){
				$(this).removeClass();
			})
			spot.eq(spot_index).addClass('active');
		});
	}
	
	$('.turn_next').on("click",nextPage);
	$('.turn_previous').on("click",prevousPage);
	//自动下一页
	 var loop = setInterval(nextPage,5000);
	 
	 //点击小点
	 $('#carousel_spot').find('li').each(function(index){
	 	$(this).on("click",function(index){
			if(($(this).index()+1)>show_index){
	 			show_index = $(this).index();
				nextPage();
			}else if(($(this).index()+1)<show_index){
				
				show_index = $(this).index()+2;
				prevousPage();
			}
	 	});
	 });
	 /*轮播图结束*/

    //渲染热门书单
    $.ajax({
        type:"get",
        url:"/page/host_blist",
        async:false,
        success:function (result) {
        	//复制10个书单
			var blistHtml = $(".each_book_list").html();
			var bliststr =""
			for(var i=0 ;i<9;i++){
				bliststr += '<div class="each_book_list">';
                bliststr += blistHtml;
                bliststr += '</div>';
			}
			$("#hot_book_list").append(bliststr);

			//修改内容为数据库的内容
        	$("#hot_book_list").find(".each_book_list").each(function (index) {
				$(this).find(".book_list_cover").attr("src",result[index].BooklistCover);
				$(this).find("h3").text(result[index].BooklistTitle).attr("title",result[index].BooklistTitle);
				$(this).find(".blist_colloct").text(result[index].BooklistCollect);
                $(this).find(".blist_good").text(result[index].BooklistGood);
                $(this).find(".book_list_tab").text("标签：" + result[index].BooklistTab);
                $(this).attr("onclick","window.location.href='/booklist/page?userID="+result[index].BooklistEditID+"&blistID="+result[index].BooklistID+"'")
            });
		}

    });

    //渲染热门书评
    $.ajax({
        type:"post",
        url:"/page/host_lcomment",
        async:false,
        success:function (result) {
        	for(let i = 0;i<10;i++){
                var hot_comment = "";
                var str = "<div class='nonediv'></div>";
                var lcommentcon = $(str).html(result[i].LCommentContent).text();
                var grade = Number(result[i].LCommentGrade)/10*100;

                hot_comment += '<div class="each_review">';
                hot_comment = hot_comment + '<img alt="小说封面" src="'+ result[i].NovelCover +'">';
                hot_comment += '<div class="hot_review_content">';
                hot_comment = hot_comment + '<h3><a href="/comment?commentID='+result[i].LCommentID+'">' + result[i].LCommentTitle + '</a></h3>';
                hot_comment = hot_comment + '<a class="review_user" href="/user/peoplepage?userID='+result[i].LCommentEID+'">' + result[i].username + '</a> 评论';
                hot_comment = hot_comment + '<a class="nover_name" href="/novel?novelID='+result[i].LCommentNID+'">《' + result[i].Novelname + '》</a>';
            	hot_comment = hot_comment + '<div class="score"> <div class="star_black"></div> <div class="star_yellow" style="width:' + grade + '%"></div></div>';
            	hot_comment = hot_comment + '<p>' + lcommentcon + '</p></div></div>';

				$("#hot_review").append(hot_comment);

			}
        }

    });

//	书单动画
	$('.each_book_list').each(function(){
		$(this).mouseenter(function(){
			var Width = $(document).width();
			if(Width>994){
				$(this).find('.book_list_content').stop(true,true);
				$(this).find('.book_list_content').animate({bottom:'0px'},"slow");
			}
		});
		$(this).mouseleave(function(){
			var Width = $(document).width();
			if(Width>994){
				$(this).find('.book_list_content').stop(true,true);
				$(this).find('.book_list_content').animate({bottom:'-70px'},"slow");
			}
			
		});
	});

	//评分星星的黄色部分
    $("#high_score_novel").find(".score").each(function (i) {
        var star_width = $(this).text();
        star_width = Number(star_width)*10;
        $(this).prev().find(".star_yellow").css("width",star_width+"%");
    });



	
});
