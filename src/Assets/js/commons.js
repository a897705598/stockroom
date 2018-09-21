/*
 * 获取身份证信息
 * */
function bankCardMatching(cardNumber) {
    var result_arr = window.result_arrs ? window.result_arrs : [];
    if (result_arr.length == 0) {
        alert('获取数据失败')
    } else {
        var ajax_return_datas = check_data(cardNumber, result_arr)
        return ajax_return_datas
    }
    function check_data(cardNumber, result_arr) {
        var data_digits = _.filter(result_arr, {'id_number_length': cardNumber.toString().length.toString()})
        var data_card = _.filter(data_digits, function (item) {
            var itemBin = item['bin']
            var re = new RegExp("^" + itemBin, "gim");
            if (cardNumber.toString().search(re) == 0) {
                return item
            }
        })
        return data_card
    }
}
