function getData() {
    var data = {};
    data.recFlowId = $(".recFlowId").val();
    data.parcelID = $(".parcelID").val();
    data.estateNum = $(".estateNum").val();
    data.preEstateNum = $(".preEstateNum").val();
    data.RegDate = $(".RegDate").val();
    data.RegCategory = $(".RegCategory").val();
    data.qlr = [];
    $('.qlr_hash').each(function () {
        data.qlr.push($(this).val());
    });
    data.certID = [];
    $('.certID').each(function () {
        data.certID.push($(this).val());
    });
//        var qlr = {};
//        qlr.name_hash = $(".name_hash").val();
//        qlr.type_hash = $(".type_hash").val();
//        qlr.number_hash = $(".number_hash").val();
//        data.nameHash = $(".name_hash").val();
//        data.typeHash = $(".type_hash").val();
//        data.numberHash = $(".number_hash").val();
//        data.qlr = JSON.stringify(qlr);
//        data.content = $(".content").val();
    return data;
}

function aRe($url, $data, $successFun, $errorFun) {
    $.ajax({
        url: $url,
        type: 'POST',
        data: $data,
        dataType: 'JSON',
        success: function (response, status, xhr) {
            if (response.retcode == 1) {
                $successFun(response)
            } else {
                $errorFun(response)
            }
        },
        error: function (xhr, errorText, errorType) {
            alert(errorType.info);
        }
    });
}
function plusEle(self, top, prs) {
    var selfPrs = self.parents(top);
    selfPrs.append(self.parents(prs).clone(true));
}

function delEle(self, prs) {
    if ($(prs + " .del-icon").length > 1) {
        self.parents(prs).remove();
    } else {
        return false;
    }
}
