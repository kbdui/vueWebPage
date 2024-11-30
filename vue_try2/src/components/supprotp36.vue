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
            :on-success="handleUploadSuccess"
            :on-error="handleUploadError"
            :show-file-list="false"
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
          @click="downloadPdf(procedure)"
        >
          下载
        </el-button>
        
        <!-- 其他操作按钮 -->
        <el-upload
          class="upload-demo"
          action="/api/upload"
          :on-success="(res) => handleReImport(res, index)"
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
  
      <!-- 对比实验部分 -->
      <div class="section">
        <div class="section-header">
          <h3>对比实验</h3>
          <el-upload
            class="upload-demo"
            action="/api/upload"
            :on-success="handleComparisonUpload"
            :on-error="handleUploadError"
            :show-file-list="false"
          >
            <el-button type="success" size="small">导入</el-button>
          </el-upload>
        </div>
  
        <div class="comparison-list">
          <div v-if="comparisonFile" class="comparison-item">
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
  
          <el-button 
            type="warning" 
            class="comparison-manage-btn"
            @click="manageComparison"
          >
            对比实验管理
          </el-button>
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
const comparisonFile = ref();

// 加载项目ID
function loadProjectId() {
  const savedData = localStorage.getItem('project_id');
  if (savedData) {
      project_id.value = JSON.parse(savedData);
      console.log(project_id.value);
  }
}
// 获取PDF文件列表
async function fetchProcedures() {
  try {
    const response = await axios.post('http://localhost:8080/download_operation_procedure', {
      project_id: project_id.value
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });
    procedures.value = response.data.data.map(file => {
      // 提取文件名
      const filename = file.split('\\').pop(); // Windows系统路径分隔符
      return {
        filename: filename,
        url: `http://localhost:8080/files/${filename}` // 构造URL时只使用文件名
      };
    });
  } catch (error) {
    console.error('Error fetching procedures:', error);
    ElMessage.error('获取操作规程失败，请重试');
  }
}

// 下载PDF文件
// 下载PDF文件
function downloadPdf(procedure) {
  // 假设 procedure.url 是后端返回的完整URL，例如 "http://localhost:8080/files/somefile.pdf"
  let baseUrl = "http://localhost:8080/files/";
  
  let relativeUrl = procedure.url.replace(baseUrl, ''); // 移除 baseUrl 部分，只保留文件名

  axios({
    url: relativeUrl, // 使用相对路径，后端需要能够解析这个相对路径
    method: 'GET',
    responseType: 'blob', // 重要：设置响应类型为blob
  })
  .then(response => {
    // 创建一个可下载的URL
    const url = relativeUrl;
    console.log("下载URL为：" + url); // 这里的URL是用于下载的Blob URL，不是文件的直接URL
    // 创建一个临时的<a>标签用于下载
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', procedure.filename);
    // 确保链接被添加到文档中
    document.body.appendChild(link);
    // 触发点击事件
    link.click();
    // 从文档中移除链接
    document.body.removeChild(link);
    // 释放URL对象
    window.URL.revokeObjectURL(url);
    // 下载成功后的提示
    ElMessage.success('下载成功');
  })
  .catch(error => {
    console.error('Download error:', error);
    console.log("下载失败的URL: " + relativeUrl);
    // 下载失败后的提示
    ElMessage.error('下载失败，请重试');
  });
}


// 删除PDF文件
const deletePdf = (procedure) => {
  ElMessageBox.confirm(
    '确定要删除这个文件吗？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    const index = procedures.value.indexOf(procedure);
    procedures.value.splice(index, 1);
    ElMessage.success('删除成功');
  }).catch(() => {
    ElMessage.info('已取消删除');
  });
};

// 对比实验相关函数
const viewComparison = () => {
  if (comparisonFile.value) {
    const viewerUrl = `/pdf-viewer?file=${encodeURIComponent(comparisonFile.value.url)}&name=${encodeURIComponent(comparisonFile.value.filename)}`;
    window.open(viewerUrl, '_blank');
  }
};

// 上传相关
const handleUploadSuccess = (response, file) => {
  // 处理上传成功的逻辑
};

const handleReImport = (response, index) => {
  // 处理重新导入的逻辑
};

const handleComparisonUpload = (response, file) => {
  // 处理对比实验上传的逻辑
};

const handleUploadError = () => {
  // 处理上传错误的逻辑
};

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
onMounted(() => {
  loadProjectId();
  fetchProcedures();
});
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