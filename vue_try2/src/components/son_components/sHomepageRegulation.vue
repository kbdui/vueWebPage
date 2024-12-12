<template>
  <el-tab-pane label="规程" name="procedures">
    <el-button type="success" @click="exportList">导出对比测试清单</el-button>
    
    <el-table :data="allProjects" style="width: 100%">
      <el-table-column prop="project" label="项目" id="shr_project">
        <template #default="scope">
          <el-link :href="scope.row.link" type="primary" :underline="false" @click.prevent="navigateToProject(scope.row.link)">
              {{ scope.row.projectTest.testid }}  {{ scope.row.project.categories }}  {{ scope.row.project.projecttype }}  {{ scope.row.project.projectname }}
          </el-link>
        </template>
      </el-table-column>

      <el-table-column prop="status" label="进行状态" width="180">
        <template #default="scope">
          <el-tag :type="getStatusType(scope.row.projectTest.state)">
            {{ scope.row.projectTest.state }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="操作" width="200">
        <template #default="scope">
          <el-button 
            v-if="scope.row.projectTest.state !== 'Finish'"
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
  import { ref,onMounted, inject } from 'vue'
  import { ElMessage } from 'element-plus'
  import { useRouter } from 'vue-router'
  import ProjectDetailsModal from '../ProjectDetailsModal.vue'
  import html2pdf from 'html2pdf.js' // 确保已经安装了html2pdf.js库
  import axios from 'axios'

  const router = useRouter()
  const baseurl = inject('baseurl')

  const showDetailsModal = ref(false)
  const selectedProject = ref(null)

  const getStatusType = (status) => {
    return status === 'Finish' ? 'success' : 'warning'
  }

  const navigateToProject = (link) => {
    router.push(link)
  }

  const completeProject = (row) => {
    row.projectTest.state = 'Finish'
    axios.post(baseurl + '/finish_test', {
      project_id: row.projectTest.testid
    },{
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(function (response){
        onSuccess(response)
        ElMessage.success('项目已标记为完成')
    }).catch(function (error){
        ElMessage.error('状态修改失败')
    })
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

    allProjects.value.forEach(item => {
      const listDiv = document.createElement('div')
      listDiv.innerHTML = `
        <h2>对比测试清单</h2>
        <div class="list-info">
          <h3>项目基本信息：</h3>
          <p>项目编号：${item.projectTest.testid}</p>
          <p>项目类别：${item.project.categories}</p>
          <p>项目类型：${item.project.projecttype}</p>
          <p>项目名称：${item.project.projectname}</p>
          <p>项目状态：${item.projectTest.state}</p>
        </div>
        <hr>
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

  // 获取所有对比实验
  const allProjects = ref([])
  function getAllProjects() {
    axios.get(baseurl + '/show_all_test')
    .then(function (response) {
      allProjects.value = response.data.data
    })
    .catch(function (error) {
      console.error('Error:', error);
      ElMessage.error('获取对比实验列表失败')
    });
  }

  // 组件挂载时执行的函数
  onMounted(() => {
    getAllProjects()
  })

</script>