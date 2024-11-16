<template>
    <div class="standards-container">

    <Top />

      <h2 class="header">标准查询</h2>
      
      <div class="search-section">
        <el-input
          v-model="searchQuery"
          placeholder="请输入入标准号或中文关键词搜索"
          class="search-input"
        >
        </el-input>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
        <el-button type="primary" @click="openAddApplicationDialog">增加申请</el-button>
      </div>
  
      <div class="standards-list">
        <div v-for="(standard, index) in standards" :key="index" class="standard-item">
          <router-link :to="standard.link" class="standard-link">
            {{ standard.title }}
            <span v-if="standard.note" class="note">({{ standard.note }})</span>
          </router-link>
        </div>
      </div>
  
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="10"
          :total="100"
          :pager-count="11"
           layout="prev, pager, next"
          @current-change="handlePageChange"
        />

        <el-dialog
      v-model="addApplicationDialogVisible"
      title="增加申请"
      width="50%"
      :before-close="handleCloseDialog"
    >
      <el-form :model="applicationForm" label-width="120px">
        <el-form-item label="大类">
          <el-input v-model="applicationForm.category" />
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

      </div>
    </div>
  </template>
  
  <script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import Top from './Top.vue'

const router = useRouter()

  const searchQuery = ref('')
  const currentPage = ref(1)
  const itemsPerPage = 10
  
  // 假设我们有一个包含所有标准的大数组
  const allStandards = ref([
    // 数据区
    {
      title: 'GB 19083-2003 4.1 医用防护口罩>基本要求',
      link: '/details/1',
      note: '点击跳转到详情页面'
    },
    {
      title: 'GB 19083-2003 4.2 医用防护口罩>口罩带连接强度',
      link: '/details/2'
    },
    {
      title: 'GB 19083-2003 4.2 医用防护口罩>口罩带连接强度',
      link: '/details/2'
    },{
      title: 'GB 19083-2003 4.2 医用防护口罩>口罩带连接强度',
      link: '/details/2'
    },{
      title: 'GB 19083-2003 4.2 医用防护口罩>口罩带连接强度',
      link: '/details/2'
    },{
      title: 'GB 19083-2003 4.2 医用防护口罩>口罩带连接强度',
      link: '/details/2'
    },{
      title: 'GB 19083-2003 4.2 医用防护口罩>口罩带连接强度',
      link: '/details/2'
    },{
      title: 'GB 19083-2003 4.2 医用防护口罩>口罩带连接强度',
      link: '/details/2'
    },
    {
      title: 'GB 19083-2003 4.2 医用防护口罩>口罩带连接强度',
      link: '/details/2'
    },
    {
      title: 'GB 19083-2003 4.2 医用防护口罩>口罩带连接强度',
      link: '/details/2'
    },
    {
      title: 'GB 19083-2003 4.2 医用防护口罩>口罩带连接强度',
      link: '/details/2'
    },
    {
      title: 'GB 19083-2003 4.2 医用防护口罩>口罩带连接强度',
      link: '/details/2'
    },
    {
      title: 'GB 19083-2003 4.2 医用防护口罩>口罩带连接强度',
      link: '/details/2'
    },
    {
      title: 'GB 19083-2003 4.2 医用防护口罩>口罩带连接强度',
      link: '/details/2'
    },
    {
      title: 'GB 19083-2003 4.2 医用防护口罩>口罩带连接强度',
      link: '/details/2'
    },
    {
      title: 'GB 19083-2003 4.2 医用防护口罩>口罩带连接强度',
      link: '/details/2'
    },
    {
      title: 'GB 19083-2003 4.2 医用防护口罩>口罩带连接强度',
      link: '/details/2'
    },
  ])
  
  const addApplicationDialogVisible = ref(false)
const applicationForm = ref({
  category: '',
  subCategory: '',
  standardName: '',
  standardNumber: '',
  projectName: ''
})
const openAddApplicationDialog = () => {
  addApplicationDialogVisible.value = true
}

const handleCloseDialog = () => {
  addApplicationDialogVisible.value = false
  // Reset form data
  applicationForm.value = {
    category: '',
    subCategory: '',
    standardName: '',
    standardNumber: '',
    projectName: ''
  }
}

const handleAddApplication = () => {
  // Here you would typically send the form data to your backend
  console.log('Application data:', applicationForm.value)
  // For demonstration, we'll just show a success message
  ElMessage.success('申请已添加')
  handleCloseDialog()
}
  const standards = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return allStandards.value.slice(start, end);
});

const handleSearch = () => {
  // Implement search logic here
  console.log('Searching for:', searchQuery.value);
};

const handlePageChange = (newPage) => {
  currentPage.value = newPage;
  // 可以在这里添加逻辑，比如重新获取数据或者更新视图
};

const handleRowClick = (row) => {
  router.push(`/standard/${row.id}`);
};
  </script>
  
<style scoped>

.standards-container {
  max-width: 1200px;
  min-height: 100vh;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

  .header {
    font-size: 24px;
    color: #333;
    margin-bottom: 20px;
  }
  .search-section {
    display: flex;
    gap: 10px;
    margin-bottom: 30px;
  }
  .search-input {
    flex: 1;
    padding: 0px; /* 内边距 */
    color: #333;
    z-index: 0;
  }
  .home-link{
    color: #409EFF;
  }
  .add-button {
    background-color: #409EFF;
  }
  
  .standards-list {
    border: 1px solid #EBEEF5;
    border-radius: 4px;
  }
  
  .standard-item {
    padding: 15px;
    border-bottom: 1px solid #EBEEF5;
  }
  
  .standard-item:last-child {
    border-bottom: none;
  }
  
  .standard-link {
    color: #409EFF;
    text-decoration: none;
    font-size: 14px;
  }
  
  .standard-link:hover {
    text-decoration: underline;
  }
  
  .note {
    color: #666;
    font-size: 12px;
  }
  
  .pagination {
    margin-top: 20px;
    display: block;
    justify-content: center;
    z-index: 0;
  }
  :deep(.el-table__row) {
  cursor: pointer;
}

:deep(.el-table__row:hover) {
  background-color: #f5f7fa;
}

  </style>