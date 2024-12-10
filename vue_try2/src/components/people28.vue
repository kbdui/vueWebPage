<script lang="ts" setup>
    import { onMounted, ref } from 'vue'
    import outWindow from './outWindow.vue'
    import { useRouter } from 'vue-router'
    import headshot from './headshot.vue'
    import topMessage from './son_components/topMessage.vue'
    import { ElMessage } from 'element-plus'
    import axios from 'axios'
    import { project_id, user_data } from '@/status'

    const router = useRouter()

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
    function openModal(i: number, url: string){
        if(i==1) {
            getFullVideoUrl(url)
            showModal.value = true
        }
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

    // 上传培训视频
    function customRequest(options) {
      const { file, onProgress, onSuccess, onError } = options
      axios.post('http://localhost:8080/upload_c_msg', {
          project_id: project_id.value,
          file: file
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
                ElMessage.success('培训视频上传成功')
            }
            else ElMessage.error('培训视频上传失败')
        }).catch(function (error){
            onError(error)
            ElMessage.error('培训视频上传失败')
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
            ElMessage.error('获取试卷下载地址失败')
        })
    }

    // 获取视频地址
    const videoUrls = ref([])
    function getVideoUrl() {
        axios.post('http://localhost:8080/download_c_msg', {
          project_id: project_id.value
        },{
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(function (response){
            videoUrls.value = response.data.data
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
            ElMessage.error('获取视频路径失败')
        })
    }

    // 获取完整视频路径
    const fullVideoUrl = ref('')
    async function getFullVideoUrl(url: string) {
        const strtmp="D:/files/";
        const Path=url.toString().replace(strtmp, "");
        try {
            const fullFileName =  decodeURIComponent(Path);
            const response = await axios({
            url: `http://localhost:8080/download`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: `fileName=${fullFileName}`, // 传递完整的文件名
            responseType: 'blob' // 指定响应类型为blob
            });
            fullVideoUrl.value = window.URL.createObjectURL(new Blob([response.data]));
        } catch (error) {
            ElMessage.error('获取视频路径失败');
        }
    }

    // 下载试卷
    async function downloadPdf() {
        const filename = dawnLoadURL.value;
        console.log("项目ID为:" + project_id.value + "\n" + "下载的文件名为：" + decodeURIComponent(filename));
        const strtmp="D:/files/";
        const Path=filename.toString().replace(strtmp, "");
        try {
            const fullFileName =  decodeURIComponent(Path);

            console.log("用来下载的文件地址为fullFileName:" + fullFileName);
            const response = await axios({
            url: `http://localhost:8080/download`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: `fileName=${fullFileName}`, // 传递完整的文件名
            responseType: 'blob' // 指定响应类型为blob
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            console.log("下载地址为：" + url);

            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', fullFileName); // 设置下载的文件名
            document.body.appendChild(link);
            link.click(); // 触发下载
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url); // 释放URL对象
        } catch (error) {
            console.error('下载试卷失败:', error);
            ElMessage.error('下载试卷失败');
        }
    }

    // 上传试卷
    function uploadPdf(options) {
        const { file, onProgress, onSuccess, onError } = options
      axios.post('http://localhost:8080/upload_t_msg', {
          project_id: project_id.value,
          file: file
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
                ElMessage.success('考核试卷上传成功')
            }
            else ElMessage.error('考核试卷上传失败')
        }).catch(function (error){
            onError(error)
            ElMessage.error('考核试卷上传失败')
        })
    }

    // handle change
    function handleChange() {
    }

    // 一个用于从localStorage加载信息的函数
    function loadData() {
        const savedProjectId = localStorage.getItem('project_id');
        if (savedProjectId) {
            project_id.value = JSON.parse(savedProjectId);
        }
    }

    // 更新localStorage中的视频完成信息
    const videoStorage = ref(new Map())
    function updateLocalVideoStorage(num: number) {
        const str = 'video_storage' + user_data.value.accountid
        const tmp = localStorage.getItem(str)
        if (tmp === null) {
            videoStorage.value = new Map()
        }
        else {
            videoStorage.value = JSON.parse(tmp)
        }

        if (videoStorage.value.has(project_id.value)) {
            var tmp2 = videoStorage.value.get(project_id.value) + 1
            videoStorage.value.set(project_id.value, tmp2)
        }
        else {
            videoStorage.value.set(project_id.value, 1)
        }

        localStorage.setItem(str, JSON.stringify(videoStorage.value))

        if(num === videoStorage.value.get(project_id.value)) {
            ElMessage.success('已完成培训视频学习')
        }
    }

    onMounted(() => {
        loadData()
        getDownloadUrl()
        getVideoUrl()
    })

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
        <div id="upload_video">
            <el-upload
                class="upload-demo"
                action="/api/upload"
                :on-change="handleChange"
                :show-file-list="false"
                :http-request="customRequest"
            >
                <el-button id="upvideo28" type="success">导入视频</el-button>
            </el-upload>
        </div>
        <div id="myvideo">
            <div
                class="inline-flex line1"
                h="30"
                w="30"
                m="2"
                :style="{
                boxShadow: `var(${getCssVarName('light')})`,
                }"
                v-for="(item, index) in videoUrls"
            >
                <p>培训视频{{ index }}</P>
                <el-button class="paly_button" type="success" @click="openModal(1, item)" round>播放</el-button>
                <el-button class="paly_button" type="danger" round>删除</el-button>
            </div>
        </div>
    </div>

    <div v-else-if="test" id="content3">
        <div id="testPaper">
            <h2>考核试卷</h2>
            <el-button type="primary" @click="downloadPdf()" plain>下载试卷</el-button>
            <el-upload
                id="upload_paper"
                class="upload-demo"
                action="/api/upload"
                :on-change="handleChange"
                :show-file-list="false"
                :http-request="uploadPdf"
            >
                <el-button type="success" plain>上传试卷</el-button>
            </el-upload>
        </div>
        <div id="testVideo">
            <el-button type="warning" plain>考核管理</el-button>
        </div>
    </div>
  </div>

  <!-- 视频播放窗口 -->
   <outWindow 
    :isVisible = "showModal"
    :messageType="'Offiers'"
    :outWindowType = false
    @closeModal = "closeModal(1)"
   >
        <video class="video1" :src=fullVideoUrl poster="./images/photo1.png" controls>
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
    #upload_video{
        margin-top: 1.5rem;
    }
    #upvideo28{
        margin-left: 1rem;
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
    #upload_paper{
        margin-top: 1rem;
    }
</style>
