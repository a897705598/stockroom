/*转换php数据*/
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


/*表单验证提示*/
function formNotic(idName) {
    $(idName).find('input[type=text]').blur(function () { //表单验证
        if($(this).val()==''){
            $(this).parent().next().css('display','inline-block')
        }else{
            $(this).parent().next().css('display','none')
        }
        if($(this).hasClass('input_tel')){
            if($(this).val().search(/^0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8}$/)==-1 ){
                $(this).parent().next().css('display','inline-block')
            }else{
                $(this).parent().next().css('display','none')
            }
        }
        if($(this).hasClass('input_idcard')){
            if($(this).val().search(/^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/)==-1 ){
                $(this).parent().next().css('display','inline-block')
            }else{
                $(this).parent().next().css('display','none')
            }
        }
    })
}