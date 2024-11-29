<template>
  <Top
    :_name="user_data.name"
    :username="user_data.username"
    :institution="user_data.institution"
    :contact="user_data.contact"
    :accountType="user_data.accountType"
  ></Top>

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
  
      <!-- Standards List -->
      <div class="standards-list">
        <div v-if="paginatedProjects.length === 0">没有项目数据</div>
        <div v-for="category in uniqueCategories" :key="category">
          <a>
            <p>
              <strong>类别：</strong>{{ category }}
            </p>
          </a>
        </div>
      </div>
    </div>
      <!-- Pagination -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="10"
          :page-count="11"
          :total="totalProjects"
          layout="prev, pager, next, jumper"
          @current-change="handlePageChange"
        />
      </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted ,reactive} from 'vue'
  import { ElMessage } from 'element-plus'
  import { useRouter } from 'vue-router'
  import { useRoute } from 'vue-router'
  import { user_data } from '../status.js'
 import axios from 'axios'
  import Top from './Top.vue'
  
  const searchQuery = ref('')
  const currentPage = ref(1)
  const totalStandards = ref(100)
  const router = useRouter()
  const pageSize = ref(5)
  const projects = ref([])
  const projectData = ref([])
  const displayedCategories = reactive(new Set());

function search() {
axios.get('http://localhost:8080/all_project')
.then(function (response) {
  // 确保响应数据是一个对象
  if (typeof response.data === 'object' && response.data !== null) {
    // 提取对象的所有值到数组中
    projects.value = Object.values(response.data);
    console.log('projects data:', projects.value);
    // 检查数组中是否有至少两个元素
    if (projects.value.length > 1) {
      // 获取第二个元素，即 projects[1]
     projectData.value = projects.value[1];
      console.log('projects[1] data:', projectData);
      // 在这里处理 projects[1] 的数据
    } else {
      console.error('Expected at least two elements in the array, but got:', projects.value);
    }
  } else {
    console.error('Expected an object, but got:', response.data);
  }
})
.catch(function (error) {
  console.error('Error:', error);
});
}
// 计算属性，检查类别是否唯一
const uniqueCategories = computed(() => {
  const categoriesSet = new Set();
  paginatedProjects.value.forEach(project => {
    categoriesSet.add(project.categories);
  });
  return Array.from(categoriesSet);
});
const paginatedProjects = computed(() => {
// 首先，如果存在搜索查询，则过滤项目
let filteredProjects = searchQuery.value
  ? projectData.value.filter(project => project.projectname.toLowerCase().includes(searchQuery.value.toLowerCase()))
  : projectData.value;

// 然后，进行分页
const start = (currentPage.value - 1) * pageSize.value;
const end = start + pageSize.value;
return filteredProjects.slice(start, end);
});
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

  // const user_data = ref({
  //   name : decodeURIComponent(route.params.name),
  //   username : decodeURIComponent(route.params.username),
  //   contact : decodeURIComponent(route.params.contact),
  //   institution : decodeURIComponent(route.params.institution),
  //   accountType : decodeURIComponent(route.params.accountType)
  // })
  
  const navigateToStandard = (standard) => {
    if(standard.id === 1) {
      router.push("/standard")
    }
    ElMessage.success(`导航到标准详情页: ${standard.number}`)
  }
  
  const handlePageChange = (page) => {
    currentPage.value = page
    ElMessage.success('切换到页码: ' + page)
  }
   onMounted(() => {
    search()
    })
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