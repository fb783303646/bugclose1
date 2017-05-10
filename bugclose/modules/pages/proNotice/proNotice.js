var Vue  = require("vue");

module.exports = Vue.component("p-pronotice", {
    className: 'proNotice',
    name:'proNotice',
    template: __inline('./proNotice.html'),
    data:function(){
    	return {
    		module:'项目通知'
    	}
    },
    methods:{
    	add:function  (argument) {
    		alert(0);
    	}
    }
});