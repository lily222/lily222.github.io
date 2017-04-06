/*
 * 时间:2017-3-20 19:56:29
 */



$(document).ready(function(){
	
	
	//菜单栏的显示       //改进:菜单栏应是向下划出而不是消失
	$(window.document).scroll(function(){
		var window_top = $(document).scrollTop();
		
		if(window_top>5){
			$("#menubar").show();   
		}else{
			$("#menubar").hide();
		}
	})   
	
	//字体的变换
	var i=0;
	var text_arry=new Array("developers","rockstars","designers");
	function text_change(){
		$(".text_change").text(text_arry[i]);
		i++;
		if(i>=3){
			i=0;
		}
	}
	var text_chang=setInterval(text_change,2000);
	
})

/*js的代码
 * 菜单栏的显示
window.onload=function () {
	window.onscroll = function(){ 
    var t = document.documentElement.scrollTop || document.body.scrollTop;  
    var top_div = document.getElementById( "menubar" ); 
    if( t >= 5 ) { 
        top_div.style.display = "none"; 
    } 
   }
	
}

*/