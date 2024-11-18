<template>
  <div id="top1">
      <!-- page header 页头 -->
      <el-page-header @back="goBack">
      <template #content>
          <span class="text-large font-600 mr-3">
          个人主页
          </span>
      </template>
      </el-page-header>

      <!-- 头像框 -->
      <headshot></headshot>
  </div>
    <div class="training-management">
      <!-- Navigation Tabs -->
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
  
  <script lang="ts" setup>
  import { ref } from 'vue'
  import { useRouter } from 'vue-router'

  import headshot from './headshot.vue'

  const router = useRouter()

  // menu 菜单
    const activeIndex1 = ref('1')
    const handleSelect1 = (key: string, keyPath: string[]) => {
        if(key.match('2')) router.push('/testmachine')
        if(key.match('3')) router.push('/Regulations18')
        if(key.match('4')) router.push('/samplep19')
        console.log(key, keyPath)
    }
  
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

  // page header 页头
    const goBack = () => {
        router.push('/details/1')
        console.log('go back')
    }
  </script>
  
  <style scoped>
  #top1{
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .training-management {
    padding: 0px;
  }
  
  .nav-tabs {
    margin-bottom: 20px;
  }
  
  .action-buttons {
    margin-top: 20px;
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