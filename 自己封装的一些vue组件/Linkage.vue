<template>
    <div class="cityList">
        <div class="nowCity">
            <Selected @change="change" :select="selectData" :Reset='data' :data='data' value="name"></Selected>
        </div>
        <div v-if="dataSon.son&&dataSon.son.length" class="citySon">
            <Linkage @change="changed" :select='selecte' :data='dataSon.son' />
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
import Selected from '@/components/Component/select.vue';
export default {
    name:'Linkage',
    props:{
        data:{
            type:[Array,Object],
            required:true
        },
        select:{
            type:Array,
            default(){
                return []
            }
        }
    },
    data(){
        return {
            dataSon:{},
            selectData:'',
            selecte:[],
        }
    },
    watch:{
        data(){
            let index=this.selectData;
            this.selectData=0;
            setTimeout(res=>{
                if(this.selectData==0){
                    this.selectData=index;
                }else{
                    this.selectData=this.selectData;
                }
            },30)
        },
        select(){
          this.Selectefn();
        },
        dataSon(){
           this.dataSon.son||this.$emit('change',this.dataSon)
        }
    },
    created(){
        this.Selectefn();
    },
    methods:{
        Selectefn(){
           let arr=this.select.concat([]);
           this.selectData=arr.shift();
           this.selecte=arr;
        },
        change(data){
           this.dataSon=toString.call(data)==="[object Object]"?data:{};
        },
        changed(data){
          this.$emit('change',{
              now:this.dataSon,
              son:data
          })
        }
    },
    components:{
        Selected
    }
}
</script>

<style lang='less' scoped>
.cityList{
    display: flex;
    position: relative;
    .loading{
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0%;
        left: 0%
    }
    .nowCity{
        width: 150px;
        margin-right: 20px;
    }
    .citySon{
        flex: 1
    }
}
</style>
