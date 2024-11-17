<template>
    <div class="management-system">
  <Top/>
       <!-- Main Content -->
    <el-main>
      <el-tabs v-model="activeTab" class="main-tabs">
        <el-tab-pane label="留言管理" name="messages"></el-tab-pane>
        <el-tab-pane label="清单管理" name="lists">
          <el-tabs v-model="activeListTab">
            <el-tab-pane label="人员" name="personnel"></el-tab-pane>
            <el-tab-pane label="设备" name="equipment"></el-tab-pane>
            <el-tab-pane label="规程" name="procedures"></el-tab-pane>
            <el-tab-pane label="物料" name="materials"></el-tab-pane>
          </el-tabs>
          
          <el-button type="success" @click="exportList">导出对比测试清单</el-button>
          
          <el-table :data="tableData" style="width: 100%">
            <el-table-column prop="project" label="项目" width="1150px">
              <template #default="scope">
                <el-link :href="scope.row.link" type="primary" :underline="false" @click.prevent="navigateToProject(scope.row.link)">
                  {{ scope.row.project }}
                </el-link>
              </template>
            </el-table-column>
            <el-table-column prop="status" label="进行状态" width="180">
              <template #default="scope">
                <el-tag :type="getStatusType(scope.row.status)">
                  {{ scope.row.status }}
                </el-tag>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-main>
    </div>
  </template>
  
<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import Top from './Top.vue';
const router = useRouter()

const activeTab = ref('lists')
const activeListTab = ref('procedures')

const tableData = [
  { 
    project: '项目GB 19083-2003 4.1 医用防护口罩> 基本要求(点击跳转到对应项目界面)', 
    status: '计划',
    link: '/project/GB19083-2003-4.1-basic'
  },
  { 
    project: '项目GB 19083-2003 4.2 医用防护口罩> 口罩带连接强度(点击跳转到对应项目界面)', 
    status: '完成',
    link: '/project/GB19083-2003-4.2-strength'
  },
  { 
    project: '项目GB 19083-2003 4.1 医用防护口罩> 基本要求(点击跳转到对应项目界面)', 
    status: '完成',
    link: '/project/GB19083-2003-4.1-basic-2'
  },
]

const handleCommand = (command) => {
  if (command === 'logout') {
    ElMessage.success('已退出登录')
    // Implement logout logic here
  }
}

const exportList = () => {
  ElMessage.success('导出对比测试清单成功')
  // Implement export logic here
}

const getStatusType = (status) => {
  return status === '完成' ? 'success' : 'warning'
}

const navigateToProject = (link) => {
  router.push(link)
}
</script>

<style scoped>
/* Styles remain the same */
</style>