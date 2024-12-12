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
      <!-- <div class="action-buttons">
        <el-button type="success" class="export-btn">导出培训清单</el-button>
        <el-button type="success" class="export-btn">导出授权清单</el-button>
      </div> -->
  
      <!-- Project List -->
      <div class="project-list">
        <div v-for="(project, index) in projectData" :key="index" class="project-item">
          <el-card>
            <div class="project-content">
              <!-- Project Title -->
              <el-link type="primary" class="project-title">
                {{ project.standardnumber }}  {{ project.projecttype }}  {{ project.projectname }}
              </el-link>
  
              <!-- Status Section -->
              <div class="status-section">
                <div class="status-item">
                  <el-button type="primary" 
                  @click="goSeeTrainStatus(project.projectid, project.standardnumber, project.projecttype, project.projectname)"
                   plain>查看培训情况</el-button>
                  <!-- 培训情况：
                  <el-tag 
                    :type="project.trainingStatus ? 'success' : 'danger'"
                    effect="plain"
                  >
                    {{ project.trainingStatus ? '已完成' : '未完成' }}
                  </el-tag> -->
                </div>
                <div class="status-item">
                  <el-button type="success" 
                  @click="goSeeAuthorizationStatus(project.projectid,  project.standardnumber, project.projecttype, project.projectname)" 
                  plain>查看授权情况</el-button>
                  <!-- 授权情况：
                  <el-tag 
                    :type="project.authorizationStatus ? 'success' : 'danger'"
                    effect="plain"
                  >
                    {{ project.authorizationStatus ? '已完成' : '未完成' }}
                  </el-tag> -->
                </div>
              </div>
            </div>
          </el-card>
        </div>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref, onMounted, inject } from 'vue'
  import { useRouter } from 'vue-router'
  import headshot from './headshot.vue'
  import axios from 'axios'
  import { project_id, title } from '@/status'

  const router = useRouter()
  const baseurl = inject('baseurl')

    // menu 菜单
    const activeIndex1 = ref('1')
    const handleSelect1 = (key: string, keyPath: string[]) => {
        if(key.match('2')) router.push('/testmachine')
        if(key.match('3')) router.push('/Regulations18')
        if(key.match('4')) router.push('/samplep19')
        console.log(key, keyPath)
    }

    // 获取所有项目
    const projectData = ref([])
    function search() {
      axios.get(baseurl + '/all_project')
      .then(function (response) {
          projectData.value = response.data.data
      })
      .catch(function (error) {
        console.error('Error:', error);
      });
    }

    // 查看培训情况
    function goSeeTrainStatus(pid: String, standardnumber: String, projecttype: String, projectname: String) {
      project_id.value = pid
      title.value = standardnumber + '  ' + projecttype + '  ' + projectname
      localStorage.setItem('project_id', JSON.stringify(project_id.value))
      localStorage.setItem('title', JSON.stringify(title.value))
      router.push('/details/1')
    }

    // 查看授权情况
    function goSeeAuthorizationStatus(pid: String, standardnumber: String, projecttype: String, projectname: String) {
      project_id.value = pid
      title.value = standardnumber + '  ' + projecttype + '  ' + projectname
      localStorage.setItem('project_id', JSON.stringify(project_id.value))
      localStorage.setItem('title', JSON.stringify(title.value))
      router.push('/details/2')
    }

   // page header 页头
    const goBack = () => {
        router.push('/entry')
        console.log('go back')
    }

    onMounted(() => {
      search()
    })

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
    margin-top: 1rem;
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