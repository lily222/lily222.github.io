/*
 * 时间:2017-3-20 19:56:29
 */



$(document).ready(function(){
	
	
	//菜单栏的显示
	$(window.document).scroll(function(){
		var window_top = $(document).scrollTop();
		
		if(window_top>5){
			$("#menubar").show();
		}else{
			$("#menubar").hide();
		}
	})   
	
})

/*
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