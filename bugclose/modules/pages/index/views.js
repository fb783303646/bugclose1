/**
 *  @require style.css
*/
var Vue  = require("vue");
var $ = require("zepto");

var api = require('api/project')

var regexp = require('utils/regexp');
var validate = require('utils/validate');

/*组件*/
var proNotice = require('pages/proNotice/proNotice');
var Activity = require('pages/Activity/Activity');
var form = require('widgets/form/form');
var select = require('widgets/select/select');
var screens = require('widgets/screen/screen');
var date = require('widgets/date/date')
var datevue = require('widgets/date/datevue')

var apiUrl ={
    selectProjectRul:api.selectProject().requestUrl, //获取项目个数
    numericalUrl:api.numerical().requestUrl, //获取某个项目bug总数信息getFrom
    getFromlUrl:api.getFrom().requestUrl, //获取某个项目bug总数信息
    updateDocumentUrl:api.updateDocument().requestUrl,
    modificationsUrl:api.modifications().requestUrl, //获取某个项目bug总数信息
    getusRul:api.getus().requestUrl, //
    getusTwoRul:api.getusTwo().requestUrl, //
    addProjectRul:api.addProject().requestUrl, //创建添加项目getNum2
    getNum2Rul:api.getNum2().requestUrl, //拉取个数
    setDescriptionRul:api.setDescription().requestUrl, //流程提交表单
    getDescriptionRul:api.getDescription().requestUrl, //流程查询
}

var vm = new Vue({
    el:'#wrap',
    data:{
    	context: "iconPro",
        healthClass:'projectHealth5',
        isbugshow:false,
        isloading:false,
        isfloat:false,
    	isShow:false,
    	isShowfu:false,
        ismyproject:false,
        userId:'',
        projectId:'',
        //修改数据
        modifydata:"",

        tipsnmb:'',

        userName:'',
        myProjectList:{
            titleName:'',
            list:[]
        },
        infoNmb:{
            totalNumber:0,
            notSolved:0,
            toAudit:0,
            hasRefused:0,
            resolved:0,
            beenPostponed:0,
            closed:0,
            defects:0,
            task:0,
            demand:0,
            urgent:0,
            high:0,
            middle:0,
            low:0,
            projectRunning:0,
            members:0,
            product:0,
            health:100,
            today:0,
            overdue:0,
            todayEnd:0,
            start:0,
            tomorrow:0,
            week:0,
            weekEnd:0
        },
        bugList:[],
        bugdetiel:{},

        // 修复
        isRepairobj:{
            isRepair:false,
            Repairlist:[{text:'未指定',type:106},{text:'未指定1',type:106}],
            describe:''
        },
        // 通过
        isAdoptobj:{
            isAdopt:false,
            AdoptWho:'3333',
            Adoptlist:[{text:'未指定',type:106},{text:'未指定1',type:106}],
            describe:''
        },

        // 不通过
        isnoAdoptobj:{
            isnoAdopt:false,
            noAdoptWho:'3333',
            noAdoptlist:[{text:'未指定',type:106},{text:'未指定1',type:106}],
            describe:''
        },

         // 已拒绝
        isRefuseobj:{
            isRefuse:false,
            describe:''
        },

        // 关闭
        isCloseobj:{
            isClose:false,
            CloseWho:'3333',
            Closelist:[{text:'未指定',type:106},{text:'未指定1',type:106}],
            describe:''
        },

        // 延期
        isDelayobj:{
            isDelay:false,
            DelayWho:'3333',
            Delaylist:[{text:'未指定',type:106},{text:'未指定1',type:106}],
            describe:''
        },
        
        // 创建项目
        CreateProject:{
            listshow:false,
            CreateProjectShow:false,
            CreateProjectName:'',
            CreateProjectdescribe:'',
            CreateProjectList:[],
            recipient:'',
        },
         
    },

    mounted:function(){
        this.$nextTick(function () {
            this.init();
            //this.getTalNumber();
            this.setColor();
         })
    },
    methods:{

         init:function(){

            var sessionId = JSON.parse(sessionStorage.getItem('sessionId'));

            if(sessionId==null || sessionId=='undefined'|| sessionId == undefined ){
                window.location.href = 'pages/user/login.html'
            }  

            var projectName = JSON.parse(localStorage.getItem('projectName')); 

            if(projectName==null || projectName=='undefined'|| projectName == undefined ) {
                 this.ismyproject=true;
            }  

            this.userId = sessionId.id;
            this.userName = sessionId.name;

            this.selectProject();

        },

        checkmyproject:function(){
            this.ismyproject = true;
        },

        CreateProbtn:function(){
            // 清空创建表单数据
            this.CreateProject.CreateProjectName ='';
            this.CreateProject.CreateProjectdescribe ='';
            this.CreateProject.CreateProjectList =[];
            this.CreateProject.recipient ='';

            this.CreateProject.CreateProjectShow = !this.CreateProject.CreateProjectShow;
        },
        // 选择相关人员时候高亮
        selectProduct: function(e) {
            if(typeof e.ischecked == 'undefined') {
                this.$set(e, 'ischecked', true); 
            } else {
                e.ischecked = !e.ischecked;
            }
        },

        // 拉取项目名以及相关人员
        getusersbig:function(){

            var _this = this;
            $.ajax({
                type:"GET",
                url:apiUrl.getusTwoRul,
                dataType:'json',
                error:function(msg){
                    console.log('错误提示'+msg)
                },
                success:function(data){
                   
                    _this.CreateProject.CreateProjectList = data;               
                }
            });  
            this.CreateProject.listshow = !this.CreateProject.listshow; 
        },
        // 选择相关人员
        changeCheckAllState:function(){
            var nameId = [this.userId];
            this.CreateProject.CreateProjectList.forEach(function(e, index){
              if(e.ischecked == true){
                nameId.push(e.userId)
              }
            });
            
            this.CreateProject.recipient = this.removeDuplicatedItem(nameId).join(',');
            this.CreateProject.listshow = !this.CreateProject.listshow;
        },  
        // 去重
        removeDuplicatedItem:function (ar) {
             var ret = [];
         
             for (var i = 0, j = ar.length; i < j; i++) {
                 if (ret.indexOf(ar[i]) === -1) {
                     ret.push(ar[i]);
                 }
             }
             return ret;
         },

        // 提交创建项目表单
        myprojectbtn:function(){

            var Postdata={
               projectName:this.CreateProject.CreateProjectName,
               projectDescribe:this.CreateProject.CreateProjectdescribe,
               recipient:this.CreateProject.recipient,
               userId:this.userId,
               founder:this.userName
            }
            if(this.CreateProject.recipient=='' || this.CreateProject.recipient ==null || this.CreateProject.recipient ==undefined ){
               this.tipsText('请指定人员');
               return;
            }

            var _this = this;
            $.ajax({
                type:"POST",
                url:apiUrl.addProjectRul,
                dataType:'json',
                data:Postdata,
                error:function(msg){
                    console.log('错误提示'+msg)
                },
                success:function(data){
                    if( data == '项目名重复'){

                        _this.tipsText('项目名重复');

                        return ;
                    }

                    localStorage.setItem("projectName",JSON.stringify(Postdata.projectName));

                    _this.CreateSuccess(data)
                   
                }
            });   
           
        },

        // 创建项目成功后
        CreateSuccess:function(data){
   
            this.ismyproject=true,
            this.selectProject();
            this.$refs.profile.getusers();  
            this.CreateProject.CreateProjectShow = false;
        },


        bugclick:function(e,index){

            e.descriptionBean.reverse()
            this.bugdetiel = e;
            if(typeof e.ischecked == 'undefined'  ||  e.ischecked ==false) {
                this.$set(e, 'ischecked', true); //局部
                this.isbugshow = true;
            } else {
                e.ischecked = !e.ischecked;
                this.isbugshow = !this.isbugshow;
            }

            this.modifydata = e;

        },
        // 详情弹框关闭按钮
        colsedelbtn:function(){
           
            this.isRepairobj.isRepair   = false;
            this.isAdoptobj.isAdopt     = false;
            this.isnoAdoptobj.isnoAdopt = false;
            this.isCloseobj.isClose     = false;
            this.isDelayobj.isDelay     = false;
            this.isRefuseobj.isRefuse   = false;
            this.CreateProject.CreateProjectShow = false;
        },

        //修改流程状态接口
        modifications:function(dataType){
            
             var _this = this;
             $.ajax({
                type:"POST",
                url:apiUrl.modificationsUrl,
                dataType:'json',
                data:dataType,
                error:function(msg){
                    console.log('错误提示'+msg)
                },
                success:function(data){
                    if(data == true || data == "true" && dataType.process =='待审核'){
                        _this.isRepairobj.isRepair = true;
                    }else if(data == true || data == "true" && dataType.process =='已解决'){
                        _this.isAdoptobj.isAdopt = true;
                    }else if(data == true || data == "true" && dataType.process =='未解决'){
                        _this.isnoAdoptobj.isnoAdopt = true;;
                    }else if(data == true || data == "true" && dataType.process =='已关闭'){
                        _this.isCloseobj.isClose = true;
                    }else if(data == true || data == "true" && dataType.process =='已延期'){
                        _this.isDelayobj.isDelay = true;
                    }else if(data == true || data == "true" && dataType.process =='已拒绝'){
                        _this.isRefuseobj.isRefuse = true;
                    }else{
                        _this.tipsText('失败');
                    }
                 
                }
            });
        },  

        //get 获取单个数据
        modificationsGet:function(typedata){
            var _this = this;
             $.ajax({
                type:"GET",
                url:apiUrl.getDescriptionRul+'fromId='+typedata,
                dataType:'json',
                error:function(msg){
                    console.log('错误提示'+msg)
                },
                success:function(data){
                  _this.bugdetiel.descriptionBean.push(data[data.length-1]);
                  _this.bugdetiel.descriptionBean.reverse();
               
                }
            });
        },

        // 提交submit
        modificationsSubmit:function(typedata){

            var _this = this; 
             $.ajax({
                type:"POST",
                url:apiUrl.setDescriptionRul,
                dataType:'json',
                data:typedata,
                error:function(msg){
                    console.log('错误提示'+msg)
                },
                success:function(data){
                    if( data =='添加成功' && typedata.process=='待审核' ){
                        _this.bugdetiel.process="待审核";
                    }
                    if( data =='添加成功' && typedata.process=='通过' ){
                        _this.bugdetiel.process="已解决";
                    }
                    if( data =='添加成功' && typedata.process=='未解决' ){
                        _this.bugdetiel.process="未解决";
                    }
                    if( data =='添加成功' && typedata.process=='已关闭' ){
                        _this.bugdetiel.process="已关闭";
                    }
                    if( data =='添加成功' && typedata.process=='已延期' ){
                        _this.bugdetiel.process="已延期";
                    }
                    if( data =='添加成功' && typedata.process=='已拒绝' ){
                        _this.bugdetiel.process="已拒绝";

                    }
                     _this.modificationsGet(typedata.fromId)
                }
            });
        },

        // 修复
        Repair:function(){
            var modifyobj = {
                userId:this.userId,
                userName:this.userName,
                docId:this.bugdetiel.fromId,
                process:'待审核'
            }
            this.modifications(modifyobj);
        },
        submitRepair:function(){

            var modifyobj = {
                userId:this.userId,
                userName:this.userName,
                fromId:this.bugdetiel.fromId,
                description:'#修复问题#'+this.isRepairobj.describe,
                process:'待审核'
            }
            this.modificationsSubmit(modifyobj)
            this.isRepairobj.isRepair = false;
            
        },
        // 通过
        Adopt:function(){
             var modifyobj = {
                userId:this.userId,
                userName:this.userName,
                docId:this.bugdetiel.fromId,
                process:'已解决'
            }
            this.modifications(modifyobj);
        },
        submitAdopt:function(){
            var modifyobj = {
                userId:this.userId,
                userName:this.userName,
                fromId:this.bugdetiel.fromId,
                description:'#通过问题#'+this.isAdoptobj.describe,
                process:'通过'
            }
            this.modificationsSubmit(modifyobj)
            this.isAdoptobj.isAdopt = false;
           
        },


        // 不通过
        noAdopt:function(){
            var modifyobj = {
                userId:this.userId,
                userName:this.userName,
                docId:this.bugdetiel.fromId,
                process:'未解决'
            }
            this.modifications(modifyobj);
        },
        submitnoAdopt:function(){
            var modifyobj = {
                userId:this.userId,
                userName:this.userName,
                fromId:this.bugdetiel.fromId,
                description:'#未通过问题#'+this.isnoAdoptobj.describe,
                process:'未解决'
            }
            this.modificationsSubmit(modifyobj)
            this.isnoAdoptobj.isnoAdopt = false;
        },
        // 已拒绝
         Refuse:function(){
             var modifyobj = {
                userId:this.userId,
                userName:this.userName,
                docId:this.bugdetiel.fromId,
                process:'已拒绝'
            }
            this.modifications(modifyobj);

        },
        submitRefuse:function(){
             var modifyobj = {
                userId:this.userId,
                userName:this.userName,
                fromId:this.bugdetiel.fromId,
                description:'#已拒绝问题#'+this.isRefuseobj.describe,
                process:'已拒绝'
            }
            this.modificationsSubmit(modifyobj)
            this.isRefuseobj.isRefuse = false;
        },
         // 关闭
        Close:function(){
             var modifyobj = {
                userId:this.userId,
                userName:this.userName,
                docId:this.bugdetiel.fromId,
                process:'已关闭'
            }
            this.modifications(modifyobj);
        },
        submitClose:function(){
            var modifyobj = {
                userId:this.userId,
                userName:this.userName,
                fromId:this.bugdetiel.fromId,
                description:'#已关闭问题#'+this.isCloseobj.describe,
                process:'已关闭'
            }
            this.modificationsSubmit(modifyobj)
            this.isCloseobj.isClose = false;
        },

         //已延期
        Delay:function(){
            var modifyobj = {
                userId:this.userId,
                userName:this.userName,
                docId:this.bugdetiel.fromId,
                process:'已延期'
            }
            this.modifications(modifyobj);            
        },
        submitDelay:function(){
             var modifyobj = {
                userId:this.userId,
                userName:this.userName,
                fromId:this.bugdetiel.fromId,
                description:'#已延期问题#'+this.isDelayobj.describe,
                process:'已延期'
            }
            this.modificationsSubmit(modifyobj)
            this.isDelayobj.isDelay = false;
        },

         //再打开
        openAgain:function(){
            var modifyobj = {
                userId:this.userId,
                userName:this.userName,
                docId:this.bugdetiel.fromId,
                fromId:this.bugdetiel.fromId,
                description:'#再打开问题#',
                process:'未解决'
            }
            var _this = this; 
             $.ajax({
                type:"POST",
                url:apiUrl.modificationsUrl,
                dataType:'json',
                data:modifyobj,
                error:function(msg){
                    console.log('错误提示'+msg)
                },
                success:function(data){
                  console.log(data);
                }
            });
            this.modificationsSubmit(modifyobj)
        },

        //修改
        modifyGetdata:function(){
             this.$refs.profile.renderodify();    
             this.isfloat = !this.isfloat;
        },

        // 接收子组件返回的值并设置父组件的值
        changeParent:function(b){

            if(b.type == 'submit'){
                console.log("提交后刷新");
                this.selectProject();
            }
            this.isfloat = b.value;
            this.isbugshow = b.value;
        },
        setColor:function(){

            var healthNmb = this.infoNmb.health;
            if(healthNmb>90 && healthNmb<=100){
                this.healthClass = 'projectHealth5'
            } 
            if(healthNmb>80 && healthNmb<=90){
                this.healthClass = 'projectHealth4'
            } 
            if(healthNmb>60 && healthNmb<=80){
                this.healthClass = 'projectHealth3'
            } 
            if(healthNmb>50 && healthNmb<=60){
                this.healthClass = 'projectHealth2'
            } 
            if(healthNmb<=50){
                this.healthClass = 'projectHealth1'
            } 
        },
       
        //退出
        loginout:function(){
            sessionStorage.clear();
            this.init();
        },
        // 提交问题
        submintfn:function(){
            console.log('清空了')
            this.modifyData = "";
            this.$refs.profile.clearinput('typesubmit');  
            this.isfloat = !this.isfloat;
        },
        
        // 侧边栏切换
    	change:function  (obj) {
    		this.context = obj;
            this.tabsPage(obj);
    	},
    	// 我的项目下拉
    	tabs:function(){
            this.isShow = !this.isShow;
    	},

        //拉取我的项目
        selectProject:function(){

            if(validate.isEmpty(this.userId) ){
                return
            }

            var projectName = JSON.parse(localStorage.getItem('projectName')); 
           
            var _this = this;
             $.ajax({
                type:"POST",
                url:apiUrl.selectProjectRul+"userId="+this.userId,
                dataType:'json',
                error:function(msg){
                    console.log('错误提示'+msg)
                },
                success:function(data){
                
                    _this.myProjectList.list = data;

                    //如果没有数据的时候清除缓存
                    if(data.length== 0){

                        localStorage.clear();
                        return;
                    }
                    // 判断缓存中是否记录有上一次的项目名字
                    if(projectName==null || projectName=='undefined'|| projectName == undefined ){
                        var dataProjectName = data[0].projectName;
                        _this.myProjectList.titleName = dataProjectName;
                        localStorage.setItem("projectName",JSON.stringify(dataProjectName));
                        _this.getTalNumber(dataProjectName);
                        _this.getbuglist(projectName);

                        return
                    } 
                    console.log(data);
                    _this.myProjectList.titleName = projectName;
                    _this.getTalNumber(projectName);
                    _this.getbuglist(projectName);

                }
            });   
        },

        //选择当前项目
        selectToProject:function(item,type){

            this.myProjectList.titleName = item.projectName;
            localStorage.setItem("projectName",JSON.stringify(item.projectName)); 
            this.getTalNumber(item.projectName);
           
            if(type=='undefined'|| type==undefined){
                this.isShow = !this.isShow;
            }
            this.ismyproject =false;
        },
        // 获取某个项目总数信息
        getTalNumber:function(projectName){

            var proName = projectName;
            var _this = this;
            this.isloading = true;
            $.ajax({
                type:"GET",
                url:apiUrl.numericalUrl+"projectName="+proName,
                dataType:'json',
                error:function(msg){
                    console.log('错误提示'+msg)
                },
                success:function(data){
                  _this.infoNmb = data; 
                  //_this.isloading = false;

                  _this.getbuglist(proName);
                 // _this.$refs.profile.getProdu();
                }
            });   

            this.gettips();
        },
        gettips:function(){
            var projectName = JSON.parse(localStorage.getItem('projectName')); 
            var obj = {
                userId:this.userId,
                projectName:projectName
            }
            var _this = this;
            $.ajax({
                type:"GET",
                url:apiUrl.getNum2Rul,
                data:obj,
                dataType:'json',
                error:function(msg){
                    console.log('错误提示'+msg)
                },
                success:function(data){
                  var tipsnmb = {
                     activenmb:data[0],
                     mynmb:data[1]
                  };  
                 _this.tipsnmb = tipsnmb;
                }
            });   
        },

    	// 我的下拉
    	showfu:function(){
            this.isShowfu = !this.isShowfu;
    	},
        tabsPage:function(pages){
            switch (pages){
                case 'iconPro':
                    console.log(pages);
                    //this.iconProFun();
                  break;
                case 'iconAt':
                  console.log(pages);
                  break;
                case 'iconQs':
                    console.log(pages);
                  break;
                case 'iconDb':
                  console.log(pages);
                  break;
                case 'iconMyget':
                    console.log(pages);
                  break;
            }

        },
        iconProFun:function(){
             var projectName = JSON.parse(localStorage.getItem('projectName')); 
             this.getTalNumber(projectName);

        },
        //获取bug 列表
        getbuglist:function(projectName){
            var proName = projectName;
            var _this = this;
            //this.isloading = true;
            $.ajax({
                type:"GET",
                url:apiUrl.getFromlUrl+"projectName="+proName,
                dataType:'json',
                error:function(msg){
                    console.log('错误提示'+msg)
                },
                success:function(data){
                  _this.isloading = false;
                  var newdata  = [];
                  _this.bugList = data.reverse().slice(0,10);

                }
            });   
        },
        //tips
        tipsText:function(text){
            var tips = document.getElementById("tips");
            tips.innerHTML = text
            tips.style.display= "block";
            setTimeout(function(){
                tips.style.display= "none";
            },3000)
            
        },

    }
});
