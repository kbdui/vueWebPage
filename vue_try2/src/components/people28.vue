<script lang="ts" setup>
    import { ref } from 'vue'
    import outWindow from './outWindow.vue'
    import { useRouter } from 'vue-router'
    import headshot from './headshot.vue'

    const router = useRouter()

    // page header 页头
    const goBack = () => {
        router.push('/standard')
        console.log('go back')
    }

    // menu 菜单
    const activeIndex1 = ref('1')
    const activeIndex2 = ref('5')
    const handleSelect1 = (key: string, keyPath: string[]) => {
        if(key.match('2')) router.push('/machineSelect')
        if(key.match('3')) router.push('/supprotp36')
        if(key.match('4')) router.push('/p38')
        console.log(key, keyPath)
    }
    const handleSelect2 = (key: string, keyPath: string[]) => {
        if(key.match('5')){
            video.value = true
            test.value = false
        }
        else if(key.match('6')){
            video.value = false
            test.value = true
        }
        console.log(key, keyPath)
    }

    // 打开/关闭小窗口
    const showModal = ref(false)
    function openModal(i: number){
        if(i==1) showModal.value = true
    }
    function closeModal(i: number) {
        if(i==1) showModal.value = false
    }

    // 用于切换视频/考核页面
    const video = ref(true)
    const test = ref(false)

    //给边框使用
    const getCssVarName = (type: string) => {
        return `--el-box-shadow${type ? '-' : ''}${type}`
    }

    // 留言-文本框设置
    const textarea = ref('')

    //调整窗口的CSS
    const styleProps2 = ref({
        height: '35rem'
    });
</script>

<template>
  <div id="top">
    <div id="top1">
        <!-- page header 页头 -->
        <el-page-header @back="goBack">
        <template #content>
            <span class="text-large font-600 mr-3">
            GB 19083-2003 4.1 医用防护口罩>基本要求
            </span>
        </template>
        </el-page-header>

        <!-- 头像框 -->
        <headshot></headshot>
    </div>

    <!-- menu 菜单 -->
    <el-menu
      :default-active="activeIndex1"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect1"
    >
      <el-menu-item index="1">人员</el-menu-item>
      <el-menu-item index="2">设备</el-menu-item>
      <el-menu-item index="3">规程</el-menu-item>
      <el-menu-item index="4">样品</el-menu-item>
    </el-menu>
  </div>

  <div id="content">
    <div id="content1">
        <!-- menu 菜单2 -->
        <el-menu
          id="menu228"
          :default-active="activeIndex2"
          class="el-menu-demo"
          mode="horizontal"
          active-text-color="#ffd04b"
          @select="handleSelect2"
        >
          <el-menu-item index="5">视频</el-menu-item>
          <el-menu-item index="6">考核</el-menu-item>
        </el-menu>

        <!-- 按钮 -->
        <div id="p_button128">
            <el-button id="add" type="success" plain>加入记录</el-button>
        </div>
    </div>

    <!-- 具体内容 -->
    <div v-if="video" id="content228">
        <el-button id="upvideo28" type="success">导入视频</el-button>
        <div id="myvideo">
            <div
                class="inline-flex line1"
                h="30"
                w="30"
                m="2"
                :style="{
                boxShadow: `var(${getCssVarName('light')})`,
                }"
            >
                <p>这里放视频的标题或者内容的简要描述1</P>
                <el-button class="paly_button" type="success" @click="openModal(1)" round>播放</el-button>
                <el-button class="paly_button" style="width: auto;" type="primary" round>重新导入</el-button>
                <el-button class="paly_button" type="danger" round>删除</el-button>
            </div>
            <div
                class="inline-flex line1"
                h="30"
                w="30"
                m="2"
                :style="{
                boxShadow: `var(${getCssVarName('light')})`,
                }"
            >
                <p>这里放视频的标题或者内容的简要描述1</P>
                <el-button class="paly_button" type="success" @click="openModal(1)" round>播放</el-button>
                <el-button class="paly_button" style="width: auto;" type="primary" round>重新导入</el-button>
                <el-button class="paly_button" type="danger" round>删除</el-button>
            </div>
        </div>
    </div>

    <div v-else-if="test" id="content3">
        <div id="testPaper">
            <h2>考核试卷</h2>
            <el-button type="primary" plain>下载试卷</el-button>
            <el-button type="success" plain>上传试卷</el-button>
        </div>
        <div id="testVideo">
            <el-button type="warning" plain>考核管理</el-button>
        </div>
    </div>
  </div>

  <!-- 视频播放窗口 -->
   <outWindow 
    :isVisible = "showModal"
    @closeModal = "closeModal(1)"
   >
        <video class="video1" src="./videos/what.mp4" poster="./images/photo1.png" controls>
            Your browser does not support the video element.
        </video>
   </outWindow>
</template>

<style>
    #top1{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    #menu228{
        width: 80%;
        float: left;
    }
    #p_button128{
        width: 20%;
        height: auto;
        margin-left: 80%;
        display: flex;
    }
    #add{
        margin-top: 2rem;
        margin-left: 2rem;
    }
    #p1{
        margin-top: 2rem;
    }
    #upvideo28{
        margin-top: 2rem;
        margin-left: -80%;
    }
    .radius {
        height: auto;
        border: 1px solid var(--el-border-color);
        border-radius: 0;
        margin-top: 15px;
        padding: 1rem 0 1rem 0.5rem;
    }
    #myvideo{
        margin-top: 1rem;
        height: 24rem;
    }
    .video1{
        width: auto;
        height: 19rem;
    }
    .line1{
        display: flex;
        align-items: center;
        margin-bottom: 0.5rem;
        height: 6rem;
        padding: 1rem 0 1rem 0.5rem;
    }
    .line1 button{
        margin-left: 2rem;
        width: 3rem;
    }
    #content3 #testPaper{
        margin-top: 3rem;
    }
    #content3 h2{
        margin-bottom: 0.5em;
    }
    #content3 p{
        margin-top: 0.5em;
    }
    #content3 #testVideo{
        margin-top: 2em;
    }
    #content3 #authorization{
        margin-top: 2em;
    }
    #message_block{
        width: 30rem;
        height: 60%;
        overflow-y: scroll;
        overflow-x: hidden;
    }
    .message{
        margin-top: 0.5rem;
        margin-left: 0.4rem;
        width: 28rem;
        height: 8rem;
    }
    #text_input{
        margin-top: 1rem;
        width: 30rem;
        height: 10rem;
    }
    #send_text{
        position: absolute;
        margin-top: 11.5rem;
        margin-left: 12rem;
    }
</style>
