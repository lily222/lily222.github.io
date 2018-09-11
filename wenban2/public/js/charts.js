$(function(){
	
	// 最受关注小说排行榜页面渲染
    $.ajax({
        type:"post",
        url:"/page/focus_chart",
        async:false,
        success:function (result) {
            //修改内容为数据库的内容
			//渲染第一名
			$("#p2").find(".first_novel").find("img").attr("src",result.highNovel[0].NovelCover);
            $("#p2").find(".first_novel").find("img").attr("onclick","window.location.href='/novel?novelID="+result.highNovel[0].NovelID+"'");
			$("#p2").find(".first_novel_right").find("h4").text(result.highNovel[0].Novelname);
            $("#p2").find(".first_novel_right").find("h4").attr("onclick","window.location.href='/novel?novelID="+result.highNovel[0].NovelID+"'");
            $("#p2").find(".first_novel_right").find(".author").text(result.highNovel[0].authorName);
            $("#p2").find(".first_novel_right").find(".star_yellow").css("width",result.highNovel[0].gradeWidth);
            $("#p2").find(".first_novel_right").find(".score").text(result.highNovel[0].NovelGrade);
            $("#p2").find(".first_novel_right").find(".assess_people").text(result.highNovel[0].NovelGradeNum + " 人评价");
            $("#p2").find(".first_novel_right").find(".short_comment").text(result.highNovel[0].comment);

            //渲染第2-10名

			for(let i = 1;i<10;i++){
                let $p2 = $("#p2").find(".other_each_novel").eq((i-1));
                $p2.find("img").attr("src",result.highNovel[i].NovelCover);
                $p2.find("img").attr("onclick","window.location.href='/novel?novelID="+result.highNovel[i].NovelID+"'");
                $p2.find("p").html(result.highNovel[i].Novelname +' <span>' + result.highNovel[i].NovelGrade + '</span>');
			}
        }

    });
	
	//固定导航的隐藏与显示
	function ShowNav(){
		if(window.location.hash){
			$('#fixed_nav').show();
		}else{
			$('#fixed_nav').hide();
		}
	}
	
	//固定的导航的音乐
	$('.bg_music').on({mouseenter:function(e){
		$(this).find('img').attr('src','/public/img/charts/music_hover.gif');
		$(this).find('p').text('关闭背景音乐');
	},mouseleave:function(e){
		$(this).find('img').attr('src','/public/img/charts/music.gif');
		$(this).find('p').text('天門 - 想い出は逺くの日々');
	}});
	var num_bgmusic = 0;
	$('.bg_music').click(function(){
		if(num_bgmusic++%2 == 0){
			$(this).off('mouseenter').off('mouseleave');
			$(this).find('img').attr('src','/public/img/charts/music_stop.png');
			$(this).find('p').text('播放背景音乐');
			$(this).find("audio")[0].pause();
		}else{
			$(this).on({mouseenter:function(e){
				$(this).find('img').attr('src','/public/img/charts/music_hover.gif');
				$(this).find('p').text('关闭背景音乐');
			},mouseleave:function(e){
				$(this).find('img').attr('src','/public/img/charts/music.gif');
				$(this).find('p').text('天門 - 想い出は逺くの日々');
			}});
			$(this).find('img').attr('src','/public/img/charts/music.gif');
			$(this).find('p').text('天門 - 想い出は逺くの日々');
			$(this).find("audio")[0].play();
		}
	});
	
	//固定的导航的目录
	var num_nav =0;
	$('.page_nav').click(function(){
		var page_nav = $(this);
		if(num_nav++%2 == 0){
			page_nav.css('background','#fff');
			$('.scroll_nav').show();
		}else{
			page_nav.css('background','transparent');
			$('.scroll_nav').hide();
		}
	});
	$('dd').on("click",function(){
		$('dd').each(function(){
			$(this).removeClass();
		});
		$(this).addClass('active');
	});
	//修改固定导航样式
	function change_url(){
		var changed_url_str = window.location.hash.substr(2);
		var changed_url_num = parseInt(changed_url_str)-1;
		$('dd').each(function(){
			$(this).removeClass();
		});
		$('dd').eq(changed_url_num).addClass('active');
	}
	//当url改变时，修改样式
	if( ("onhashchange" in window) && ((typeof document.documentMode==="undefined") || document.documentMode==8)) {  
	    // 浏览器支持onhashchange事件  
	    //window.onhashchange = change_url;  // TODO，对应新的hash执行的操作函数  
	    //window.onhashchange = ShowNav;  // TODO，对应新的hash执行的操作函数
	    window.onhashchange = function(){
	    	change_url();
	    	ShowNav();
	    };
	} else {  
	    // 不支持则用定时器检测的办法  
	    setInterval(function() {  
	        var ischanged = isHashChanged();  // TODO，检测hash值或其中某一段是否更改的函数  
	        if(ischanged) {  
	            change_url();  // TODO，对应新的hash执行的操作函数
	            ShowNav();
	        }  
	    }, 150);  
	}
	//当进入页面，有HASH时的样式
	if(window.location.hash){
		change_url(); 
		ShowNav();
	}
	
	/*页面的主题内容*/
	page_load();
	function page_load(){
		var ShowHegiht = $(window).height();
		//视频
		$('#mp4').height(ShowHegiht-70);
		//页面
		$('#high_nover_page').height(ShowHegiht);
		$('.each_page').height(ShowHegiht);
		
		//高度变化时，页面的顶部显示的内容不变
		var url_hash = window.location.hash;   //目标的name字符
		if(url_hash){
			var to_top = $(url_hash).offset().top;
			$('body,html').scrollTop(to_top);
		}
		
		
		
	}
	//改变浏览器高度
	$(window).resize(page_load);
	
	//下一页函数
	function next_page(){
		var url_num_str = window.location.hash.substr(2);  //路径#后面的数字
		if(!url_num_str){
			$('body,html').animate({'scrollTop':$('#p1').offset().top},1000);
			$(location).attr('href',"#p1");
		}
		
		if(parseInt(url_num_str) < 11){
			var targe_str ="#p" + (parseInt(url_num_str)+1).toString();    //目标的name字符
			var targe_top = $(targe_str).offset().top;
			$('body,html').animate({'scrollTop':targe_top},1000);
			$(location).attr('href',targe_str);
		}
	}
	//上一页函数
	function pre_page(){
		var url_num_str = window.location.hash.substr(2);  //路径#后面的数字
		if(url_num_str == "1"){
			$('body,html').animate({'scrollTop':0},1000);
			setTimeout(function(){
				$(location).attr('href',"");
			},1000);
		}
		if(parseInt(url_num_str) > 1){
			var targe_str ="#p" + (parseInt(url_num_str)-1).toString();    //目标的name字符
			var targe_top = $(targe_str).offset().top;
			$('body,html').animate({'scrollTop':targe_top},1000);
			$(location).attr('href',targe_str);
		}
		
	}
	
	//固定按钮下一页
	$('#next_page_btn').children('i').on("click",next_page);
	//滚轮上下页
	$(document).on('mousewheel', function(event, delta) {
		if(delta < 0){
			next_page();
		}else{
			pre_page();
		}
	});
	
//	移动端第2到10名的左右移动
	var x_start,x_move,left_start,left_end;
	$('.inner_other_novel').each(function(index){

		$(this).get(0).addEventListener("touchstart",function(e){
			x_start = e.touches[0].pageX;
			left_start = $(this).css("left");
            console.log("ok");
		});
		$(this).get(0).addEventListener("touchmove",function(e){
			x_move = e.touches[0].pageX;
			left_end = parseFloat(x_move)-parseFloat(x_start)+parseFloat(left_start);
			//获取inner_other_novel能到达最左端的距离
			var inner_width = $('.inner_other_novel').width();
			var out_width = $('.other_novel').width();
			var leftest = inner_width-out_width;
			
			if(left_end<0 && left_end>(-leftest)){
//				alert(-left_end);
				$(this).css("left",left_end+"px");
			}
			
		});
	});


});
