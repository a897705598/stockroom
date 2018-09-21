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

//异常函数
function methodError(res) {
    var result = changeToObject(res);
    if(result.errorCode == 0){
        //无网
        window.RXXBWallet.doToastMsg(result.errorMsg);
    }else if(result.errorCode == 1){
        //连接失败
        window.RXXBWallet.doToastMsg(result.errorMsg);
    }else if(result.errorCode == 2){
        //json入参错误
        window.RXXBWallet.doToastMsg(result.errorMsg);
    }
}


//获取数据渲染页面
function initPage(appVersion) {
    var pageUrl = serverUrl+"/api/wallet/redirect/insurance";
    var pageDate = {
        app_version: appVersion,
        app_key: appKey
    };
    pageDate = JSON.stringify(pageDate);
    window.RXXBWallet.doPostWithEncrypt(pageUrl, pageDate, "getPage");
}


function getPage(res) {
    if(res){
        var page = JSON.parse(res);
        if(page.retcode == 1){
            var resData = page.data;
            //广告位
            var bannerUrl = resData.advertisement[0].urlPic?resData.advertisement[0].urlPic:"";
            var banner = '<img src="'+bannerUrl+'"/>';
            $(".banner").empty();
            $(".banner").append($(banner));
            var linkUrl = resData.advertisement[0].linkTo;
            linkUrl = linkUrl?linkUrl:"javascript:void(0);";
            $(".banner").attr("href",linkUrl);
            var list = resData.list;
            for(var i=0;i<list.length;i++){
                var node = list[i];
                var linkTo = node.linkTo?node.linkTo:"javascript:void(0);";
                var imgPic = node.urlPic?node.urlPic:"";
                var item = '<li>'
                    +'<a href="'+linkTo+'">'
                    +'<div class="imgBox">'
                    +'<img src="'+imgPic+'"/>'
                    +'</div>'
                    +'<div class="tipBox">'
                    +'<div class="tip_t">'
                    +'<p class="title">'+node.name+'</p>'
                    +'<p class="tip">'+node.description+'</p>'
                    +'</div>'
                    +'<div class="tip_b">'
                    +'<p class="price">'+node.cost+'<span class="unit">'+node.starting+'</span></p>'
                    +'</div>'
                    +'</div>'
                    +'</a>'
                    +'</li>';
                $(item).appendTo($(".insList"))
            }
        }else{
            // alert("获取数据错误");
            showEmpty();

        }
    }else{
        initPage(appVersion,appKey);
    }

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