<template>
    <div class="uploadFiles">
        <div v-show="!dataImg.length">
            <div class="uploadButton" v-if='status=="button"'></div>
            <div class="uploadDrag" v-else-if='status=="drag"'></div>
            <div class="uploadList" v-else-if='status=="list"'>
                <input type="file" @change="changed" />
                <i>+</i>
            </div>
        </div>
        <div class="imgList" v-show="dataImg.length">
            <ul>
                <li :key="item.id" v-for="item,index in dataImg">
                    <img :src="item.url" :title="item.dispName" />
                    <i class="iconfont" @click="removeData(index)">&#xe61d;</i>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
/*
  status :{
      button    //按钮样式的上传图片
      drag      //待拖拽上传的样式
  }
  event
  @change
*/
import {uploadImg} from '@/assets/js/api.js';
export default {
    props:{
        status:{
            type:String,
            default(){
                return 'button'
            }
        },
        Reset:{},
        select:{
            type:Array,
            default(){
                return []
            }
        }
    },
    watch:{
        Reset(){
            this.dataImg=[];
        },
        select(){
            this.dataImg=this.select
        }
    },
    data(){
        return {
            dataImg:[]
        }
    },
    methods:{
        removeData(index){
            this.dataImg.splice(index,1);
            this.$emit('change',this.dataImg);
        },
        changed(e){
            if(this.uploadImg){
                this.$message({
                    type:"info",
                    message:'正在上传图片，请稍后'
                })
            }else{
                let el=e.target;
                let files=el.files[0];
                if(files&&/image/.test(files.type)){
                    let data=new FileReader();
                    data.readAsDataURL(files);
                    data.onload=res=>{
                        this.uploadImg=true;
                        let request=this.$request({
                            Controller:uploadImg,
                            isToken:true,
                            uploadImg:[data.result],
                            method:'post',
                        })
                        request.request.then(res=>{
                            this.uploadImg=false;
                            el.value='';
                            if(!res) return '';
                            let data=res.data;
                            if(data.code===200){
                                this.$emit('change',data.data);
                                this.dataImg=data.data;
                                this.$message({
                                    type:'success',
                                    message:"上传成功"
                                })
                            }else{
                                this.$emit('change','fail');
                                this.$message({
                                    type:'error',
                                    message:data.message
                                })
                            }
                        })
                    }
                    data.onerror=res=>{
                        this.$message({
                            type:"error",
                            message:'图片文件解析失败'
                        })
                    }
                }else{
                    this.$message({
                        type:"info",
                        message:'请上传图片文件'
                    })
                }
            }
        }
    }
}   
</script>

<style lang='less' scoped>
.uploadFiles{
    width: 100%;
    height: 100%;
    >div{
        height: 100%;
        width: 100%;  
    }
    .imgList{
        ul,li,img{
            width: 100%;
            height:100%
        }
        ul{
            li{
                position: relative;
                i{
                    position: absolute;
                    font-size: 20px;
                    right: 0%;
                    top:0%;
                    transform: translate(50%,-50%);
                    color: #999;
                    cursor: pointer;
                }
            }
        }
    }
    .uploadList{
        background-color: #fbfdff;
        border: 1px dashed #c0ccda;
        border-radius: 6px;
        box-sizing: border-box;
        cursor: pointer;
        height: 100%;
        width: 100%;
        vertical-align: top;
        position: relative;
        overflow: hidden;
        display: flex;
        justify-content: center;
        align-items: center;
        input{
            position: absolute;
            width: 100%;
            height: 100%;
            opacity: 0;
        }
        i{
            font-size: 20px;
            color: #c0ccda
        }
    }
}
</style>
