<template>
    <div id="top">
    <div id="top1">
        <!-- page header 页头 -->
        <topMessage></topMessage>

        <!-- 头像框 -->
        <headshot></headshot>
    </div>

    <!-- menu 菜单 -->
    <el-menu
      :default-active="activeIndex1"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect1"
    >
      <el-menu-item index="1">人员</el-menu-item>
      <el-menu-item index="2">设备</el-menu-item>
      <el-menu-item index="3">规程</el-menu-item>
      <el-menu-item index="4">样品</el-menu-item>
    </el-menu>
  </div>

  <div id="leave_btn">
    <el-button id="r_leave" @click="openModal()" type="primary" plain>留言</el-button>
  </div>
    <h2 style="margin-left: 1rem; margin-bottom: 1rem;">规程操作</h2>
   <div class="procedures-list">
      <div v-for="(procedure, index) in procedures" :key="index" class="procedure-item">
        <span class="filename">{{ procedure.filename }}</span>
        <div class="actions">
          <el-button 
            type="primary" 
            size="small"
            @click="downloadPdf(index)"
          >
            下载
          </el-button>
        </div>
      </div>
    </div>
    
    <el-divider />

    <!-- 展示对比实验 -->
    <h2 style="margin-left: 1rem; margin-bottom: 1rem;">对比实验</h2>
    <div class="comparison-list">
      <div v-for="(comparisonFile, index) in comparisonFiles" :key="index" class="procedure-item">
        <span class="filename">{{ comparisonFile.filename }}</span>
        
        <div class="actions">
          <el-button 
            type="warning" 
            size="small"
            @click="downloadComparison()"
          >
            下载查看
          </el-button>
        </div>
      </div>
    </div>

    <div class="status-wrapper">

      <el-space align="right">
        <!-- <el-check-tag success>对比实验申请状态：<el-tag type="success" size="default" class="status-tag">{{ statusText }}</el-tag></el-check-tag> -->
        <el-button 
          type="success" 
          @click="showDialog"
          :disabled="status === 'planned'"
          class="apply-button"
          >申请对比实验</el-button>
        </el-space>
    
    <!-- 申请对比实验的按钮功能 -->
      <el-tooltip
        v-if="status === 'planned'"
        effect="dark"
        content="该项目正在申请中"
        placement="right"
      >
        <span class="info-icon">
          <InfoIcon class="h-5 w-5" />
        </span>
      </el-tooltip>
    </div>
    <el-dialog
  v-model="dialogVisible"
  title="申请对比实验"
  width="30%"
  :close-on-click-modal="false"
>
  <el-form
    ref="formRef"
    label-width="120px"
    
  >
    <el-form-item label="Project ID" prop="project_id">
      <el-input v-model="projectId"  placeholder="{{ project_id }}" />
    </el-form-item>
    <el-form-item label="Account ID" prop="account_id">
      <el-input v-model="accountId"  placeholder="{{account_id}}" />
    </el-form-item>
  </el-form>


  <template #footer>
    <span class="dialog-footer">
      <el-button @click="dialogVisible = false">取消</el-button>
      <el-button type="primary" @click="submitApplication" :loading="loading">
        确认
      </el-button>
    </span>
  </template>
</el-dialog>


  <!-- 留言窗口 -->
    <outWindow 
    :isVisible = "showModal2"
    :styleProps = "styleProps2"
    :messageType = "'Stander'"
    :outWindowType = true
    @closeModal = "closeModal()"
   >
   </outWindow>
</template>


<script lang="ts" setup>

import { ref, onMounted, inject } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { project_id ,user_data } from '@/status';

const procedures = ref([]);
const comparisonFiles = ref([]);
const tmp = ref([]);
const tmp_com = ref([]);
const baseurl = inject('baseurl')
// 控制按钮加载状态
const loading = ref(false);
// 项目ID和账户ID,申请对比试验用
const projectId = ref('');
const accountId = ref('');
const router = useRouter();
const comparisonPlans = ref([]); // 用于存储对比试验数据
const status = ref(''); // 用于存储对比试验状态
const statusText = ref(''); // 用于存储对比试验状态文本
const statusClass = ref(''); // 用于存储对比试验状态样式类

// page header 页头
const goBack = () => {
    router.push('/standard')
    console.log('go back')
}
// 加载数据
function loadProjectId() {
  const savedData = localStorage.getItem('project_id');
  if (savedData) {
      project_id.value = JSON.parse(savedData);
  }
  const saveuser = localStorage.getItem('user_data');
  if (saveuser) {
    user_data.value = JSON.parse(saveuser);
    
  }

}
// 弹窗的可见性
const dialogVisible = ref(false);

// 显示弹窗的方法
const showDialog = () => {
  dialogVisible.value = true;
};

// 提交申请对比实验的函数
const submitApplication = async () => {
  // console.log('项目ID为：' + project_id.value + "\n" + "账户ID为：" + user_data.value.accountid);
  try {
    const response = await axios.post(baseurl + '/create_compare_plan', {
      project_id: project_id.value,
      account_id: user_data.value.accountid,
    },{
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
    });

    // 检查响应状态
    if (response.status === 200&&response.data.data===true) {
      ElMessage.success('对比实验申请成功');
      dialogVisible.value = false; 
    console.log('申请对比实验成功'+ response.data);
    }
    if(response.data.data===false){
      ElMessage.error('请勿重复申请！');
    } 
    if(response.status !== 200){
      ElMessage.error('申请对比实验失败，请重试');
    }
  } catch (error) {
    console.error('申请对比实验失败：', error);
    ElMessage.error('申请对比实验失败，请重试');
    console.log(error.response.data);
  }
};

// 加载对比试验数据
async function loadComparisonPlans() {
  try {
    const response = await axios.post(baseurl + '/show_my_compare_plan', {
      account_id: user_data.value.accountid,
    },{
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
    });
    if (response.data && response.data.data) {
      comparisonPlans.value = response.data.data;
      comparisonPlans.value.forEach(plan => {
        // 假设我们只关心第一个项目的申请状态
        status.value = plan.projectTest.state;
        statusText.value = getStatusText(plan.projectTest.state); // 根据状态码转换为对应的文本描述
        statusClass.value = getStatusClass(plan.projectTest.state); // 根据状态设置不同的样式类
      });
    } else {
      console.error('数据结构不符合预期:', response.data);
      ElMessage.error('数据结构不符合预期，请检查后端返回的数据');
    }
  } catch (error) {
    console.error('获取对比试验数据失败：', error);
    ElMessage.error('获取对比试验数据失败，请重试');
  }
}
// 根据状态返回不同的样式类
// 根据状态返回不同的文本描述
function getStatusText(status) {
  switch (status) {
    case 'Finish':
      return '已完成'; // 完成状态的文本描述
    case 'Ongoing':
      return '正在进行'; // 进行中状态的文本描述
    default:
      return '未知状态'; // 默认文本描述
  }
}

// 根据状态返回不同的样式类
function getStatusClass(status) {
  switch (status) {
    case 'Finish':
      return 'status-finish'; // 完成状态的样式类
    case 'Ongoing':
      return 'status-ongoing'; // 进行中状态的样式类
    default:
      return 'status-default'; // 默认样式类
  }
}



//获取后端操作规程文件
async function fetchProcedures() {
  try {
    const response = await axios.post(baseurl + '/download_operation_procedure', {
      project_id: project_id.value
    }, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    if (response.data && response.data.data) {
       tmp.value = response.data.data;
       console.log("tmp中的数据为：");
       console.log(tmp.value);
      procedures.value = response.data.data.map(file => {
        const filename = file.split('#').pop(); // 提取文件名
        return {
          filename: filename,
          url: baseurl + `/files/${encodeURIComponent(filename)}` // 构造URL时只使用文件名，并进行编码
        };
      });
    } else {
      console.error('数据结构不符合预期:', response.data);
      ElMessage.error('数据结构不符合预期，请检查后端返回的数据');
    }
  } catch (error) {
    console.error('获取操作规程失败：', error);
    ElMessage.error('获取操作规程失败，请重试');
  }
}
// 下载PDF文件
async function downloadPdf(index) {
  const filename = tmp.value[index];
  console.log("项目ID为：" + project_id.value + "\n" + "下载的文件名为：" + decodeURIComponent(filename));
  const strtmp="D:/files/";
  const Path=filename.replace(strtmp, "");
  try {
    const fullFileName =  decodeURIComponent(Path);

    console.log("用来下载的文件地址为fullFileName：" + fullFileName);
    const response = await axios({
      url: baseurl + `/download`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: `fileName=${fullFileName}`, // 传递完整的文件名
      responseType: 'blob' // 指定响应类型为blob
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    console.log("下载地址为：" + url);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', fullFileName); // 设置下载的文件名
    document.body.appendChild(link);
    link.click(); // 触发下载
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url); // 释放URL对象
  } catch (error) {
    console.error('下载PDF文件失败：', error);
    ElMessage.error('下载PDF文件失败，请重试');
  }
}

// 下载对比实验文件
async function downloadComparison() {
  const filename = tmp_com.value;
  // 确保 tmp_com.value 存在
  if (!tmp_com.value) {
    ElMessage.error('文件地址不存在');
    return;
  }

  try {
    // 假设 tmp_com.value 包含的是文件位置（例如：pic/1.jpg）
    const response = await axios({
      url: baseurl + '/download', // 接口URL
      method: 'POST', // 请求方法为POST
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded' // 设置请求头
      },
      data: `fileName=${filename}`, // 传递文件位置参数
      responseType: 'blob' // 指定响应类型为blob
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    console.log("下载地址为：" + url);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', "对比实验规程.pdf"); // 设置下载的文件名
    document.body.appendChild(link);
    link.click(); // 触发下载
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url); // 释放URL对象
  } catch (error) {
    console.error('下载文件失败：', error);
    ElMessage.error('下载文件失败，请重试');
  }
}

//获取后端对比文件的函数
async function fetchComparison() {
  try {
    const response = await axios.post(baseurl + '/download_compare_plan', 
      `project_id=${project_id.value}`, 
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    if (response.data && response.data.data) {
      // 假设后端返回的data是一个包含文件地址的字符串
      const comparisonFileUrl = response.data.data;
      tmp_com.value = response.data.data;
      console.log("tmp_com中的数据为：");
      console.log(tmp_com.value);
      // 将文件地址存储到响应式变量中，以便在Vue模板中使用
      comparisonFiles.value = [{
        filename: comparisonFileUrl.split('/').pop(), // 提取文件名
        url: comparisonFileUrl // 文件的完整URL
      }];
    } else {
      console.error('数据结构不符合预期:', response.data);
      ElMessage.error('数据结构不符合预期，请检查后端返回的数据');
    }
  } catch (error) {
    console.error('获取对比实验文件失败：', error);
    ElMessage.error('获取对比实验文件失败，请重试');
  }
}

onMounted(() => {
  loadProjectId();
  fetchProcedures();
  loadComparisonPlans();
  fetchComparison();
  const savedProjectId = localStorage.getItem('project_id');
  if (savedProjectId) {
    projectId.value = savedProjectId;
  }

  const savedUserData = localStorage.getItem('user_data');
  if (savedUserData) {
    user_data.value = JSON.parse(savedUserData);
    accountId.value = user_data.value.accountid;
  }
});
    // menu 菜单
    const activeIndex1 = ref('3')
    const handleSelect1 = (key: string, keyPath: string[]) => {
        if(key.match('1')) router.push('/details/')
        if(key.match('2')) router.push('/machinefirst')
        if(key.match('4')) router.push('/sample')
        console.log(key, keyPath)
    }

    // 打开/关闭小窗口
    const showModal2 = ref(false)
    function openModal(){
        showModal2.value = true
    }
    function closeModal() {
        showModal2.value = false
    }

    //给边框使用
    const getCssVarName = (type: string) => {
        return `--el-box-shadow${type ? '-' : ''}${type}`
    }

    // 留言-文本框设置
    const textarea = ref('')

    //调整窗口的CSS
    const styleProps2 = ref({
        height: '35rem'
    });
</script> -->

<style>
     #top1{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    #leave_btn {
      width: 100%;
      height: 3rem;
    }
    #r_leave{
        float: right;
        margin-top: 1rem;
        margin-right: 3rem;
    }
    #r_content1{
        margin-top: 3rem;
        margin-left: 2rem;
    }
    #r_content1 h2{
        margin-bottom: 1.5rem;
    }
    .content_pdf{
        display: flex;
        margin-bottom: 1rem;
    }
    .content_pdf p{
        margin-right: 3rem;
    }
    #r_content2{
        margin-top: 3rem;
        margin-left: 2rem;
    }
    #r_content2 h2{
        margin-bottom: 1.5rem;
    }
    .content_compare{
        display: flex;
        margin-bottom: 1rem;
    }
    .content_compare p{
        margin-right: 3rem;
    }
    .content_status{
        display: flex;
        margin-bottom: 1rem;
    }
    .content_status p{
        margin-right: 3rem;
    }
    .header {
    margin-bottom: 20px;
  }
  
  .standard-title {
    font-size: 20px;
    font-weight: bold;
    margin-bottom: 8px;
  }
  
  .standard-subtitle {
    font-size: 16px;
    color: #666;
  }
  
  .section {
    margin-bottom: 30px;
  }
  
  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }
  
  .section-header h3 {
    font-size: 16px;
    margin: 0;
  }
  
  .procedures-list,
  .comparison-list {
    background: #f5f7fa;
    padding: 15px;
    border-radius: 4px;
  }
  
  .procedure-item,
  .comparison-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background: white;
    margin-bottom: 10px;
    border-radius: 4px;
  }
  
  .filename {
    color: #606266;
  }
  
  .actions {
    display: flex;
    gap: 8px;
  }
  
  .comparison-manage-btn {
    margin-top: 15px;
  }
  
  :deep(.el-button--small) {
    padding: 8px 15px;
  }
  
  :deep(.el-upload) {
    display: inline-block;
  }
  .status-wrapper {
    margin-top: 20px;
  }

  .status-finish {
    color: green;
  }

  .status-ongoing {
    color: blue;
  }

  .status-planned {
    color: orange;
  }

  .status-default {
    color: grey;
  }

</style>