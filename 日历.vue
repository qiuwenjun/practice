<template>
    <div class='calendar'>
       <div class="header">
            {{nowDay}}
       </div>
       <time>当前时间:{{nowTime}}</time>
       <time>预期时间::{{expected}}</time>
       <time>剩余时间:{{restTime}}</time>
       <button @click="getNowDate">返回今天</button>
       <div class="tab">
           <div class="tabChange">
                <span @click="yearFn('prev')">&lt</span>
                <select @change='change' v-model="year" class="year">
                    <option v-for="item,index in 100">{{initYear+item}}</option>
                </select>
                <span @click="yearFn('next')">&gt</span>
           </div>
           <div class="tabChange">
                <span @click="monthFn('prev')">&lt</span>
                <select @change='change' v-model="month" class="month">
                    <option v-for="item,index in 12">{{item | months}}月</option>
                </select>
                <span @click="monthFn('next')">&gt</span>
           </div>
       </div>
       <div class="main">
           <ul class="week">
               <li :key='item.id' v-for="item,index in week">{{item.name}}</li>
           </ul>
           <div class="day">
               <ul :key='item.id' v-for="item,index in dates">
                   <li @click="alertDate(value.date)" :date='value.date' :day='value.day' :class="{border:nowDate==value.date,active:value.active,noMonth:value.noMonth}" :key='value.id' v-for='value,key in item.value'>
                       {{value.value}}
                       <span v-if='festival[value.day]'>{{festival[value.day]}}</span>
                   </li>
               </ul>
           </div>
       </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            nowTime:new Date().toLocaleString(),
            expected:'2077/4/21',
            restTime:'',
            nowDay:'',
            nowDate:'',
            initYear:1999,
            year:'',
            month:'',
            week:[
                {
                    id:1,
                    name:'星期一'
                },
                {
                    id:2,
                    name:'星期二'
                },
                {
                    id:3,
                    name:'星期三'
                },
                {
                    id:4,
                    name:'星期四'
                },
                {
                    id:5,
                    name:'星期五'
                },
                {
                    id:6,
                    name:'星期六'
                },
                {
                    id:7,
                    name:'星期日'
                }
            ],
            dates:[],
            festival:{
                "0101":"元旦",
				"0214":"情人节",
				"0308":"妇女节",
				"0312":"植树节",
				"0315":"消费者权益日",
                "0401":"愚人节",
				"0404":"清明节",
				"0407":"世界卫生日",
				"0501":"劳动节",
				"0504":"青年节",
				"0512":"护士节",
				"0515":"家庭日",
				"0518":"博物馆日",
				"0531":"世界无烟日", 
				"0601":"儿童节",
				"0605":"世界环境保护日",
				"0606":"全国爱眼日",
				"0626":"禁毒日",
                "0701":"建党节",
                "0707":"抗日战争纪念日",
                "0801":"建军节",
				"0903":"抗战胜利日", 
				"0910":"教师节", 
				"0918":"九·一八",
				"1001":"国庆节",
				"1224":"平安夜",
				"1225":"圣诞节"
            }
        }
    },
    created(){
        setInterval(res=>{
            let date=new Date();
            this.nowTime=date.toLocaleString();
            let time=new Date(...this.expected.split('/'));
            let cha=time.getTime()-date.getTime();
            if(cha<0){
                cha=0
            }else{
                let date=parseInt(cha/86400000);
                let house=parseInt(cha%86400000/3600000);
                let min=parseInt(cha%86400000%3600000/60000);
                let sec=parseInt(cha%86400000%3600000%60000/1000);
                this.restTime=date+'天-'+house+'时-'+min+'分-'+sec+'秒';
            }
        },1000);
        this.getNowDate();  
    },
    filters:{
        months(defaults){
            return defaults<10?'0'+defaults:defaults;
        }
    },
    methods:{
        yearFn(text){
            if(text==='prev'&&this.year>this.initYear+1){
                this.year--;
                this.getDay(this.year,parseInt(this.month)-1,this.date);
            }else if(text==='next'&&this.year<this.initYear+100){
                this.year++;
                this.getDay(this.year,parseInt(this.month)-1,this.date);
            }
        },
        monthFn(text){
            if(text==='prev'){
                this.month=parseInt(this.month);
                this.month--;
                if(parseInt(this.month)<1){
                    this.yearFn('prev');
                    this.month=12;
                }
            }else if(text==='next'){
                this.month=parseInt(this.month);
                this.month++;
                if(parseInt(this.month)>12){
                    this.yearFn('next');
                    this.month=1;
                }
            };
            if(this.month<10) this.month='0'+this.month;
            this.month+='月';
            this.getDay(this.year,parseInt(this.month)-1,this.date);
        },
        change(){
            this.getDay(this.year,parseInt(this.month)-1,this.date);
        },
        getNowDate(){
            let time=new Date();
            this.year=time.getFullYear();
            let month=time.getMonth()+1;
            this.date=time.getDate();
            this.month=this.setTwo(month)+'月';
            this.time=new Date(this.year,month-1,this.date);
            this.getDay(this.year,month-1,this.date);
        },
        getDay(year,month,date){
            let time=new Date(year,month,date);
            month+=1;
            let day=time.getDay();
            day=day?day:7;
            this.nowDay=year+'年'+this.setTwo(month)+'月'+this.setTwo(date)+'日 星期'+this.switchWeek(day);
            this.nowDate=year+'-'+this.setTwo(month)+'-'+this.setTwo(date);
            let allDay=this.getMonth(year,month);
            let ceng=Math.ceil(allDay/7);
            let startWeek=new Date(year,month-1,1).getDay();
            startWeek=startWeek?startWeek:7;
            let endWeek=new Date(year,month-1,allDay).getDay();
            endWeek=endWeek?endWeek:7;
            let restDay=allDay-(7-startWeek+1);
            if((ceng-1)*7<restDay||endWeek===7) ceng++;
            if(startWeek==1) ceng++;
            let news=[];
            let index=1;
            let nextIndex=1;
            for(let i=0;i<ceng;i++){
                let arr=[];
                for(let l=1;l<=7;l++){
                    if(i==0&&l>=startWeek&&startWeek!==1){
                        arr.push({
                            id:i*7+l,
                            value:index,
                            day:this.setTwo(month)+''+this.setTwo(index),
                            date:year+'-'+this.setTwo(month)+'-'+this.setTwo(index),
                            active:this.time.getTime()==new Date(year,month-1,index).getTime(),
                            noMonth:false
                        });
                        index++;
                    }else if(i>0&&index<=allDay){
                        arr.push({
                            id:i*7+l,
                            value:index,
                            day:this.setTwo(month)+''+this.setTwo(index),
                            date:year+'-'+this.setTwo(month)+'-'+this.setTwo(index),
                            active:this.time.getTime()==new Date(year,month-1,index).getTime(),
                            noMonth:false
                        });
                        index++;
                    }else if(i==0){
                        let obj=this.getDate(true,year,month);
                        let value=startWeek==1?obj.day-(7-l):obj.day-startWeek+1+l;
                        arr.push({
                            id:i*7+l,
                            value,
                            day:this.setTwo(obj.prevMonth)+''+this.setTwo(value),
                            date:obj.prevYear+'-'+this.setTwo(obj.prevMonth)+'-'+this.setTwo(value),
                            active:false,
                            noMonth:true
                        })
                    }else{
                        let obj=this.getDate(false,year,month);
                        arr.push({
                            id:i*7+l,
                            value:nextIndex,
                            day:this.setTwo(obj.prevMonth)+''+this.setTwo(nextIndex),
                            date:obj.prevYear+'-'+this.setTwo(obj.prevMonth)+'-'+this.setTwo(nextIndex),
                            active:false,
                            noMonth:true
                        });
                        nextIndex++;
                    }
                }
                news.push({
                    id:news.length+1,
                    value:arr
                })
            }
            this.dates=news;
        },
        alertDate(date){
            let arr=date.split('-');
            this.year=arr[0];
            this.month=arr[1]+'月';
            this.date=parseInt(arr[2]);
            this.getDay(parseInt(arr[0]),arr[1]-1,parseInt(arr[2]));
        },
        switchWeek(day){
            switch(day){
                case 1:
                return '一';
                break;
                case 2:
                return '二';
                break;
                case 3:
                return '三';
                break;
                case 4:
                return '四';
                break;
                case 5:
                return '五';
                break;
                case 6:
                return '六';
                break;
                case 7:
                return '日';
                break;
            }
        },
        setTwo(value){
            return value<10?'0'+value:value;
        },
        getDate(flag,year,month){
            let prevMonth
            if(flag){
                prevMonth=month-1;
            }else{
                prevMonth=month+1;
            }
            let prevYear=year;
            if(prevMonth<1){
                prevMonth=12;
                prevYear=year-1;
            }else if(prevMonth>12){
                prevMonth=1;
                prevYear=year+1;
            }
            let day=this.getMonth(parseInt(prevYear),parseInt(prevMonth));
            return {
                prevYear,
                prevMonth,
                day
            };
        },
        getMonth(year,month){
            let max=[1,3,5,7,8,10,12];
            let min=[4,6,9,11];
            let spe=[2];
            if(max.includes(month)){
                return 31
            }else if(min.includes(month)){
                return 30
            }else{
                return this.getTwo(year)?29:28
            }
        },
        getTwo(year){               //判断是否闰年
            return year%4==0&&year%100!=0||year%400==0?true:false
        }
    }
}
</script>

<style lang='less' scoped>
.calendar{
    position: fixed;
    width: 500px;
    height: 500px;
    overflow-y: auto;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    background: #fff;
    box-shadow: 0 0 5px rgba(0,0,0,0.4);
    z-index: 999;
    .header{
        padding: 12px 0;
        text-align: center;
        font-size: 20px
    }
    time{
        display: block;
        text-align: center;
        line-height: 26px;
    }
    button{
        display: block;
        margin: 0 auto;
    }
    .tab{
        display: flex;
        justify-content: space-around;
        align-items: center;
        .tabChange{
            span{
                padding:0px 8px;
                font-size: 18px;
                background: #00BCD4;
                color: #fff
            }
            select{
                vertical-align: top;
                outline: none;
                line-height: 20px;
                height: 20px;
            }
        }
    }
    .main{
        .week{
            display: flex;
            li{
                width: 14%;
                text-align: center;
            }
        }
        .day{
            margin-top: 20px;
            ul{
                display: flex;
                border-bottom: 1px solid #999;
                li{
                    width: 14%;
                    height: 50px;
                    box-sizing: border-box;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-direction: column;
                    &.active{
                        color: #f00;
                    }
                    &.noMonth{
                        color: #ccc;
                    }
                    &.border{
                        border: 3px solid rgb(241, 245, 7);
                    }
                    span{
                        color: #f00;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                        display: block;
                        width: 100%;
                        text-align: center;
                        font-size: 12px;
                    }
                }
                li:hover{
                    border: 3px solid rgb(241, 245, 7);
                }
            }
        }
    }
}
</style>
