var Vue  = require("vue");

module.exports = Vue.component("a-activity", {
    className: 'aactivity',
    name:'aactivity',
    template: __inline('./Activity.html'),
    data:function(){
    	return {
    		module:'活动问题'
    	}
    },
    methods:{
    	add:function  (argument) {
    		alert(0);
    	}
    }
});