$(function(){

	//点击添加新标签
	$('.use_tab').find("li").on("click",function(){
		var new_str = $(this).text();
		var selected = $('.selected_tab').find("li");
		if(selected.length<10){
			if(selected.length != 0){
				var exit = 0;//判断标签是否存在
				$.each(selected, function(i) {
					if($(".selected_tab").find("li").eq(i).text() == new_str){
						alert("该标签已存在");
							exit = 1;
							return false;
					}
				});
				if(exit == 0){
						$('.selected_tab').find("ul").eq(0).append($("<li>"+new_str+"</li>"));
					}
			}else{
				$('.selected_tab').find("ul").eq(0).append($("<li>"+new_str+"</li>"));
			}
			//删除已选标签
			delect_tab();
		}else{
			alert("最多只能有10个标签！");
		}
	});
	
	//手写添加新标签
	$(".add_new_tab").on("click",function(){
		var new_str = $(this).prev().val().trim();
		if(new_str){
			var selected = $('.selected_tab').find("li");
			if(selected.length<10){
				if(selected.length != 0){
					var exit = 0;//判断标签是否存在
					$.each(selected, function(i) {
						if($(".selected_tab").find("li").eq(i).text() == new_str){
							alert("该标签已存在");
								exit = 1;
								return false;
						}
					});
					if(exit == 0){
							$('.selected_tab').find("ul").eq(0).append($("<li>"+new_str+"</li>"));
						}
				}else{
					$('.selected_tab').find("ul").eq(0).append($("<li>"+new_str+"</li>"));
				}
				//删除已选标签
				delect_tab();
			}else{
				alert("最多只能有10个标签！");
			}
		}
	});

	//提交短评信息到后台
	$(".save").on("click",function () {
		let grade = $("input[name='evaluate_num']").filter(":checked");
		let tab = $(".selected_tab").find("li");
		let text = $(".conttent").find("textarea").eq(0).val();
		if(grade.length == 0){
			alert("请给小说评分");
		}else if(tab.length == 0){
			alert("请给小说选择标签");
		}else if(text == "" || text == null){
			alert("请输入简评");
		}else {
            let cookie = $.cookie("keepuser");
            cookie = eval("(" + cookie + ")");
            let date = new Date();
            let date_str = date.toLocaleDateString() + " ";
            date_str = date_str + date.getHours() + ":" + date.getMinutes() + ":" +date.getSeconds();
			let tabstr = [];
			for(let index = 0;index < tab.length;index++){
                tabstr[index] = tab.eq(index).text();
			}
            // console.log(tabstr);

            //获取url的长评id
            (function ($) {
                $.getUrlParam = function (name) {
                    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
                    var r = window.location.search.substr(1).match(reg);
                    if (r != null) return unescape(r[2]); return null;
                }
            })(jQuery);
            var novelID = $.getUrlParam('novelID');
            $.ajax({
                type: "POST",
                url: "/api/comment/addShortComment",
                dataType: "json",
                data: {
                    phone: cookie.phone,
                    novelId:novelID,
                    datetime:date_str,
                    grade:grade.val(),
                    content:text,
					tab:tabstr
                },
                success: function (result) {
                    if(result.mes == "保存成功"){
                        alert(result.mes);
                        window.location.href = "/novel?novelID="+novelID;
                    }else {
                        alert(result.mes);
                    }
                },
                error:function () {
                    alert("上传失败");
                }
            });
		}
    });


	//取消添加短评，返回上一页
	$(".cancel").on("click",function () {
		let cancel = confirm("确定取消编辑评论？");
		if(cancel){
			history.back();
		}
    });
	
});

//删除已选标签
function delect_tab(){
	$(".selected_tab").find("li").on("click",function(){
		$(this).remove();
	});
}
