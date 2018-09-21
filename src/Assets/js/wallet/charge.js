var phone = $(".phone");
var appVersion = "";
var appKey;
var payAgainFlag = true;
//获取版本号
window.RXXBWallet.getAppConfig("getApp");

//版本回调
//getApp('{}')
function getApp(res) {
	var result = JSON.parse(res);
	//var result = {};
	appVersion = result.appVersion?result.appVersion:"1.0.0";
	appKey = result.appKey?result.appKey:"-";
	//initPage(appVersion,appKey);
    /*请输入手机号*/
    $('.payBox .btn.disable').unbind('click').bind('click',function () {
        window.RXXBWallet.isNetworkAvailable("isAvailable");
    })
    phone.unbind("change input").bind("change input", function() {
        var val = $(this).val();
        var type = $(this).attr("data-type");
        if(testPhone(val)) {
            $(".numBox .from").text(utils.checkMobile(val).data.name);
            var pageUrl = serverUrl+"/api/wallet/recharge/flow/fare/products";
            var pageDate = {
                app_version:appVersion,
                app_key:appKey,
                telephone:val
            };
            pageDate = JSON.stringify(pageDate);
            window.RXXBWallet.doPostWithEncrypt(pageUrl, pageDate, "getPage");
        } else {
            
            $('#defaultProduct').removeClass('hide').siblings('div').addClass('hide')
            $(".numBox .from").html("");
        }
        $(".history").slideUp(200);
    });
    $('.tabCheckedBox li').on('click',function (e) {
        e.stopPropagation();
        $(this).addClass('active').siblings('li').removeClass('active')
        if(!testPhone(phone.val())){
            phone.focus()
        }else {
            $('.payBox>div').eq($(this).index()).removeClass('hide').siblings('div').addClass('hide');
        }
    })
    init();//下拉选择层显示
};
function getPage(res) {
    if(res) {
        //var page = res;
        var page = JSON.parse(res);
		if (page.retcode == 1) {
			var resData = page.data;
            for(var key in resData){
                var everyBoxH = ''
                for(var i=0;i<resData[key].products.length;i++){
                    var node = resData[key].products[i];
                    everyBoxH +=
                        '<div class="btn payBtn" product_id="'+ node.product_id +'">' +
                        '<p class="price">' +
                        '<span class="num">' + node.product_name + '</span>' +
                        '</p>' +
                        '<p class="pay" data-price="' + node.price + '" data-code="' + node.product_id + '">' +
                        '<span>价格：</span><span>' + node.price + '元</span>' +
                        '</p>'
                        + '</div>';
                }
                if(key == 'domesticFlowProduct'){
                    $('#domesticFlowProduct>div').html(everyBoxH)
                }else if(key == 'provinceFlowProduct'){
                    $('#provinceFlowProduct>div').html(everyBoxH)
                }
            }
            $('.payBox>div').eq(0).removeClass('hide').siblings('div').addClass('hide')
            /*点击选择支付*/
			$(".payBox .btn.payBtn").unbind("click").bind("click", function () {
                initChoose()
                var product_id = $(this).attr('product_id'),telephone = $('.phone').val(),product_qty=1;
				$('.paybutton').on('click',function () {
                    var pay_mode = $(this).attr('ids');
                    var mobile = $(".phone").val();
                    var from = $(".numBox .from").text();
                    setTelHistory(mobile, from)
                    var pageUrl = serverUrl+'/api/wallet/order/pay/post';
                    var pageDate={
                        product_id:product_id,
                        product_qty:1,
                        pay_mode:pay_mode,
                        telephone:telephone,
						app_version:appVersion,
						app_key:appKey
                    }
                    pageDate = JSON.stringify(pageDate);
                    //window.RXXBWallet.doToastMsg(pageDate);
                    if(pay_mode == 2){
                        $('#pagBoxId').html('');
                        window.RXXBWallet.doToastMsg('微信支付暂未开放，请稍后再试！');
                    }else{
                        if(payAgainFlag){
                            payAgainFlag = false;
                            setTimeout(function () {
                                payAgainFlag = true;
                            },600)
                            window.RXXBWallet.doPostWithEncrypt(pageUrl, pageDate, "paycallback");
                        }
					}
                })
			});
		} else {
            showEmptyProduct();
		}
	}else{
		initPage(appVersion,appKey);
	}
};

//初始化页面 历史记录
function init(){
	var telHistory = getTelHistory();
	if(telHistory.length>0){
		phone.val(telHistory[telHistory.length-1].tel);
		phone.change();
		$(".numBox .from").text(telHistory[telHistory.length-1].from);
		$(".history ul").empty();
		for(var i=telHistory.length-1;i>=0;i--){
			var html = '<li>'
							+'<p>'+telHistory[i].tel+'</p>'
							+'<p>'+telHistory[i].from+'</p>'
						+'</li>'
			$(html).appendTo($(".history ul"));

		}

		$(".numBox").unbind("click").bind("click",function(e){
			e.stopPropagation();
			$(this).unbind('click');
			phone.val("");
			phone.change();
			$(".numBox .from").text("");
			$(".history").slideDown(200);
		})
	}



	$(".history li").unbind("click").bind("click",function(){
		var tel = $(this).find("p").eq(0).text();
		var from = $(this).find("p").eq(1).text();
		phone.val(tel);
		$(".numBox .from").text(from);
		phone.change();
	})

	//清空历史记录
	$(".history .clearH").unbind("click").bind("click",function(){
		clearTelHistory();
		phone.change();
	})

	$(".page").unbind("click").bind("click",function(){
		$(".history").slideUp(200);
		//phone.change();
	})
};

//初始化缴费显示
function chargeInit(msg,type) {
    if(msg){
		$(".payBox .btn").removeClass("disable");
	}else{
		$(".payBox .btn").addClass("disable");
	}
	var from = msg?msg:"default";

    if(type && type!="timeCard"){
		$(".everyPayBox").each(function() {
            if($(this).hasClass(from)) {
                $(this).show().siblings('.everyPayBox').hide();
				/*无内容是判断标题显示隐藏*/
                $(this).parent().prev('p.title').show();
				if($(this).children('p').hasClass('dissupport')){
                    $(this).siblings('p.title').hide()
				}else {
                    $(this).siblings('p.title').show()
				}
			}
		})
	}else{
		$(".payBox").show();
	}



};

//存入历史手机号
function setTelHistory(val,from){
	var flag = true;
	if(val.length != 11){
		flag = false;
	}
	var telHistory = localStorage.getItem("telHistory");
	telHistory = telHistory?JSON.parse(telHistory):[];
	telHistory.forEach(function(it,idx){
		if(it.tel == val){
			flag = false;
		}
	})
	if(flag){
		var data = {
			tel: val,
			from: from
		}
		telHistory.push(data);
		telHistory = telHistory.slice(-5);
		telHistory = JSON.stringify(telHistory);
		localStorage.telHistory = telHistory;
	}
};

//取出历史手机号
function getTelHistory(){
	var telHistory = localStorage.getItem("telHistory");
	telHistory = telHistory?JSON.parse(telHistory):[];
	return telHistory;
};

//清空历史手机号
function clearTelHistory(){
	localStorage.telHistory = '[]';
};

//支付方式弹窗显示
function initChoose() {
    var grayBox =
        '<div id="backBox">' +
        '<div class="chooseListBox">' +
        '<ul class="chooseList">' +
        '<li class="first paybutton" ids="1">支付宝</li>' +
        '<li class="second paybutton" ids="2">微信</li>' +
        '<li class="dele">取消</li>' +
        '</ul>' +
        '</div>' +
        '</div>';
    $('body').append(grayBox);
    $('#backBox').fadeIn(100,function () {
        $('.chooseListBox').animate({
            bottom:'0'
        },200)
    });
    /*取消*/
    $('#backBox .dele').on('click',function () {
        $('.chooseListBox').animate({
            bottom:'-160px'
        },200,function () {
            $('#backBox').fadeOut(100,function () {
                $('#backBox').remove()
            });
        })
    })
    $('#backBox').on('click',function (e) {
        if(e.target==$('#backBox')[0]){
            $('#backBox .dele').trigger('click')
        }
    })
};

//点击支付回调函数
function paycallback(res) {
	//alert(res);
    var page = JSON.parse(res);
    payAgainFlag = true;
    retCallback(page,{
    	1:function () {
            $('#pagBoxId').html(page.data[0]);
		},
		2010:function () {
            window.RXXBWallet.jump2Login("loginSuccess");
        }
    })
};

//异常函数
function methodError(res) {
    var result = JSON.parse(res);
    payAgainFlag = true;
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
};

/*登录成功回调函数*/
function loginSuccess() {
    window.RXXBWallet.isLogin("isLoginCallback");
}

/*判断是否登陆回调*/
function isLoginCallback(res) {
	if(res){
		window.location.reload()
	}else{
        window.RXXBWallet.doToastMsg('登陆失败');
	}
}

/*判断是否联网*/
function isAvailable(res) {
    var page = JSON.parse(res);
    if(page.isAvailable){
        window.RXXBWallet.doToastMsg("请输入正确手机号码");
    }else {
        window.RXXBWallet.doToastMsg("网络连接状态异常");
    }
    $(".numBox input").focus();
}

function showEmptyProduct(){
    $('#noProduct').removeClass('hide').siblings('div').addClass('hide')
}