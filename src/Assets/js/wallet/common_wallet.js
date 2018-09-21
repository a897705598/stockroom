// var serverUrl = "http://api.cifswalletapp.com";
var serverUrl = "http://wallet-app.rxxbtech.com";
//var serverUrl = "http://172.17.16.236:8097";
//var serverUrl = "http://172.17.16.244:8056";
//var serverUrl = "http://172.17.38.186:8023";

//手机号码验证
function testPhone(val) {
	var myreg = /^1[345789]\d{9}$/;
	if(!myreg.test(val)) {
		return false;
	} else {
		return true;
	}
}

//运营商验证
var isChinaMobile = /^(?:13[4-9]|147|15[0-27-9]|178|18[2-478])\d{8}$/; //移动方面最新答复
var isChinaUnion = /^(?:13[0-2]|145|15[56]|176|18[56])\d{8}$/; //向联通微博确认并未回复  
var isChinaTelcom = /^(?:133|153|173|177|18[019]|199)\d{8}$/; //1349号段 电信方面没给出答复，视作不存在
var isOtherTelphone = /^170([059])\d{7}$/; //其他运营商  
var utils = {
	checkMobile: function(telphone) {
		if(telphone.length !== 11) {
			return this.setReturnJson(false, '未检测到正确的手机号码');
		} else {
			if(isChinaMobile.test(telphone)) {
				return this.setReturnJson(true, 'CMCC', {
					name: '中国移动'
				});
			} else if(isChinaUnion.test(telphone)) {
				return this.setReturnJson(true, 'ChinaUnicom', {
					name: '中国联通'
				});
			} else if(isChinaTelcom.test(telphone)) {
				return this.setReturnJson(true, 'ChinaTelecom', {
					name: '中国电信'
				});
			} else if(isOtherTelphone.test(telphone)) {
				var num = isOtherTelphone.exec(telphone);
				return this.setReturnJson(true, '', {
					name: '未知'
				});
			} else {
				return this.setReturnJson(false, '未检测到正确的手机号码');
			}
		}
	},
	setReturnJson: function(status, msg, data) {
		if(typeof status !== 'boolean' && typeof status !== 'number') {
			status = false;
		}
		if(typeof msg !== 'string') {
			msg = '';
		}
		return {
			'status': status,
			'msg': msg,
			'data': data
		};
	}
}

//解析json
function changeToObject(str) {
	var date = str.replace(/&quot;/g, '"');
	date = date.replace(/\"\{\"/g, '{"');
	date = date.replace(/\"\[\"/g, '["');
	date = date.replace(/\"\}\"/g, '"}');
	date = date.replace(/\"\]\"/g, '"]');
	date = date.replace(/\"\[\{/g, '[{');
	date = date.replace(/\}\]\"/g, '}]');
	date = date.replace(/\}\}\"/g, '}}');
	date = date.replace(/\\/g, '\\\\');

	return JSON.parse(date)
}

//获取url信息
function getQueryString(key) {
	var reg = new RegExp("(^|&)" + key + "=([^&]*)(&|$)");
	var result = window.location.search.substr(1).match(reg);
	return result ? decodeURIComponent(result[2]) : null;
};

/*retcode callback*/
function retCallback(res,option) {
	for(var k in option){
		if(res.retcode==k){
            typeof option[k] == 'function' && option[k]()
		}
	}
}

//空白页面
function showEmpty(){
    $(".page").empty();
    var html = '<div class="empty">'
        +'<div class="kong"></div>'
        +'<p class="tip">暂无数据</p>'
        +'</div>';
    $(".page").append(html);
}