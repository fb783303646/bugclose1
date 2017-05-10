/*
	用户模块接口
	
*/

var getHost = require('api')
var api = {};
var host = getHost();

api.selectProject = function(data){

	return {
		requestBody: data,
		requestUrl: host+"/BUGClose/selectProject?"
	};
}

api.numerical = function(data){

	return {
		requestBody: data,
		requestUrl: host+"/BUGClose/numerical?"
	};
}

/*
*提交表单
*/
api.submitQuestions = function(data){

	return {
		requestBody: data,
		requestUrl: host+"/BUGClose/submitQuestions?"
	};
}

/*
*获取所有bug
*/

api.getFrom = function(data){

	return {
		requestBody: data,
		requestUrl: host+"/BUGClose/getFrom?"
	};
}

/*
*获取项目下的产品集与相关人员ID及name
*传入（项目名称）
*/

api.getus = function(data){

	return {
		requestBody: data,
		requestUrl: host+"/BUGClose/getus?"
	};
}

/*
*拉取项目人员
*传入（项目名称）
*/
api.getusTwo = function(data){

	return {
		requestBody: data,
		requestUrl: host+"/BUGClose/getus2?"
	};
}


/*
*传入对象修改表单
*传入（）
*/

api.updateDocument = function(data){

	return {
		requestBody: data,
		requestUrl: host+"/BUGClose/updateDocument?"
	};
}


/*
*修改流程
*传入（docId,'未解决'，userId）
*/
api.modifications = function(data){

	return {
		requestBody: data,
		requestUrl: host+"/BUGClose/modifications?"
	};
}


/*
*删除某一个bug
*根据项目ID和USERID删除指定项目
*/

api.removeProject = function(data){

	return {
		requestBody: data,
		requestUrl: host+"/BUGClose/removeProject?"
	};
}
/*
*创建项目
*传入 String projectName;//项目名称
	  String projectDescribe;//项目描述
	  String recipient;//被指定的人员名单
*/
api.addProject = function(data){

	return {
		requestBody: data,
		requestUrl: host+"/BUGClose/addProject?"
	};
}

/*
*创建项目
*传入 
	  String projectId;//项目ID
	  String userId;//用户id
*/
api.getNum2 = function(data){

	return {
		requestBody: data,
		requestUrl: host+"/BUGClose/getNum2?"
	};
}


/*
*传入对象修改指定表单
*传入 
*/
api.upProject = function(data){

	return {
		requestBody: data,
		requestUrl: host+"/BUGClose/upProject?"
	};
}


/*
*修复流程查寻接口
*传入 （fromId）
*/
api.getDescription = function(data){

	return {
		requestBody: data,
		requestUrl: host+"/BUGClose/getDescription?"
	};
}

/*
*修复流程提交接口
*传入(
userId  当前用户id  string
 fromId  表单id  string
 description 描述  string
 datae 时间  string
   )
*/
api.setDescription = function(data){

	return {
		requestBody: data,
		requestUrl: host+"/BUGClose/setDescription?"
	};
}

/*
*获取某个项目下的所有产品名称
*参数  projectName string 
*响应  product string
*/
api.getProdu = function(data){

	return {
		requestBody: data,
		requestUrl: host+"/BUGClose/getProdu?"
	};
}






module.exports = api;