<template>
    <div class="management-container">
        <Top/>
      <div class="secondary-nav">
        <router-link to="/message" class="nav-link">留言管理</router-link>
        <span class="current-page">清单管理</span>
      </div>
      <el-divider content-position="left"></el-divider>
      <div class="tertiary-nav">
        <el-tabs v-model="activeTab">
          <el-tab-pane label="人员" name="personnel">
            <div class="sub-tabs">
              <el-radio-group v-model="subTab">
                <el-radio-button label="审核提醒">审核提醒</el-radio-button>
                <el-radio-button label="授权清单">授权清单</el-radio-button>
                <el-radio-button label="培训清单">培训清单</el-radio-button>
              </el-radio-group>
            </div>
          </el-tab-pane>
          <el-tab-pane label="设备" name="equipment"></el-tab-pane>
          <el-tab-pane label="规程" name="procedures"></el-tab-pane>
          <el-tab-pane label="物料" name="materials"></el-tab-pane>
        </el-tabs>
      </div>
  
      <!-- Export Button -->
      <el-button 
        type="success" 
        class="export-button"
        @click="exportToPDF"
      >
        导出培训清单
      </el-button>
  
      <!-- Training List Table -->
      <el-table :data="trainingData" style="width: 100%; font-size: 16PX;">
        <el-table-column 
          prop="trainee" 
          label="完成培训人" 
          width="180"
        />
        <el-table-column 
          prop="course" 
          label="培训项目"
        />
      </el-table>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import html2pdf from 'html2pdf.js'
  import Top from './Top.vue';
  const activeTab = ref('personnel')
  const subTab = ref('培训清单')
  
  const trainingData = ref([
    {
      trainee: '甲',
      course: 'GB 19083-2003 4.1 医用防护口罩>基本要求'
    },
    {
      trainee: '乙',
      course: 'GB 19083-2003 4.1 医用防护口罩>基本要求'
    },
    {
      trainee: '丙',
      course: 'GB 19083-2003 4.1 医用防护口罩>基本要求'
    }
  ])
  
  const exportToPDF = () => {
    const element = document.querySelector('.el-table')
    const opt = {
      margin: 1,
      filename: '培训清单.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    }
    
    html2pdf().set(opt).from(element).save()
  }
  </script>
  
  <style scoped>
  .management-container {
    padding: 20px;
  }
  
  .top-nav, .secondary-nav {
    margin-bottom: 20px;
    font-size: 20px;

  }
  
  .nav-link {
    color: #409EFF;
    text-decoration: none;
    margin-right: 20px;
  }
  
  .nav-link:hover {
    text-decoration: underline;
  }
  
  .current-page {
    color: #000;
    margin-right: 20px;
  }
  
  .sub-tabs {
    margin: 20px 0;
    margin-right: 5PX;
  }
  
  .export-button {
    margin: 20px 0;
    background-color: #67C23A;
    border-color: #67C23A;
    font-size: 14PX;
  }
  
  .tertiary-nav :deep(.el-tabs__item) {
    color: #409EFF;
  }
  
  .tertiary-nav :deep(.el-tabs__item.is-active) {
    color: #000;
  }
  
  .tertiary-nav :deep(.el-tabs__active-bar) {
    background-color: #000;
  }
  </style>