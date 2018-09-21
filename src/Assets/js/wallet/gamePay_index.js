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
    $(".column").empty();
    var pageUrl = serverUrl+"/game/all-category";
    // var pageUrl = "/game/all-category";
    var pageDate = {
        app_version: appVersion,
        app_key : appKey
    };
 pageDate = JSON.stringify(pageDate);
 window.RXXBWallet.doPostWithEncrypt(pageUrl, pageDate, "getPage");
    // $.ajax({
    //     url : pageUrl,
    //     type: "POST",
    //     data:"",
    //     dataType:"JSON",
    //     success: function(res) {
    //         getPage(res);
    //     }
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
	console.log(res)
	if(res) {
        //var page = changeToObject(res);
        var page = JSON.parse(res);
        if (page.retcode == 1) {

            var resData = page.data;
            resData.forEach(function(it,idx){
            	if(it.is_index&&it.category_api_ids.length != 0){
            		var box = '<div class="column">'
								+'<div class="title">'
									+'<div class="title-l">'
										+'<img src="/assets/walletImages/gamePay/icon.png"/>'
										+'<p class="name">'+it.category_name+'</p>'
									+'</div>'
									+'<div class="title-r">'
										+'<p class="more" data-key="'+it.keyword_name+'">更多</p>'
									+'</div>'
								+'</div>'
								
								+'<div class="cardBox">'
									
								+'</div>'
							+'</div>';
					box = $(box);
                    box.appendTo($(".index"));
					
					it.category_api_ids.forEach(function(item,index){
                        var imgSrc = item.icon?item.icon:"/assets/walletImages/gamePay/icon.png";
                        var goodsId = item.GoodsCatalogID?item.GoodsCatalogID:item.GoodsID;
                        var postType = item.GoodsCatalogID?"GoodsCatalogID":"GoodsID";
                        var keyword = item.keyword?item.keyword:"";
						var cardItme = '<div class="cardItem" data-keyword="'+keyword+'" data-type="'+it.type+'" data-typeId="'+it.type_cate_id+'" data-goodsId="'+goodsId+'" data-postType = "'+postType+'">'
										+'<img src="'+imgSrc+'"/>'
										+'<p class="cardName">'+item.GoodsCatalogName+'</p>'
									+'</div>';
									
						$(cardItme).appendTo(box.find(".cardBox"))
					});
            	}
            });
            $(".title .more").unbind("click").bind("click",function(){
                var key = $(this).attr("data-key");
                window.location.href = "./list?keyword_name="+key;
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
        } else {
            // window.RXXBWallet.doToastMsg("获取数据错误");
            showEmpty();
        }
    }else{
        //initPage(appVersion,appKey);
    }
}
