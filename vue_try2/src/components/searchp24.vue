<template>
    <div class="standard-search">
      <h2 class="page-title">标准查询</h2>
  
      <!-- Search Bar -->
      <div class="search-section">
        <el-input
          v-model="searchQuery"
          placeholder="请输入标准号或中文关键词搜索"
          class="search-input"
        >
          <template #append>
            <el-button type="primary" class="search-button" @click="handleSearch">
              搜索
            </el-button>
          </template>
        </el-input>
      </div>
  
      <!-- Action Buttons -->
      <div class="action-buttons">
        <el-button 
          type="success" 
          class="action-button"
          @click="showAddForm = true"
        >
          添加
        </el-button>
        <el-button 
          type="success" 
          class="action-button"
          @click="handleImportExcel"
        >
          从excel统计表导入
        </el-button>
        <el-button 
          type="success" 
          class="view-applications-button"
          @click="showApplications = true"
        >
          查看增加申请
        </el-button>
      </div>
  
      <!-- Add Application Form Dialog -->
      <el-dialog
        v-model="showAddForm"
        title="添加申请"
        width="50%"
        :show-close="false"
      >
        <el-form :model="addForm" label-width="120px">
          <el-form-item label="大类">
            <el-input v-model="addForm.category" placeholder="输入框" />
          </el-form-item>
          <el-form-item label="类别">
            <el-input v-model="addForm.type" placeholder="输入框" />
          </el-form-item>
          <el-form-item label="标准名称">
            <el-input v-model="addForm.standardName" placeholder="输入框" />
          </el-form-item>
          <el-form-item label="标准编号及条款号">
            <el-input v-model="addForm.standardNo" placeholder="输入框" />
          </el-form-item>
          <el-form-item label="项目名称">
            <el-input v-model="addForm.projectName" placeholder="输入框" />
          </el-form-item>
        </el-form>
        <div class="dialog-footer">
          <el-button type="success" @click="handleAddSubmit">添加</el-button>
          <el-button @click="showAddForm = false">取消</el-button>
        </div>
      </el-dialog>
  
      <!-- View Applications Dialog -->
      <el-dialog
        v-model="showApplications"
        title=""
        width="80%"
        :show-close="false"
      >
        <div class="applications-header">
          <el-button type="primary" @click="handleResolveAll">
            全部标为已解决
          </el-button>
        </div>
        
        <el-table :data="applications" border style="width: 100%">
          <el-table-column prop="applicant" label="申请人" width="100" />
          <el-table-column prop="category" label="申请大类" width="150" />
          <el-table-column prop="type" label="申请类别" width="150" />
          <el-table-column prop="standardName" label="申请标准名称" width="200" />
          <el-table-column prop="standardNo" label="申请标准编号及条款号" width="200" />
          <el-table-column prop="projectName" label="项目名称" width="150" />
          <el-table-column prop="status" label="状态" width="100">
            <template #default="scope">
              <span :class="{ 'status-resolved': scope.row.status === '已解决' }">
                {{ scope.row.status }}
              </span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template #default="scope">
              <el-button 
                v-if="scope.row.status === '未解决'"
                type="primary" 
                link
                @click="handleResolve(scope.row)"
              >
                标为已解决
              </el-button>
            </template>
          </el-table-column>
        </el-table>
  
        <div class="dialog-footer">
          <el-button type="danger" @click="showApplications = false">
            关闭
          </el-button>
        </div>
  
        <el-pagination
          v-model:current-page="applicationsPage"
          :page-size="10"
          :total="100"
          layout="prev, pager, next"
          class="applications-pagination"
        />
      </el-dialog>
  
      <!-- Standards List -->
      <div class="standards-list">
        <div v-for="standard in standards" :key="standard.id" class="standard-item">
          <div class="standard-content">
            <a 
              :href="standard.link" 
              class="standard-link"
              @click.prevent="handleStandardClick(standard)"
            >
              {{ standard.title }}
            </a>
          </div>
          <el-button
            type="danger"
            size="small"
            @click="handleDelete(standard)"
          >
            删除
          </el-button>
        </div>
        <div v-for="i in 8" :key="`placeholder-${i}`" class="standard-item placeholder">
          <div class="standard-content">
            ......................................................................................................................
          </div>
          <el-button
            type="danger"
            size="small"
          >
            删除
          </el-button>
        </div>
      </div>
  
      <!-- Pagination -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="10"
          :total="100"
          layout="prev, pager, next"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  
  const searchQuery = ref('')
  const currentPage = ref(1)
  const applicationsPage = ref(1)
  const showAddForm = ref(false)
  const showApplications = ref(false)
  
  const addForm = ref({
    category: '',
    type: '',
    standardName: '',
    standardNo: '',
    projectName: ''
  })
  
  const standards = ref([
    {
      id: 1,
      title: 'GB 19083-2003 4.1 医用防护口罩技术要求>基本要求(点击跳转到详情页面)',
      link: '/standard/detail/1'
    },
    {
      id: 2,
      title: 'GB 19083-2003 4.2 医用防护口罩技术要求>口罩带连接强度',
      link: '/standard/detail/2'
    }
  ])
  
  const applications = ref([
    {
      applicant: '甲',
      category: '无源医疗器械',
      type: '医用防护口罩',
      standardName: '医用防护口罩',
      standardNo: 'GB 19083-2003 4.1',
      projectName: '基本要求',
      status: '未解决'
    },
    {
      applicant: '乙',
      category: '无源医疗器械',
      type: '医用防护口罩',
      standardName: '医用防护口罩',
      standardNo: 'GB 19083-2003 4.2',
      projectName: '口罩带连接强度',
      status: '已解决'
    }
  ])
  
  const handleSearch = () => {
    ElMessage.success('搜索查询: ' + searchQuery.value)
  }
  
  const handleImportExcel = () => {
    ElMessage.success('打开Excel导入对话框')
  }
  
  const handleAddSubmit = () => {
    ElMessage.success('添加申请成功')
    showAddForm.value = false
    // Reset form
    addForm.value = {
      category: '',
      type: '',
      standardName: '',
      standardNo: '',
      projectName: ''
    }
  }
  
  const handleDelete = (standard) => {
    ElMessageBox.confirm(
      '确定要删除该标准吗？',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(() => {
      const index = standards.value.findIndex(s => s.id === standard.id)
      if (index !== -1) {
        standards.value.splice(index, 1)
        ElMessage.success('删除成功')
      }
    }).catch(() => {
      ElMessage.info('已取消删除')
    })
  }
  
  const handleStandardClick = (standard) => {
    ElMessage.success('跳转到标准详情页: ' + standard.title)
  }
  
  const handlePageChange = (page) => {
    currentPage.value = page
    ElMessage.success('切换到页码: ' + page)
  }
  
  const handleResolve = (application) => {
    application.status = '已解决'
    ElMessage.success('已将申请标记为已解决')
  }
  
  const handleResolveAll = () => {
    ElMessageBox.confirm(
      '确定要将所有申请标记为已解决吗？',
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(() => {
      applications.value.forEach(app => {
        app.status = '已解决'
      })
      ElMessage.success('已将所有申请标记为已解决')
    }).catch(() => {
      ElMessage.info('已取消操作')
    })
  }
  </script>
  
  <style scoped>
  .standard-search {
    padding: 20px;
  }
  
  .page-title {
    font-size: 18px;
    color: #333;
    margin-bottom: 20px;
  }
  
  .search-section {
    margin-bottom: 20px;
  }
  
  .search-input {
    width: 100%;
    max-width: 800px;
    margin: 0 auto;
    display: block;
  }
  
  :deep(.search-button) {
    background-color: #d9534f;
    border-color: #d9534f;
    color: white;
  }
  
  :deep(.search-button:hover) {
    background-color: #c9302c;
    border-color: #c9302c;
  }
  
  .action-buttons {
    margin-bottom: 20px;
    display: flex;
    gap: 10px;
  }
  
  .action-button {
    background-color: #87c735;
    border-color: #87c735;
  }
  
  .action-button:hover {
    background-color: #78b32d;
    border-color: #78b32d;
  }
  
  .view-applications-button {
    background-color: #87c735;
    border-color: #87c735;
    margin-left: auto;
  }
  
  .standards-list {
    margin-bottom: 20px;
  }
  
  .standard-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border: 1px solid #dcdfe6;
    margin-bottom: -1px;
  }
  
  .standard-content {
    flex: 1;
    margin-right: 20px;
  }
  
  .standard-link {
    color: #409EFF;
    text-decoration: none;
  }
  
  .standard-link:hover {
    text-decoration: underline;
  }
  
  .placeholder {
    color: #dcdfe6;
  }
  
  .pagination-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
  
  .applications-header {
    margin-bottom: 20px;
    text-align: right;
  }
  
  .applications-pagination {
    margin-top: 20px;
    text-align: center;
  }
  
  .dialog-footer {
    margin-top: 20px;
    text-align: center;
  }
  
  .status-resolved {
    color: #67C23A;
  }
  
  :deep(.el-dialog__header) {
    margin-right: 0;
  }
  
  :deep(.el-dialog__body) {
    padding-top: 10px;
  }
  
  :deep(.el-form-item__label) {
    font-weight: normal;
  }
  
  :deep(.el-button--danger) {
    padding: 8px 16px;
  }
  </style>