<template>
    <div id="dataMain" class="dataMain" @scroll="Scroll">
        <table id="dataTable">
            <thead class="dataHeader" ref='' :style="style">
                <tr>
                    <th v-if="check">
                        <div class="checkBox">
                            <input type="checkbox" @change="changeall(checkedAll)" v-model="checkedAll" />
                            <i class="iconfont" v-html='checkedAll?"&#xe64d;":""'></i>
                        </div>
                    </th>
                    <th :key="item.id" v-for="item,index in tableTitle">
                        {{item.name}}
                    </th>
                    <th v-if='opearsData.length'>操作</th>
                </tr>
            </thead>
            <tbody v-if="!tableData.length">
                <tr>
                    <td colspan="9" style="border:none">暂无数据</td>
                </tr>
            </tbody>
            <tbody v-else>
                <tr v-for="item,index in tableData" :key="item.id">
                    <td v-if="check">
                        <div class="checkBox">
                            <input type="checkbox" @change="change(item,index,tableCheck[index])" v-model="tableCheck[index]"/>
                            <i class="iconfont" v-html='tableCheck[index]?"&#xe64d;":""'></i>
                        </div>
                    </td>
                    <td  v-for="value,i in tableTitle" :key='value.id'>
                        <div v-if="CustomElement[value.type]" @click='CustomElement[value.type].event&&CustomElement[value.type].event($event,item)' v-html="Array.isArray(CustomElement[value.type].node)?CustomElement[value.type].node[index]:CustomElement[value.type].node"></div>
                        <div v-else>{{item[value.type]}}</div>
                    </td>
                    <!--  v-html="opearsData" -->
                    <td class="opearing" v-html="opears[index]" v-if='opearsData.length' @click='operating($event,item,index)'>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>    
</template>

<script>
/*
props参数
@opears //获取要做的操作的html
@check //判断是否要开启全选和非全选按钮
@head  //设置tahead栏的数据  必传
@body  //设置taBody栏的数据  必传
@CustomElement  //替换表格中的展示形式
CustomElement:{
    [key和数据中key]:{
        //要插入的节点
        node:`<a href='javascript:void(0)' style="color:#00B5F0;">查看并审核</a>`,
        event(e,data){  //回调函数
            
        }   
    }
},

自定义事件
@checkChange   //当有数据被选中时触发
@checksChange    //当全选按钮被选中时触发
@targetel       //操作所用的自定义事件
*/
export default {
    props:{
        opears:{
            type:Array,
            default(){
                return []
            }
        },
        check:{
            type:Boolean,
            default(){
                return false
            }
        },
        CustomElement:{
            type:Object,
            default(){
                return {}
            }  
        },
        head:{
            type:[Array,Object],
            required:true
        },
        body:{
            type:[Array,Object],
            required:true
        }
    },
    data(){
        return{
            checkedAll:false,      //是否全选
            tableCheck:this.body.map(res=>false),
            style:{}
        }
    },
    watch:{
        body(){
            this.checkedAll=false;
            this.tableCheck=this.body.map(res=>false);
        }
    },
    computed:{
        tableTitle(){
            return this.head
        },
        tableData(){
            return this.body
        },
        opearsData(){
            return this.opears
        }
    },
    activated(){
        this.style={
            transform:'translateY(0px)',
        }
    },
    methods:{
        Scroll(e){
           let el=e.currentTarget;
           this.style={
               transform:'translateY('+el.scrollTop+'px)',
           }
        },
        changeall(flag){
            this.tableCheck=this.tableCheck.map(res=>flag);
            this.check&&this.$emit('checksChange',flag,this.tableData);
        },
        change(...rest){
            this.checkedAll=this.tableCheck.every(res=>res);
            this.check&&this.$emit('checkChange',...rest);
        },
        operating(...rest){
            this.opears&&this.$emit('targetel',...rest);
        }
    }
}
</script>

<style lang="less" scoped>
    .dataMain{
        width: 100%;
        height: 100%;
        &::-webkit-scrollbar { display: none }
        -ms-overflow-style: none; 
        overflow: -moz-scrollbars-none;
        overflow: auto;
        #dataTable{
            width:100%;
            text-align: center;
            padding: 0 20px;
            thead{
                box-shadow: rgba(0, 0, 0, 0.28) 1px 0px 9px 0px;
                z-index: 12;
                position: relative;
                tr{
                    th:first-child{
                        width: 50px;
                    }
                    th{
                        height: 38px;
                        font-size: 12px;
                        color: #535F6B;
                        background: #ECEDEF;
                    }
                }
                
            }
            tbody{
                tr:hover{
                    background:rgba(204, 204, 204, 0.253);
                }
                tr:nth-child(2n){
                    td{
                        background: rgb(248, 248, 248);
                    }
                }
                tr{
                    td{
                        height: 38px;
                        font-size: 12px;
                        color: #30373F;
                        border-bottom: 1px solid #E6E9EE;
                    }
                    .opearing{
                        font-size: 12px;
                       
                    }
                }
            }
        }
    }
.checkBox{
    width: 16px;
    height: 16px;
    display: inline-block;
    vertical-align: top;
    position: relative;
    input{
        position: absolute;
        width: 100%;
        height: 100%;
        opacity: 0;
        left: 0%;
        &:checked+i{
            color: #00B5F0;
            display: block;
            border: none;
            font-size: 17px;
            background: none;
        }
    }
    i{
        display: block;
        height: 100%;
        width: 100%;
        background: #fff;
        box-sizing: border-box;
        border: 1px solid #D8DDE6;
        border-radius: 2px;
    }
}
</style>

