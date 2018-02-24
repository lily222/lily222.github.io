$(function(){
	//引入头部,阻止异步加载
	$.ajax({
		type:"get",
		url:"head.html",
		async:false,
		success:function(html){
			$('header').html(html);
		}
	});
	
//	选项卡按钮
	$('#book_list_main').find('li').on("click",function(){
		$('#book_list_main').find('li').each(function(){
			$(this).removeClass();
		});
		$(this).addClass("active");
	});
	
	//计算每页显示的数量
	var show_width = $(window).width();
	var page_num;
	if(show_width>768 && show_width<= 994){
		page_num=9;
	}else{
		page_num=10;
	}
	
	/*分页显示，可参考fenyaaaaaaa.html*/
	 $.jqPaginator('#pagi', {  
            //注意：要么设置totalPages，要么设置totalCounts + pageSize，否则报错；设置了totalCounts和pageSize后，会自动计算出totalPages。  
            //totalPages: 10,//分页的总页数;默认0  
            totalCounts: 10,//分页的总条目数；默认0  
            pageSize: page_num,//每一页的条目数；默认0  
            visiblePages: 5,//最多显示的页码数  
            currentPage: 1,  
            first: '<li class="prev"><a href="javascript:;">首页</a></li>',  
            last: '<li class="prev"><a href="javascript:;">尾页</a></li>',  
            prev: '<li class="prev"><a href="javascript:;"><</a></li>',  
            next: '<li class="next"><a href="javascript:;">></a></li>',  
            page: '<li class="page"><a href="javascript:;">{{page}}</a></li>',
            onPageChange: function (num, type) {
            	var page_size = page_num;
            	if(type == "init"){
            		$.ajax({
	            		type:"get",
	            		url:"../html/can_delete/pagination_content.html",
	            		async:true,
	            		success:function(html){
	            			$('#hidden').empty().append(html);
	            			var all_num = $('#hidden').find('.each_book_list').length;
	            			$('#pagi').jqPaginator('option', {  
	                            totalCounts: all_num     //根据返回的总条目数动态显示页码总数  
	                       }); 
	                       //修改显示的内容
	                        $('#book_list_list').empty();
	                        $('#hidden').find('.each_book_list').each(function(index){
	                        	var index_num =index+1;
	                        	var start_num = (num-1)*page_size+1;
	                        	var end_num = num*page_size;
	                        	if(index_num>=start_num && index_num<=end_num){
	                        		
	                        		var each_clone = $('#hidden div.each_book_list').eq(index).clone();
	                        		$('#book_list_list').append(each_clone);
	                        	}
	                        });
	                        
	            			book_list_animate();
	            		},  
	                    error: function (xhr, textStatus) {  
	                        console.log('错误');  
	                        console.log(xhr);  
	                        console.log(textStatus);  
	                    }  
	            	});
            	}else{
            		//返回页面顶部
            		$('html,body').scrollTop(80);
            		//修改显示的内容
	                        $('#book_list_list').empty();
	                        $('#hidden').find('.each_book_list').each(function(index){
	                        	var index_num =index+1;
	                        	var start_num = (num-1)*page_size+1;
	                        	var end_num = num*page_size;
	                        	if(index_num>=start_num && index_num<=end_num){
	                        		
	                        		var each_clone = $('#hidden div.each_book_list').eq(index).clone();
	                        		$('#book_list_list').append(each_clone);
	                        	}
	                        });
	                        
	            			book_list_animate();
            	}
            	
            }
//          onPageChange: function (num, type) {  
//              $('#p2').text('当前页码：' + type + '：' + num);  
//              $.ajax({  
//                  //url = http://imoocnote.calfnote.com/inter/getClasses.php?curPage=1  
//                  url: "http://imoocnote.calfnote.com/inter/getClasses.php",  
//                  type: "get",  
//                  timeout: 5000,  
//                  dataType: 'json',  
//                  /*  
//                   contentType: "application/json",  
//                   data: JSON.stringify(datajson),  
//                   * */  
//                  data: {curPage: num},  
//                  success: function (data) {  
//                      $('#total').text('共' + data.totalCount + '条');  
//                      var totalCount = data.totalCount;  
//                      //初始化后，动态修改配置  
//                      $('#pagination2').jqPaginator('option', {  
//                          totalCounts: totalCount//根据返回的总条目数动态显示页码总数  
//                      });  
//                      $('#render-div').empty();  
//                      var html = '';  
//                      if (data && data.data && data.data.length > 0) {  
//                          $.each(data.data, function (i, v) {  
//                              html += '<div class="col-md-3">' +  
//                                  '<img src="' + v.image + '" alt="' + v.title + '">' +  
//                                  '<h4 style="height: 32px;">' + v.title + '</h4>' +  
//                                  '<p style="height: 32px;">' + v.subtitle + '</p>' +  
//                                  '<p style="height: 32px;">' + v.timespan + '</p>' +  
//                                  '</div>';  
//                          });  
//                      }  
//                      $('#render-div').append(html);  
//                  },  
//                  error: function (xhr, textStatus) {  
//                      console.log('错误');  
//                      console.log(xhr);  
//                      console.log(textStatus);  
//                  }  
//              })  
//          }  
            });
	
	/*分页显示，可参考fenyaaaaaaa.html,结束*/
	
	
	
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
