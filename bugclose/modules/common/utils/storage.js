
var storage = function (options) {

    this.data   = options.data;
    this.key    = options.key || "_XN_DATA_";

    if(this.data){
        this.setData(this.data);
    }
};

storage.prototype.set = function (key, value) {
    if(key === undefined){
        return;
    }

    var data = this.getData() || {};

    data[key] = value;

    this.setData(data);
};

storage.prototype.get = function (key) {
    var data = this.getData();

    if(key === undefined){
        return data;
    }

    return data[key];
};

storage.prototype.remove = function (key) {
    var data = this.getData();

    if(key === undefined){
        return;
    }

    delete data[key];

    this.setData(data);
};

storage.prototype.setData = function (data) {
    if(data === undefined){
        return;
    }

    if(typeof(data) != "string"){
        window.sessionStorage.setItem(this.key, JSON.stringify(data));

        return;
    }

    window.sessionStorage.setItem(this.key, data);
};

storage.prototype.getData = function () {
    var data  = window.sessionStorage.getItem(this.key);

    try{
        return JSON.parse(data) || {};
    }
    catch(e){
        return data;
    }
};

storage.prototype.clear = function () {
    window.sessionStorage.removeItem(this.key);
};


module.exports = {

    KEYS: {
        DETAULT_KEY: "_XN_DATA_",  //默认KEY
        REFERRER_KEY: "_REFERRER_KEY_", //推荐人存储数据
        REDPACKET_KEY: "_REDPACKET_KEY_", //使用红包存储数据
        RECHARGE_KEY: "_RECHARGE_REDIRECT_" //充值回跳的URL
    },

    create: function (options) {
        return new storage(options || {});
    }
};