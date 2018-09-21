var appVersion = "";
var appKey;
//获取版本号
window.RXXBWallet.getAppConfig("getApp");

//版本回调
function getApp(res) {
	var result = changeToObject(res);
	appVersion = result.appVersion?result.appVersion:"1.0.0";
	appKey = result.appKey?result.appKey:"-";
	initPage(appVersion,appKey);
}

//获取数据渲染页面
function initPage(appVersion,appKey) {
	$(".cardList .cardList-l").empty();
	$(".cardList-r .cardBox").empty();
	var pageUrl = serverUrl+"/game/all-category";
	// var pageUrl = "/game/all-category";
	var pageDate = {
      	app_version: appVersion,
		app_key:appKey
	};
 pageDate = JSON.stringify(pageDate);
 window.RXXBWallet.doPostWithEncrypt(pageUrl, pageDate, "getPage");
	// $.ajax({
	// 	url : pageUrl,
	// 	type: "POST",
	// 	data:"",
	// 	dataType:"JSON",
	// 	success: function(res) {
	// 		getPage(res);
	// 	}
	// });
}

//异常函数
function methodError(res) {
	var result = JSON.parse(res);
	if(result.errorCode == 0){
		//无网
		window.RXXBWallet.doToastMsg(result.errorMsg);
	}else if(result.errorCode == 1){
		//连接失败
		window.RXXBWallet.doToastMsg(result.errorMsg);
	}else if(result.errorCode == 2){
		//json入参错误
		window.RXXBWallet.doToastMsg(result.errorMsg);
	}else{
		window.RXXBWallet.doToastMsg(result.errorMsg);
	}
}

//初始化页面
function getPage(res){
	console.log(res);
	var keyword_name = getQueryString("keyword_name");
	if(res) {
		//var page = changeToObject(res);
		var page = JSON.parse(res);
		if (page.retcode == 1) {

			var resData = page.data;
			var left = $(".cardList .cardList-l");
			resData.forEach(function(it,idx){
				if(it.category_api_ids.length != 0){
					var li = '<li data-key="'+it.keyword_name+'"><i class="line"></i><p>'+it.category_name+'</p></li>';
					li = $(li);
					if(keyword_name == it.keyword_name){
						li.addClass("active");
					}
					li.appendTo(left);
				}
			});
			liActive(resData,keyword_name);

			$(".cardList-l li").unbind("click").bind("click",function(){
				$(this).addClass("active").siblings().removeClass("active");
				var key = $(this).attr("data-key");
				console.log(key);
				liActive(resData,key);
			});



		} else {
			// window.RXXBWallet.doToastMsg("获取数据错误");
			showEmpty();
		}
	}else{
		initPage(appVersion,appKey);
	}
}

//选择栏目
function liActive(data,key) {
	$(".cardList-r .cardBox").empty();
	data.forEach(function (item,idx) {
		if(item.keyword_name == key){
			$(".cardList-r .name").text(item.category_name);
			item.category_api_ids.forEach(function (it,idx) {
				var imgSrc = it.icon?it.icon:"/assets/walletImages/gamePay/icon.png";
				var goodsId = it.GoodsCatalogID?it.GoodsCatalogID:it.GoodsID;
				var postType = it.GoodsCatalogID?"GoodsCatalogID":"GoodsID";
				var keyword = it.keyword?it.keyword:"";
				var cardItme = '<div class="cardItem" data-keyword="'+keyword+'" data-type="'+item.type+'" data-typeId="'+item.type_cate_id+'" data-goodsId="'+goodsId+'" data-postType = "'+postType+'">'
					+'<img src="'+imgSrc+'"/>'
					+'<p class="cardName">'+it.GoodsCatalogName+'</p>'
					+'</div>';

				$(cardItme).appendTo($(".cardList-r .cardBox"));
			});
		}
	});
	$(".cardBox .cardItem").unbind("click").bind("click",function(){
		var type = $(this).attr("data-type");
		var postType = $(this).attr("data-postType");
		var typeId = $(this).attr("data-typeId");
		if(type == 1){
			var goodsId = $(this).attr("data-goodsId");
		}else if(type == 2){
			var goodsId = typeId;
			typeId = $(this).attr("data-keyword");
		}else{
			alert("未知type"+type);
		}
		window.location.href = "./charge?type="+type+"&typeId="+typeId+"&postType="+postType+"&goodsId="+goodsId;
	});
}
