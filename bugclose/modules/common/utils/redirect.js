var storage     = require("storage");
var validate    = require("utils/validate");
var defaultUri  = require("web/default_uri");

/*
    设置回跳URL
    使用场景: 充值成功跳转到充值前的页面, 忘记交易密码后, 登录后等等
*/
var redirect = function () {
    var _this   = this;
    var urlKey  = "redirect";

    this.storage = storage.create({
        key: storage.KEYS.RECHARGE_KEY
    });

    this.set = function (url) {
        try{
            this.clear();
            this.storage.set(urlKey, url || window.location.href)
        }catch(e){
            console && console.log(e);
        }
    };

    this.get = function () {
        var url = this.getUrl();

        return url || defaultUri();
    };

    this.getUrl = function(){
        var url =  storage.get(urlKey);

        if(!validate.isEmpty(url)){
            return url;
        }

        return null;
    };

    this.goto = function () {
        var url = this.get();

        this.clear();
        
        window.location.href = url;
    };

    this.clear = function () {
        this.session.clear();
    };

    return this;
};

module.exports = redirect();