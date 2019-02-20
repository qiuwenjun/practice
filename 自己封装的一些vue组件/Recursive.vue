<template>
    <div class="Recursive">
        <div v-if="data.length==0" class="loading">
            暂无数据
        </div>
        <ul v-else class="table_list">
            <li v-for="item,i in data" :key='item.id'>
                <div class="title active">
                    <div v-for="value,key in head">
                        <template v-if='(index==0||songIndex)&&key==0'>
                            <i class="iconfont" @click="change(item)" :style="{'padding-left':index*20+20+'px'}">{{item.flag?'&#xe643;':'&#xe604;'}}</i>
                            {{item[value.type]}}
                        </template>
                        <template v-else>
                            <span :style="key==0&&{'padding-left':index*40+20+'px'}">{{item[value.type]}}</span>
                        </template>
                    </div>
                    <div v-if='opera.length' @click="operating($event,item)" v-html="opera[i].value" class="edit"></div>
                </div>
                <template v-if='item.son&&item.son.length'>
                    <Recursive @operatEvent='operating' v-show="item.flag" :Collapse='Collapse' :songIndex='songIndex' :head='head' :opera='opera[i]&&opera[i].children?opera[i].children:[]' :data='item.son' :index='index+1' />
                </template>
            </li>
        </ul>
    </div>
</template>

<script>
/**
 * head:    用来设置数据跟头部位置对应
 * data:    传过来的数据
 * index:   判断递归的层数
 * songIndex 判断要不要显示子集的头部按钮
 * opera     操作的相关代码
 * $event:   下面回调事件
 * operatEvent  操作的的回调
*/
export default {
    name:'Recursive',
    props:{
        head:{
            type:Array,
            default(){
                return []
            }
        },
        data:{
            type:Array,
            required:true,
        },
        index:{
            type:Number,
            default(){
                return 0
            }
        },
        songIndex:{
            type:Boolean,
            default(){
                return false
            }
        },
        opera:{
            type:Array,
            default(){
                return []
            }
        },
        Collapse:{
            type:Boolean,
            default(){
                return true
            }
        }
    },
    data(){
        this.watchData();
        return {
        }
    },
    watch:{
        data(){
            this.watchData();
        }
    },
    methods:{
        watchData(){
            this.data.forEach(res=>{
                if(this.Collapse&&res.son&&res.son.length){
                    this.$set(res,'flag',false);
                }else{
                    this.$set(res,'flag',true);
                }
            })
        },
        change(item,flag){
            if(item.son&&item.son.length){
                item.flag=flag!==undefined?flag:!item.flag;
                if(!item.flag){
                    item.son.forEach(res=>{
                        this.change(res,item.flag);
                    })
                }
            }
        },
        operating(...rest){
            this.$emit('operatEvent',...rest)
        }
    }
}
</script>

<style lang='less' scoped>
.Recursive{
    .table_list{
        li{
            .title{
                &.active{
                    border-bottom:1px solid #ececec;
                }
                display: flex;
                justify-content: space-around;
                align-items: center;
                padding: 10px 0;
                div{
                    font-size: 14px;
                    color: #535F6B;
                    flex: 1;
                    box-sizing: border-box;
                }
                div:first-child{
                    i{
                        cursor: pointer;
                        font-size: 20px;
                        vertical-align: -2px;
                    }
                }
                .edit:last-child{
                    text-align: right;
                }
            }
        }
    }
}
</style>
