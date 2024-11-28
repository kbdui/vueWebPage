<template>
    <div class="standards-container">
      <div class="top-bar">
        <router-link to="/" class="home-text">登出</router-link>
        <el-dropdown trigger="hover" @command="handleCommand">
        <div class="avatar-wrapper">
          <el-avatar :size="40" :src="userAvatar" @error="handleAvatarError">
            {{ userInitials }}
          </el-avatar>
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item disabled>
              <div class="user-info">
                <p><strong>姓名：</strong>{{ userInfo.name }}</p>
                <p><strong>用户名：</strong>{{ userInfo.username }}</p>
                <p><strong>所属机构：</strong>{{ userInfo.organization }}</p>
                <p><strong>联系方式：</strong>{{ userInfo.contact }}</p>
              </div>
            </el-dropdown-item>
            <el-dropdown-item divided command="jumpToHomepage2">个人主页</el-dropdown-item>
            <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>

      <h2 class="header">标准查询</h2>
      
      <div class="search-section">
        <el-input
          v-model="searchQuery"
          placeholder="请输入入标准号或中文关键词搜索"
          class="search-input"
        >
        </el-input>
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div>
      <div id="buttonGroup24">
        <div id="left24">
          <el-button type="primary" @click="openAddApplicationDialog">添加</el-button>
            <!-- <el-button type="success">从excel统计表导入</el-button> -->
            <el-button type="success" @click="importFromExcel">从excel统计表导入</el-button>
  <input type="file" ref="excelFileInput" style="display: none" accept=".xlsx, .xls" @change="handleExcelUpload" />
  <div v-if="importedData.length > 0">
    <table>
      <thead>
        <tr>
          <th>大类</th>
          <th>类别</th>
          <th>标准名称</th>
          <th>标准编号</th>
          <th>项目名称</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in importedData" :key="index">
          <td>{{ item['大类'] }}</td>
          <td>{{ item['类别'] }}</td>
          <td>{{ item['标准名称'] }}</td>
          <td>{{ item['标准编号'] }}</td>
          <td>{{ item['项目名称'] }}</td>
        </tr>
      </tbody>
    </table>
  </div>
        </div>
        <el-button type="success">查看增加申请</el-button>
      </div>
      <div class="standards-list">
        <div v-for="(standard, index) in filteredStandards" :key="index" class="standard-item">
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

// 导入excel表用
import * as XLSX from 'xlsx'
const router = useRouter()
// 用于存储导入的数据
const importedData = ref([])
// 处理文件上传和解析Excel文件的方法
const handleExcelUpload = (event) => {
  const file = event.target.files[0]
  if (!file) {
    ElMessage.error('请选择一个Excel文件')
    return
  }
  const reader = new FileReader()
  reader.onload = (e) => {
    const data = e.target.result
    const workbook = XLSX.read(data, { type: 'array' })
    const sheetName = workbook.SheetNames[0]
    const sheet = workbook.Sheets[sheetName]
    const json = XLSX.utils.sheet_to_json(sheet, { header: 1 })
    importedData.value = json
  }
  reader.readAsArrayBuffer(file)
}

// 用于触发文件选择的ref
const excelFileInput = ref(null)

// 调用文件输入的方法
const importFromExcel = () => {
  excelFileInput.value.click()
}
const userInfo = ref({
  name: '张三',
  username: 'zhangsan',
  organization: 'ABC公司',
  contact: 'zhangsan@example.com'
})

const userAvatar = ref('https://example.com/avatar.jpg')
const userInitials = computed(() => {
  return userInfo.value.name.slice(0, 2)
})
  
  const searchQuery = ref('')
  const currentPage = ref(1)
  const itemsPerPage = 10
  
  // 假设我们有一个包含所有标准的大数组
  const allStandards = ref([
    // 数据区
    {
      title:'这里都是演示用的数据',
      link:'/details/0',
      note:'点击跳转详情页面'},
    {
      title: 'GB 19083-2003 4.1 医用防护口罩>基本要求',
      link: '/details/1',
      note: '点击跳转到详情页面'
    },
    {
      title: 'GB 19083-2003 4.2 医用防护口罩>口罩',
      link: '/details/2'
    },
    {
      title: 'GB 19083-2003 4.2 医用防护口罩>扣找',
      link: '/details/2'
    },{
      title: 'GB 19083-2003 4.2 医用防护工具>酒精',
      link: '/details/2'
    },{
      title: 'GB 19083-2003 4.2 医用防护工具>双氧水',
      link: '/details/2'
    },{
      title: 'GB 19083-2003 4.2 医用防护口罩>颠覆',
      link: '/details/2'
    },{
      title: 'GB 19083-2003 4.2 医用防护口罩>剪刀',
      link: '/details/2'
    },{
      title: 'GB 19083-2003 4.2 医用防护口罩>镊子',
      link: '/details/2'
    },
    {
      title: 'GB 19083-2003 4.2 医用防护口罩>筷子',
      link: '/details/2'
    },
    {
      title: 'GB 19083-2003 4.2 医用防护口罩>勺子',
      link: '/details/2'
    },
    {
      title: 'GB 19083-2003 4.2 医用防护口罩>锤子',
      link: '/details/2'
    },
    {
      title: 'GB 19083-2003 4.2 医用防护口罩>1',
      link: '/details/2'
    },
    {
      title: 'GB 19083-2003 4.2 医用防护口罩>2',
      link: '/details/2'
    },
    {
      title: 'GB 19083-2003 4.2 医用防护口罩>3',
      link: '/details/2'
    },
    {
      title: 'GB 19083-2003 4.2 医用防护口罩>5',
      link: '/details/2'
    },
    {
      title: 'GB 19083-2003 4.2 医用防护口罩>7',
      link: '/details/2'
    },
    {
      title: 'GB 19083-2003 4.2 医用防护口罩>8',
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
const handleCommand = (command) => {
  if (command === 'logout') {
    // Implement logout logic here
    ElMessage.success('退出登录成功')
    // You would typically clear user session and redirect to login page
    // router.push('/login')
  }
  else if(command === 'jumpToHomepage2'){
      router.push('/MessageofPersonP40')
  }
}

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

  console.log('Application data:', applicationForm.value)

  ElMessage.success('申请已添加')
  handleCloseDialog()
}

const standards = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return allStandards.value.slice(start, end);
});
const filteredStandards = computed(() => {
  if (!searchQuery.value) {
    return standards.value;
  }
  const lowerSearchQuery = searchQuery.value.toLowerCase();
  return allStandards.value.filter(standard => {
    return standard.title.toLowerCase().includes(lowerSearchQuery);
  });
});

const handleSearch = () => {
  // Implement search logic here
  console.log('Searching for:', searchQuery.value);
};

const handlePageChange = (newPage) => {
  currentPage.value = newPage;

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

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.home-text {
  color: #409EFF;
  text-decoration: none;
  font-size: 16px;
}

.home-text:hover {
  text-decoration: underline;
}

.avatar-wrapper {
  cursor: pointer;
}
  .header {
    font-size: 24px;
    color: #333;
    margin-bottom: 20px;
  }
  
  .search-section {
    display: flex;
    gap: 10px;
    margin-bottom: 10px;
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

.user-info {
  padding: 10px;
  min-width: 200px;
  /* margin-left: 90%; */
}

.user-info p {
  margin: 5px 0;

}
#buttonGroup24{
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
}
#left24{
    display: flex;
}
</style>