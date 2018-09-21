(function($) {
	var loading = {};
	loading.html = '<div class="loadingBox"><div class="bg"><div class="spinner"><div class="rect1"></div><div class="rect2"></div><div class="rect3"></div><div class="rect4"></div><div class="rect5"></div></div></div></div>'
	loading.showLoading = function(){
		$(this.html).appendTo($(document.body))
	}
	loading.hideLoading = function(){
		$(".loadingBox").remove()
	}
	
	
	$.extend(loading);
})(jQuery);