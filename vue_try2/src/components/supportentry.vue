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
        <el-button type="primary" @click="openAddApplicationDialog">添加</el-button>
        <el-button type="success" @click="handleExcelUpload">从excel统计表导入</el-button>
        <!-- Standards List -->
        <div class="standards-list">
          <div v-if="paginatedProjects.length === 0">没有项目数据</div>
          <div v-for="category in uniqueCategories" :key="category">
            <router-link to="/supportStandardQuery" @click="saveCategory(category)" class="action-button">
              <div class="category-button">
                {{ category }}
              </div>
            </router-link>
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
        <el-dialog
        v-model="addApplicationDialogVisible"
        title="增加申请"
        width="50%"
        :before-close="handleCloseDialog"
      >
        <el-form :model="applicationForm" label-width="120px">
          <el-form-item label="大类">
            <el-input v-model="applicationForm.categories" />
          </el-form-item>
          <el-form-item label="类别">
            <el-input v-model="applicationForm.subCategory" />
          </el-form-item>
          <el-form-item label="标准名称">
            <el-input v-model="applicationForm.standardName" />
          </el-form-item>
          <el-form-item label="标准编号">
            <el-input v-model="applicationForm.standardNumber" />
          </el-form-item>
          <el-form-item label="项目名称">
            <el-input v-model="applicationForm.projectName" />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="handleCloseDialog">取消</el-button>
            <el-button type="primary" @click="handleAddApplication">确认添加</el-button>
          </span>
        </template>
      </el-dialog>
    </template>
    
    <script setup>
    import { ref, computed, onMounted ,reactive, inject} from 'vue'
    import { ElMessage } from 'element-plus'
    import { useRouter } from 'vue-router'
    import { useRoute } from 'vue-router'
    import { user_data, selected_category } from '../status.js'
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
  const baseurl = inject('baseurl')
  const addApplicationDialogVisible = ref(false)
const applicationForm = ref({
categories: '',//大类
subCategory: '',//类别
standardName: '',//标准名称
standardNumber: '',//标准编号
projectName: ''//项目名称
})
  function search() {
  axios.get(baseurl + '/all_project')
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
    
 
  
const handleExcelUpload = async () => {
  // 创建文件选择器
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.xlsx,.xls';
  input.style.display = 'none';
  document.body.appendChild(input);

  input.click();
  input.onchange = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      ElMessage.error('未选择文件');
      document.body.removeChild(input);
      return;
    }

    // 检查文件类型
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      ElMessage.error('请上传Excel文件(.xlsx或.xls格式)');
      document.body.removeChild(input);
      return;
    }

    try {
      // 创建FormData对象
      const formData = new FormData();
      
      // 直接将文件添加到FormData中
      formData.append('file', file);

      // 使用FormData对象上传文件
      const response = await axios.post(baseurl + '/gen_project_by_excel', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.data === true) {
        ElMessage.success('Excel导入成功');
        search(); // 刷新数据
      } else {
        ElMessage.error('Excel导入失败: ' + response.data.message);
        console.log(response.data);
      }
    } catch (uploadError) {
      console.error('Excel上传错误:', uploadError);
      ElMessage.error('Excel上传失败: ' + uploadError.message);
    } finally {
      document.body.removeChild(input);
    }
  };
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
    
    const saveCategory = (category) => {
      localStorage.setItem('selected_category', category)
      selected_category.value = category // 更新全局变量
      console.log('Saved category:', selected_category.value)
    }
const  openAddApplicationDialog = () => {
addApplicationDialogVisible.value = true
}
const  handleCloseDialog = () => {
addApplicationDialogVisible.value = false
}

const handleAddApplication = () => {
const formData = new FormData();
formData.append('categories', applicationForm.value.subCategory);
formData.append('project_type', applicationForm.value.categories);
// formData.append('standardName', applicationForm.value.standardName);
formData.append('standard_number', applicationForm.value.standardNumber);
formData.append('project_name', applicationForm.value.projectName);
console.log("formDasdsdsdta",applicationForm.value.standardNumber)
axios.post(baseurl + '/get_new_project', formData, {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})
.then(response => {
  if (response.data.data) {
    ElMessage.success('申请已成功提交');
    search()
  } else {
    ElMessage.error('申请提交失败: ' + response.data.message);
  }
})
.catch(error => {
  console.error('申请提交错误:', error);
  ElMessage.error('申请提交过程中发生错误');
});
console.log('Application data:', applicationForm.value)
// For demonstration, we'll just show a success message
ElMessage.success('申请已添加')
handleCloseDialog()
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
     display: flex;
     color: green;
     padding: 10px 20px;
     background-color: white;
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