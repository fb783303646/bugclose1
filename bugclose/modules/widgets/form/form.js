var Vue  = require("vue");
var api = require('api/project');

var apiUrl ={
    submitQuestionsRul:api.submitQuestions().requestUrl, //提交表单
    getusRul:api.getus().requestUrl, //
    updateDocumentRul:api.updateDocument().requestUrl, //修改表单
    getProduRul:api.getProdu().requestUrl, //
}

module.exports = Vue.component("f-form", {
    className: 'form',
    name:'form',
    props: ['myId','isfloat','modifyData'],
    template: __inline('./form.html'),

    data:function(){
    	return {
            shippingmethod:1,

            isfloatinput1:false,
            isfloatinput2:false,

            projectName:'',
            userId:'',
            founder:'',//创建人
            
            product:'未指定',
            productList:[{text:'未指定',type:101}],

            problem:'缺陷',
            problemList:[{text:'缺陷',value:1,type:102},{text:'任务',value:2,type:102},{text:'需求',value:3,type:102}],

            module:'未指定',
            moduleList:[{text:'未指定',type:103}],

            Impact:'选择默认',
            ImpactList:[{text:'版本1',type:104},{text:'版本2',type:104}],

            recipient:'未指定',
            recipientId :'',
            recipientList:[{text:'未指定',type:105}],

            IterativeName:'未指定',
            IterativeList:[{text:'未指定',type:106}],

            title:'',
            planDate:'',
            endDate:'',
            planVersion:'',
            priority:4,
            environment:'',
            describe:'',
            typesubmit:''
    	}

    },
    mounted:function(){

        this.init();
    },
    methods:{

        init:function(){

            this.getusers();
            this.getProdu();
        },
       
        // 拉取项目名以及相关人员
        getusers:function(){
            var projectName = JSON.parse(localStorage.getItem('projectName'));
            var _this = this;
            $.ajax({
                type:"GET",
                url:apiUrl.getusRul+'projectName='+projectName,
                dataType:'json',
                error:function(msg){
                    console.log('错误提示'+msg)
                },
                success:function(data){
                  _this.feters(data);
                }
            });   
        },
        feters:function(data){
            var arrt = [];

            for(var i=0;i<data.length;i++ ){
              arrt.push({text:data[i].userName, value:data[i].userId, type:105});
            }
            this.recipientList = arrt;
        },

        getProdu:function(){

            var projectName = JSON.parse(localStorage.getItem('projectName'));
            var _this = this;
            $.ajax({
                type:"GET",
                url:apiUrl.getProduRul+'projectName='+projectName,
                dataType:'json',
                error:function(msg){
                    console.log('错误提示'+msg)
                },
                success:function(data){
                    console.log(data);
                  _this.Produfeter(data);
                }
            });   

        },
         Produfeter:function(data){
            var arrt = [];

            for(var i=0;i<data.length;i++ ){
              arrt.push({text:data[i], type:101});
            }
            this.productList = arrt;
           
        },
    	

        dateShow:function (y) {
            if (y==1) {
                this.isfloatinput1 = !this.isfloatinput1
            };
            if (y==2) {
                this.isfloatinput2 = !this.isfloatinput2
            };
        },
        //开始时间选择
        changebegin:function(date){
            
            if(this.planDate==""&& this.endDate ==""){
                this.planDate = this.formatDate( date.getFullYear() , date.getMonth() + 1, date.getDate());
                this.endDate = this.formatDate( date.getFullYear() , date.getMonth() + 1, date.getDate());
            }
            this.planDate = this.formatDate( date.getFullYear() , date.getMonth() + 1, date.getDate());
            this.isfloatinput1 = !this.isfloatinput1;
           
        },
         //end时间选择
        changeend:function(date){

            if(this.planDate==""&& this.endDate ==""){
                this.planDate = this.formatDate( date.getFullYear() , date.getMonth() + 1, date.getDate());
                this.endDate = this.formatDate( date.getFullYear() , date.getMonth() + 1, date.getDate());
            }

            this.endDate = this.formatDate( date.getFullYear() , date.getMonth() + 1, date.getDate());
            this.isfloatinput2 = !this.isfloatinput2;
        },

        //关闭窗口
        colsefun:function(){
            this.$emit("isfloat",{type:'colse',value:false});
        },
        
        selectProduct:function(i){
            this.priority = i;
        },
        // 提交表单
        sumbmitbtn:function(){

            if(this.typesubmit == 'typesubmit'){
                this.sumbmitfun();
            }else{
                this.modifySubmit();
            }
        },
        clearinput:function(data){

            this.typesubmit = data;

            this.founder       = "";
            //this.userId        ""this.modifyData.userId;
            this.projectName   = "";
            this.title         = "";
            //this.product       = null;
            this.module        = "";
            //this.problem       = '';
            this.Impact        = "";
            this.IterativeName = "";
            this.planDate      = "";
            this.endDate       = "";
            this.planVersion   = "";
            //this.priority      = '';
            this.recipient     = "";
            this.recipientId   = "";
            this.environment   = "";
            this.describe      = "";
        },
        //渲染表单
        renderodify:function(){
           
            // 渲染看的
            this.founder       = this.modifyData.founder,
            //this.userId        = this.modifyData.userId;
            this.projectName   = this.modifyData.projectName;
            this.title         = this.modifyData.title;
            this.product       = this.modifyData.product;
            this.module        = this.modifyData.module;
            this.problem       = this.modifyData.problem;
            this.Impact        = this.modifyData.Impact;
            this.IterativeName = this.modifyData.IterativeName;
            this.planDate      = this.modifyData.planDate;
            this.endDate       = this.modifyData.endDate;
            this.planVersion   = this.modifyData.planVersion;
            this.priority      = this.modifyData.priority;
            this.recipient     = this.modifyData.recipient;
            this.recipientId   = this.modifyData.founder;
            this.environment   = this.modifyData.environment;
            this.describe      = this.modifyData.describe;
 
        },  

        //修改表单
         modifySubmit:function(){

            //session获取userId 
            this.userId = JSON.parse(sessionStorage.getItem('sessionId')).id;

             var newobj = {
                fromId:this.modifyData.fromId,
                founder:this.founder,
                userId:this.userId,
                projectName: this.projectName,
                title:this.title,
                product:this.product,
                module: this.module,
                problem:this.problem,
                Impact:this.Impact,
                IterativeName:this.IterativeName,
                planDate:this.planDate,
                endDate:this.endDate,
                planVersion:this.planVersion,
                priority:this.priority,
                recipient:this.recipientId,
                environment:this.environment,
                describe:this.describe,
            }

            console.log(newobj);

             var _this = this;

             $.ajax({
                type:"POST",
                url:apiUrl.updateDocumentRul,
                data:newobj,
                dataType:'json',
                error:function(msg){
                    console.log('错误提示'+msg)
                },
                success:function(data){
                  console.log(data);
                  _this.$emit("isfloat",{type:'submit',value:false}); 
                }
            });  

         },

        // 提交表单
        sumbmitfun:function(){
           
            //session获取userId 
            this.userId = JSON.parse(sessionStorage.getItem('sessionId')).id;
            //获取localStorage 中projectName;
            this.projectName = JSON.parse(localStorage.getItem('projectName')); 

            if(this.product=="" || this.product=='未指定' ){
                this.tipsText("产品未指定");
                return;
            }

            if(this.title==""){
                this.tipsText("标题不能为空");
                return;
            }

            if(this.recipientId==""){
                this.tipsText("请指派人员");
                return;
            }
            if(this.planDate==""){
                this.tipsText("请选择开始时间");
                return;
            }
             if(this.endDate==""){
                this.tipsText("请选择结束时间");
                return;
            }

            var sumbmitobj = {
                founder:this.recipientId,
                userId:this.userId,
                projectName: this.projectName,
                title:this.title,
                product:this.product,
                module: this.module,
                problem:this.problem,
                Impact:this.Impact,
                IterativeName:this.IterativeName,
                planDate:this.planDate,
                endDate:this.endDate,
                planVersion:this.planVersion,
                priority:this.priority,
                //recipient:this.recipient,
                recipient:this.recipientId,
                environment:this.environment,
                describe:this.describe,
            }

            var _this = this;
             $.ajax({
                type:"POST",
                url:apiUrl.submitQuestionsRul,
                data:sumbmitobj,
                dataType:'json',
                error:function(msg){
                    console.log('错误提示'+msg)
                },
                success:function(data){
                  console.log(data);
                  _this.typesubmit = "";
                  _this.$emit("isfloat",{type:'submit',value:false}); 
                }
            });  

         },

        changvalfun:function(value,index){

            var type = value.type;

            if(type==101){
                this.product = value.text;
                console.log(value.text);
            }
            if(type==102){
                this.problem = value.text;
            }
            if(type==103){
                this.module = value.text;
            }
            if(type==104){
                this.Impact = value.text;
            }
            if(type==105){
                this.recipient = value.text;
                this.recipientId = value.value;
            }
            if(type==106){
                this.IterativeName = value.text;
            }
            
        },
        formatDate: function(year,month,day){
            var y  = year;
            var m = month;
            if(m<10) m = "0" + m;
            var d = day;
            if(d<10) d = "0" + d;
            return y+"-"+m+"-"+d
        },
         tipsText:function(text){
            var tips = document.getElementById("tips");
            tips.innerHTML = text
            tips.style.display= "block";
            setTimeout(function(){
                tips.style.display= "none";
            },3000)
            
        }

    }
});