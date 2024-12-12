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
  
   <div class="procedures-list">
      <div v-for="(procedure, index) in procedures" :key="index" class="procedure-item">
        <span class="filename">{{ procedure.filename }}</span>
        <div class="actions">
          <el-button 
            type="primary" 
            size="small"
            @click="downloadPdf(index)"
          >
            下载aaaadddd
          </el-button>
        </div>
      </div>
    </div>



    <!-- 申请对比实验 -->

    <div class="status-wrapper">
      申请状态: 
      <span :class="statusClass">{{ statusText }}</span>
      
       <!-- 申请对比实验的按钮 -->
  <el-button 
    type="success" 
    @click="showDialog"
    :disabled="status === 'planned'"
    class="apply-button"
  >
    申请对比实验
  </el-button>


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
      <el-input v-model="projectId"  placeholder="请输入项目ID" />
    </el-form-item>
    <el-form-item label="Account ID" prop="account_id">
      <el-input v-model="accountId" placeholder="请输入账户ID" />
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
import { project_id,user_data } from '@/status';

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
const router = useRouter()


// 弹窗的可见性
const dialogVisible = ref(false);
    // page header 页头
    const goBack = () => {
        router.push('/standard')
        console.log('go back')
    }
// 加载项目ID
function loadProjectId() {
  const savedData = localStorage.getItem('project_id');
  if (savedData) {
      project_id.value = JSON.parse(savedData);
      // console.log(project_id.value);
  }
  const saveuser = localStorage.getItem('user_data');
  if (saveuser) {
    user_data.value = JSON.parse(saveuser);
    
  }
}
// 显示弹窗的方法
const showDialog = () => {
  dialogVisible.value = true;
};

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


// 假设 user_data.value.accountid 是一个字符串类型的数字
// const accountId = parseInt(user_data.value, 10);


// 提交申请对比实验的函数
const submitApplication = async () => {
  
  try {
    // 发送POST请求到后端接口
    const response = await axios.post(baseurl + '/create_compare_plan', {
      project_id: project_id.value,
      account_id: parseInt(user_data.value.accountid, 10)
    },{
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
    });

    // 检查响应状态
    if (response.status === 200) {
      // 提交成功，可以在这里添加一些逻辑，比如关闭对话框，显示成功消息等
      ElMessage.success('对比实验申请成功');
      dialogVisible.value = false; // 关闭对话框
    } else {
      // 提交失败，显示错误消息
      ElMessage.error('对比实验申请失败，请重试');
    }
  } catch (error) {
    // 捕获并处理错误
    console.error('申请对比实验失败：', error);
    ElMessage.error('申请对比实验失败，请重试');
  }
};


























onMounted(() => {
  loadProjectId();
  fetchProcedures();
//   fetchComparison();
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
    //调整窗口的CSS
    const styleProps2 = ref({
        height: '35rem'
    });
    


</script> 

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
  .experiment-container {
  padding: 20px;
}

.status-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.status-text {
  font-weight: bold;
}

.status-not-applied {
  color: #e6a23c;
}

.status-planned {
  color: #409eff;
}

.status-completed {
  color: #67c23a;
}

.apply-button {
  margin-left: 16px;
}

.info-icon {
  color: #909399;
  cursor: help;
  display: inline-flex;
  align-items: center;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 20px;
}
</style>