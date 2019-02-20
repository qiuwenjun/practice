<template>
    <div class="selected">
        <h2 ref='title' @click="active">
            <dl>
                <dd v-for="item,i in selectArr" :key="item.id">{{item[value]}}<i @click="removeSelecte($event,i)" class="iconfont">&#xe612;</i></dd>
            </dl>
            <i class="iconfont" :style="{transform:flag?'rotateZ(-180deg)':'rotateZ(0deg)'}">&#xe695;</i>
        </h2>
        <ul v-show="flag" class="body">
            <li @click="selected(i,item)" :key='item.id' :class="{'active':selectArr.findIndex(res=>res.id==item.id)==-1?false:true,'hover':hoverIndex===i}" @mouseover="over(i)" @mouseout="out" v-for='item,i in data'>
                {{item[value]}}
                <i class="iconfont">&#xe656;</i>
            </li>
        </ul>
    </div>
</template>

<script>
/*
  props:
  select //父组件指定当前选中项
  Reset  //重置
  data  //接受父级传过来的数据
  event
  change 选中项改变时向父级传递
*/
export default {
    name:"selected",
    props:{
        Reset:{},
        select:{
            type:Array,
            default(){
                return [];
            }
        },
        data:{
            type:[Object,Array],
            required:true
        },
        value:{
            type:String,
            default(){
                return 'value'
            }
        }
    },
    watch:{
        Reset(){
            this.selectArr=[];
        },
        select(){
            this.selectArr=this.data.filter(res=>this.select.findIndex(item=>item==res.id)!=-1?true:false);
        }
    },
    data(){
        return{
            hoverIndex:'',
            flag:false,
            selectArr:[],
        }
    },
    mounted(){
        document.body.addEventListener('click',this.active,false)
    },
    destroyed(){
        document.body.removeEventListener('click',this.active,false)
    },
    methods:{
        over(index){    //放上去的样式
            this.hoverIndex=index;
        },
        out(){          //离开的样式
            this.hoverIndex='';
        },
        selected(index,item){    //选中项样式
            this.selectArr.push(item);
            this.$emit('change',this.selectArr);
            this.index=index;
            this.flag=false;
        },
        active(e){     //判断关闭还是开启
            let el=e.target;
            if(e.currentTarget==this.$refs.title){
                this.el=el;
                this.flag=!this.flag;
            }else if(!this.el&&this.flag){
                this.flag=false;
            }
            if(e.currentTarget!==this.$refs.title) this.el=''
        },
        removeSelecte(e,i){     //删除已被选中的菜单
            this.selectArr.splice(i,1);
            e.stopPropagation();
        }
    }
}
</script>

<style lang="less" scoped>
.selected{
    min-width: 150px;
    width: 100%;
    background: #FFFFFF;
    border: 1px solid #AEBBCE;
    border-radius: 4px;
    position: relative;
    h2{
        width: 100%;
        height: 100%;
        padding: 5px 8px;
        box-sizing: border-box;
        font-size: 14px;
        color: rgb(122, 124, 126);
        line-height: 20px;
        font-weight: normal;
        cursor: pointer;
        display: flex;
        >dl{
            flex: 1;
            display: flex;
            flex-flow:wrap;
            dd{
                box-sizing: border-box;
                border-color: transparent;
                margin: 2px 0 2px 6px;
                background-color: #f0f2f5;
                display: inline-block;
                padding: 0 10px;
                height: 32px;
                line-height: 30px;
                font-size: 12px;
                border-radius: 4px;
                border: 1px solid rgba(64,158,255,.2);
                white-space: nowrap;
                i{
                    display: inline-block;
                    vertical-align: middle;
                    margin-left: 5px;
                }
            }
        }
        >i{
            width: 20px;
            transition: 0.6s;
            display: flex;
            align-items: center;
        }
    }
    ul{
        &::-webkit-scrollbar { display: none }
        top: 120%;
        position: absolute;
        z-index: 999;
        background: #fff;
        min-width: 100%;
        max-height:100px;
        overflow-y: auto;
        border: 1px solid #e4e7ed;
        border-radius: 4px;
        background-color: #fff;
        box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
        box-sizing: border-box;
        li{
            &.active{
                i{
                    color: #409eff;
                }
            }
            &.hover{
                background-color: #f5f7fa;
            }
            font-size: 14px;
            padding: 0 20px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            color: #606266;
            height: 34px;
            line-height: 34px;
            box-sizing: border-box;
            cursor: pointer;
            position: relative;
            i{
                position: absolute;
                display: block;
                right: 20px;
                top:50%;
                transform: translateY(-50%)
            }
        }
    }
}
</style>
