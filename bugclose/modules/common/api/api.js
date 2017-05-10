
var getHost=function () {
	if(window.location.host.indexOf("127.0.0.1") > -1){
     return "http://192.168.30.109";
    }
     return window.location.origin;
}

module.exports = getHost;