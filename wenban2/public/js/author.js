$(function(){
	//引入头部,阻止异步加载
	$.ajax({
		type:"get",
		url:"../html/head.html",
		async:false,
		success:function(html){
			$('header').html(html);
		}
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
	
		/*分页显示，可参考fenyaaaaaaa.html*/
	 $.jqPaginator('#inv_page', {  
            //注意：要么设置totalPages，要么设置totalCounts + pageSize，否则报错；设置了totalCounts和pageSize后，会自动计算出totalPages。  
            //totalPages: 10,//分页的总页数;默认0  
            totalCounts: 50,//分页的总条目数；默认0  
            pageSize: 10,//每一页的条目数；默认0  
            visiblePages: 5,//最多显示的页码数  
            currentPage: 1,  
            first: '<li class="prev"><a href="javascript:;">首页</a></li>',  
            last: '<li class="prev"><a href="javascript:;">尾页</a></li>',  
            prev: '<li class="prev"><a href="javascript:;"><</a></li>',  
            next: '<li class="next"><a href="javascript:;">></a></li>',  
            page: '<li class="page"><a href="javascript:;">{{page}}</a></li>',
            onPageChange: function (num, type) {}
            });
	
	/*分页显示，可参考fenyaaaaaaa.html,结束*/
	
});
