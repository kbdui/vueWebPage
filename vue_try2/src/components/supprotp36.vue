<template>
    <div class="standards-management">
      <div id="top">
        <div id="top1">
            <!-- page header 页头 -->
            <TopMessage></TopMessage>

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
  
      <!-- 规程操作 -->
      <div class="section">
        <div class="section-header">
          <h2>规程操作</h2>

          <el-upload
            class="upload-demo"
            action="/api/upload"
            :on-change="handleChange"
            :show-file-list="false"
            :http-request="customRequest"
          >
    <el-button type="success" size="small">导入</el-button>
  </el-upload>
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
          下载
        </el-button>

        <el-button 
          type="danger" 
          size="small"
          @click="deletePdf(index)"
        >
          删除
        </el-button>
      </div>
    </div>
        </div>
      </div>
  
      <!-- 对比实验部分 -->
      <div class="section">
        <div class="section-header">
          <h2>对比实验</h2>
          
          <el-upload
            class="upload-demo"
            action="/api/upload"
            :on-change="handleChange"
            :show-file-list="false"
            :http-request="UploadComparision"
          > <el-button type="success" size="small">导入</el-button>
        </el-upload>


           
        </div>
  
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

              <el-button 
                type="danger" 
                size="small"
                @click="deleteComparison()"
              >
                删除
              </el-button>
            </div>
          </div>
        </div>
      <el-button style="margin-top: 1rem;" type="warning" size="medium" @click="fetchOngoingTest">对比试验管理</el-button>
      <el-dialog
        v-model="dialogVisible"
        title="对比实验管理"
        width="60%"
        :before-close="handleClose"
        >
        <p class="text-sm mb-4">本轮对比实验首次被申请时间: {{ date }}</p>

        <h3 class="font-medium mb-2">申请人员表</h3>

        <el-table :data="userAccountList" style="width: 100%">
          <el-table-column prop="name" label="姓名" />
          <el-table-column prop="institution" label="所属机构" />
          <el-table-column prop="contact" label="联系方式" />
        </el-table>

    <div class="mt-4 flex justify-between items-center">
      <div>
      <el-button type="success" @click="markTestAsComplete">完成</el-button>
      <el-button type="danger" @click="dialogVisible = false">关闭</el-button>
    </div>
      </div>
    </el-dialog>
      </div>
    </div>
  </template>
<script lang="ts" setup>
import { ref, onMounted, inject } from 'vue';
import { ElMessage } from 'element-plus';
import axios from 'axios';
import { useRouter } from 'vue-router';
import { project_id } from '@/status';
import TopMessage from './son_components/topMessage.vue';

const procedures = ref([]);
const comparisonFiles = ref([]);
const tmp = ref([]);
const tmp_com = ref();
const baseurl = inject('baseurl')
//pdf文件应该都放在相对应的projectid文件夹下的子文件夹才能正确访问到，并且projectid文件夹下应该包含两个文件夹，
// 分别存放操作规程和对比实验文件

const handleComplete = () => {
  ElMessage.success('实验已完成')
  dialogVisible.value = false
}
// 加载项目ID
function loadProjectId() {
  const savedData = localStorage.getItem('project_id');
  if (savedData) {
      project_id.value = JSON.parse(savedData);
      // console.log(project_id.value);
  }
}
const dialogVisible = ref(false);
const date = ref(''); // 用于存储对比实验首次被申请的时间
const userAccountList = ref([]); // 用于存储申请人员表的数据

// 获取对比实验管理数据
async function fetchOngoingTest() {
  try {
    const response = await axios.post(baseurl + '/show_project_test_ongoing', 
      `project_id=${project_id.value}`, 
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    if (response.data && response.data.data) {
      const data = response.data.data;

      date.value = data.date; // 更新实验时间

      userAccountList.value = data.userAccountList; // 更新人员信息

      dialogVisible.value = true; // 显示对话框
    } else {
      console.error('数据结构不符合预期:', response.data);
      ElMessage.error('数据结构不符合预期，请检查后端返回的数据');
    }
  } catch (error) {
    console.error('获取对比实验管理数据失败:', error);
    ElMessage.error('获取对比实验管理数据失败，请重试');
  }
}



const handleClose = (done) => {
  ElMessage.info('关闭弹窗！');
  done();
}

// const handleComplete = () => {
//   ElMessage.success('实验已完成');
//   dialogVisible.value = false;
// }
// 标记对比实验为已完成
async function markTestAsComplete() {
  try {
    const response = await axios.post(baseurl + '/finish_test_by_project_id', 
      `project_id=${project_id.value}`, 
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    if (response.data) {
      ElMessage.success('对比实验已标记为完成');
      dialogVisible.value = false;
    } else {
      ElMessage.error('操作失败，请重试');
    }
  } catch (error) {
    console.error('标记对比实验为完成失败:', error);
    ElMessage.error('标记对比实验为完成失败，请重试');
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
// 假设 procedures.value 已经通过 fetchProcedures 函数赋值
async function displayFiles() {
  if (procedures.value) {
    // 遍历 procedures.value 数组
    procedures.value.forEach(file => {
      console.log("文件名:", file.filename);
      console.log("文件地址:", file.url);
    });
  } else {
    console.log("文件列表尚未加载");
  }
}

// 调用 displayFiles 函数以显示文件列表
displayFiles();
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

  console.log("项目ID为：" + project_id.value + "\n" + "下载的文件名为：" + decodeURIComponent(filename));

  try {
    // 假设 tmp_com.value 包含的是文件位置（例如：pic/1.jpg）
    const response = await axios({
      url: baseurl + '/download', // 接口URL
      method: 'POST', // 请求方法为POST
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded' // 设置请求头
      },
      data: `fileName=${encodeURIComponent(filename)}`, // 传递文件位置参数
      responseType: 'blob' // 指定响应类型为blob
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    console.log("下载地址为：" + url);

    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename); // 设置下载的文件名
    document.body.appendChild(link);
    link.click(); // 触发下载
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url); // 释放URL对象
  } catch (error) {
    console.error('下载文件失败：', error);
    ElMessage.error('下载文件失败，请重试');
  }
}

//上传操作规程方法
function customRequest(options) {
      const { file, onProgress, onSuccess, onError } = options;

      const formData = new FormData();
      formData.append('project_id', project_id.value);
      formData.append('file', file);

      axios({
        method: 'post',
        url: baseurl + '/upload_operation_procedure',
         // 后端接口URL
        data: formData,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        onUploadProgress: progressEvent => {
          onProgress(progressEvent);
        }
      })
      .then(response => {
        onSuccess(response);
        ElMessage.success('文件上传成功');
      })
      .catch(error => {
        onError(error);
        ElMessage.error('文件上传失败，请重试');
      });
    }


// //上传对比试验方法
// function UploadComparision(options) {
//       const { file, onProgress, onSuccess, onError } = options;

//       const formData = new FormData();
//       formData.append('project_id', project_id.value);
//       formData.append('file', file);
//       console.log("上传的文件名为：" + file.name);
//       axios({
//         method: 'post',
//         url: baseurl + '/upload_compare_plan',
//          // 后端接口URL
//         data: formData,
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded'
//         },
//         onUploadProgress: progressEvent => {
//           onProgress(progressEvent);
//         }
//       })
//       .then(response => {
//         onSuccess(response);
//         ElMessage.success('文件上传成功');
//       })
//       .catch(error => {
//         onError(error);
//         ElMessage.error('文件上传失败，请重试');
//       });
//     }
function UploadComparision(options) {
  const { file, onProgress, onSuccess, onError } = options;

  // 创建 FormData 对象并添加文件和项目ID
  const formData = new FormData();
  formData.append('project_id', project_id.value); // 假设 project_id 是一个响应式变量或可访问的变量
  formData.append('file', file); // 'file' 是后端期望的字段名

  // 使用 axios 发送 POST 请求
  axios({
    method: 'post',
    url: baseurl+'/upload_compare_plan', // 后端接口URL
    data: formData,
    headers: {
      'Content-Type': 'multipart/form-data'  // 让 axios 自动设置 Content-Type
    },
    onUploadProgress: progressEvent => {
      onProgress(progressEvent); // 调用 onProgress 更新上传进度
    }
  })
  .then(response => {
    onSuccess(response); // 上传成功，调用 onSuccess
    ElMessage.success('文件上传成功'); // 显示成功消息
  })
  .catch(error => {
    onError(error); // 上传失败，调用 onError
    ElMessage.error('文件上传失败，请重试'); // 显示错误消息
  });
}
// 删除PDF文件的函数
function deletePdf(index) {
  // 获取要删除的文件信息
  const procedure = procedures.value[index];
  if (!procedure) {
    ElMessage.error('文件信息不存在');
    return;
  }

  // 在tmp数组中找到对应的完整路径
  const filePath = tmp.value.find(path => path.includes(procedure.filename));
  if (!filePath) {
    ElMessage.error('文件路径不存在');
    return;
  }
  console.log("要删除的文件路径为：" + filePath);
  // let filepath ="/files/" + filePath.split("/").pop();
  console.log("要删除的文件路径为：" + filePath);
  // 构造请求参数
  const params = new URLSearchParams();
  params.append('file_address', filePath); // 使用找到的完整路径作为参数

  // 发送删除请求
  axios.post(baseurl + '/delete_operation_procedure_and_compare_plan', params, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  .then(response => {
    // 检查响应是否成功
    if (response && response.data ) {
      // 成功删除后，从列表中移除该文件
      procedures.value.splice(index, 1);
      tmp.value = tmp.value.filter(path => path !== filePath); // 同时从tmp数组中移除对应的路径
      ElMessage.success('文件删除成功');
    } else {
      // 后端返回的响应不包含预期的成功标识
      ElMessage.error('删除失败：后端返回未知错误');
    }
  })
  .catch(error => {
    // 处理请求错误
    console.error('删除文件失败：', error);
    ElMessage.error('删除文件失败，请重试');
  });
}




function deleteComparison() {
  const filename = tmp_com.value;
  console.log("要删除的文件名为：" + filename);
  // 确认是否要删除文件

  if (!filename) {
    console.log("未找到文件");
    ElMessage.error('未找到文件');
    return;
  }

  // 从 URL 中提取文件路径并删除url前缀
  const filepath_ = decodeURIComponent(filename);
  const tmp = baseurl + "/files/";
  const filepathWithoutPrefix = filepath_.replace(tmp, "");

  new Promise((resolve, reject) => {
    const confirmed = confirm('此操作将永久删除该文件, 是否继续?');
    if (confirmed) {
      resolve(confirmed);
    } else {
      reject();
    }
  })
  .then(() => {
    // 发送删除请求
    axios({
      method: 'POST',
      url: baseurl + '/delete_operation_procedure_and_compare_plan',
      data: `file_address=${encodeURIComponent(filepath_)}`,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    .then(response => {
      if (response.data.code === 1 && response.data.data) {
        ElMessage.success('文件删除成功!');
        fetchProcedures();
      } else {
        ElMessage.error('删除文件失败: ' + response.data.description);
      }
    })
    .catch(error => {
      console.error('删除文件失败:', error);
      ElMessage.error('删除文件失败');
    });
  })
  .catch(() => {
    // 用户取消删除操作
    console.log('已取消删除');
  });
}
onMounted(() => {
  loadProjectId();
  fetchProcedures();
  fetchComparison();
});


const router = useRouter();

// menu 菜单
const activeIndex1 = ref('3');
const handleSelect1 = (key, keyPath) => {
  if (key.match('1')) router.push('/supportDetails/');
  if (key.match('2')) router.push('/machineSelect');
  if (key.match('4')) router.push('/p38');
  console.log(key, keyPath);
};

</script>  

  <style scoped>
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
  </style>