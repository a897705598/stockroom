

initPage();

//获取数据渲染页面
function initPage() {
    var pageUrl = "/api/wallet/redirect/apply/card";
    $.ajax({
        headers: {
            'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
        },
        url : pageUrl,
        type: "POST",
        data:"",
        dataType:"JSON",
        success: function(res) {
            if(res.retcode != undefined){
                if (res.retcode == 1) {
                    getPage(res);

                }else{
                    window.MeizuDemo.showToast(res.info[0])
                }
            }else{
                getPage(res);
            }

        }
    });
}


function getPage(res) {
    var page = res;
    if(page.retcode == 1){
        var resData = page.data;
        var list = resData.list;
        for(var i=0;i<list.length;i++){
            var is_new = list[i].is_new == 1?'new':'';
            var is_recommend = list[i].is_recommend == 1?"jian":"";
            var item = '<li class="'+is_new+' '+is_recommend+'" data-link = "'+list[i].linkTo+'">'
                +'<div class="imgBox">'
                +'<img src="'+list[i].urlPic+'"/>'
                +'</div>'
                +'<div class="tipBox">'
                +'<div class="tip_l">'
                +'<p class="bankName">'+list[i].name+'</p>'
                +'<p class="tip">'+list[i].description+'</p>'
                +'</div>'
                +'<div class="tip_r">'
                +'<a href="#" class="applyBtn">申请</a>'
                +'</div>'
                +'</div>'
                +'</li>';
            item = $(item).unbind("click").bind("click",function () {
                window.location.href = $(this).attr("data-link");
            });
            item.appendTo($(".banks"));
        }
    }else{
        alert("获取数据错误")
    }

}