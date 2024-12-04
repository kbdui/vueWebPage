<script lang="ts" setup>
    import { onMounted, ref } from 'vue'
    import headshot from './headshot.vue'
    import { useRouter } from 'vue-router'
    import axios from 'axios'
    import { project_id, user_data } from '@/status'
    import OutWindow from './outWindow.vue'
    import { ElMessage } from 'element-plus'
    import topMessage from './son_components/topMessage.vue'
    import { useRoute } from 'vue-router'

    const router = useRouter()
    const route = useRoute()

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

    // handle change
    function handleChange() {
    }

    // 上传试卷
    function customRequest(options) {
      const { file, onProgress, onSuccess, onError } = options
      axios.post('http://localhost:8080/people_task_1_msg', {
          project_id: project_id.value,
          file: file,
          user_id: user_data.value.accountid
        },{
          headers: {
            'Content-Type': 'multipart/form-data'
            // 'Content-Type': 'application/x-www-form-urlencoded'
          },
          onUploadProgress: progressEvent => {
            onProgress(progressEvent);
          }
        }).then(function (response){
            onSuccess(response)
            ElMessage.success('试卷上传成功')
        }).catch(function (error){
            onError(error)
            ElMessage.error('试卷上传失败')
        })
    }

    // 上传考核视频
    function customRequest2(options) {
      const { file, onProgress, onSuccess, onError } = options
      axios.post('http://localhost:8080/people_task_2_msg', {
          project_id: project_id.value,
          file: file,
          user_id: user_data.value.accountid
        },{
          headers: {
            'Content-Type': 'multipart/form-data'
            // 'Content-Type': 'application/x-www-form-urlencoded'
          },
          onUploadProgress: progressEvent => {
            onProgress(progressEvent);
          }
        }).then(function (response){
            onSuccess(response)
            if(response.data.data === true){
                ElMessage.success('试卷上传成功')
            }
            else ElMessage.error('试卷上传失败')
        }).catch(function (error){
            onError(error)
            ElMessage.error('试卷上传失败')
        })
    }

    // 获取试卷下载地址
    const dawnLoadURL = ref('')
    function getDownloadUrl() {
        axios.post('http://localhost:8080/get_task_1_msg', {
          project_id: project_id.value
        },{
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(function (response){
            dawnLoadURL.value = response.data.data
        }).catch(function (error){
            if (error.response) {
                // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // 请求已经成功发起，但没有收到响应
                // `error.request` 在浏览器中是 XMLHttpRequest 的实例，
                // 而在node.js中是 http.ClientRequest 的实例
                console.log(error.request);
            } else {
                // 发送请求时出了点问题
                console.log('Error', error.message);
            }
            console.log(error.config)
            ElMessage.error('获取下载地址失败')
        })
    }

    // 下载地址字符串还没裁，现在会去E:/no_game/git/back2/local_hub\D:/files/4000001/4000001paper.pdf下载
    // 下载试卷
    function downloadPdf() {
        axios.post('http://localhost:8080/download', {
          fileName: dawnLoadURL.value
        },{
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(function (response){
            const link = document.createElement('a');
            link.href = 'http://localhost:8080/download';
            link.setAttribute('download', dawnLoadURL.value); // 设置下载的文件名
            document.body.appendChild(link);
            link.click(); // 触发下载
            document.body.removeChild(link);
            window.URL.revokeObjectURL('http://localhost:8080/download'); // 释放URL对象 
        }).catch(function (error){
            if (error.response) {
                // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // 请求已经成功发起，但没有收到响应
                // `error.request` 在浏览器中是 XMLHttpRequest 的实例，
                // 而在node.js中是 http.ClientRequest 的实例
                console.log(error.request);
            } else {
                // 发送请求时出了点问题
                console.log('Error', error.message);
            }
            console.log(error.config)
            ElMessage.error('下载失败')
        })
    }

    // 获取学习状态
    const isok = ref()
    const isover = ref()
    const overtime = ref()
    function getTrainStatus() {
        axios.post('http://localhost:8080/people_msg', {
            project_id: project_id.value,
            user_id: user_data.value.accountid
        },{
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (response){
            isok.value = response.data.data.is_ok
            if(isok.value === 1) {
                isover.value = '已完成'
                overtime.value = response.data.data.oktime
            }
            else {
                isover.value = '未完成'
                overtime.value = '未完成'
            }
        }).catch(function (error){
            if (error.response) {
            // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
            } else if (error.request) {
            // 请求已经成功发起，但没有收到响应
            // `error.request` 在浏览器中是 XMLHttpRequest 的实例，
            // 而在node.js中是 http.ClientRequest 的实例
            console.log(error.request);
            } else {
            // 发送请求时出了点问题
            console.log('Error', error.message);
            }
            console.log(error.config)
            ElMessage.error('获取学习状态失败')
        })
    }

    // 获取考核进度
    const progress = ref({
        progress: String,
        task_1: String,
        task_2: String,
        is_autho: String,
        auth_time: String
    })
    function getTestProgress() {
        axios.post('http://localhost:8080/task_msg', {
            project_id: project_id.value,
            user_id: user_data.value.accountid
        },{
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (response){
            progress.value = response.data.data
        }).catch(function (error){
            if (error.response) {
            // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
            } else if (error.request) {
            // 请求已经成功发起，但没有收到响应
            // `error.request` 在浏览器中是 XMLHttpRequest 的实例，
            // 而在node.js中是 http.ClientRequest 的实例
            console.log(error.request);
            } else {
            // 发送请求时出了点问题
            console.log('Error', error.message);
            }
            console.log(error.config)
            ElMessage.error('获取考核进度失败')
        })
    }

    // 一个用于从localStorage加载user_data的函数
    function loadData() {
        const savedData = localStorage.getItem('user_data');
        if (savedData) {
            user_data.value = JSON.parse(savedData);
        }
        const savedProjectId = localStorage.getItem('project_id');
        if (savedProjectId) {
            project_id.value = JSON.parse(savedProjectId);
        }
    }

    // 获取路由之后的信息
    function getRouterInfo() {
        if(route.params.num === '2'){
            activeIndex2.value = '6'
            video.value = false
            test.value = true
        }
    }

    onMounted(() => {
    loadData()
    getTrainStatus()
    getDownloadUrl()
    getTestProgress()
    getRouterInfo()
    });
</script>

<template>
  <div id="top">
    <div id="top1">
        <!-- page header 页头 -->
        <topMessage></topMessage>

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
        <p id="p1">培训情况: {{ isover }}</p>
        <p>培训完成时间：{{ overtime }}</p>
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
            <div style="display: flex;">
                <el-button type="primary" @click="downloadPdf()" plain>下载试卷</el-button>
                <el-upload
                    id="upload"
                    class="upload-demo"
                    action="/api/upload"
                    :on-change="handleChange"
                    :show-file-list="false"
                    :http-request="customRequest"
                >
                    <el-button type="success" plain>上传作答</el-button>
                </el-upload>
            </div>
            <p>笔试进度：{{ progress.task_1 }}</p>
        </div>
        <div id="testVideo">
            <h2>考核视频</h2>
            <el-upload
                class="upload-demo"
                action="/api/upload"
                :on-change="handleChange"
                :show-file-list="false"
                :http-request="customRequest2"
            >
                <el-button type="success" plain>上传操作考核视频</el-button>
            </el-upload>
            <p>操作视频考核进度：{{ progress.task_2 }}</p>
        </div>
        <div id="authorization">
            <h2>授权结果</h2>
            <p>授权情况：{{ progress.is_autho }}</p>
            <p>授权时间：{{ progress.auth_time }}</p>
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
    #upload{
        margin-left: 2em;
        margin-top: -2px;
    }
</style>
