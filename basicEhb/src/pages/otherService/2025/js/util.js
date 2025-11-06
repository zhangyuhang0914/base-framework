var util = {
    getParamValue: function(keyName) {
        let paramValue = '';
        if (window.location.href.indexOf("?")  && window.location.href.indexOf("=") > 1) {
            let params = unescape(window.location.href).substring(0, window.location.href.length).split("?");
            let i = 0;
            params = params[1].split('&');
            while (i < params.length) {
                if (keyName === params[i].split('=')[0]) {
                    paramValue = params[i].split('=')[1];
                }
                i++;
            }
        }
        return paramValue;
    },
    /*
    * 描述：格式化时间  默认：YYYY-MM-DD hh:mm:ss
    * @param {String} date 需要格式化的时间
    * */
    formatTime: function(date) {
        date = new Date(date);
        var y = date.getFullYear();
        var m = date.getMonth() + 1;	// 月份要 +1
        var d = date.getDate();
        var h = date.getHours();
        var mm = date.getMinutes();
        var s = date.getSeconds();
        return y + '-' + util.add0(m) + '-' + util.add0(d) + ' ' +
            util.add0(h) + ':' + util.add0(mm) + ':' + util.add0(s);
    },
    /*
    * 描述：补零
    * @param {String} timeValue 需要补零的值
    * */
    add0: function(timeValue) {
        return timeValue < 10 ? '0' + timeValue : timeValue;
    },
    /*
    * 描述：ajax请求封装
    * @param {String} url 请求路径
    * @param {String} type 请求类型（Stringboot 中 delete 请求有问题，这里单独判断传值）
    * @param {Object} data 请求参数
    * @param {fn} successFn 成功后调用方法
    * @param {fn} errorFn 失败后调用方法
    * */
    ajax: function (url, type, data, successFn, errorFn) {
        // 对请求参数序列化处理
        if (type === 'get' || type === 'delete') {
            data = { data: JSON.stringify(data) };
        } else {
            data = Qs.stringify({ data: JSON.stringify(data) });
        }
        $.ajax({
            url: url,
            type: type,
            data: data,
            header: {
                contentType: 'application/x-www-form-urlencoded;charset=UTF-8'
            },
            success: function (res) {
                successFn && successFn(res);
            },
            error: function (error) {
                console.log(error);
                errorFn && errorFn(error);
            }
        })
    }
}

window.trsRobotUtil = util
