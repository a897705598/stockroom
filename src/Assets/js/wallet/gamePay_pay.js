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



function initPage(appVersion,appKey) {
	var type = getQueryString("type");
	var typeId = getQueryString("typeId");
	var postType = getQueryString("postType");
	var GoodsCatalogID = getQueryString("goodsId");
	if(type == 1){
		if(postType == "GoodsCatalogID"){
			var pageUrl = serverUrl+"/game/categoryid/goodsinfo";
			var pageDate = {
				GoodsCatalogID: GoodsCatalogID,
				app_version: appVersion,
				app_key:appKey
			};
		}else if(postType == "GoodsID"){
			var pageUrl = serverUrl+"/game/goodsid/goodsinfo";
			var pageDate = {
				GoodsID: GoodsCatalogID,
				app_version: appVersion,
				app_key:appKey
			};
		}else{
			console.log(postType);
			alert("未知的postType")
		}
	}else if(type == 2){
		var pageUrl = serverUrl+"/game/categoryid-keyword/goodsinfo";
		var pageDate = {
			GoodsCatalogID: GoodsCatalogID,
			keyword:typeId,
			app_version: appVersion,
			app_key:appKey
		};
	}

 pageDate = JSON.stringify(pageDate);
 window.RXXBWallet.doPostWithEncrypt(pageUrl, pageDate, "getPage");
}

//初始化页面
function getPage(res){
	//console.log(res);
	//$(".payBox").empty();
	if(res) {
		//var page = changeToObject(res);
		var page = JSON.parse(res);
		if (page.retcode == 1) {
			var resData = page.data;
			console.log(resData)
			if(resData.MessageCode){
				alert(resData.MessageInfo);
			}else{
				resData.forEach(function(it,idx){
					//过滤卡密
					if(it.TemplateGuid){
						var btn = '<div class="btn" data-price = "'+it.SellPrice+'" data-goodsId="'+it.GoodsID+'" data-TemplateGuid="'+it.TemplateGuid+'">'
							+'<p class="title">'+it.GoodsName+'</p>'
							+'<div>'
							+'<p class="oldPrice">原价：<span>'+it.GoodsParvalue+'元</span></p>'
							+'<p class="nowPrice">优惠价：<span>'+it.SellPrice+'元</span></p>'
							+'</div>'

							+'</div>';
						$(btn).appendTo($(".payBox"));
					}
				});
				$(".payBox .btn").unbind("click").bind("click", function() {
					$(this).addClass("choose").siblings().removeClass("choose");
					choose();
				});
				$(".payBox .btn").eq(0).addClass("choose").siblings().removeClass("choose");
				choose();
			}

		} else {
			window.RXXBWallet.doToastMsg("获取数据错误");
		}
	}else{
		//initPage(appVersion,appKey);
	}

}

//选择规格
function choose(){
	if($(".payBox .btn").length >0){
		var TemplateGuid = $(".payBox .choose").attr("data-TemplateGuid");
		console.log(TemplateGuid);
		if(TemplateGuid){
			$.showLoading();
			var url = serverUrl+"/game/get/game-server";
			var data = {
				TemplateGuid: TemplateGuid,
				app_version: appVersion,
				app_key:appKey
			};
		 data = JSON.stringify(data);
		 window.RXXBWallet.doPostWithEncrypt(url, data, "initSelect");
	// 		$.ajax({
	// 			url : url,
	// 			type: "POST",
	// 			data:data,
	// 			dataType:"JSON",
	// 			success: function(res) {
	// 				initSelect(res);
	// 			},
	// 			error:function (res) {
	// 				$.hideLoading();
	// 				console.log(res)
	// 			}
	// 		});
		}else{
			window.RXXBWallet.doToastMsg("卡密暂不支持");
			$(".options").removeClass("show").addClass("hide");
			$(".options .valBox").attr("data-val","");
			$(".districtBox .valBox").attr("data-template","");
			getPrice();
		}
	}else{
		window.RXXBWallet.doToastMsg("暂不支持此项充值");
	}

}

//初始化选项框
function initSelect(res) {
	$.hideLoading();
	//重置选项
	$(".options").removeClass("show").addClass("hide");
	$(".options .valBox").attr("data-val","");
	$(".districtBox .valBox").attr("data-template","");
	$(".mobileSelect").remove();

	if(res) {

		//var page = changeToObject(res);
		var page = JSON.parse(res);
		if (page.retcode == 1) {
			var resData = page.data;
			console.log(resData)
			if(resData.type){
				resData.type.forEach(function (it,idx) {
					if(it.is_check){
						switch(it.type_name)
						{
							case "ChargeAccount":
								//"充值账号"
								$(".accountBox").addClass("show").removeClass("hide");
								break;
							case "ChargeNum":
								//"购买数量"
								var numList = resData.ChargeNum;
								if(numList.length == 1){
									//最大最小
									var str = numList[0];
									if(str.indexOf("-") != -1){
										var min = str.split("-")[0];
										var max = str.split("-")[1];
										amount(min,max);
									}else if(str.indexOf(" ") != -1){
										var min = str.split(" ")[0];
										var max = str.split(" ")[1];
										amount(min,max);
									}else{
										alert("数量字符串"+str);
									}

									$(".numBox").addClass("show").removeClass("hide");
								}else{
									//枚举
									var numSelect = new MobileSelect({
										trigger: '#num',
										title: '',
										wheels: [
											{data : numList}
										],
										position: [],
										transitionEnd:function(indexArr, data){
											//console.log(data);
										},
										callback:function(indexArr, data){
											console.log(data);
											$(".numSelect .valBox").attr("data-val",data);
											getPrice();
										}
									});
									$(".numSelect").addClass("show").removeClass("hide");
									$(".numSelect .valBox").attr("data-val","0");
								}
								break;
							case "ChargeGame":
								//"充值游戏"
								var arr = resData.ChargeGame;
								var template = "";
								districtInit(arr,template);
								break;
							case "ChargeRegion":
								//"充值区"
								var arr = resData.ChargeRegion;
								var template = "";
								districtInit(arr,template);
								break;
							case "ChargeServer":
								//"充值服"
								var arr = resData.ChargeServer;
								var template = "";
								districtInit(arr,template);
								break;
							case "ChargeType":
								//"计费方式"
								var typeList = resData.ChargeType;
								var typeBox = new MobileSelect({
									trigger: '#type',
									title: '',
									wheels: [
										{data : typeList}
									],
									position: [],
									transitionEnd:function(indexArr, data){
										console.log(data);
									},
									callback:function(indexArr, data){
										console.log(data);
										$("#type").attr("data-val",data);
									}
								});
								$(".typeBox").addClass("show").removeClass("hide");
								break;
							case "ChargeGameRegion":
								//"充值游戏-充值区"
								var arr = resData.ChargeGameRegion;
								var template = "";
								districtInit(arr,template);
								break;
							case "ChargeGameRegionServer":
								//"充值游戏-充值区-充值服"
								var arr = resData.ChargeGameRegionServer;
								var template = "";
								districtInit(arr,template);
								break;
							case "ChargePWD":
								//"充值密码"
								$(".pwdBox").addClass("show").removeClass("hide");
								break;
							case "ChargeRegionServer":
								//"充值区-充值服"
								var arr = resData.ChargeRegionServer;
								var template = "";
								districtInit(arr,template);
								break;
							default:

						}
					}
				})
			}
		} else {
			// window.RXXBWallet.doToastMsg("获取数据错误");
			showEmpty();
		}
	}else{
		//choose();
	}
	getPrice();
}

//初始化分区选择
function districtInit(arr,template) {
	var newArr = getArr(arr);
	var districtSelect = new MobileSelect({
		trigger: '#district',
		title: '',
		wheels: [
			{data : newArr}
		],
		position: [],
		transitionEnd:function(indexArr, data){
			//console.log(data);
		},
		callback:function(indexArr, data){
			//console.log(data);
			var val={};
			data.forEach(function (it,idx) {
				val[it.id] = it.value;
			});
			console.log(val);
			val = JSON.stringify(val);
			$(".districtBox .valBox").attr("data-val",val);
		}
	});
	$(".districtBox").addClass("show").removeClass("hide");
	$(".districtBox .valBox").attr("data-template",template);
}

//生成分区数组
function getArr(arr) {
	var newArr = [];
	arr.forEach(function (item,index) {
		//找最外层
		if(item.game_name){
			//最外层为游戏  找第二层
			var game = {
				value : item.game_name,
				id:"chargegame",
				childs : []
			};
			newArr.push(game);
			if(item.ChargeRegion){
				//第二层为区  找第三层
				var ChargeRegion = item.ChargeRegion;
				ChargeRegion.forEach(function (it,idx) {
					var region = {
						value : it.region_name?it.region_name:it,
						id:"chargeregion",
						childs : []
					};
					newArr[index].childs.push(region);
					if(it.ChargeServer){
						var ChargeServer = it.ChargeServer;
						ChargeServer.forEach(function (i) {
							var server = {
								value : i,
								id:"chargeserver"
							};
							newArr[index]["childs"][idx]["childs"].push(server);
						});
					}
				});
			}else if(item.ChargeServer){
				//第二层为服  结束
				var ChargeServer = item.ChargeServer;
				ChargeServer.forEach(function (i) {
					var server = {
						value : i,
						id:"chargeserver"
					};
					newArr[index]["childs"].push(server);
				});
			}
		}else if(item.region_name){
			//最外层为区
			var region = {
				value : item.region_name?item.region_name:item,
				id:"chargeregion",
				childs : []
			};
			newArr.push(region);
			if(item.ChargeServer){
				var ChargeServer = item.ChargeServer;
				ChargeServer.forEach(function (i) {
					var server = {
						value : i,
						id:"chargeserver"
					};
					newArr[index]["childs"].push(server);
				});
			}
		}else if(item.server_name){
			//最外层为区
			var server = {
				value : item.server_name?item.server_name:item,
				id:"chargeserver"
			};
			newArr.push(server);
		}else{
			newArr.push(item);
		}
	});
	console.log(newArr);
	return newArr;
}

//设置加减点击事件
function amount(min,max) {
	//数量加
	$(".sumBox #add").unbind("click").bind("click",function(e){
		e.stopPropagation();
		var num = $(this).prev().text();
		if(num*1<max*1){
			$(this).prev().text(num*1+1);
			$(this).prev().attr("data-val",num*1+1);
		}
		getPrice();
	});

//数量减
	$(".sumBox #sub").unbind("click").bind("click",function(e){
		e.stopPropagation();
		var num = $(this).next().text();
		if(num*1>min*1){
			$(this).next().text(num-1);
			$(this).next().attr("data-val",num-1);
		}
		getPrice();
	});
	$(".sum").text(min);
	$(".sum").attr("data-val",min);
	getPrice();
}

//计算价格
function getPrice() {
	var price = $(".payBox .choose").attr("data-price");
	if($(".numSelect").hasClass("show")){
		var num = $(".numSelect .valBox").attr("data-val");
	}else if($(".numBox").hasClass("show")){
		var num = $(".numBox .valBox").attr("data-val");
	}else{
		var num = 1;
	}
	var pay = price*num;
	$(".reality .pay").text(pay+"元");
	$(".reality .pay").attr("data-pay",pay);
}

$(".payBtn").unbind("click").bind("click",function () {
	chargeTimeCard();
});


//充点卡
function chargeTimeCard(){
	//生成数据
	var data = {};
	var flag = true;
	$(".show .valBox").each(function () {
		var name = $(this).attr("data-valName");
		var val = $(this).attr("data-val");
		var tip = $(this).attr("data-tip");
		if(name == "chargegame"){
			if(val){
				val = JSON.parse(val);
				$.extend(data, val);
			}
		}else if(name == "chargeaccount"||name == "chargepassword"){
			val = $(this).val();
			data[name] = val;
		}else{
			data[name] = val;
		}
		if(!val || val == 0){
			//alert(tip);
			window.RXXBWallet.doToastMsg(tip);
			flag = false;
			return false;
		}
	});

	if(flag){
		data.productid = $(".choose").attr("data-goodsid");
		data.buyamount = $(".pay").attr("data-pay");
		if(!data.buynum){
			data.buynum = 1;
		}
		initChoose();
		$('.paybutton').on('click',function () {
			// var pay_mode = $(this).attr('ids');
			// if(pay_mode == 1){
			// 	window.RXXBWallet.doToastMsg('支付宝支付暂未开放，请稍后再试！');
			// }else if(pay_mode == 2){
			// 	window.RXXBWallet.doToastMsg('微信支付暂未开放，请稍后再试！');
			// }
            //
			// $('.chooseListBox').animate({
			// 	bottom:'-160px'
			// },200,function () {
			// 	$('#backBox').fadeOut(100,function () {
			// 		$('#backBox').remove()
			// 	});
			// });
			var pay_mode = $(this).attr('ids');
			data.pay_mode = pay_mode;
			data.app_key = appKey;
			data.app_version = appVersion;
			var pageUrl = serverUrl+"/api/wallet/order/game-pay/post";
			var pageDate = JSON.stringify(data);
			$.showLoading();

			window.RXXBWallet.doPostWithEncrypt(pageUrl, pageDate, "paycallback");
		});
		console.log(data);
	}
}

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
}

//点击支付回调函数
function paycallback(res) {
	//alert(res);
	$.hideLoading();
	var page = JSON.parse(res);
	$('#pagBoxId').html(page.data[0]);
	//alert(page.data.length)
	if(!page.data.length){
		$('#pagBoxId').html('');
		window.RXXBWallet.doToastMsg('微信支付暂未开放，请稍后再试！');
	}
	/*if(page.retcode==1){
	 $('#backBox').remove()
	 addLazy();
	 var pageUrl = serverUrl+'/api/wallet/order/get/info';
	 var pageDate={
	 order_id:page.data.order_id?page.data.order_id:0
	 }
	 pageDate = JSON.stringify(pageDate)
	 window.RXXBWallet.doPost(pageUrl, pageDate, "againGetData");
	 }else{
	 alert('失败')
	 }*/
}

//异常函数
function methodError(res) {
	$.hideLoading();
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