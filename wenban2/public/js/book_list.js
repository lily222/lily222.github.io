$(function(){

//	选项卡按钮
	$('#book_list_main').find('li').on("click",function(){
		$('#book_list_main').find('li').each(function(){
			$(this).removeClass();
		});
		$(this).addClass("active");
	});

	//选项卡内容显示
	$("#ago").on("click",function () {
        $.ajax({
            type:"post",
            url:"/page/blist/ago",
            async:false,
            success:function (result) {
                let str = "";
				result.forEach(function (item,index) {
                    str = str + '<div class="each_book_list"  onclick="window.location.href=\'/booklist/page?userID='+item.BooklistEditID+'&blistID='+item.BooklistID+'\'" data-url="'+item.BooklistID+'">';
                    str = str + '<img class="book_list_cover" alt="书单封面" src="'+item.BooklistCover+'" />';
                    str = str + '<div class="book_list_content">';
                    str = str + '<h3 title="'+item.BooklistTitle+'">'+item.BooklistTitle+'</h3>';
                    str = str + '<i title="收藏" class="glyphicon glyphicon-heart"></i><span>'+item.BooklistCollect+'</span>';
                    str = str + '<i title="点赞" class="glyphicon glyphicon-star"></i><span>'+item.BooklistGood+'</span>';
                    str = str + '<span class="book_list_tab">标签：'+item.BooklistTab+'</span>';
                    str = str + '</div>';
                    str = str + '</div>';
                });
				$("#book_list_list").empty().append(str);
                book_list_animate();
            }
        });
    });
    $("#now").on("click",function () {
        $.ajax({
            type:"post",
            url:"/page/blist/now",
            async:false,
            success:function (result) {
                let str = "";
                result.forEach(function (item,index) {
                    str = str + '<div class="each_book_list"  onclick="window.location.href=\'/booklist/page?userID='+item.BooklistEditID+'&blistID='+item.BooklistID+'\'" data-url="'+item.BooklistID+'">';
                    str = str + '<img class="book_list_cover" alt="书单封面" src="'+item.BooklistCover+'" />';
                    str = str + '<div class="book_list_content">';
                    str = str + '<h3 title="'+item.BooklistTitle+'">'+item.BooklistTitle+'</h3>';
                    str = str + '<i title="收藏" class="glyphicon glyphicon-heart"></i><span>'+item.BooklistCollect+'</span>';
                    str = str + '<i title="点赞" class="glyphicon glyphicon-star"></i><span>'+item.BooklistGood+'</span>';
                    str = str + '<span class="book_list_tab">标签：'+item.BooklistTab+'</span>';
                    str = str + '</div>';
                    str = str + '</div>';
                });
                $("#book_list_list").empty().append(str);
                book_list_animate();
            }
        });
    });
    $("#future").on("click",function () {
        $.ajax({
            type:"post",
            url:"/page/blist/future",
            async:false,
            success:function (result) {
                let str = "";
                result.forEach(function (item,index) {
                    str = str + '<div class="each_book_list"  onclick="window.location.href=\'/booklist/page?userID='+item.BooklistEditID+'&blistID='+item.BooklistID+'\'" data-url="'+item.BooklistID+'">';
                    str = str + '<img class="book_list_cover" alt="书单封面" src="'+item.BooklistCover+'" />';
                    str = str + '<div class="book_list_content">';
                    str = str + '<h3 title="'+item.BooklistTitle+'">'+item.BooklistTitle+'</h3>';
                    str = str + '<i title="收藏" class="glyphicon glyphicon-heart"></i><span>'+item.BooklistCollect+'</span>';
                    str = str + '<i title="点赞" class="glyphicon glyphicon-star"></i><span>'+item.BooklistGood+'</span>';
                    str = str + '<span class="book_list_tab">标签：'+item.BooklistTab+'</span>';
                    str = str + '</div>';
                    str = str + '</div>';
                });
                $("#book_list_list").empty().append(str);
                book_list_animate();
            }
        });
    });
	
	//计算每页显示的数量
	// var show_width = $(window).width();
	// var page_num;
	// if(show_width>768 && show_width<= 994){
	// 	page_num=9;
	// }else{
	// 	page_num=10;
	// }
	
	// /*分页显示，可参考fenyaaaaaaa.html*/
	//  $.jqPaginator('#pagi', {
     //        //注意：要么设置totalPages，要么设置totalCounts + pageSize，否则报错；设置了totalCounts和pageSize后，会自动计算出totalPages。
     //        //totalPages: 10,//分页的总页数;默认0
     //        totalCounts: 10,//分页的总条目数；默认0
     //        pageSize: page_num,//每一页的条目数；默认0
     //        visiblePages: 5,//最多显示的页码数
     //        currentPage: 1,
     //        first: '<li class="prev"><a href="javascript:;">首页</a></li>',
     //        last: '<li class="prev"><a href="javascript:;">尾页</a></li>',
     //        prev: '<li class="prev"><a href="javascript:;"><</a></li>',
     //        next: '<li class="next"><a href="javascript:;">></a></li>',
     //        page: '<li class="page"><a href="javascript:;">{{page}}</a></li>',
     //        onPageChange: function (num, type) {
     //        	var page_size = page_num;
     //        	if(type == "init"){
     //        		$.ajax({
	//             		type:"get",
	//             		url:"../html/can_delete/pagination_content.html",
	//             		async:true,
	//             		success:function(html){
	//             			$('#hidden').empty().append(html);
	//             			var all_num = $('#hidden').find('.each_book_list').length;
	//             			$('#pagi').jqPaginator('option', {
	//                             totalCounts: all_num     //根据返回的总条目数动态显示页码总数
	//                        });
	//                        //修改显示的内容
	//                         $('#book_list_list').empty();
	//                         $('#hidden').find('.each_book_list').each(function(index){
	//                         	var index_num =index+1;
	//                         	var start_num = (num-1)*page_size+1;
	//                         	var end_num = num*page_size;
	//                         	if(index_num>=start_num && index_num<=end_num){
	//
	//                         		var each_clone = $('#hidden div.each_book_list').eq(index).clone();
	//                         		$('#book_list_list').append(each_clone);
	//                         	}
	//                         });
	//
	//             			book_list_animate();
	//             		},
	//                     error: function (xhr, textStatus) {
	//                         console.log('错误');
	//                         console.log(xhr);
	//                         console.log(textStatus);
	//                     }
	//             	});
     //        	}else{
     //        		//返回页面顶部
     //        		$('html,body').scrollTop(80);
     //        		//修改显示的内容
	//                         $('#book_list_list').empty();
	//                         $('#hidden').find('.each_book_list').each(function(index){
	//                         	var index_num =index+1;
	//                         	var start_num = (num-1)*page_size+1;
	//                         	var end_num = num*page_size;
	//                         	if(index_num>=start_num && index_num<=end_num){
	//
	//                         		var each_clone = $('#hidden div.each_book_list').eq(index).clone();
	//                         		$('#book_list_list').append(each_clone);
	//                         	}
	//                         });
	//
	//             			book_list_animate();
     //        	}
     //
     //        }
     //        });
	
	/*分页显示，可参考fenyaaaaaaa.html,结束*/


    book_list_animate();
	//	书单动画
	function book_list_animate(){
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
	}
	
	
});
