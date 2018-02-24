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
	
	//推荐语与小说简介的动效
	$('.recommendation_title').on("click",function(){
		$(this).parent().parent().find('.summary_text').eq(0).slideUp(function(){
			$(this).parent().parent().find('.summary_title').eq(0).css("border-radius","10px");
		});
		$(this).css("border-radius","10px 10px 0px 0px");
		$(this).next().slideDown();
		
	});
	$('.summary_title').on("click",function(){
		$(this).parent().parent().find('.recommendation_text').eq(0).slideUp(function(){
			$(this).parent().parent().find('.recommendation_title').eq(0).css("border-radius","10px");
			
		});
		$(this).css("border-radius","10px 10px 0px 0px");
		$(this).next().slideDown();
		
	});
	
	//书单包含的小说的页数
	$.jqPaginator('.content_main_pagination ul',{
		totalCounts: 10,//分页的总条目数；默认0  
        pageSize: 1,//每一页的条目数；默认0  
        visiblePages: 4,//最多显示的页码数  
        currentPage: 1,  //一开始显示的页面
        first: '<li class="prev"><a href="javascript:;">首页</a></li>',  
        last: '<li class="prev"><a href="javascript:;">尾页</a></li>',  
        prev: '<li class="prev"><a href="javascript:;"><</a></li>',  
        next: '<li class="next"><a href="javascript:;">></a></li>',  
        page: '<li class="page"><a href="javascript:;">{{page}}</a></li>',
        onPageChange: function (num, type) {}
	});
	//评论页数
	$.jqPaginator('.comment_pagination ul',{
		totalCounts: 10,//分页的总条目数；默认0  
        pageSize: 1,//每一页的条目数；默认0  
        visiblePages: 4,//最多显示的页码数  
        currentPage: 1,  //一开始显示的页面
        first: '<li class="prev"><a href="javascript:;">首页</a></li>',  
        last: '<li class="prev"><a href="javascript:;">尾页</a></li>',  
        prev: '<li class="prev"><a href="javascript:;"><</a></li>',  
        next: '<li class="next"><a href="javascript:;">></a></li>',  
        page: '<li class="page"><a href="javascript:;">{{page}}</a></li>',
        onPageChange: function (num, type) {}
	});
	
	//点击评论出现编辑框
	$('.comment').on("click",function(){
		$('.edite_right').find("div").eq(0).html("评论：")
		$('.edite').show();
		$('.edite').find("textarea").eq(0).focus();
		$('html,body').animate({scrollTop: $('#footer').offset()},2000);
	});
	//点击回复出现编辑框
	$('.reactive').on("click",function(){

		var reactive_people = $(this).parent().find('.name').text();
//		alert($(this).parent().find('.name').text());
		$('.edite_right').find("span").eq(0).html(reactive_people);
		$('.edite').show();
		$('.edite').find("textarea").eq(0).focus();
		$('html,body').animate({scrollTop: $('#footer').offset()},1000);
	});
	//取消编辑框
	$('.cancel').on("click",function(){
		$('.edite').fadeOut();
	});
	
	
	
	//独属于my_page的部分
	
	//更换书单封面
	$('.book_list_cover').hover(function(){
		$('.change_cover').show();
	},function(){
		$('.change_cover').hide();
	});
	$('.change_cover').on("mouseenter",function(){
		$('.change_cover').show();
	});
	$('.change_cover').on("mouseout",function(e){
		
		$('.change_cover').hide();
	});
	
	//修改书单标题
	var old_name;
	$('.change_book_list_name').on("click",function(){
		old_name = $('.book_list_name').find("span").eq(0).text();
		$(this).parent().find("span").eq(0).attr("contenteditable","true").focus();
		$(this).parent().on("keydown",function(event){
			if(event.keyCode == "13"){
				$('.book_list_name').find("span").eq(0).blur();
			}
		});
	});
	$('.book_list_name').find("span").eq(0).blur(function(){
		$('.change_book_list_name').parent().off("keydown");
		var new_name = $(this).text().trim();
		$(this).attr("contenteditable","false");
		if(new_name == ""){
			alert("标题不能为空");
			$(this).text(old_name);
		}else if(new_name.length>10){
			alert("标题不能超过10个字符");
			$(this).text(old_name);
		}else{
			//提交新的书单标题
			console.log("提交新的书单标题");
		}
	});
	
	//修改标签
	$('.change_tab').on("click",function(){
		//获取旧标签
		var old_tab = $('.tab').find("i").eq(0).text().split("、");
		if(old_tab != 0){
			var lis;
			$.each(old_tab, function(i) {
				if(i == 0){
					lis = "<li>"+old_tab[0]+"</li>";
				}else{
					lis += "<li>"+old_tab[i]+"</li>";
				}
			});
			$('.old_tab').find("ul").eq(0).empty().prepend($(lis));
		}
		
		//删除旧标签
		function delete_tab(){
			$('.old_tab').find("li").on("click",function(){
				$(this).remove();
			});
		}
		delete_tab();
		//点击添加新标签
		$('.add_tab').find("li").on("click",function(){
			var new_str = $(this).text();
			var old_num = $('.old_tab').find("li");
			if(old_num.length<10){
				if(old_num != 0){
					var exit = 0;  //判断标签是否存在
					$.each(old_num, function(i) {
						if($('.old_tab').find("li").eq(i).text() == new_str){
							alert("该标签已存在");
							exit = 1;
							return false;
						}
					});
					if(exit == 0){
						$('.old_tab').find("ul").eq(0).append($("<li>"+new_str+"</li>"));
					}
				}else{
					$('.old_tab').find("ul").eq(0).append($("<li>"+new_str+"</li>"));
				}
				delete_tab();
			}else{
				alert("最多只能有10个标签！");
			}
			
		});
		//手写添加新标签
		$('#submit_tab').on("click",function(){
			var new_str = $(this).prev().val();
			if(new_str){
				var old_num = $('.old_tab').find("li");
				if(old_num.length<10){
					if(old_num != 0){
						var exit = 0;  //判断标签是否存在
						$.each(old_num, function(i) {
							if($('.old_tab').find("li").eq(i).text() == new_str){
								alert("该标签已存在");
								exit = 1;
								return false;
							}
						});
						if(exit == 0){
							$('.old_tab').find("ul").eq(0).append($("<li>"+new_str+"</li>"));
						}
					}else{
						$('.old_tab').find("ul").eq(0).append($("<li>"+new_str+"</li>"));
					}
					delete_tab();
				}else{
					alert("最多只能有10个标签！");
				}
			}
		});
		//确定修改标签
		$('#submit_change').on("click",function(){
			var old_num = $('.old_tab').find("li");
			var str;
			$.each(old_num, function(i) {
				if(i ==0){
					str = old_num.eq(0).text();
				}else{
					str = str+"、"+old_num.eq(i).text();
				}
			});
			$('.tab').find("i").eq(0).html(str);
			
			//解除绑定
			$('.change_tab').off("click");
		});
		//解除绑定
		$('.close').click(function(){
			$('.change_tab').off("click");
		});
		$('.modal-footer').find("button").eq(0).click(function(){
			$('.change_tab').off("click");
		});
	});
	
	//修改推荐语
	$('.change_recommendation').on("click",function(e){
//		e.stopPropagation();
		$(this).parent().next().find("p").eq(0).attr("contenteditable","true").focus();
		$(this).parent().next().children("input").css("display","block");
	});
	$('.recommendation_text').children("input").on("click",function(){
		var new_recommendation = $(this).parent().text().trim();
		if(new_recommendation==""){
			alert("推荐语不能为空");
			$(this).prev().text("用户未填写评语");
			//提价推荐语为“提交新的评语”
			
		}else{
			//提交新的评语
			console.log("提交新的推荐语");
		}
		$(this).css("display","none");
		$(this).prev().attr("contenteditable","false");
	});
	
	//删除每一个小说
	$(".del_each_novel").on("click",function(){
		var novel_name = $(this).next().text();
		var del = confirm("确认从书单中删除《"+novel_name+"》？");
		if(del == true){
			$(this).parent().parent().remove();
		}
	});
	
	//分享：将内容复制到剪贴板上
	var clipboard = new Clipboard('.share');
	clipboard.on('success', function (e) {
		$(".share_message").show().fadeOut(3000);		
	  	e.clearSelection();
	});
	clipboard.on('error', function (e) {
	  $(".share_message").text("复制不成功！").show().fadeOut(2000);
	});
	$('.share').on("click",function(e){
		e.preventDefault();
		$(".share").val("");
		var copy_text = "文瓣书单：“";
		copy_text = copy_text+$('.book_list_name').text()+"” ";
		copy_text = copy_text+window.location.href;
		$(this).attr("data-clipboard-text",copy_text);
	});
	
	
});
