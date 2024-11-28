<template>
    <div class="standards-container">
      <Top
      :_name="user_data.name"
      :username="user_data.username"
      :institution="user_data.institution"
      :contact="user_data.contact"
      :accountType="user_data.accountType"
      ></Top>

      <h2 class="header">标准查询</h2>
      
      <div class="search-section">
        <el-input
          v-model="searchQuery"
          placeholder="请输入入标准号或中文关键词搜索"
          class="search-input"
        >
        </el-input>
      </div>
      <div id="buttonGroup24">
        <div id="left24">
          <el-button type="primary" @click="openAddApplicationDialog">添加</el-button>
          <el-button type="success" @click="importFromExcel">从excel统计表导入</el-button>
        </div>
        <el-button type="success" @click="showApplicationsDialog">查看增加申请</el-button>
      </div>

      <div class="standards-list">
      <div v-for="(standard, index) in filteredStandards" :key="index" class="standard-item">
        <router-link :to="`/details/${standard.id}`" class="standard-link">
          {{ standard.title }}
          <span v-if="standard.note" class="note">({{ standard.note }})</span>
        </router-link>
      </div>
    </div>
     <!-- 申请信息弹窗 -->
  <el-dialog
    v-model="applicationDialogVisible"
    title="申请信息"
    width="80%"
  >
    <el-table :data="applications">
      <el-table-column prop="category" label="大类"></el-table-column>
      <el-table-column prop="subCategory" label="类别"></el-table-column>
      <el-table-column prop="standardName" label="标准名称"></el-table-column>
      <el-table-column prop="standardNumber" label="标准编号"></el-table-column>
      <el-table-column prop="projectName" label="项目名称"></el-table-column>
      <el-table-column prop="status" label="申请状态"></el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="scope">
          <!-- 使用statusControl控制按钮显示 -->
          <div style="display: flex; flex-direction: column; align-items: center;">
            <el-button 
              type="primary" 
              size="small" 
              v-if="scope.row.statusControl === 'pending'"
              @click="handleApproveApplication(scope.row)" 
            >同意申请</el-button>
            <el-button 
              type="danger" 
              size="small" 
              v-if="scope.row.statusControl === 'pending'"
              @click="handleRejectApplication(scope.row)" 
            >不同意申请</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <template #footer>
      <el-button @click="applicationDialogVisible = false">关闭</el-button>
    </template>
  </el-dialog>
<!-- 分页处理 -->
      <div class="pagination">
        <el-pagination
          v-model:current-page="currentPage"
          :page-size="10"
          :total="100"
          :pager-count="11"
           layout="prev, pager, next"
          @current-change="handlePageChange"
        />

<!-- 手动添加项目 -->
        <el-dialog
      v-model="addApplicationDialogVisible"
      title="添加项目"
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
import { ref, computed,reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage,ElDialog } from 'element-plus'
// import * as XLSX from 'xlsx'
import Top from './Top.vue'
import { user_data } from '@/status'

const router = useRouter()
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

const importedData = ref([])

const handleExcelUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      // 移除标题行
      const importedData = jsonData.slice(1);

      // 将导入的数据添加到allStandards数组中
      allStandards.value = [...allStandards.value, ...importedData.map((item) => ({
        id: item[4], // 假设项目名称是ID
        title: `${item[0]} ${item[2]}`, // 大类 + 标准名称
        note: item[4], // 项目名称作为备注
        link: `/details/${item[4]}` // 链接格式
      }))];

      ElMessage.success('Excel文件导入成功');
    };
    reader.readAsArrayBuffer(file);
  }
};

const importFromExcel = () => {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.xlsx, .xls';
  input.onchange = handleExcelUpload;
  input.click();
};

const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = 10
  
// 假设的申请信息数组
const applications = ref([
  { category: '大类1', subCategory: '类别1', standardName: '标准名称1', standardNumber: '标准编号1', projectName: '项目名称1', status: '申请中', statusControl: 'pending' },
  { category: '大类1', subCategory: '类别1', standardName: '标准名称1', standardNumber: '标准编号1', projectName: '项目名称1', status: '申请中', statusControl: 'pending' },
  { category: '大类1', subCategory: '类别1', standardName: '标准名称1', standardNumber: '标准编号1', projectName: '项目名称1', status: '申请中', statusControl: 'pending' },
  { category: '大类1', subCategory: '类别1', standardName: '标准名称1', standardNumber: '标准编号1', projectName: '项目名称1', status: '申请中', statusControl: 'pending' },
  { category: '大类1', subCategory: '类别1', standardName: '标准名称1', standardNumber: '标准编号1', projectName: '项目名称1', status: '申请中', statusControl: 'pending' },
  { category: '大类1', subCategory: '类别1', standardName: '标准名称1', standardNumber: '标准编号1', projectName: '项目名称1', status: '申请中', statusControl: 'pending' },
  { category: '大类1', subCategory: '类别1', standardName: '标准名称1', standardNumber: '标准编号1', projectName: '项目名称1', status: '申请中', statusControl: 'pending' },
  { category: '大类1', subCategory: '类别1', standardName: '标准名称1', standardNumber: '标准编号1', projectName: '项目名称1', status: '申请中', statusControl: 'pending' },
  { category: '大类1', subCategory: '类别1', standardName: '标准名称1', standardNumber: '标准编号1', projectName: '项目名称1', status: '申请中', statusControl: 'pending' },
  { category: '大类1', subCategory: '类别1', standardName: '标准名称1', standardNumber: '标准编号1', projectName: '项目名称1', status: '申请中', statusControl: 'pending' },
  { category: '大类1', subCategory: '类别1', standardName: '标准名称1', standardNumber: '标准编号1', projectName: '项目名称1', status: '申请中', statusControl: 'pending' },
  { category: '大类1', subCategory: '类别1', standardName: '标准名称1', standardNumber: '标准编号1', projectName: '项目名称1', status: '申请中', statusControl: 'pending' },

])
// 申请信息弹窗的可见性
const applicationDialogVisible = ref(false)

// 处理同意申请的方法
const handleApproveApplication = (application) => {
  application.status = '已同意'
  application.statusControl = 'approved'
  ElMessage.success('申请已同意')
  // 将申请信息添加到标准列表中
  // ...
}

// 处理不同意申请的方法
const handleRejectApplication = (application) => {
  application.status = '已拒绝'
  application.statusControl = 'rejected'
  ElMessage.success('申请已拒绝')
}

// 显示申请信息弹窗的方法
const showApplicationsDialog = () => {
  applicationDialogVisible.value = true
}
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
    ElMessage.success('退出登录成功')
  } else if (command === 'jumpToHomepage2') {
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