
<template>
  <div class="standards-container">
    <Top></Top>

    <h2 class="header">标准查询</h2>
    <div class="search-section">
      <el-input
        v-model="searchQuery"
        placeholder="请输入入标准号或中文关键词搜索"
        class="search-input"
      >
      </el-input>
      <el-button type="primary" @click="handleSearch" >搜索</el-button>
      <!-- <el-button type="primary" @click="openAddApplicationDialog">增加申请</el-button> -->
    </div>
    <div id="buttonGroup24">
      <div id="left24">
        <el-button type="primary" @click="openAddApplicationDialog">添加</el-button>
        <el-button type="success" @click="handleExcelUpload">从excel统计表导入</el-button>
        <!-- <el-button type="success" @click="showApplicationsDialog">查看增加申请</el-button> -->
      </div>
    </div>
    <div class="standards-list">
      <div v-for="project in paginatedProjects" :key="project.projectid" class="standard-item">
        <div v-if="projects.length === 0">没有项目数据</div>
    
        <router-link to="/supportDetails/" class="action-button" 
          @click="handleClick(project.projectid, project.standardnumber, project.projecttype, project.projectname)" 
        >
          <strong>项目名称：</strong> {{ project.projectname }}
        </router-link>
          <p><strong>项目ID：</strong>{{ project.projectid }}</p>
          <p><strong>类别：</strong>{{ project.categories }}</p>
          <p><strong>项目时间：</strong>{{ project.projecttime }}</p>
          <p><strong>项目类型：</strong>{{ project.projecttype }}</p> 

      </div>
    </div>
  </div>
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
   <!-- 申请信息弹窗 -->
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
import { ref, computed, inject } from 'vue'
import { useRouter } from 'vue-router'
import { onMounted } from 'vue';
import axios from 'axios'
import { ElMessage,ElDialog } from 'element-plus'
import { project_id, title ,selected_category} from '@/status';
import * as XLSX from 'xlsx';
// import * as XLSX from 'xlsx'
import Top from './Top.vue'
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
// function handleClick(projectId, standardNumber, projecttype, projectname) {
//       project_id.value = projectId
//       title.value = standardNumber +'  '+ projecttype +'  '+ projectname
//       saveData()
//       console.log("project_id:",project_id.value)
//     }
// const handleExcelUpload = (event) => {
// const file = event.target.files[0];
// if (file) {
//   const reader = new FileReader();
//   reader.onload = (e) => {
//     const data = new Uint8Array(e.target.result);
//     const workbook = XLSX.read(data, { type: 'array' });
//     const firstSheetName = workbook.SheetNames[0];
//     const worksheet = workbook.Sheets[firstSheetName];
//     const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

//     // 移除标题行
//     const importedData = jsonData.slice(1);

//     // 将导入的数据添加到allStandards数组中
//     allStandards.value = [...allStandards.value, ...importedData.map((item) => ({
//       id: item[4], // 假设项目名称是ID
//       title: `${item[0]} ${item[2]}`, // 大类 + 标准名称
//       note: item[4], // 项目名称作为备注
//       link: `/details/${item[4]}` // 链接格式
//     }))];

//     ElMessage.success('Excel文件导入成功');
//   };
//   reader.readAsArrayBuffer(file);
// }
// };
console.log("category为",selected_category.value)
const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(5)
const projects = ref([])
const projectData = ref([])
  const baseurl = inject('baseurl')
function search() {
axios.get(baseurl + '/all_project')
.then(function (response) {
  // 确保响应数据是一个对象
  if (typeof response.data === 'object' && response.data !== null) {
    // 提取对象的所有值到数组中
    projects.value = Object.values(response.data)
    console.log('projects data:', projects.value)
    // 检查数组中是否有至少两个元素
    if (projects.value.length > 1) {
      // 获取第二个元素，即 projects[1]，并根据category筛选
      let filteredData = projects.value[1].filter(project => 
        project.categories === selected_category.value
      );
      projectData.value = filteredData;
      console.log('Filtered projects data:', projectData)
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
const paginatedProjects = computed(() => {
// 首先，如果存在搜索查询，则过滤项目
let filteredProjects = searchQuery.value && projectData.value
  ? projectData.value.filter(project => project.projectname.toLowerCase().includes(searchQuery.value.toLowerCase()))
  : projectData.value;

// 然后，进行分页
const start = (currentPage.value - 1) * pageSize.value;
const end = start + pageSize.value;
return filteredProjects ? filteredProjects.slice(start, end) : [];
});
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
const addApplicationDialogVisible = ref(false)
const applicationForm = ref({
categories: '',//大类
subCategory: '',//类别
standardName: '',//标准名称
standardNumber: '',//标准编号
projectName: ''//项目名称
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
} else if (command === 'jumpToHomepage2') {
  router.push('/MessageofPersonP40')
}
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

const  openAddApplicationDialog = () => {
addApplicationDialogVisible.value = true

}

const handleCloseDialog = () => {
addApplicationDialogVisible.value = false
}

  
function handleClick(projectId, standardNumber, projecttype, projectname) {
      project_id.value = projectId
      title.value = standardNumber +'  '+ projecttype +'  '+ projectname
      saveData()
      console.log("project_id:",project_id.value)
    }

    function saveData() {
        localStorage.setItem('project_id', JSON.stringify(project_id.value))
        localStorage.setItem('title', JSON.stringify(title.value))
    }

const fileInput = ref(null)

const triggerFileUpload = () => {
  fileInput.value.click()
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
const handleSearch = () => {
  // Implement search logic here
  console.log('Searching for:', searchQuery.value);
};

const handlePageChange = (newPage) => {
  currentPage.value = newPage;
  // 可以在这里添加逻辑，比如重新获取数据或者更新视图
};

function onload(){
  const savedCategory = localStorage.getItem('selected_category');
  if (savedCategory) {
    selected_category.value = savedCategory; // Restore the selected category from localStorage
    console.log("data", selected_category.value);
  }
}
// const handleRowClick = (row) => {
onMounted(() => {
search()
onload()
})
</script>
<style scoped>
.standards-container {
max-width: 1200px;
min-height: 100vh;
display: flex;
flex-direction: column;
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
.top-bar {
display: flex;
justify-content: space-between;
}
.pagination {
display: flex;
justify-content: center;
margin-top: 20px;
}

</style>