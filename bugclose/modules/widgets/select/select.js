var Vue  = require("vue");

module.exports = Vue.component("f-select", {
    className: 'select',
    name:'select',
    props:["list",'values',"myTypeInput"],
    template: __inline('./select.html'),
    data:function(){
    	return {
    		isSelectShow:false,
            val:'未指定',
            valindex:'1',
            computedList:[],
            nmvb:''
            
    	}
    },
     mounted :function(){ 
        this.val = this.values;
        this.computedList = this.list;
        this.nmvb = this.computedList.length;
    },
    watch:{
        val:'addval',
        deep:true
    },
    methods:{
    	SelectShow:function () {
            this.isSelectShow = !this.isSelectShow
    	},

        addval:function(val, oldVal){
            if (this.myTypeInput==true) {
                var nwtt = {text:this.val,type:101}
                var nmb = this.nmvb;
                this.changeValueHandle(nwtt); 
            };
        },
        
        changeValueHandle:function(value,index){

            this.val = value.text;
            this.valindex = value.value;
            this.$emit("changval",value,index)
        }
    }
});