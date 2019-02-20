<template>
    <div class="selected">
        <h2 ref='title' @click="active">{{data[index]?data[index][value]:''}}<i class="iconfont" :style="{transform:flag?'translateY(-50%) rotateZ(-180deg)':'translateY(-50%) rotateZ(0deg)'}">&#xe695;</i></h2>
        <ul v-show="flag" class="body">
            <li @click="selected(i,item)" :key='item.id' :class="{'active':index===i,'hover':hoverIndex===i}" @mouseover="over(i)" @mouseout="out" v-for='item,i in data'>{{item[value]}}</li>
        </ul>
    </div>
</template>

<script>
/*
  props:
  Reset  //通过传这个参数能够重置下拉组件
  data  //接受父级传过来的数据
  select  //指定选中的项
  event
  change 选中项改变时向父级传递
*/
export default {
    name:"selected",
    props:{
        Reset:{},
        select:{
            type:[String,Number],
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
            this.index=0;
            this.selected(this.index,this.data[this.index])
        },
        select(){
            this.setSelect();
        }
    },
    data(){
        return{
            index:0,
            hoverIndex:'',
            flag:false
        }
    },
    mounted(){
        if(this.select){
            this.setSelect();
        }else{
            this.selected(this.index,this.data[this.index])
        }
        document.body.addEventListener('click',this.active,false)
    },
    destroyed(){
        document.body.removeEventListener('click',this.active,false)
    },
    methods:{
        over(index){
            this.hoverIndex=index;
        },
        out(){
            this.hoverIndex='';
        },
        setSelect(){
            let index=this.data.findIndex(res=>res.id==this.select);
            this.index=index==-1?0:index;
            this.selected(this.index,this.data[this.index])
        },
        selected(index,item){
            this.$emit('change',item);
            this.index=index;
            this.flag=false;
        },
        active(e){
            console.log(1)
            if(e){
                let el=e.target;
                if(el===this.$refs.title&&el!==e.currentTarget){
                    return ''
                }else if(el!==this.$refs.title&&!this.flag){
                    return ''
                }
            }
            this.flag=!this.flag;
        }
    }
}
</script>

<style lang="less" scoped>
.selected{
    min-width: 150px;
    width: 100%;
    height: 30px;
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
        position: relative;
        cursor: pointer;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
        i{
            position: absolute;
            right: 8px;
            top: 50%;
            transition: 0.6s;
            transform: translateY(-50%) rotateZ(0deg);
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
                color: #409eff;
                font-weight: 700;
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
        }
    }
}
</style>
