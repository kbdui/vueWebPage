<template>
    <div class="container">
    <Top/>
      <h2 class="title">GB 19083-2003 4.1</h2>
      <h3 class="subtitle">医用防护口罩>基本要求</h3>
      <el-divider content-position="left"></el-divider>
      <!-- Navigation -->
      <nav class="nav-menu">
        <router-link to="/personnel" class="nav-link">人员</router-link>
        <router-link to="/equipment" class="nav-link">设备</router-link>
        <router-link to="/procedures" class="nav-link">规程</router-link>
        <span class="nav-link current">样品</span>
      </nav>
      <el-divider content-position="left"></el-divider>
      <!-- Content Section -->
      <div class="content-section">
        <div class="section-header">
          <h4>检测</h4>
          <h3 class="green-text">GB 19083-2003 医用防护口罩</h3>
          <p>可能需要以下样品</p>
          <el-button type="success" style="font-size: 16px;"  @click="openDialog()">添加</el-button>
        </div>
  
        <!-- Table -->
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="standardName" label="标准名称" width="180" />
          <el-table-column prop="standardNumber" label="标准编号" width="180" />
          <el-table-column prop="productName" label="产品名称" width="180" />
          <el-table-column prop="sampleName" label="样品名称" width="180" />
          <el-table-column prop="manufacturer" label="生产厂家" width="180" />
          <el-table-column prop="specifications" label="型号规格" width="180" />
          <el-table-column label="操作" width="180">
            <template #default="scope">
              <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
              <el-button type="text" @click="handleDelete(scope.row)">删除</el-button>
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
            <el-form-item label="产品名称">
              <el-input v-model="form.productName" />
            </el-form-item>
            <el-form-item label="样品名称">
              <el-input v-model="form.sampleName" />
            </el-form-item>
            <el-form-item label="生产厂家">
              <el-input v-model="form.manufacturer" />
            </el-form-item>
            <el-form-item label="规格型号">
              <el-input v-model="form.currentSpec" style="width: calc(100% - 100px)" />
              <el-button 
                type="primary" 
                @click="addSpecification" 
                style="margin-left: 10px"
              >
                添加
              </el-button>
            </el-form-item>
  
            <!-- Specifications Table -->
            <div class="specs-table" v-if="form.specifications.length > 0">
              <el-table :data="form.specifications" border style="width: 100%">
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
            </div>
          </el-form>
          
          <template #footer>
            <span class="dialog-footer">
              <el-button type="success" @click="handleSubmit">{{ isEditing ? '保存' : '添加' }}</el-button>
              <el-button type="danger" @click="dialogVisible = false">取消</el-button>
            </span>
          </template>
        </el-dialog>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import Top from './Top.vue';
  const dialogVisible = ref(false)
  const isEditing = ref(false)
  const editingIndex = ref(-1)
  const form = ref({
    productName: '',
    sampleName: '',
    manufacturer: '',
    currentSpec: '',
    specifications: []
  })
  
  const tableData = ref([
    {
      standardName: '医用防护口罩',
      standardNumber: 'GB 19083-2023',
      productName: '医用防护口罩',
      sampleName: '普通口罩',
      manufacturer: '107厂',
      specifications: '180'
    },
    {
      standardName: '医用防护口罩',
      standardNumber: 'GB 19083-2023',
      productName: '医用防护口罩',
      sampleName: '普通口罩',
      manufacturer: '113厂',
      specifications: '170'
    }
  ])
  
  const openDialog = () => {
    isEditing.value = false
    editingIndex.value = -1
    resetForm()
    dialogVisible.value = true
  }
  
  const handleEdit = (row) => {
    isEditing.value = true
    editingIndex.value = tableData.value.indexOf(row)
    form.value = {
      productName: row.productName,
      sampleName: row.sampleName,
      manufacturer: row.manufacturer,
      currentSpec: '',
      specifications: [{ value: row.specifications }]
    }
    dialogVisible.value = true
  }
  
  const handleDelete = (row) => {
    const index = tableData.value.indexOf(row)
    tableData.value.splice(index, 1)
  }
  
  const addSpecification = () => {
    if (form.value.currentSpec.trim()) {
      form.value.specifications.push({
        value: form.value.currentSpec
      })
      form.value.currentSpec = ''
    }
  }
  
  const removeSpecification = (index) => {
    form.value.specifications.splice(index, 1)
  }
  
  const handleSubmit = () => {
    if (isEditing.value) {
      // Update existing entry
      if (form.value.specifications.length > 0) {
        tableData.value[editingIndex.value] = {
          ...tableData.value[editingIndex.value],
          productName: form.value.productName,
          sampleName: form.value.sampleName,
          manufacturer: form.value.manufacturer,
          specifications: form.value.specifications[0].value
        }
      }
    } else {
      // Add new entries
      form.value.specifications.forEach(spec => {
        tableData.value.push({
          standardName: '医用防护口罩',
          standardNumber: 'GB 19083-2023',
          productName: form.value.productName,
          sampleName: form.value.sampleName,
          manufacturer: form.value.manufacturer,
          specifications: spec.value
        })
      })
    }
    
    dialogVisible.value = false
    resetForm()
  }
  
  const resetForm = () => {
    form.value = {
      productName: '',
      sampleName: '',
      manufacturer: '',
      currentSpec: '',
      specifications: []
    }
  }
  </script>
  
  <style scoped>
  .container {
    padding: 20px;
  }
  
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