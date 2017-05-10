/*
	用户模块接口
	
*/

var getHost = require('api')
var api = {};
var host = getHost();

api.login = function(data){

	return {
		requestBody: data,
		requestUrl: host+"/BUGClose/login?"
	};
}

api.resigter = function(data){

	return {
		requestBody: data,
		requestUrl: "/api/user/login"
	};
}

module.exports = api;