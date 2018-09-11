$(function(){

	sel_tab();
	
	//添加新标签
	$('.add_tabs').find("input").eq(1).on("click",add_new_tab);


	$(".submit_blist").on("click",function () {
		var datetime = new Date();
		datetime = datetime.toLocaleDateString();  //创建时间
		var tabs = $(".tabs").find(".sel");        //书单标签
		var tabs_str = "";
		var cookie = $.cookie("keepuser");        //是否登录
		cookie = eval("(" + cookie + ")");
		if(!cookie){
			alert("请登录后再创建");
			return;
		}


		if($(".book_list_name").val() == "" || $(".book_list_name").val() == null){
			alert("请输入书单名");
		}else if(tabs.length == 0){
			alert("至少选择一个标签");
		}else{
			tabs.each(function (i) {
                tabs_str = tabs_str + tabs.eq(i).val() + " ";
            });
            $.ajax({
                type:'POST',
                url:'/api/blist/add',
                dataType:'json',
                data:{
                	phone:cookie.phone,
					tabs:tabs_str,
					date:datetime,
					name:$(".book_list_name").val()
				},
				success:function (data) {
					if(data.mes == "创建成功"){
						alert(data.mes);
						window.location.href = "/user/mypage?userID=12345678901";
					}else {
                        alert(data.mes);
					}
                }
            });
		}

    });

});

//添加新标签函数
function add_new_tab(){
	var val = $(".new_tab").val().trim(); //去除前后的空格
	var tabs_num = $(".tabs").find(".sel").length;
	if(val != ""){
		if(tabs_num<10){
			var exit =0;
			$(".tabs").find("input").each(function(){
				if($(this).val() == val){
					alert("该标签已存在!");
					exit = 1;
					return false;
				}
			});
			if(exit == 0){
				var str;
				str = "<input class='sel' type='button' value='"+val+"' />";
				$('.tabs').append(str);
				sel_tab();
			}
		}else{
			alert("最多只能选择10个标签！");
		}
		
		
	}
}
//选择显示的标签
	function sel_tab(){
		$(".tabs").find("input").off("click");
		$(".tabs").find("input").on("click",function(){
			if($(this).attr("class") == "sel"){
				$(this).removeClass("sel");
			}else{
				var tab_num = $(".tabs").find(".sel").length;
				if(tab_num<10){
					$(this).addClass("sel");
				}else{
					alert("最多只能选择10个标签！");
				}
			}
		});
	}