<template>
    <div class="standards-management">
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
  
      <!-- 规程操作 -->
      <div class="section">
        <div class="section-header">
          <h3></h3>

          <el-upload
    class="upload-demo"
    action="/api/upload"
    :on-change="handleChange"
    :show-file-list="false"
    :http-request="customRequest"
  >
    <el-button type="success" size="small">导入</el-button>
  </el-upload>
          
        </div>
  
        <div class="procedures-list">

          <div v-for="(procedure, index) in procedures" :key="index" class="procedure-item">
            <span class="filename">{{ procedure.filename }}</span>
          <div class="actions">
        <!-- 绑定点击事件到downloadPdf函数 -->
        <el-button 
          type="primary" 
          size="small"
          @click="downloadPdf(procedure.filename)"
        >
          下载
        </el-button>
        
        <!-- 其他操作按钮 -->
        <el-upload
          class="upload-demo"
          action="/api/upload"
          :on-success="(res) => (res, index)"
          :on-error="handleUploadError"
          :show-file-list="false"
        >
        </el-upload>
        <el-button 
          type="danger" 
          size="small"
          @click="deletePdf(procedure)"
        >
          删除
        </el-button>
      </div>
    </div>
        </div>
      </div>
  
      对比实验部分
      <div class="section">
        <div class="section-header">
          <h3>对比实验</h3>

          <!-- <el-upload
            class="upload-demo"
            action="/api/upload"
            :on-success="handleComparisonUpload"
            :on-error="handleUploadError"
            :show-file-list="false"
          >
            <el-button type="success" size="small">导入</el-button>
          </el-upload> -->
        </div>
  
        <div class="comparison-list">
          <!-- <div v-if="comparisonFile" class="comparison-item">
            <span class="filename">{{ comparisonFile.filename }}</span>
            <div class="actions">
              <el-button 
                type="warning" 
                size="small"
                @click="viewComparison"
              >
                下载查看
              </el-button>
              
              <el-upload
                class="upload-demo"
                action="/api/upload"
                :on-success="handleComparisonUpload"
                :on-error="handleUploadError"
                :show-file-list="false"
              >
               
              </el-upload>
              <el-button 
                type="danger" 
                size="small"
                @click="deleteComparison"
              >
                删除
              </el-button>
            </div>
          </div>
   -->
          <!-- <el-button 
            type="warning" 
            class="comparison-manage-btn"
            @click="manageComparison"
          >
            对比实验管理
          </el-button> -->
        </div>
      </div>
    </div>
  </template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { user_data } from '@/status';
import { project_id } from '@/status';

const procedures = ref([]);

// 加载项目ID
function loadProjectId() {
  const savedData = localStorage.getItem('project_id');
  if (savedData) {
      project_id.value = JSON.parse(savedData);
      console.log(project_id.value);
  }
}
//获取后端文件
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
// 下载PDF文件
async function downloadPdf(filename) {
  console.log("项目ID为：" + project_id.value + "\n" + "下载的文件名为：" + decodeURIComponent(filename));

  try {
    const fullFileName = project_id.value + "/" + decodeURIComponent(filename);
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
});

// 对比实验相关函数
const viewComparison = () => {
  
};

// 上传
 // 自定义上传方法
 function customRequest(options) {
      const { file, onProgress, onSuccess, onError } = options;

      const formData = new FormData();
      formData.append('project_id', project_id.value);
      formData.append('file', file);

      axios({
        method: 'post',
        url: 'http://localhost:8080/upload_operation_procedure',
         // 后端接口URL
        data: formData,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        onUploadProgress: progressEvent => {
          onProgress(progressEvent);
        }
      })
      .then(response => {
        onSuccess(response);
        ElMessage.success('文件上传成功');
      })
      .catch(error => {
        onError(error);
        ElMessage.error('文件上传失败，请重试');
      });
    }

    // 文件选择变化时的处理
    function handleChange(file, fileList) {
      // 如果需要，可以在这里处理文件选择的变化
    }
const router = useRouter();

// menu 菜单
const activeIndex1 = ref('3');
const handleSelect1 = (key, keyPath) => {
  if (key.match('1')) router.push('/supportDetails/');
  if (key.match('2')) router.push('/machineSelect');
  if (key.match('4')) router.push('/p38');
  console.log(key, keyPath);
};

// page header 页头
const goBack = () => {
  router.push('/supportStandardQuery');
  console.log('go back');
};

// 在组件加载时获取PDF文件列表

</script>  

  <style scoped>
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