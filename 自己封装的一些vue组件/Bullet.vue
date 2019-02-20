<template>
    <div id="bullet" class="add_admin" v-show="show">
        <div :class="['main','animated',animation]">
            <header class="addHeader">
                <slot name='header'></slot>
            </header>
            <section class="addBody">
                <slot></slot>
            </section>
            <footer class="addFooter">
                <slot name="footer"></slot>
            </footer>
        </div>
    </div>
</template>

<script>
export default {
    props:{
        show:{
            type:Boolean,
            default(){
                return false
            }
        },
        animation:{
            type:String,
            default(){
                return 'bounceIn'
            }
        }
    },
}
</script>

<style lang='less'>
.add_admin{
        overflow-y: auto;
        position: fixed;
        left: 0%;
        background: rgba(0, 0, 0, 0.4);
        right: 0%;
        top: 0%;
        bottom: 0%;
        z-index: 999;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        .main{
            width: 800px;
            background: #fff;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 3px 0 rgba(0,0,0,0.16);
            border-radius: 4px;
            margin-top: 20px;
            overflow: hidden;
            .addHeader{
                width: 100%;
                height:60px;
                line-height: 60px;
                font-size: 20px;
                font-weight: 600;
                color: #30373F;
                text-align: center;
                position: relative;
                span{
                    &:hover{
                        transform:rotateZ(360deg) translateY(-50%);
                    }
                    position: absolute;
                    right: 5%;
                    top: 50%;
                    line-height: 0px;
                    transition: 0.6s;
                    transform-origin: center center;
                    transform:rotateZ(0deg) translateY(-50%);
                    cursor: pointer;
                }
            }
            .addBody{
                width: 100%;
                border-top: 1px solid #E0E3EB;
                border-bottom: 1px solid #E0E3EB;
                flex: 1;
                padding: 30px;
                box-sizing: border-box;
            }
            .addFooter{
                width: 100%;
                height: 60px;
                padding: 10px 20px;
                box-sizing: border-box;
                background: #F7F9FB;
                text-align: right
            }
        }
    }
</style>
