$(function(){

	//插入图片
	$("#add_pic_save").on("click",function(){
		//获取上传图片的url
		function get_object_url(file){
			var url = null;
			if(window.createObjectURL!=undefined){ //basic
				url=window.createObjectURL(file);
			}else if(window.URL!=undefined){  // mozilla(firefox)
				url=window.URL.createObjectURL(file);
			}else if(window.webkitURL!=undefined){   // webkit or chrome
				url=window.webkitURL.createObjectURL(file);
			}
			return url;
		}
		
		var file = $('#add_pic_input');
		if($.trim(file.val()) != ''){
            // var pic_url = get_object_url($('#add_pic_input').get(0).files[0]);
	    	// $('#com_text').append('<img src="'+pic_url+'" />');
            var pic_url = $("#add_pic_input").val().split("\\").pop();
            pic_url = pic_url.substring(0, pic_url.lastIndexOf("."));
            $('#com_text').append('<img src="/public/uploads/comment/'+pic_url+'.jpg" />');
            console.log(pic_url);
		}





		//文章向下滑动
		$('#com_text').animate({scrollTop:$('#com_text').get(0).scrollHeight},'slow');
		$(document).scrollTop(315);



	});
	
	//取消，关闭页面
	$('#leave').on("click",function(){
		window.close();
	});

    //获取url的小说id
    (function ($) {
        $.getUrlParam = function (name) {
            var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
            var r = window.location.search.substr(1).match(reg);
            if (r != null) return unescape(r[2]); return null;
        }
    })(jQuery);
    var novelID = $.getUrlParam('novelID');

    //添加长评：提交长评信息到后台
	function addLComment() {
		let title = $("#com_title_text").val();
		let grade = $("input[name='com_evaluate_num']").filter(":checked");
		let text = $("#com_text").html();
		if(title == null || title == ""){
			alert("请输入书评的题目");
		}else if(grade.length == 0){
			alert("请给小说评价");
		}else if(!text){
			alert("请输入正文");
		}else {
			var cookie = $.cookie("keepuser");
			cookie = eval("(" + cookie + ")");
			var date = new Date();
			var date_str = date.toLocaleDateString() + " ";
			date_str = date_str + date.getHours() + ":" + date.getMinutes() + ":" +date.getSeconds();

            $.ajax({
                type: "POST",
                url: "/api/comment/add",
                dataType: "json",
                data: {
                	phone: cookie.phone,
					novelId:novelID,
					datetime:date_str,
					grade:grade.val(),
					content:text,
					title:title
				},
                success: function (result) {
                    if(result.mes == "发表成功"){
                        alert(result.mes);
                        window.location.href = "/novel?novelID=" +novelID;
					}else {
                    	alert(result.mes);
					}
                },
                error:function () {
                    alert("上传失败");
                }
            });
		}
    }
    
    //修改长评：提交信息到后台
	function changLComment() {
        let title = $("#com_title_text").val();
        let grade = $("input[name='com_evaluate_num']").filter(":checked");
        let text = $("#com_text").html();
        if(title == null || title == ""){
            alert("请输入书评的题目");
        }else if(grade.length == 0){
            alert("请给小说评价");
        }else if(!text){
            alert("请输入正文");
        }else {
            var cookie = $.cookie("keepuser");
            cookie = eval("(" + cookie + ")");
            var lcommentid = $("#lComment_id").val();

            $.ajax({
                type: "POST",
                url: "/api/comment/change",
                dataType: "json",
                data: {
                    lcommentid:lcommentid,
                    grade:grade.val(),
                    content:text,
                    title:title
                },
                success: function (result) {
                    alert(result.mes);
                    if(result.mes == "修改成功"){
                        window.location.href = "/";
					}
                },
                error:function () {
                    alert("上传失败");
                }
            });
        }
    }

	//根据后台是否发送数据，判断是添加长评还是修改长评，如果是修改长评，则显示长评内容
	if($("#com_title_text").val() != ""){ //修改长评
        //查看cookie
        var cookie = $.cookie("keepuser");
        cookie = eval("(" + cookie + ")");
        //显示长评内容
        $.ajax({
            type:'POST',
            url:'/api/comment/message',
            dataType:'json',
            data:{
            	phone:cookie.phone,
				lcommentid:$("#lComment_id").val()
			},
            success:function (result) {
            	var grade = result.commentDate.LCommentGrade;  //评价
				var content = result.commentDate.LCommentContent; //正文
				$("input[name=com_evaluate_num]").each(function (i) {   //显示评价
					if($(this).val() == grade){
						$(this).attr("checked","checked");
					}
                });
				$("#com_text").html(content);
			}
        });

        //修改长评：提交信息
        $(".submit").on("click",changLComment);

	}else {   //添加长评：提交信息
        $(".submit").on("click",addLComment);
	}

});
