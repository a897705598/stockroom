//解析json
function changeToObject_self(str) {
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

function getQueryString(key){
    var reg = new RegExp("(^|&)"+key+"=([^&]*)(&|$)");
    var result = window.location.search.substr(1).match(reg);
    return result?decodeURIComponent(result[2]):null;
};

//常见问题
$(".more").unbind("click").bind("click",function(e){
    e.stopPropagation();
    $(".moreBox").fadeToggle();
});
$("body").unbind("click").bind("click",function(){
    $(".moreBox").fadeOut();
});