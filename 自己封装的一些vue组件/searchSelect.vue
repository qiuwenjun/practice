<template>
    <div class="searchSelect">
        <div class="search" ref="search" @click="open">
            <input type="text" placeholder="请输入您要查询的内容" v-model="value" />
            <i class="iconfont" :class="{active:show}">&#xe695;</i>
        </div>
        <nav class="content" v-show="show">
            <div v-show="derived.length" @click="select(item)" @mouseover="over" @mouseout="out" :key='item.id' v-for="item,index in derived">{{item[keys]}}</div>
            <div v-show="!derived.length">暂无匹配数据!!!</div>
        </nav>
    </div>
</template>

<script>
export default {
    props:{
        data:{
            type:Array,
            required:true,
        },
        keys:{
            type:String,
            default(){
                return 'value'
            }
        }
    },
    data(){
        return {
            value:'',
            show:false,
        }
    },
    mounted(){
        document.addEventListener('click',this.close,false);
    },
    computed:{
        derived(){
            return this.data.filter((res,index)=>res[this.keys].includes(this.value));
        }
    },
    destroyed(){
        document.removeEventListener('click',this.close,false);
    },
    methods:{
        open(e){
            if(e.target.nodeName.toLowerCase()==='i'&&this.show){
                this.show=false;
            }else{
                this.show=true;
                this.value='';
            }
        },
        close(e){
            let el=e.target;
            if(el.parentNode!==this.$refs.search){
                this.show=false;
            }
        },
        select(item){
            this.value=item[this.keys];
            this.$emit('change',item);
        },
        over(e){
            e.currentTarget.style.backgroundColor='#f5f7fa';
        },
        out(e){
            e.currentTarget.style.backgroundColor='';
        }
    }
}
</script>

<style lang='less' scoped>
.searchSelect{
    width: 100%;
    position: relative;
    .search{
        width: 100%;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        -webkit-transition: 1s;
        transition: 1s;
        background: #FFFFFF;
        border: 1px solid #AEBBCE;
        border-radius: 4px;
        padding: 6px 10px;
        display: flex;
        input{
            flex:1;
            font-size: 14px;
            color: #AEBBCE;
            width: 100%;
            height: 100%;
            outline: none;
            border: none
        }
        i{
            width: 30px;
            height: 100%;
            cursor: pointer;
            text-align: center;
            transition:transform 0.6s;
            transform: rotateZ(0deg);
            &.active{
                transform: rotateZ(180deg);
            }
        }
    }
    .content{
        top:120%;
        position: absolute;
        z-index: 999;
        background: #fff;
        min-width: 100%;
        max-height: 100px;
        overflow-y: auto;
        border: 1px solid #e4e7ed;
        border-radius: 4px;
        background-color: #fff;
        -webkit-box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        padding: 5px 0;
        &::-webkit-scrollbar{display: none};
        div{
            padding: 5px 15px;
            font-size: 14px;
            cursor: pointer;
        }
    }
}
</style>
