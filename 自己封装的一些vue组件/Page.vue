<template>
    <div id="Page" class="page">
        <div class="page_left">
            每页显示
            <div class="tab">
                <select v-model='SelectPage'>
                    <option :key='item.id' v-for='item,index in pages'>{{item.value}}</option>
                </select>
            </div>
            条记录从1到{{nPage}}/共{{allNumber}}条数据
        </div>
        <div class="page_right">
            <nav class="clearFix" v-show="aPage" @click="callPage">
                <button v-if="nPage>page&&!isFlag" page="1">首页</button>
                <button v-if='nPage>1' :page='nPage-1'>上一页</button>
                <div v-if="isFlag||nPage<=page" class="prev">
                    <button :page="item" :class="item==nPage?'active':''" v-for="item,index in sPage">
                          {{item}}
                    </button>
                </div>
                <div v-else-if="nPage>page&&nPage<=aPage-page" class="center">
                        <button :page="nPage-page+item" :class="(nPage-page+item)==nPage?'active':''" v-for='item,index in page'>
                            {{nPage-page+item}}
                        </button>
                        <button :page="nPage+item" v-for='item,index in odd?page-1:page'>
                            {{nPage+item}}
                        </button>
                </div>
                <div v-else class="next">
                    <button :page="aPage-sPage+item" :class="aPage-sPage+item==nPage?'active':''" v-for="item,index in sPage">
                          {{aPage-sPage+item}}
                    </button>
                </div>
                <button v-if='nPage<aPage' :page='nPage+1'>下一页</button>
                <button v-if="nPage<=aPage-page&&!isFlag" :page="aPage">尾页</button>
            </nav>
        </div>
    </div>
</template>

<script>
/*
  props接受的参数
  @allNumber  //总数量
  @allPage:   //总页数，
  @showPage： //显示几页
  @nowPage:   //当前显示第几页
  @nowPages:    //选择的当前显示的量
  @pages      //当前页数的选项数
  event 
  @request    //操作之后的自定义事件函数请求对应内容
*/
import selects from '@/components/Component/select.vue';
export default {
    props:{
        allNumber:{
            type:[Number,String],
            default(){
                return 0
            }
        },
        allPage:{
            type:Number,
            default(){
                return 0
            }
        },
        showPage:{
            type:Number,
            default(){
                return 5
            }
        },
        nowPage:{
            type:Number,
            default(){
                return 1
            }
        },
        pages:{
            type:Array,
            default(){
                return [
                    {
                        id:1,
                        value:5
                    },
                    {
                        id:2,
                        value:10
                    },
                    {
                        id:3,
                        value:15
                    },
                    {
                        id:4,
                        value:20
                    },
                    {
                        id:5,
                        value:30
                    },
                ]
            }
        },
        nowPages:{
            type:[Number],
            default(){
                return 10
            }
        },
    },
    data(){
        let aPage=parseInt(this.allPage);
        let sPage=parseInt(this.showPage);
        let nPage=parseInt(this.nowPage);
        let isFlag=aPage<=sPage?true:false;
        if(isFlag){
            sPage=aPage;
        }
        if(nPage<0){
            nPage=1;
        }else if(nPage>aPage){
            nPage=aPage;
        }else{
            this.nPage=this.nowPage;
        }
        let page=Math.ceil(sPage/2);
        let odd=sPage%2?true:false;
        return {
            isFlag,
            aPage,
            sPage,
            nPage,
            odd,
            page,
            SelectPage:this.nowPages
        }
    },
    watch:{
        allPage(){
            this.Redraw();
        },
        showPage(){
            this.Redraw();
        },
        nowPage(){
            this.Redraw();
        },
        nowPages(news,old){
            if(news!=this.SelectPage) this.SelectPage=this.nowPages;
        },
        SelectPage(){
            this.request(1);
        }
    },
    methods:{
        Redraw(){
            console.log(this.allPage,this.showPage,this.nowPage)
            this.aPage=parseInt(this.allPage);
            this.sPage=parseInt(this.showPage);
            this.nPage=parseInt(this.nowPage);
            this.isFlag=this.aPage<=this.sPage?true:false;
            if(this.isFlag){
                this.sPage=this.aPage;
            }
            if(this.nPage<0){
                this.nPage=1;
            }else if(this.nPage>this.aPage){
                this.nPage=this.aPage;
            }else{
                this.nPage=this.nowPage;
            }
            this.page=Math.ceil(this.sPage/2);
            this.odd=this.sPage%2?true:false;
        },
        callPage(e){
            let el=e.target; 
            if(el.getAttribute("page")){
                let page=parseInt(el.getAttribute("page"));
                this.request(page);
            }
        },
        request(page){
            this.$emit('request',{
                num:parseInt(this.SelectPage),
                nowPage:page
            })
        },
    },
    components:{
        selects
    }
}
</script>

<style lang="less" scoped>
.page{
    height: 28px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .page_left{
        flex: 1;
        display: flex;
        align-items: center;
        font-size: 12px;
        color: #666;
        .tab{
            width: 70px;
            height: 30px;
            border-radius: 4px;
            margin: 0 6px;
            display: flex;
            font-size: 12px;
            color: rgba(0,0,0,0.65);
            overflow: hidden;
            select{
                width: 100%;
                outline: none;
                border-radius: 5px;
            }
        }
    }
    .page_right{
        flex: 1;
        nav{
           display: flex;
           justify-content: flex-end;
            height: 28px;
            button{
                &.active{
                    background: #00B5F0;
                    border-radius: 4px;
                    border: none;
                    color: #fff
                }
                &:hover{
                    background: #D9D9D9
                }
                &:active{
                    background: #bdbdbd
                }
                float: left;
                height: 28px;
                padding: 0 10px;
                border: 1px solid #D9D9D9;
                border-radius: 4px;
                font-size: 12px;
                color: #666666;
                text-align: center;
                line-height: 28px;
                margin-right: 8px;
                background: #fff;
                outline: none;
                cursor: pointer;
                transition: 0.6s;
            }
        }
    }
}
</style>
