 /**
 * 构建表单请求
 * @param {Object} options 配置对象
 * @param {String} options.formName 表单名称
 * @param {String} options.iframeName iframe名称         
 * @param {String} options.url 请求地址
 * @param {String} options.data 数据
 * @param {String} options.method 请求方式 post || get
 */
module.exports = function (options) {
    var doc = document,
        body = doc.body,
        form = doc.createElement("form"),
        o = options,
        data = o.data || {};

    form.name = o.formName;
    form.method = o.method || "post";
    form.action = o.url;

    for (var key in data) {
        form.appendChild(createInput(key, data[key]));
    }

    //如果传了iframeName, 则提交到iframe
    if(o.iframeName){
        if (!document.getElementById(o.iframeName)) {
            body.appendChild(createIframe(o.iframeName));
        }

        form.target = o.iframeName;
    }

    body.appendChild(form);
    form.submit();  
    body.removeChild(form);

    function createInput(name, value) {
        var input = document.createElement("input");
        input.value = value;
        input.name = name;
        input.type = "hidden";
        return input;
    }
    
    function createIframe(name) {
        var iframe;
        try {
            iframe = document.createElement('<iframe name="' + name + '"></iframe>');
        } catch (ex) {
            iframe = document.createElement("iframe");
            iframe.name = name;
        }
        iframe.id = name;
        iframe.style.display = "none";
        return iframe;
    }
};