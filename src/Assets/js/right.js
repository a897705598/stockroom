// (function ($) {
	var dialog = {};
	dialog.isImplement = false;
	dialog.addType;
	//展示方法
	dialog.showiframe = function (arr,index,callback) {
		var callback = callback;
		// console.log(callback);
		$('#rigth_iframe').attr('src','')
		$('body').css('overflow','hidden');
		//动态生成外部大盒子iframe标签
		if($('.showbox').length==0){
			var maxBox = document.createElement('div');
			maxBox.className = 'showbox';
			maxBox.innerHTML =
				'<h2><a class="close" href="#"></a></h2>'+
				'<ul class="left_tab"></ul>'+
				'<iframe src="" style="width:100%;height:100%" id="rigth_iframe"></iframe>';
			var shade = document.createElement('div');
			shade.className = "shade_box";
			shade.appendChild(maxBox);
			document.body.appendChild(shade);
		}
		$('.shade_box').css('display','block')
		$('.showbox').stop()
		$(".showbox").animate({top:50,opacity:'show',width:"92%",height:"94%",right:0},300);
		//生成左边按钮
		var html = '';
		for (var i = 0; i <arr.length; i++) {
			if(i==(index-1)){
				html+='<li url="'+arr[i].url+'" class="li_current" index="'+i+'">'+arr[i].name+'</li>';
			}else{
				html+='<li url="'+arr[i].url+'" index="'+i+'">'+arr[i].name+'</li>';
			}
		}
		$('.left_tab').html(html);
		//右上角关闭
		$(".showbox .close").unbind('click').bind('click',function(){
			dialog.closeiframe(callback);
		})
		//点击其他位置关闭弹窗
		$('.shade_box').unbind('click').bind('click',function(){
			dialog.closeiframe(callback);
		});
		$(".showbox").click(function(event){
			event.stopPropagation();
		});
		//点击左侧按钮跳转
		$('.left_tab li').unbind('click').bind('click',function () {
			if($(this).hasClass('active')){
				return false
			}

			$('#rigth_iframe').attr('src',arr[$(this).attr('index')].url);

			$(this).addClass("active").siblings().removeClass("active");
		})
		// console.log($('body .left_tab li').eq(index - 1));
		$('body .left_tab li').eq(index-1).click();
		return false;
	}
	//回调函数判断执行
	dialog.allowcallback = function(type){
		dialog.isImplement = true;
		dialog.addType = type;
	}
	//关闭弹窗
	dialog.closeiframe = function(callback){
		// console.log(callback);
		$('.showbox').stop()
		$(".showbox").animate({top:"20px",opacity: 'hide',width:0,height:"90%",right:0},200,function () {
			$('.shade_box').css('display','none');
			$('body').css('overflow','auto');
			// console.log(dialog.isImplement);
			if (typeof callback==='function' && dialog.isImplement) {
				// console.log(1);
				callback(dialog.addType);
			}
		});
	}
	dialog.showlazyLoad=function () {
        var html = '<div class="lazyLoadBox"><div class="spinner"> ' +
        '<div class="rect1"></div> ' +
        '<div class="rect2"></div> ' +
        '<div class="rect3"></div> ' +
        '<div class="rect4"></div> ' +
        '<div class="rect5"></div> ' +
        '</div></div>'
    $('body').append(html);
}
	dialog.removelazyLoad = function () {
    $('body>.lazyLoadBox').fadeOut().remove()
}
	$.extend(dialog);
// })(jQuery);