/**
 *  @require style.css
*/
var $ = require("zepto");
var Vue  = require("vue");

var api = require('api/user')

var regexp = require('utils/regexp');
var validate = require('utils/validate');

var apiUrl ={
	loginRul:api.login().requestUrl   //登陆接口
}

var vm = new Vue({
    el:'#myproject',
    data:{
       userAccount:'',
       userPassword:'',
       message:''
    },
    mounted:function(){
    	this.$nextTick(function () {
		    this.getsession();
		 })
    },
    methods:{
    	getsession:function(){
    		sessionStorage.clear(); 
    	},
    	getdata:function(){
    		var userAccount = this.userAccount.trim();
    		var userPassword = this.userPassword.trim();
    		var _this = this;
    		var sessionId = {};

    		if(validate.isEmpty(userAccount)){
    			this.message = '请输入账号';
    			return
    		}
    		if(validate.isEmpty(userPassword)){
    			this.message = '请输入密码';
    			return
    		}
    		$.ajax({
				type:"POST",
				url:apiUrl.loginRul+"userAccount="+userAccount+"&userPassword="+userPassword,
				dataType:'json',
				error:function(msg){
				
					console.log('错误提示'+msg)
				},
				success:function(data){
					if(data=="false" || data==false){
						_this.message = "登陆失败，账号或者密码错误！";
						return
					}
					//18175732153   123456
					console.log(data);

					sessionId = {
						id:data.id,
						name:data.name
					}
					sessionStorage.setItem("sessionId",JSON.stringify(sessionId))
					window.location.href = window.location.origin+'/index.html'
				}
			});

    	}
    }
});