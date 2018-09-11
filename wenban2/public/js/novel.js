$(function(){

	//功能：收藏
	$('.collect').on("click",function(){
		$(this).css("background","#30A080");
		$(this).css("color","#fff");
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
		var name = $(".nover_name").text();
		var copy_text = name+"：“";
		copy_text = copy_text+$('#middle_left').find('h2').text()+"” ";
		copy_text = copy_text+window.location.href;
		$(this).attr("data-clipboard-text",copy_text);
	});
	
	//	作者简介
	if($('.author_abstract')){
		var text = $(".author_abstract").find("i").text();
		if(text.length>100){
			$(".author_abstract").find("i").text(text.substr(0,100));
		}else{
			$(".author_abstract").find("span").hide();
			$(".author_abstract").find("a").hide();
		}
		
		$(".author_abstract").find("a").on("click",function(){
			$(".author_abstract").find("span").hide();
			$(".author_abstract").find("a").hide();
			$(".author_abstract").find("i").text(text);
		});
	}
	if($('.content_abstract')){
		var text = $(".content_abstract").find("i").text();
		if(text.length>100){
			$(".content_abstract").find("i").text(text.substr(0,100));
		}else{
			$(".content_abstract").find("span").hide();
			$(".content_abstract").find("a").hide();
		}
		
		$(".content_abstract").find("a").on("click",function(){
			$(".content_abstract").find("span").hide();
			$(".content_abstract").find("a").hide();
			$(".content_abstract").find("i").text(text);
		});
	}
	
	//短评点赞
	$('.short_comment').find("li").find("button").on("click",function(){
		if($(this).attr("data-bgcolor")== 0){
			var old_num = parseInt($(this).find("span").text());
			$(this).find("span").text(old_num+1);
			$(this).css("background","rgba(0,0,0,.3)");
			$(this).attr("data-bgcolor","1");
		}else{
			var old_num = parseInt($(this).find("span").text());
			$(this).find("span").text(old_num-1);
			$(this).css("background","#E5E5E5");
			$(this).attr("data-bgcolor","0");
		}
		$.ajax({
            type:"post",
            url:"/api/comment/chengeScommentGood",
            async:true,
			data:{
            	good:$(this).find("span").text(),
				scommentid:$(this).parent().attr("data-scommentid")
			},
			dataType:'json'
		});
	});
	
	//书评有用
	$(".long_good").on("click",function(){
		if($(this).next().attr("data-bgcolor")==0){
			if($(this).attr("data-bgcolor")== 0){
				var old_num = parseInt($(this).find("span").text());
				$(this).find("span").text(old_num+1);
				$(this).css("background","rgba(0,0,0,.3)");
				$(this).attr("data-bgcolor","1");
			}else{
				var old_num = parseInt($(this).find("span").text());
				$(this).find("span").text(old_num-1);
				$(this).css("background","rgba(0,0,0,.1)");
				$(this).attr("data-bgcolor","0");
			}
			//发送改变的数据到后台
            $.ajax({
                type:"post",
                url:"/api/comment/chengeLcommentGood",
                async:true,
                data:{
                    good:$(this).find("span").text(),
                    lcommentid:$(this).parent().attr("data-lcommentid")
                },
                dataType:'json'
            });
		}
		
	});
	//书评无用
	$('.long_bad').on("click",function(){
		if($(this).prev().attr("data-bgcolor")== 0){
			if($(this).attr("data-bgcolor")== 0){
				var old_num = parseInt($(this).find("span").text());
				$(this).find("span").text(old_num+1);
				$(this).css("background","rgba(0,0,0,.3)");
				$(this).attr("data-bgcolor","1");
			}else{
				var old_num = parseInt($(this).find("span").text());
				$(this).find("span").text(old_num-1);
				$(this).css("background","rgba(0,0,0,.1)");
				$(this).attr("data-bgcolor","0");
			}
            //发送改变的数据到后台
            $.ajax({
                type:"post",
                url:"/api/comment/chengeLcommentBad",
                async:true,
                data:{
                    bad:$(this).find("span").text(),
                    lcommentid:$(this).parent().attr("data-lcommentid")
                },
                dataType:'json'
            });
		}
		
	});
	


	//长评显示前100字符
	var $lcommenttext = $(".lcomment_text");
    $lcommenttext.html($lcommenttext.text());
    $lcommenttext.text($lcommenttext.text().substring(0,150)+"……");


    //相似小说推荐
	var tab = $(".tabs").find("li").eq(0).text();
    $.ajax({
        type:"post",
        url:"/page/novel/similer",
        async:true,
        data:{
            tab:tab
        },
        dataType:'json',
		success:function (data) {
			data.forEach(function (item,index) {
                let str = "";
                str += "<li>";
                str = str + "<a href='/novel?novelID="+item.NovelID+"'>" + item.Novelname +"</a><br>";
                if(item.authorname != ""){
                    str = str + '<a href="/?authorID='+item.NovelAuthor+'">'+item.authorname+'</a>';
				}
				str = str + '<div class="star_black"><div class="star_yellow" style="width:'+ item.gradeWidth +' ;"></div></div>';
                str += '</li>';

                $(".similar_novel").find("ul").append(str);
            });
        }
    });

    //渲染添加到书单的弹出框
	$(".btn_function").find("button").eq(4).on("click",function () {
		var cookie = $.cookie("keepuser");
        cookie = eval("("+cookie+")");
		if(cookie == null){
            alert("请登录后再添加小说到书单");
            return false;
		}else {
			$.ajax({
                type:"post",
                url:"/page/add/showBookList",
                async:true,
                data:{
                    phone:cookie.phone
                },
                dataType:'json',
				success:function (data) {
                    $("#book_list_ul").empty();
					data.forEach(function (item,index) {
						let str = "";
						if(index == 0){
							str = str + '<li class="sele" data-blist="'+item.BooklistID+'">'+item.BooklistTitle+'</li>';
						}else {
                            str = str + '<li data-blist="'+item.BooklistID+'">'+item.BooklistTitle+'</li>';
						}
						$("#book_list_ul").append(str);
                    });

                    //选择书单
                    $("#blist_modal").find(".right").find("li").on("click",function(){
                        $("#blist_modal").find(".right").find("li").each(function(){
                            $(this).removeClass("sele");
                        });
                        $(this).addClass("sele");
                    });

                }
			})
		}
    });

	//添加小说到书单
	$("#submit_change").on("click",function () {
		let novelid = $(".btn_function").attr("data-noveid");
		let booklistid = $("#book_list_ul").find(".sele").attr("data-blist");
		var recomment = $(".recommend").find("textarea").val();
		if(recomment == ""){
			alert("请填写推荐语");
			return false;
		}else {
            $.ajax({
                type:"post",
                url:"/api/blist/addNovel",
                async:true,
                data:{
                    novelid:novelid,
                    booklistid:booklistid,
                    recomment:recomment
                },
                dataType:'json',
                success:function (result) {
                    alert(result.mes);
                },
                error:function () {
                    alert("上传失败");
                }
            });
		}
    });

	//收藏小说
	$(".collect").on("click",function () {
        let novelid = $(".btn_function").attr("data-noveid");
        let cookie = $.cookie("keepuser");
        cookie = eval("("+cookie+")");
        $.ajax({
            type:"post",
            url:"/api/collect/novel",
            async:true,
            data:{
                novelid:novelid,
                userid:cookie.phone,
				ctype:"小说"
            },
            dataType:'json',
            success:function (result) {
                alert(result.mes);
            },
            error:function () {
                alert("上传失败");
            }
        });
    });

});
