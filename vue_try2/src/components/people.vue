@ -1,751 +1,686 @@
<script lang="ts" setup>
    import { onMounted, ref, inject } from 'vue'
    import headshot from './headshot.vue'
    import { useRouter } from 'vue-router'
    import axios from 'axios'
    import { project_id, user_data, title } from '@/status'
    import OutWindow from './outWindow.vue'
    import { ElMessage } from 'element-plus'
    import topMessage from './son_components/topMessage.vue'
    import { useRoute } from 'vue-router'
    import { PDFDocument, rgb } from 'pdf-lib'
    import fontkit from '@pdf-lib/fontkit'
    import { text } from 'pdfkit'
    const router = useRouter()
    const route = useRoute()
    const baseurl=inject("baseurl")


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
    function openModal(i: number, url: string){
        if(i==1) {
            getFullVideoUrl(url)
            showModal.value = true
        }
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
      axios.post(baseurl + '/people_task_1_msg', {
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
            changeStatusToAuditing()
            ElMessage.success('试卷上传成功')
        }).catch(function (error){
            onError(error)
            ElMessage.error('试卷上传失败')
        })
    }

    // 修改考核状态为Auditing
    function changeStatusToAuditing() {
        axios.post(baseurl + '/change_2_msg', {
            project_id: project_id.value,
            user_id: user_data.value.accountid,
            state: 1
        },{
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (response){
            if(response.data.data === true) {
                ElMessage.success('状态修改成功')
                setTimeout(function() {
                    window.location.reload();
                }, 1000);
            }
            else ElMessage.error('状态修改失败')
        }).catch(function (error){
            ElMessage.error('状态修改失败')
        })
    }

    // 上传考核视频
    function customRequest2(options) {
      const { file, onProgress, onSuccess, onError } = options
      axios.post(baseurl + '/people_task_2_msg', {
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
                changeVideoStatusToAuditing()
                ElMessage.success('试卷上传成功')
            }
            else ElMessage.error('试卷上传失败')
        }).catch(function (error){
            onError(error)
            ElMessage.error('试卷上传失败')
        })
    }

    // 修改视频考核状态为Auditing
    function changeVideoStatusToAuditing() {
        axios.post(baseurl + '/change_3_msg', {
            project_id: project_id.value,
            user_id: user_data.value.accountid,
            state: 1
        },{
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (response){
            if(response.data.data === true) {
                ElMessage.success('状态修改成功')
                setTimeout(function() {
                    window.location.reload();
                }, 1000);
            }
            else ElMessage.error('状态修改失败')
        }).catch(function (error){
            ElMessage.error('状态修改失败')
        })
    }

    // 获取试卷下载地址
    const dawnLoadURL = ref('')
    function getDownloadUrl() {
        axios.post(baseurl + '/get_task_1_msg', {
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
            url: baseurl + `/download`,
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

    function generateRandomSerial() {
    // 生成一个0到999999的随机数
    const randomNum = Math.floor(Math.random() * 1000000);
    // 将随机数转换为字符串，并取前5位
    const serial = randomNum.toString().slice(0, 5);
    return serial;
    }
    function convertDate(dateString) {
    // 移除日期字符串中的破折号
    return dateString.replace(/-/g, '');
    }
    // 使用这个函数来获取随机编号
    const randomSerial = generateRandomSerial();

    // 更新localStorage中的视频完成信息
    const videoStorage = ref(new Map())
    function updateLocalVideoStorage(num: number) {
        const str = 'video_storage' + user_data.value.accountid
        const tmp = localStorage.getItem(str)
        if (tmp === null || tmp === '{}') {
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
            axios.post(baseurl + '/change_msg', {
                project_id: project_id.value,
                user_id: user_data.value.accountid
            },{
                headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
                }
            }).then(function (response){
                if(response.data.data === true) {
                    ElMessage.success('视频学习完成')
                    setTimeout(function() {
                        window.location.reload();
                    }, 1000);
                }
                else ElMessage.error('视频学习完成失败')
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
            ElMessage.success('已完成培训视频学习')
        }
    }

    // 获取学习状态
    const isok = ref()
    const isover = ref()
    const overtime = ref()
    function getTrainStatus() {
        axios.post(baseurl + '/people_msg', {
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
    const progress_task_1 = ref('')
    const progress_task_2 = ref('')
    function getTestProgress() {
        axios.post(baseurl + '/task_msg', {
            project_id: project_id.value,
            user_id: user_data.value.accountid
        },{
            headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then(function (response){
            progress.value = response.data.data
            progress_task_1.value = response.data.data.task_1
            progress_task_2.value = response.data.data.task_2
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

    // 获取视频地址
    const videoUrls = ref([])
    function getVideoUrl() {
        axios.post(baseurl + '/download_c_msg', {
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
            ElMessage.error('获取视频地址失败')
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
            url: baseurl + `/download`,
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

    // 视频播放完成后更新localStorage
    // const videoNum = videoUrls.value.length
    function handleEnded() {
        updateLocalVideoStorage(1)
    }

    // 一个用于从localStorage加载信息的函数
    function loadData() {
        const savedData = localStorage.getItem('user_data');
        if (savedData) {
            user_data.value = JSON.parse(savedData);
        }
        const savedProjectId = localStorage.getItem('project_id');
        if (savedProjectId) {
            project_id.value = JSON.parse(savedProjectId);
        }
        const savedData2 = localStorage.getItem('title');
        if (savedData2) {
            title.value = JSON.parse(savedData2);
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

    // 下载授权证书
    async function downloadAuthorPdf() {
        const strtmp1 = progress.value.task_1
    if(progress_task_1.value !== 'Pass' || progress_task_2.value !== 'Pass') {
        ElMessage.error('请先完成考核任务')
        return
    }
    try {
        const response = await fetch('src/assets/培训证书模板.pdf');
        console.log("模板文件路径为：" + decodeURIComponent(response.url));
        console.log("用户名: " +progress.value.is_autho);
        if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        }

        const pdfBytes = await response.arrayBuffer();
        const pdfDoc = await PDFDocument.load(pdfBytes);
        
        // 注册 fontkit
        pdfDoc.registerFontkit(fontkit);

        const firstPage = pdfDoc.getPage(0);
        const pageSize = firstPage.getSize(); // 获取页面尺寸
        // 获取字体文件
        const fontResponse = await fetch('src/assets/SimSun.ttf');
        const fontBytes = await fontResponse.arrayBuffer();
        const font = await pdfDoc.embedFont(fontBytes); // 嵌入字体

        // 假设overtime.value是一个日期字符串，格式为yyyy-mm-dd
        const dateInYMDFormat = progress.value.auth_time.substring(0, 10);
        const convertedDate = convertDate(dateInYMDFormat);

        // 定义多个文本和它们的位置
        const texts = [
        { text: '授 权 证 书', x: 550, y: 600, size: 80 },
        { text: `证书编号：${convertedDate+randomSerial}`, x: 700, y: 550, size: 20 },

        { text: `兹证明 ${user_data.value.username} 先生/女士：`, x: 300, y: 450, size: 35 },
        { text: `于${progress.value.auth_time.substring(0, 10)}完成${title.value.substring(0, 18)}`, x: 350, y: 375, size: 35 },
        {text:    `${title.value.substring(18)} 项目培训。`,x: 350, y: 300, size: 35},
        {text:`获得该项目检测授权。`,x:300,y:225,size:35},
        {text:'特发此证！',x:350,y:150,size:35},

        {text:'签发单位：南京理工大学名茜医疗器械项目部',x:600,y:50,size:20},
        {text:`日期：${progress.value.auth_time.substring(0, 10)}`,x:700,y:75,size:20}

        ];

        // 在不同位置添加文本
        texts.forEach(textObj => {
        firstPage.drawText(textObj.text, {
            x: textObj.x,
            y: textObj.y,
            size: textObj.size,
            color: rgb(0.5, 0.5, 0), // 黑色
            font: font,
        });
        });

        const pdfBytesModified = await pdfDoc.save();
        const blob = new Blob([pdfBytesModified], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', '授权证书.pdf');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

    } catch (error) {
        console.error('Error fetching PDF:', error);
    }
    }  

    // 下载培训证书
    async function downloadpaperPdf() {
    if(isover.value !== '已完成') {
        ElMessage.error('请先完成培训视频学习')
        return
    }
    try {
        const response = await fetch('src/assets/培训证书模板.pdf');
        console.log("模板文件路径为：" + decodeURIComponent(response.url));
        console.log("用户名: " + user_data.value.username);
        console.log("项目名称: " + title.value);

        if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
        }

        const pdfBytes = await response.arrayBuffer();
        const pdfDoc = await PDFDocument.load(pdfBytes);
        
        // 注册 fontkit
        pdfDoc.registerFontkit(fontkit);

        const firstPage = pdfDoc.getPage(0);

        // 获取字体文件，这里使用支持中文的字体，例如宋体
        const fontResponse = await fetch('src/assets/SimSun.ttf');
        const fontBytes = await fontResponse.arrayBuffer();
        const font = await pdfDoc.embedFont(fontBytes); // 嵌入字体


        // 假设overtime.value是一个日期字符串，格式为yyyy-mm-dd
        const dateInYMDFormat = overtime.value.substring(0, 10);
        const convertedDate = convertDate(dateInYMDFormat);
        // 定义多个文本和它们的位置
        const texts = [
        { text: '培 训 证 书', x: 550, y: 600, size: 80 },
        { text: `证书编号：${convertedDate+randomSerial}`, x: 700, y: 550, size: 20 },
        { text: `兹证明 ${user_data.value.username} 先生/女士：`, x: 350, y: 450, size: 35 },
        { text: `于${overtime.value.substring(0, 10)}完成${title.value.substring(0, 18)}`, x: 350, y: 375, size: 35 },
        {text:    `${title.value.substring(18)} 项目培训。`,x: 350, y: 300, size: 35},
        { text: '特发此证', x: 350, y: 200, size: 35 },
        { text: '签发单位：南京理工大学名茜医疗器械项目部', x:600,y:50,size:20 },
        { text: `日期：${overtime.value.substring(0, 10)}`,x:700,y:75,size:20 }
        ];
        texts.forEach(textObj => {
        firstPage.drawText(textObj.text, {
            x: textObj.x,
            y: textObj.y,
            size: textObj.size,
            color: rgb(0.5, 0.5, 0), // 黑色
            font: font,
            // maxWidth: textObj.wrap && textObj.wrap.width // 换行设置
        });
        });
        const pdfBytesModified = await pdfDoc.save();
        const blob = new Blob([pdfBytesModified], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', '培训证书.pdf');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        console.error('Error fetching PDF:', error);
    }
    }

    onMounted(() => {
    loadData()
    getTrainStatus()
    getDownloadUrl()
    getVideoUrl()
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
            <el-button id="p_leave" @click="openModal(2, '')" type="primary" plain>留言</el-button>
            <!-- <el-button id="add" type="success" plain > 加入记录</el-button> -->
        </div>
    </div>

    <!-- 具体内容 -->
    <div v-if="video" id="content2">
        <p id="p1">培训情况: {{ isover }}</p>
        <p>培训完成时间：{{ overtime }}</p>
        <el-button id="download" type="success" @click="downloadpaperPdf()">下载培训证书</el-button>
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
                <p>{{ title }} 培训视频{{ index+1 }}</P>
                <el-button class="paly_button" type="success" @click="openModal(1, item)" round>播放</el-button>
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
        <el-button  type="success" size="medium"  @click="downloadAuthorPdf()" plain>下载授权证书</el-button>
    </div>
  </div>

  <!-- 视频播放窗口 -->
   <outWindow 
    :isVisible = "showModal"
    :messageType = "'Offiers'"
    :outWindowType = false
    @closeModal = "closeModal(1)"
   >
        <video class="video1" :src=fullVideoUrl @ended="handleEnded" poster="./images/photo1.png" controls>
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
    #progressMarker {
    position: absolute;
    bottom: 10px;
    right: 10px;
    padding: 5px;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    border-radius: 5px;
}
</style>
