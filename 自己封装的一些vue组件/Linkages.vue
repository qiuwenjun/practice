<template>
    <div class="cityList">
        <div id='Linkages' ref='Linkages' class="selectEl" @click="isShow">
            {{selecText}}
            <i class="iconfont">&#xe695;</i>
        </div>
        <div @click.stop :class="['nowCity',show?'show':'hide']">
            <span class="iconfont">&#xe6b4;</span>
            <div>
                <nav :key='index' v-for="item,index in selects">
                    <ul>
                        <li @click="Selected(index,value)" :key='value.id' v-for="value,key in item" :class="selectId[index]&&value.id==selectId[index].id?'active':''">{{value[name]}}<i :style="{display:value.son&&value.son.length?'block':'none'}" class="iconfont">&#xe62c;</i></li>
                    </ul>
                </nav>
            </div>
        </div>
    </div>
</template>

<script>
/**
 * 
 * data    父级组件传来的数据
 * 
 * change事件  当内容发生改变时触发
 *  
 * */
export default {
    name:'Linkage',
    props:{
        data:{
            type:[Array,Object],
            required:true,
            
        },
        select:{
            type:Array,
            default(){
                return []
            }
        },
        name:{
            type:String,
            default(){
                return 'name'
            }
        }
    },
    computed:{
        selecText(){
            return this.selectId.reduce((prev,now,index)=>{
                return prev+=now.name+'/';
            },'').replace(/\/$/,'');
        }
    },
    data(){
        return {
            show:false,
            selects:[],              //要渲染的数据
            selectId:[],             //选中项ID
        }
    },
    watch:{
        data(){
           this.Selecteds();
        },
        select(){
           this.Selecteds();
        },
        selectId(){
            this.$emit('change',this.selectId);
        }
    },
    created(){
        this.Selecteds();
    },
    mounted(){
        document.addEventListener('click',this.clicks,false);
    },
    destroyed(){
        document.removeEventListener('click',this.clicks,false);
    },
    methods:{
       Selecteds(){
           this.selectId=this.select.concat([]);
           let newArr=[];
           let index=0;
           if(this.selectId[index]&&this.data&&this.data.length){
            this.Recursive(newArr,this.data,index);
            this.selects=newArr;
           }
       },
       Recursive(newArr,dataArr,index){
           let arr=dataArr.find(res=>{
               let flag=res.id===this.selectId[index].id;
               if(flag){
                   this.selectId[index].name=res.name;
               }
               return flag
           });
           newArr.push(dataArr);
           if(index<=this.selectId.length-1&&arr&&arr.son&&arr.son.length){
               this.Recursive(newArr,arr.son,++index);
           }
       },
       clicks(e){
           let el=e.target;
            if(el!==this.$refs.Linkages){
               this.show=false;
            }
       },
       isShow(){
           this.show=!this.show;
           if(this.show){
               if(this.selects.length==0){
                   this.selects.push(this.data);
                   this.selectId=[];
               }
           }else{
               setTimeout(res=>{
                   this.selects=[];
               },600);
           }
       },
       Selected(index,item){
            if(item.son&&item.son.length) this.selects.splice(index+1,this.selects.length-1-index,item.son);
            this.selectId.splice(index,this.selectId.length-index,{id:item.id,name:item.name});
       }
    },
}
</script>

<style lang='less' scoped>
.cityList{
    width: 100%;
    position: relative;
    .selectEl{
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        background-color: #fff;
        border-radius: 4px;
        border: 1px solid #dcdfe6;
        box-sizing: border-box;
        color: #c4c4cc;
        display: inline-block;
        font-size: inherit;
        height: 40px;
        line-height: 40px;
        padding: 0 15px;
        transition:all .2s cubic-bezier(.645,.045,.355,1);
        width: 100%;
        position: relative;
        cursor: pointer;
        &:hover{
            border: 1px solid #bcbfc5;
            box-shadow: 0 0 6px rgba(0,0,0,0.2);
        }
        i{
            position: absolute;
            right: 5%;
            top: 50%;
            transform: translateY(-50%);
            color: #666
        }
    }
    @keyframes show{
        0%{
            height: 0px;
            opacity: 0;
        }
        100%{
            height: 210px;
            opacity: 1;
        }
    }
    @keyframes hide{
        0%{
            height: 210px;
            opacity: 1;
        }
        100%{
            height: 0px;
            opacity: 0;
        }
    }
    .nowCity{
        &.show{
            animation: show 0.6s both ease-in;
        }
        &.hide{
            animation: hide 0.6s both ease-in;
        }
        position: absolute;
        top: 40px;
        left: 0%;
        white-space: nowrap;
        z-index: 2;
        padding-top: 20px;
        height: 0px;
        opacity: 0;
        overflow: hidden;
        span{
           position: absolute;
           font-size: 26px;
           color: rgba(0,0,0,0.08);
           top: 0px;
           left: 20px;
        }
        div{
            display: flex;
            border: 1px solid #e4e7ed;
            border-radius: 2px;
            box-shadow: 0 2px 12px 0 rgba(0,0,0,.1);
            background: #fff;
            nav{
                display: inline-block;
                vertical-align: top;
                height: 204px;
                overflow: auto;
                border-right: 1px solid #e4e7ed;
                background-color: #fff;
                box-sizing: border-box;
                margin: 0;
                padding: 6px 0;
                min-width: 160px;
                ul{
                    li{
                        &:hover{
                            background: rgb(236, 236, 236)
                        }
                        font-size: 14px;
                        padding: 8px 20px;
                        position: relative;
                        white-space: nowrap;
                        overflow: hidden;
                        text-overflow: ellipsis;
                        color: #606266;
                        height: 34px;
                        line-height: 1.5;
                        box-sizing: border-box;
                        transition: 0.6s;
                        cursor: pointer;
                        i{
                            display: none;
                        }
                        &.active{
                            color: #409eff;
                            i{
                                display: block;
                                position: absolute;
                                right: 0%;
                                top: 50%;
                                transform:rotateZ(90deg) translate(-70%,10%);
                                font-size: 14px;
                            }
                        }
                    }
                }
            }
        }
    }
}
</style>
