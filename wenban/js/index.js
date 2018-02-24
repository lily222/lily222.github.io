$(function(){
	//引入头部,阻止异步加载
	$.ajax({
		type:"get",
		url:"html/head.html",
		async:false,
		success:function(html){
			$('header').html(html);
		}
	});
	
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
		
		imgs.eq(2).children("img").attr("src","img/carousel/carousel_"+show_index+"_01.gif");//更换下一页的图片
		imgs.eq(3).children("img").attr("src","img/carousel/carousel_"+show_index+"_02.gif");
		
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
		
		imgs.eq(2).children("img").attr("src","img/carousel/carousel_"+show_index+"_01.gif");//更换下一页的图片
		imgs.eq(3).children("img").attr("src","img/carousel/carousel_"+show_index+"_02.gif");
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
	
});
