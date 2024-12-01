<script lang="ts" setup>
    import { onMounted, ref } from 'vue'
    import headshot from './headshot.vue'
    import { reactive } from 'vue'
    import { useRouter } from 'vue-router'
    import { RouterLink } from 'vue-router'
import axios from 'axios'
    import { user_data } from '@/status'
import OutWindow from './outWindow.vue'
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
        if(key.match('2')) router.push('/machinefirst')
        if(key.match('3')) router.push('/Regulations')
        if(key.match('4')) router.push('/sample')
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
    const showModal2 = ref(false)
    function openModal(i: number){
        if(i==1) showModal.value = true
        else if(i==2) showModal2.value = true
    }
    function closeModal(i: number) {
        if(i==1) showModal.value = false
        else if(i==2) showModal2.value = false
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
    function getCurrentTime() {
  const now = new Date();
  return now.toLocaleString();
}
    const  isentry= ref(true)
    const  train= reactive({
        projectid: ''
    })
    const back= ref({
      res:'',
      isok:'',
      oktime:''
    })
    function handletrain()
    {
     if(isentry.value)
     {
        axios.post('http://localhost:8080/people_msg',
        {
            projectid:train.projectid
        },{
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
          })
          .then(function (response) {
            if(response.data.data.res===1)
          {
            alert('开始学习')
            console.log(response)
        //    router.push("/details/")
          }
          else if(response.data.data.res===2)
          {
            alert("学习项目为空")
            console.log(response)

           // router.push("/details/")
          }
          if(response.data.data.isok===1)
          {
            alert("该人员已学习完毕")
            response.data.oktime=getCurrentTime()
            console.log(response)
          //  router.push("/details/")
          }
          else if(response.data.data.isok===2)
          {
            alert("该人员未学习完毕")
            console.log(response)
          //  router.push("/details/")
          }
          })
          .catch(function (error) {
    console.error('Error:', error);
});
        }

    // 返回响应式数据和函数，以便在模板中使用
    return {
      isentry,
      train,
      handletrain,
      back
    };
    }
    onMounted(() => {
    //   handletrain(); // 页面初始化时调用handletrain函数
    });
</script>

<template>
  <div id="top">
    <div id="top1">
        <!-- page header 页头 -->
        <el-page-header @back="goBack">
        <template #content>
            <span style="color: rgb(30, 193, 30);" class="text-large font-600 mr-3">
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
          id="menu2"
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
        <div id="p_button1">
            <el-button id="p_leave" @click="openModal(2)" type="primary" plain>留言</el-button>
            <!-- <el-button id="add" type="success" plain > 加入记录</el-button> -->
        </div>
    </div>

    <!-- 具体内容 -->
    <div v-if="video" id="content2">
        <p id="p1">培训情况:{{  }}</p>
        <p>培训完成时间：{{}}</p>
        <el-button id="download" type="success">下载培训证书</el-button>
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
                <p>这里放视频的标题或者内容的简要描述2</P>
                <el-button class="paly_button" type="success" @click="openModal(1)" round>播放</el-button>
            </div>
        </div>
    </div>

    <div v-else-if="test" id="content3">
        <div id="testPaper">
            <h2>考核试卷</h2>
            <el-button type="primary" plain>下载试卷</el-button>
            <el-button type="success" plain>上传试卷</el-button>
            <p>评分情况：</p>
        </div>
        <div id="testVideo">
            <h2>考核视频</h2>
            <el-button type="success" plain>上传操作考核视频</el-button>
            <p>评分情况：</p>
        </div>
        <div id="authorization">
            <h2>授权结果</h2>
            <p>授权情况：</p>
            <p>授权时间：</p>
        </div>
    </div>
  </div>

  <!-- 视频播放窗口 -->
   <outWindow 
    :isVisible = "showModal"
    :messageType = "'Offiers'"
    :outWindowType = false
    @closeModal = "closeModal(1)"
   >
        <video class="video1" src="./videos/what.mp4" poster="./images/photo1.png" controls>
            Your browser does not support the video element.
        </video>
   </outWindow>

   <!-- 留言窗口 -->
    <outWindow 
    :isVisible = "showModal2"
    :styleProps = "styleProps2"
    :messageType = "'Offiers'"
    :outWindowType = true
    @closeModal = "closeModal(2)"
   >
   </outWindow>
</template>

<style>
    #top1{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    #menu2{
        width: 80%;
        float: left;
    }
    #p_button1{
        width: 20%;
        height: auto;
        margin-left: 85%;
        display: flex;
    }
    #p_leave{
        margin-left: 1rem;
        margin-top: 2rem;
    }
    #add{
        margin-top: 2rem;
    }
    #p1{
        margin-top: 2rem;
    }
    #download{
        margin-top: 15px;
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
</style>
