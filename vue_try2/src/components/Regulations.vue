<!-- <script lang="ts" setup>
    import { ref,onMounted } from 'vue'
    import { useRouter } from 'vue-router'
    import headshot from './headshot.vue'
    import outWindow from './outWindow.vue'
    import { project_id } from '@/status'
    import axios from 'axios'
    import topMessage from './son_components/topMessage.vue'
    import { ElMessage } from 'element-plus'

    const router = useRouter()

    // menu 菜单
    const activeIndex1 = ref('3')
    const handleSelect1 = (key: string, keyPath: string[]) => {
        if(key.match('1')) router.push('/details/')
        if(key.match('2')) router.push('/machinefirst')
        if(key.match('4')) router.push('/sample')
        console.log(key, keyPath)
    }

    // 打开/关闭小窗口
    const showModal2 = ref(false)
    function openModal(){
        showModal2.value = true
    }
    function closeModal() {
        showModal2.value = false
    }

    //给边框使用
    const getCssVarName = (type: string) => {
        return `--el-box-shadow${type ? '-' : ''}${type}`
    }

    // 留言-文本框设置
    const textarea = ref('')

    // 调整窗口的CSS
    const styleProps2 = ref({
        height: '35rem'
    });

    // 加载project_id
    function loadprojectid() {
        const savedData = localStorage.getItem('project_id');
        if (savedData) {
            project_id.value = JSON.parse(savedData);
            console.log(project_id.value)
        }
    }

    // 获取所有的操作规程
    const operationList = ref([])
    function getAllOperations(){
        axios.post('http://localhost:8080/download_operation_procedure',{
            project_id : project_id.value
        },{
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        }).then(function(response){
            operationList.value=response.data.data
            for(var i=0;i<operationList.value.length;i++){
                operationList.value[i] = (String)(operationList.value[i]).split('/').pop()
            }
        }).catch(function(error){
            console.log(error)
            ElMessage.error('获取操作规程失败')
        })
    }

    // 获取所有的对比实验
    const compareList = ref()
    function getAllcompare(){
        axios.post('http://localhost:8080/download_compare_plan',{
            project_id : project_id.value
        },{
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        }).then(function(response){
            compareList.value=response.data.data
            compareList.value = (String)(compareList.value).split('/').pop()
        }).catch(function(error){
            console.log(error)
            ElMessage.error('获取对比实验失败')
        })
    }

    // 根据输入地址下载目标文件
    function downloadFile(url: string) {
        axios.post('http://localhost:8080/download', {
          fileName: url
        },{
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }).then(function (response){
            const link = document.createElement('a');
            link.href = response.data.url; // 假设服务器返回文件的实际URL
            link.setAttribute('download', url); // 设置下载的文件名
            document.body.appendChild(link);
            link.click(); // 触发下载
            document.body.removeChild(link);
            window.URL.revokeObjectURL(link.href); // 释放URL对象 
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

    // 组件挂载时执行的事件
    onMounted(() => {
        loadprojectid()
        getAllOperations()
        getAllcompare()
    })
</script> -->

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

  <div id="leave_btn">
    <el-button id="r_leave" @click="openModal()" type="primary" plain>留言</el-button>
  </div>
  
  <!-- 操作规程 -->
   <!-- <div id="r_content1">
        <h2>操作规程</h2>
        <div v-for="operation in operationList" class="content_pdf">
            <p>{{ operation }}</p>
            <el-button type="success" @click="downloadFile(operation)" plain>下载</el-button>
        </div>
   </div> -->
   <div class="procedures-list">
      <div v-for="(procedure, index) in procedures" :key="index" class="procedure-item">
        <span class="filename">{{ procedure.filename }}</span>
        <div class="actions">
          <el-button 
            type="primary" 
            size="small"
            @click="downloadPdf(index)"
          >
            下载
          </el-button>
        </div>
      </div>
    </div>

   <!-- 对比实验 -->
    <!-- <div id="r_content2">
        <h2>对比实验</h2>
        <div v-if="compareList != 'null'" class="content_compare">
            <p>{{ compareList }}</p>
            <el-button type="success" @click="downloadFile(compareList)" plain>下载</el-button>
        </div>
        <div v-if="compareList != 'null'" class="content_status">
            <el-button type="primary" plain>申请对比实验</el-button>
        </div>
      </div> -->

   <!-- 留言窗口 -->
    <outWindow 
    :isVisible = "showModal2"
    :styleProps = "styleProps2"
    :messageType = "'Stander'"
    :outWindowType = true
    @closeModal = "closeModal()"
   >
   </outWindow>
</template>


<script lang="ts" setup>

import { ref, onMounted, inject } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { project_id } from '@/status';

const procedures = ref([]);
const comparisonFiles = ref([]);
const tmp = ref([]);
const tmp_com = ref([]);
const baseurl = inject('baseurl')

    const router = useRouter()

    // page header 页头
    const goBack = () => {
        router.push('/standard')
        console.log('go back')
    }
// 加载项目ID
function loadProjectId() {
  const savedData = localStorage.getItem('project_id');
  if (savedData) {
      project_id.value = JSON.parse(savedData);
      // console.log(project_id.value);
  }
}

//获取后端操作规程文件
async function fetchProcedures() {
  try {
    const response = await axios.post(baseurl + '/download_operation_procedure', {
      project_id: project_id.value
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    if (response.data && response.data.data) {
       tmp.value = response.data.data;
       console.log("tmp中的数据为：");
       console.log(tmp.value);
      procedures.value = response.data.data.map(file => {
        const filename = file.split('#').pop(); // 提取文件名
        return {
          filename: filename,
          url: baseurl + `/files/${encodeURIComponent(filename)}` // 构造URL时只使用文件名，并进行编码
        };
      });
    } else {
      console.error('数据结构不符合预期:', response.data);
      ElMessage.error('数据结构不符合预期，请检查后端返回的数据');
    }
  } catch (error) {
    console.error('获取操作规程失败：', error);
    ElMessage.error('获取操作规程失败，请重试');
  }
}

//获取后端对比文件的函数
async function fetchComparison() {
  try {
    const response = await axios.post(baseurl + '/download_compare_plan', 
      `project_id=${project_id.value}`, 
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    if (response.data && response.data.data) {
      // 假设后端返回的data是一个包含文件地址的字符串
      const comparisonFileUrl = response.data.data;
      tmp_com.value = response.data.data;
      console.log("tmp_com中的数据为：");
      console.log(tmp_com.value);
      // 将文件地址存储到响应式变量中，以便在Vue模板中使用
      comparisonFiles.value = [{
        filename: comparisonFileUrl.split('/').pop(), // 提取文件名
        url: comparisonFileUrl // 文件的完整URL
      }];
    } else {
      console.error('数据结构不符合预期:', response.data);
      ElMessage.error('数据结构不符合预期，请检查后端返回的数据');
    }
  } catch (error) {
    console.error('获取对比实验文件失败：', error);
    ElMessage.error('获取对比实验文件失败，请重试');
  }
}
// 下载PDF文件
async function downloadPdf(index) {
  const filename = tmp.value[index];
  console.log("项目ID为：" + project_id.value + "\n" + "下载的文件名为：" + decodeURIComponent(filename));
  const strtmp="D:/files/";
  const Path=filename.replace(strtmp, "");
  try {
    const fullFileName =  decodeURIComponent(Path);

    console.log("用来下载的文件地址为fullFileName：" + fullFileName);
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
    console.error('下载PDF文件失败：', error);
    ElMessage.error('下载PDF文件失败，请重试');
  }
}
onMounted(() => {
  loadProjectId();
  fetchProcedures();
//   fetchComparison();
});
    // menu 菜单
    const activeIndex1 = ref('3')
    const handleSelect1 = (key: string, keyPath: string[]) => {
        if(key.match('1')) router.push('/details/')
        if(key.match('2')) router.push('/machinefirst')
        if(key.match('4')) router.push('/sample')
        console.log(key, keyPath)
    }

    // 打开/关闭小窗口
    const showModal2 = ref(false)
    function openModal(){
        showModal2.value = true
    }
    function closeModal() {
        showModal2.value = false
    }

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
</script> -->

<style>
     #top1{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    #leave_btn {
      width: 100%;
      height: 3rem;
    }
    #r_leave{
        float: right;
        margin-top: 1rem;
        margin-right: 3rem;
    }
    #r_content1{
        margin-top: 3rem;
        margin-left: 2rem;
    }
    #r_content1 h2{
        margin-bottom: 1.5rem;
    }
    .content_pdf{
        display: flex;
        margin-bottom: 1rem;
    }
    .content_pdf p{
        margin-right: 3rem;
    }
    #r_content2{
        margin-top: 3rem;
        margin-left: 2rem;
    }
    #r_content2 h2{
        margin-bottom: 1.5rem;
    }
    .content_compare{
        display: flex;
        margin-bottom: 1rem;
    }
    .content_compare p{
        margin-right: 3rem;
    }
    .content_status{
        display: flex;
        margin-bottom: 1rem;
    }
    .content_status p{
        margin-right: 3rem;
    }
    .header {
    margin-bottom: 20px;
  }
  
  .standard-title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 8px;
  }
  
  .standard-subtitle {
    font-size: 16px;
    color: #666;
  }
  
  .section {
    margin-bottom: 30px;
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }
  
  .section-header h3 {
    font-size: 16px;
    margin: 0;
  }
  
  .procedures-list,
  .comparison-list {
    background: #f5f7fa;
    padding: 15px;
    border-radius: 4px;
  }
  
  .procedure-item,
  .comparison-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background: white;
    margin-bottom: 10px;
    border-radius: 4px;
  }
  
  .filename {
    color: #606266;
  }
  
  .actions {
    display: flex;
    gap: 8px;
  }
  
  .comparison-manage-btn {
    margin-top: 15px;
  }
  
  :deep(.el-button--small) {
    padding: 8px 15px;
  }
  
  :deep(.el-upload) {
    display: inline-block;
  }
</style>