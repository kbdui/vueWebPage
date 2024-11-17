<template>
    <div class="standards-management">
      <!-- Header -->
      <div class="header">
        <h1 class="standard-title">GB 19083-2003 4.1</h1>
        <h2 class="standard-subtitle">医用防护口罩-基本要求</h2>
      </div>
  
      <!-- Main Navigation -->
      <el-tabs v-model="activeTab" class="main-tabs">
        <el-tab-pane label="人员" name="personnel"></el-tab-pane>
        <el-tab-pane label="设备" name="equipment"></el-tab-pane>
        <el-tab-pane label="规程" name="procedure"></el-tab-pane>
        <el-tab-pane label="样品" name="sample"></el-tab-pane>
      </el-tabs>
  
      <!-- Operation Procedures Section -->
      <div class="section">
        <div class="section-header">
          <h3>操作规程(3/4)</h3>
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
              <el-button 
                type="warning" 
                size="small"
                @click="viewPdf(procedure)"
              >
                查看
              </el-button>
              <el-button 
                type="primary" 
                size="small"
                @click="downloadPdf(procedure)"
              >
                下载
              </el-button>
              <el-upload
                class="upload-demo"
                action="/api/upload"
                :on-success="(res) => handleReImport(res, index)"
                :on-error="handleUploadError"
                :show-file-list="false"
              >
                <el-button 
                  type="success" 
                  size="small"
                >
                  重新导入
                </el-button>
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
  
      <!-- Comparison Experiment Section -->
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
                查看
              </el-button>
              <el-button 
                type="primary" 
                size="small"
                @click="downloadComparison"
              >
                下载
              </el-button>
              <el-upload
                class="upload-demo"
                action="/api/upload"
                :on-success="handleComparisonUpload"
                :on-error="handleUploadError"
                :show-file-list="false"
              >
                <el-button 
                  type="success" 
                  size="small"
                >
                  重新导入
                </el-button>
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
  
  <script setup>
  import { ref } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  
  const activeTab = ref('procedure')
  
  const procedures = ref([
    { filename: '规程1.pdf', url: "C:\Users\User\Downloads\\25_电子病例管理系统_V2.pdf" },
    { filename: '规程2.pdf', url: '/api/pdfs/procedure2.pdf' },
    { filename: '规程3.pdf', url: '/api/pdfs/procedure3.pdf' }
  ])
  
  const comparisonFile = ref({ filename: '医用防护口罩 基本要求对比方案.pdf', url: '/api/pdfs/comparison.pdf' })
  
  // PDF操作函数
  const viewPdf = (procedure) => {
    const viewerUrl = `/pdf-viewer?file=${encodeURIComponent(procedure.url)}`
    window.open(viewerUrl, '_blank')
  }
  
  const downloadPdf = async (procedure) => {
    try {
      const response = await fetch(procedure.url)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = procedure.filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
      ElMessage.success('下载成功')
    } catch (error) {
      console.error('Download error:', error)
      ElMessage.error('下载失败，请重试')
    }
  }
  
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
      const index = procedures.value.indexOf(procedure)
      procedures.value.splice(index, 1)
      ElMessage.success('删除成功')
    }).catch(() => {
      ElMessage.info('已取消删除')
    })
  }
  
  // 对比实验相关函数
  const viewComparison = () => {
    if (comparisonFile.value) {
      const viewerUrl = `/pdf-viewer?file=${encodeURIComponent(comparisonFile.value.url)}&name=${encodeURIComponent(comparisonFile.value.filename)}`
      window.open(viewerUrl, '_blank')
    }
  }
  
  const downloadComparison = async () => {
    if (comparisonFile.value) {
      try {
        const response = await fetch(comparisonFile.value.url)
        const blob = await response.blob()
        const url = window.URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = comparisonFile.value.filename
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        window.URL.revokeObjectURL(url)
        ElMessage.success('下载成功')
      } catch (error) {
        console.error('Download error:', error)
        ElMessage.error('下载失败，请重试')
      }
    }
  }
  
  const deleteComparison = () => {
    ElMessageBox.confirm(
      '确定要删除对比方案吗？',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(() => {
      comparisonFile.value = null
      ElMessage.success('删除成功')
    }).catch(() => {
      ElMessage.info('已取消删除')
    })
  }
  
  const manageComparison = () => {
    ElMessage.info('打开对比实验管理界面')
  }
  
  // 上传相关函数
  const handleUploadSuccess = (response, file) => {
    procedures.value.push({
      filename: file.name,
      url: response.url // 假设后端返回的是文件的URL
    })
    ElMessage.success('上传成功')
  }
  
  const handleReImport = (response, index) => {
    procedures.value[index] = {
      filename: response.filename,
      url: response.url
    }
    ElMessage.success('重新导入成功')
  }
  
  const handleComparisonUpload = (response, file) => {
    comparisonFile.value = {
      filename: file.name,
      url: response.url
    }
    ElMessage.success('对比方案上传成功')
  }
  
  const handleUploadError = () => {
    ElMessage.error('上传失败，请重试')
  }
  </script>
  
  <style scoped>
  .standards-management {
    padding: 20px;
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