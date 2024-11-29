<template>
  <el-tab-pane label="规程" name="procedures">
    <el-button type="success" @click="exportList">导出对比测试清单</el-button>
    
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="project" label="项目" id="shr_project">
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
  <!-- 项目详情弹窗 -->
  <ProjectDetailsModal
    v-if="showDetailsModal"
    :project="selectedProject"
    @close="closeDetailsModal"
  />
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import ProjectDetailsModal from '../ProjectDetailsModal.vue'
import html2pdf from 'html2pdf.js' // 确保已经安装了html2pdf.js库

const router = useRouter()

const tableData = ref([
  {
    id: '1932403245',
    project: 'GB 19083-2003 4.1 医用防护口罩> 基本要求',
    status: '计划',
    link: '/project/GB19083-2003-4.1-basic',
    applicants: [
      { name: '荣成', institution: '107研究所', contact: '400-3123' },
      { name: '常玉平', institution: '113研究所', contact: '400-2462' }
    ]
  },
  {
    id: '1932403246',
    project: 'GB 19083-2003 4.2 医用防护口罩> 口罩带连接强度',
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

const exportList = () => {
  const tempDiv = document.createElement('div')
  tempDiv.className = 'pdf-content'

  tableData.value.forEach(item => {
    const applicantsInfo = item.applicants.map(applicant => `
      <p>申请人：${applicant.name}，单位：${applicant.institution}，联系方式：${applicant.contact}</p>
    `).join('')

    const listDiv = document.createElement('div')
    listDiv.innerHTML = `
      <h2>对比测试清单</h2>
      <div class="list-info">
        <p>项目编号：${item.id}</p>
        <p>项目名称：${item.project}</p>
        <p>进行状态：${item.status}</p>
        ${applicantsInfo}
      </div>
    `
    tempDiv.appendChild(listDiv)
  })

  document.body.appendChild(tempDiv)

  const opt = {
    margin: 1,
    filename: '对比测试清单.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  }

  html2pdf().set(opt).from(tempDiv).save().then(() => {
    document.body.removeChild(tempDiv)
    ElMessage({
      type: 'success',
      message: 'PDF导出成功',
    })
  })
}
</script>