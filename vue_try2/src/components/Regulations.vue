
<template>
    <div id="top">
    <div id="top1">
        <!-- page header 页头 -->
        <el-page-header @back="goBack">
        <template #content>
            <span class="text-large font-600 mr-3">
            检测人员的操作规程
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

  <!-- <el-button id="leave" @click="openModal()" type="success" plain>留言</el-button> -->
   <div class="section">
        <div class="section-header">
          <h2>规程操作</h2>

          <el-upload
            class="upload-demo"
            action="/api/upload"
            :on-change="handleChange"
            :show-file-list="false"
            :http-request="customRequest"
            />
   
            <el-button type="success" @click="openModal()" size="small">留言</el-button>
        </div>
  
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

        <!-- 删除按钮 -->
        <!-- <el-button 
          type="danger" 
          size="small"
          @click="deletePdf(index)"
        >
          删除
        </el-button> -->
      </div>
    </div>
        </div>
      </div>
  
   <!-- 对比实验部分 -->
   <div class="section">
        <div class="section-header">
          <h2>对比实验</h2>
            <el-button type="success" size="small">导入</el-button>
        </div>
  
        <div class="comparison-list">
          <div v-for="(comparisonFile, index) in comparisonFiles" :key="index" class="procedure-item">
            <span class="filename">{{ comparisonFile.filename }}</span>
            
            <div class="actions">
              <el-button 
                type="warning" 
                size="small"
                @click="downloadComparison()"
              >
                下载查看
              </el-button>

              <el-button 
                type="danger" 
                size="small"
                @click="deleteComparison()"
              >
                删除
              </el-button>
            </div>
          </div>
        </div>
      </div>

   <!-- 留言窗口 -->
    <outWindow 
    :isVisible = "showModal2"
    :styleProps = "styleProps2"
    @closeModal = "closeModal()"
   >
        <div
            id="message_block"
            h="30"
            w="30"
            m="2"
            :style="{
            boxShadow: `var(${getCssVarName('light')})`,
            }"
        >
            <el-card class="message" style="max-width: 480px" shadow="hover">
                <template class="header" #header>
                <div class="card-header">
                    <span>检测人员:甲 留言于2024.11.07 23:23:21</span>
                </div>
                </template>
                <p class="text item">请添加---!</p>
            </el-card>
            <el-card class="message" style="max-width: 480px" shadow="hover">
                <template class="header" #header>
                <div class="card-header">
                    <span>检测人员:甲 留言于2024.11.07 23:23:21</span>
                </div>
                </template>
                <p class="text item">请添加---!</p>
            </el-card>
            <el-card class="message" style="max-width: 480px" shadow="hover">
                <template class="header" #header>
                <div class="card-header">
                    <span>检测人员:甲 留言于2024.11.07 23:23:21</span>
                </div>
                </template>
                <p class="text item">请添加---!</p>
            </el-card>
        </div>

        <el-input
            id="text_input"
            v-model="textarea"
            style="width: 240px"
            :rows="2"
            type="textarea"
            placeholder="请输入留言内容"
        />
        <el-button id="send_text" type="success">发送</el-button>
   </outWindow>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { project_id } from '@/status';

const procedures = ref([]);
const comparisonFiles = ref([]);
const tmp = ref([]);
const tmp_com = ref([]);

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
    const response = await axios.post('http://localhost:8080/download_operation_procedure', {
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
          url: `http://localhost:8080/files/${encodeURIComponent(filename)}` // 构造URL时只使用文件名，并进行编码
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
    const response = await axios.post('http://localhost:8080/download_compare_plan', 
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
</script>

<style>
     #top1{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    #leave{
        float: right;
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