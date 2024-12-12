<template>
    <div class="container">
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

      <!-- Content Section -->
      <div class="content-section">
        <div class="section-header">
          <!-- <h4>检测</h4>
          <h3 class="green-text">GB 19083-2003 医用防护口罩</h3>
          <p>可能需要以下样品</p> -->
          <el-button type="success" style="font-size: 16px;"  @click="openDialog()">添加</el-button>
        </div>
  
        <!-- Table -->
        <el-table :data="sampleList" style="width: 100%">
          <el-table-column prop="sampleid" label="样品ID">
            <template #default="scope">
              {{ scope.row.sampleid || '/' }}
            </template>
          </el-table-column>

          <el-table-column prop="source" label="生产厂家">
            <template #default="scope">
              {{ scope.row.source || '/' }}
            </template>
          </el-table-column>

          <el-table-column prop="samplename" label="样品名称">
            <template #default="scope">
              {{ scope.row.samplename || '/' }}
            </template>
          </el-table-column>

          <el-table-column prop="model" label="型号规格">
            <template #default="scope">
              {{ scope.row.model || '/' }}
            </template>
          </el-table-column>

          <el-table-column prop="typename" label="类型">
            <template #default="scope">
              {{ scope.row.typename || '/' }}
            </template>
          </el-table-column>
          
          <el-table-column label="操作" width="180">
            <template #default="scope">
              <!-- <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button> -->
              <el-button type="text" @click="deleteSample(scope.row.sampleid, scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
  
        <!-- Add/Edit Dialog -->
        <el-dialog
          v-model="dialogVisible"
          :title="isEditing ? '编辑样品' : '添加样品'"
          width="500px"
          :close-on-click-modal="false"
        >
          <el-form :model="form" label-width="120px">
            <el-form-item label="标准编号">
              <el-input v-model="form.number" />
            </el-form-item>
            <el-form-item label="产品名称">
              <el-input v-model="form.type_name" />
            </el-form-item>
            <el-form-item label="样品名称">
              <el-input v-model="form.name" />
            </el-form-item>
            <el-form-item label="规格型号">
              <el-input v-model="form.model" />
            </el-form-item>
            <el-form-item label="生产厂家">
              <el-input v-model="form.source" />
            </el-form-item>
  
            <!-- Specifications Table这是一个编辑按钮会用到的 -->
            <!-- <div class="specs-table" v-if="form.specifications.length > 0">
              <el-table :data="form.specifications" style="width: 100%">
                <el-table-column prop="value" label="型号" width="180" />
                <el-table-column label="操作">
                  <template #default="scope">
                    <el-button 
                      type="text" 
                      @click="removeSpecification(scope.$index)"
                      class="delete-btn"
                    >
                      删除
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </div> -->
          </el-form>
          
          <template #footer>
            <span class="dialog-footer">
              <el-button type="success" @click="addSample()">{{ isEditing ? '保存' : '添加' }}</el-button>
              <el-button type="danger" @click="dialogVisible = false">取消</el-button>
            </span>
          </template>
        </el-dialog>
      </div>
    </div>
  </template>
  
  <script lang="ts" setup>
  import { ref,onMounted, inject } from 'vue'
  import { useRouter } from 'vue-router'
  import TopMessage from './son_components/topMessage.vue'
  import axios from 'axios'
  import { ElMessage } from 'element-plus'
  import { project_id } from '@/status'

  const router = useRouter()
  const baseurl = inject('baseurl')

  // menu 菜单
  const activeIndex1 = ref('4')
  const handleSelect1 = (key: string, keyPath: string[]) => {
      if(key.match('1')) router.push('/supportDetails/')
      if(key.match('2')) router.push('/machineSelect')
      if(key.match('3')) router.push('/supprotp36')
      console.log(key, keyPath)
  }

  const dialogVisible = ref(false)
  const isEditing = ref(false)
  const editingIndex = ref(-1)
  const form = ref({
    number: '',
    type_name: '',
    name: '',
    model: '',
    source: '',
  })
  
  // const tableData = ref([
  //   {
  //     standardName: '医用防护口罩',
  //     standardNumber: 'GB 19083-2023',
  //     productName: '医用防护口罩',
  //     sampleName: '普通口罩',
  //     manufacturer: '107厂',
  //     specifications: '180'
  //   },
  //   {
  //     standardName: '医用防护口罩',
  //     standardNumber: 'GB 19083-2023',
  //     productName: '医用防护口罩',
  //     sampleName: '普通口罩',
  //     manufacturer: '113厂',
  //     specifications: '170'
  //   }
  // ])
  
  const openDialog = () => {
    isEditing.value = false
    editingIndex.value = -1
    resetForm()
    dialogVisible.value = true
  }
  
  // const handleEdit = (row) => {
  //   isEditing.value = true
  //   editingIndex.value = tableData.value.indexOf(row)
  //   form.value = {
  //     productName: row.productName,
  //     sampleName: row.sampleName,
  //     manufacturer: row.manufacturer,
  //     currentSpec: '',
  //     specifications: [{ value: row.specifications }]
  //   }
  //   dialogVisible.value = true
  // }
  
  // const handleDelete = (row) => {
  //   const index = tableData.value.indexOf(row)
  //   tableData.value.splice(index, 1)
  // }
  
  // const addSpecification = () => {
  //   if (form.value.currentSpec.trim()) {
  //     form.value.specifications.push({
  //       value: form.value.currentSpec
  //     })
  //     form.value.currentSpec = ''
  //   }
  // }
  
  // const removeSpecification = (index) => {
  //   form.value.specifications.splice(index, 1)
  // }
  
  
  const resetForm = () => {
    form.value = {
      number: '',
      type_name: '',
      name: '',
      model: '',
      source: ''
    }
  }

  // 添加样品
  function addSample() {
    const validations = {
      number: '请填写标准编号',
      type_name: '请填写产品名称',
      name: '请填写样品名称',
      model: '请填写规格型号',
      source: '请填写生产厂家'
    };

    for (const [key, message] of Object.entries(validations)) {
      if (form.value[key] === '') {
        ElMessage.error(message);
        return;
      }
    }

    axios.post(baseurl + '/add_sample', {
      number: form.value.number,
      type_name: form.value.type_name,
      name: form.value.name,
      model: form.value.model,
      source: form.value.source
    },{
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(function (response){
      if(response.data.data == true) ElMessage.success('添加样品成功')
      else ElMessage.error('添加样品失败')
    }).catch(function (error){
      if (error.response) {
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // `error.request` 在浏览器中是 XMLHttpRequest 的实例，
        // 而在node.js中是 http.ClientRequest 的实例
        console.log(error.request);
      } else {
        // 发送请求时出了点问题
        console.log('Error', error.message);
      }
      console.log(error.config)
      ElMessage.error('添加样品失败')
    })
    dialogVisible.value = false
  }

  // 删除样品
  function deleteSample(sample_id : string, index : number) {
    sampleList.value.splice(index, 1)
    axios.post(baseurl + '/del_sample', {
      sample_id: sample_id
    },{
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(function (response){
      if(response.data.data == true) ElMessage.success('删除样品成功')
      else ElMessage.error('删除样品失败')
    }).catch(function (error){
      if (error.response) {
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // `error.request` 在浏览器中是 XMLHttpRequest 的实例，
        // 而在node.js中是 http.ClientRequest 的实例
        console.log(error.request);
      } else {
        // 发送请求时出了点问题
        console.log('Error', error.message);
      }
      console.log(error.config)
      ElMessage.error('删除样品失败')
    })
  }

  // 通过项目ID获取样品列表
  const sampleList = ref([])
  function getSampleList() {
    axios.post(baseurl + '/get_sample_by_id', {
      project_id: project_id.value
    },{
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(function (response){
      sampleList.value = response.data.data
    }).catch(function (error){
      if (error.response) {
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // `error.request` 在浏览器中是 XMLHttpRequest 的实例，
        // 而在node.js中是 http.ClientRequest 的实例
        console.log(error.request);
      } else {
        // 发送请求时出了点问题
        console.log('Error', error.message);
      }
      console.log(error.config)
      ElMessage.error('获取样品列表失败')
    })
  } 

  // 加载project_id和sampleNumber
  function loadData() {
      const projectId = localStorage.getItem('project_id')
      if (projectId) project_id.value = JSON.parse(projectId)
  }

  // 挂载组件时执行的方法
  onMounted(() => {
      loadData()
      getSampleList()
  })

  </script>
  
  <style scoped>
  .title {
    font-size: 24px;
    margin-bottom: 8px;
  }
  
  .subtitle {
    font-size: 20px;
    margin-bottom: 20px;
  }
  
  .nav-menu {
    margin-bottom: 30px;
  }
  
  .nav-link {
    margin-right: 20px;
    font-size: 16px;
    color: #409EFF;
    text-decoration: none;
  }
  
  .nav-link.current {
    color: #333;
    cursor: default;
  }
  
  .content-section {
    background-color: #fff;
    padding: 20px;
  }
  
  .section-header {
    margin-bottom: 20px;
  }
  
  .green-text {
    color: #67C23A;
    margin: 10px 0;
  }
  
  .specs-table {
    margin-top: 20px;
    margin-bottom: 20px;
  }
  
  .delete-btn {
    color: #F56C6C;
  }
  
  .delete-btn:hover {
    color: #f89898;
  }
  
  .dialog-footer {
    display: flex;
    justify-content: center;
    gap: 20px;
  }
  
  :deep(.el-dialog) {
    border-radius: 8px;
  }
  
  :deep(.el-form-item:last-child) {
    margin-bottom: 0;
  }
  
  </style>