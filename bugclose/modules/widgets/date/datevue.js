  
var Vue  = require("vue");

module.exports = Vue.component("vue-time", { 
className: 'vuetime',
name:'vuetime',
props:["planDate",'endDate'],   
template: __inline('./datevue.html'),
data: function(){
    return{
        currentDay: 1,
        currentMonth: 1,
        currentYear: 1970,
        currentWeek: 1,
        days: [],
        isfloatinput:false,
    }
},
mounted: function() {

    this.initData(null);
},
methods: {
   

    initData: function(cur) {
        var date;
        if (cur) {
            date = new Date(cur);
        } else {
            date = new Date();
        }
        this.currentDay = date.getDate();
        this.currentYear = date.getFullYear();
        this.currentMonth = date.getMonth() + 1;
        this.currentWeek = date.getDay(); // 1...6,0
        if (this.currentWeek == 0) {
            this.currentWeek = 7;
        }
        var str = this.formatDate(this.currentYear , this.currentMonth, this.currentDay);
        this.days.length = 0;
        // 今天是周日，放在第一行第7个位置，前面6个
        for (var i = this.currentWeek - 1; i >= 0; i--) {
            var d = new Date(str);
            d.setDate(d.getDate() - i);
            this.days.push(d);
        }
        for (var i = 1; i <= 35 - this.currentWeek; i++) {
            var d = new Date(str);
            d.setDate(d.getDate() + i);
            this.days.push(d);
        }
    },
    pick: function(date) {

        this.$emit("planDate",date);
        this.$emit("endDate",date);

    },
    pickPre: function(year, month) {
        
        var d = new Date(this.formatDate(year , month , 1));
        d.setDate(0);
        this.initData(this.formatDate(d.getFullYear(),d.getMonth() + 1,1));
    },
    pickNext: function(year, month) {
        var d = new Date(this.formatDate(year , month , 1));
        d.setDate(35);
        this.initData(this.formatDate(d.getFullYear(),d.getMonth() + 1,1));
    },

    formatDate: function(year,month,day){
        var y  = year;
        var m = month;
        if(m<10) m = "0" + m;
        var d = day;
        if(d<10) d = "0" + d;
        return y+"-"+m+"-"+d
    },
},

});