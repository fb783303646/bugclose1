var Vue  = require("vue");

module.exports = Vue.component("m-screen", {
    className: 'mscreen',
    name:'mscreen',
    template: __inline('./screen.html'),
    props:{
       title:{
         type:String,
         default: '下拉'
       } 
    },
    data:function(){
        return {
            isScreenShow:false,
            computedList:[]
        }
    },
    mounted :function(){ 
       
    },
    methods:{

        openclick:function(){
            this.isScreenShow = !this.isScreenShow;
        } 
    }
});