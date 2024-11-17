<template>
    <div class="training-management">
      <!-- Navigation Tabs -->
      <el-tabs v-model="activeTab" class="nav-tabs">
        <el-tab-pane label="人员" name="personnel"></el-tab-pane>
        <el-tab-pane label="设备" name="equipment"></el-tab-pane>
        <el-tab-pane label="规程" name="procedure"></el-tab-pane>
        <el-tab-pane label="样品" name="sample"></el-tab-pane>
      </el-tabs>
  
      <!-- Action Buttons -->
      <div class="action-buttons">
        <el-button type="success" class="export-btn">导出培训清单</el-button>
        <el-button type="success" class="export-btn">导出授权清单</el-button>
      </div>
  
      <!-- Project List -->
      <div class="project-list">
        <div v-for="(project, index) in projects" :key="index" class="project-item">
          <el-card>
            <div class="project-content">
              <!-- Project Title -->
              <el-link type="primary" class="project-title">
                {{ project.title }}
              </el-link>
  
              <!-- Status Section -->
              <div class="status-section">
                <div class="status-item">
                  培训情况：
                  <el-tag 
                    :type="project.trainingStatus ? 'success' : 'danger'"
                    effect="plain"
                  >
                    {{ project.trainingStatus ? '已完成' : '未完成' }}
                  </el-tag>
                </div>
                <div class="status-item">
                  授权情况：
                  <el-tag 
                    :type="project.authorizationStatus ? 'success' : 'danger'"
                    effect="plain"
                  >
                    {{ project.authorizationStatus ? '已完成' : '未完成' }}
                  </el-tag>
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const activeTab = ref('personnel')
  
  const projects = ref([
    {
      title: '项目GB 19083-2003 4.1 医用防护口罩>基本要求(点击跳转到对应项目界面)',
      trainingStatus: true,
      authorizationStatus: false
    },
    {
      title: '项目GB 19083-2003 4.1 医用防护口罩>口罩带连接强度',
      trainingStatus: false,
      authorizationStatus: true
    },
    {
      title: '项目GB 19083-2003 4.1 医用防护口罩>过滤效率',
      trainingStatus: false,
      authorizationStatus: false
    }
  ])
  </script>
  
  <style scoped>
  .training-management {
    padding: 20px;
  }
  
  .nav-tabs {
    margin-bottom: 20px;
  }
  
  .action-buttons {
    margin-bottom: 20px;
  }
  
  .export-btn {
    margin-right: 10px;
  }
  
  .project-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
  }
  
  .project-item {
    width: 100%;
  }
  
  .project-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
  }
  
  .project-title {
    flex: 1;
    min-width: 300px;
  }
  
  .status-section {
    display: flex;
    gap: 20px;
  }
  
  .status-item {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  
  @media (max-width: 768px) {
    .project-content {
      flex-direction: column;
      align-items: flex-start;
    }
  
    .status-section {
      flex-direction: column;
      gap: 10px;
      width: 100%;
    }
  }
  </style>