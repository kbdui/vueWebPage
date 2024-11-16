<template>
  <div class="management-system">
    
    <Top/>

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
            <el-table-column prop="project" label="项目" width="940px">
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
            <el-table-column label="操作" width="200">
              <template #default="scope">
                <el-button 
                  v-if="scope.row.status !== '完成'"
                  size="small" 
                  @click="completeProject(scope.row)"
                >
                  完成
                </el-button>
                <el-button 
                  size="small" 
                  @click="viewDetails(scope.row)"
                >
                  详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-main>

    <!-- 项目详情弹窗 -->
    <ProjectDetailsModal
      v-if="showDetailsModal"
      :project="selectedProject"
      @close="closeDetailsModal"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import ProjectDetailsModal from './ProjectDetailsModal.vue'
import Top from './Top.vue'
const router = useRouter()

const activeTab = ref('lists')
const activeListTab = ref('procedures')

const tableData = ref([
  { 
    id: '1932403245',
    project: 'GB 19083-2003 4.1 医用防护口罩> 基本要求(点击自动跳转到对应项目界面)', 
    status: '计划',
    link: '/project/GB19083-2003-4.1-basic',
    applicants: [
      { name: '荣成', institution: '107研究所', contact: '400-3123' },
      { name: '常玉平', institution: '113研究所', contact: '400-2462' }
    ]
  },
  { 
    id: '1932403246',
    project: 'GB 19083-2003 4.2 医用防护口罩> 口罩带连接强度(点击自动跳转到对应项目界面)', 
    status: '完成',
    link: '/project/GB19083-2003-4.2-strength',
    applicants: [
      { name: '李四', institution: '108研究所', contact: '400-1234' },
      { name: '王五', institution: '114研究所', contact: '400-5678' }
    ]
  },
])

const showDetailsModal = ref(false)
const selectedProject = ref(null)

const exportList = () => {
  ElMessage.success('导出对比测试清单成功')
}

const getStatusType = (status) => {
  return status === '完成' ? 'success' : 'warning'
}

const navigateToProject = (link) => {
  router.push(link)
}

const completeProject = (row) => {
  row.status = '完成'
  ElMessage.success('项目已标记为完成')
}

const viewDetails = (project) => {
  selectedProject.value = project
  showDetailsModal.value = true
}

const closeDetailsModal = () => {
  showDetailsModal.value = false
  selectedProject.value = null
}
</script>

<style scoped>
.management-system {
  height: 100vh;
  display: block;
  flex-direction: column;
}

.home-link {
  font-size: 18px;
  font-weight: bold;
  color: #409EFF;
  text-decoration: none;
}

.text-right {
  text-align: right;
}

.main-tabs {
  margin-top: 20px;
}

.el-main {
  padding: 20px;
}

.el-button {
  margin-bottom: 20px;
}
</style>