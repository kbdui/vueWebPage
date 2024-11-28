<template>
  <Top></Top>
    <div class="standards-search">
      <h2 class="page-title">标准查询</h2>
  
      <!-- Search Section -->
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
          @click="handleAdd"
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
          @click="handleViewApplications"
        >
          查看增加申请
        </el-button>
      </div>
  
      <!-- Standards List -->
      <div class="standards-list">
        <div v-for="standard in filteredStandards" :key="standard.id" class="standard-item">
          <el-link 
            type="primary" 
            :underline="false"
            @click="navigateToStandard(standard)"
          >
            {{ standard.number }} {{ standard.title }}
          </el-link>
        </div>
      </div>
  
      <!-- Pagination -->
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="10"
          :total="totalStandards"
          layout="prev, pager, next"
          @current-change="handlePageChange"
        />
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { ElMessage } from 'element-plus'
  import { useRouter } from 'vue-router'

  import Top from './Top.vue'
  
  const searchQuery = ref('')
  const currentPage = ref(1)
  const totalStandards = ref(100)
  const router = useRouter()
  
  const standards = ref([
    {
      id: 1,
      number: 'GB 19083-2023',
      title: '医用防护口罩'
    },
    {
      id: 2,
      number: 'GB/T 32610-2016',
      title: '日常防护型口罩技术规范'
    },
    {
      id: 3,
      number: 'GB 2626-2019',
      title: '呼吸防护用品-自吸过滤式防颗粒物呼吸器'
    },
    {
      id: 4,
      number: ' YY/T 0969-2013',
      title: '一次性使用医用口罩'
    },
    {
      id: 5,
      number: ' GB/T 42061-2022',
      title: '医疗器械 质量管理体系 用于法规的要求'
    },
    {
      id: 6,
      number: 'GB/T 42062-2022',
      title: ' 医疗器械 风险管理对医疗器械的应用'
    },
    {
      id: 7,
      number: 'GB/Z 42217-2022',
      title: ' 医疗器械 用于医疗器械质量体系软件的确认'
    },
    {
      id: 8,
      number: ' YY/T 0316-2016',
      title: '医疗器械 风险管理对医疗器械的应用'
    },
    {
      id: 9,
      number: 'YY/T 0664-2020',
      title: ' 医疗器械软件 软件生存周期过程'
    },
    {
      id: 10,
      number: 'YY/T 0595-2020',
      title: '医疗器械 质量管理体系YY/T 0287-2017 应用指南'
    }
  ])
  
  const filteredStandards = computed(() => {
    if (!searchQuery.value) return standards.value
    const query = searchQuery.value.toLowerCase()
    return standards.value.filter(standard => 
      standard.number.toLowerCase().includes(query) ||
      standard.title.toLowerCase().includes(query)
    )
  })
  
  const handleSearch = () => {
    ElMessage.success('执行搜索: ' + searchQuery.value)
  }
  
  const handleAdd = () => {
    ElMessage.success('打开添加标准对话框')
  }
  
  const handleImportExcel = () => {
    ElMessage.success('打开Excel导入对话框')
  }
  
  const handleViewApplications = () => {
    ElMessage.success('查看增加申请')
  }
  
  const navigateToStandard = (standard) => {
    if(standard.id === 1) {
      router.push('./standard')
    }
    ElMessage.success(`导航到标准详情页: ${standard.number}`)
  }
  
  const handlePageChange = (page) => {
    currentPage.value = page
    ElMessage.success('切换到页码: ' + page)
  }
  </script>
  
  <style scoped>
  .standards-search {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
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
  }
  
  :deep(.search-button) {
    background-color: #409EFF;
    border-color: #409EFF;
    color: white;
  }
  
  :deep(.search-button:hover) {
    background-color: #66b1ff;
    border-color: #66b1ff;
  }
  
  .action-buttons {
    margin-bottom: 20px;
    display: flex;
    gap: 10px;
  }
  
  .action-button {
    background-color: #67c23a;
    border-color: #67c23a;
  }
  
  .action-button:hover {
    background-color: #85ce61;
    border-color: #85ce61;
  }
  
  .view-applications-button {
    background-color: #67c23a;
    border-color: #67c23a;
    margin-left: auto;
  }
  
  .standards-list {
    margin-bottom: 20px;
  }
  
  .standard-item {
    padding: 12px;
    border-bottom: 1px solid #EBEEF5;
  }
  
  .standard-item:last-child {
    border-bottom: none;
  }
  
  :deep(.el-link) {
    font-size: 14px;
  }
  
  :deep(.el-link:hover) {
    text-decoration: underline;
  }
  
  .pagination-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
  }
  
  :deep(.el-pagination .el-pager li.active) {
    background-color: #409EFF;
    color: white;
  }
  </style>