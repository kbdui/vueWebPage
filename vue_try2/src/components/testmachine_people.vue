<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <router-link to="/" class="text-blue-600 hover:text-blue-800">首页</router-link>
        
        <!-- User Avatar and Dropdown -->
        <el-popover
          placement="bottom-end"
          :width="300"
          trigger="hover"
          popper-class="user-popover"
        >
          <template #reference>
            <el-avatar 
              :size="40" 
              :src="user.avatar" 
              @error="errorHandler"
              class="cursor-pointer"
            >
              <el-icon><User /></el-icon>
            </el-avatar>
          </template>
          <div class="p-4">
            <h3 class="text-lg font-semibold">{{ user.name }}</h3>
            <p class="text-sm text-gray-500">@{{ user.username }}</p>
            <p class="text-sm text-gray-500">{{ user.organization }}</p>
            <p class="text-sm text-gray-500">{{ user.contact }}</p>
            <el-button type="danger" class="mt-4 w-full" @click="handleLogout">
              退出登录
            </el-button>
          </div>
        </el-popover>
      </div>
    </header>

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 class="text-2xl font-semibold text-gray-900 mb-2">GB 19083-2003 4.1</h1>
      <h2 class="text-xl text-gray-700 mb-6">医用防护口罩>基本要求</h2>

      <!-- Tabs -->
      <el-tabs class="mb-6">
        <el-tab-pane label="人员"></el-tab-pane>
        <el-tab-pane label="设备" name="equipment"></el-tab-pane>
        <el-tab-pane label="规程"></el-tab-pane>
        <el-tab-pane label="样品"></el-tab-pane>
      </el-tabs>

      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex justify-between items-center mb-4">
          <p class="text-gray-600">(6/10) 若要检测本项目，可能用到以下设备</p>
          <el-button type="primary" @click="showAddDialog">
            添加记录
          </el-button>
        </div>

        <!-- Table -->
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="type" label="器械品类" min-width="70%">
          </el-table-column>
          <el-table-column label="操作" min-width="30%">
            <template #default="scope">
              <el-button
                type="primary"
                size="small"
                @click="handleEdit(scope.$index, scope.row)"
              >
                编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- Edit Dialog -->
        <el-dialog
          v-model="editDialogVisible"
          :title="'编辑: ' + currentEquipment.type"
          width="80%"
          :close-on-click-modal="false"
        >
          <div class="grid grid-cols-2 gap-4">
            <div v-for="(item, index) in equipmentDetails" :key="index" class="border rounded-lg p-4">
              <el-upload
                class="upload-demo mb-4"
                action="#"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :before-remove="beforeRemove"
                :limit="1"
                :on-exceed="handleExceed"
                :on-success="(file) => handleImageSuccess(file, index)"
                :auto-upload="false"
              >
                <template #trigger>
                  <el-button size="small" type="primary">导入照片</el-button>
                </template>
                <template #tip>
                  <div class="el-upload__tip">
                    只能上传 jpg/png 文件，且不超过 500kb
                  </div>
                </template>
              </el-upload>
              <div v-if="item.imageUrl" class="mb-4">
                <img :src="item.imageUrl" alt="Equipment Image" class="w-full h-40 object-cover rounded" />
              </div>
              <el-form :model="item" label-width="100px">
                <el-form-item label="设备名称">
                  <el-input v-model="item.name"></el-input>
                </el-form-item>
                <el-form-item label="生产厂家">
                  <el-input v-model="item.manufacturer"></el-input>
                </el-form-item>
              </el-form>
              <div class="flex items-center justify-between mt-4">
                <a :href="item.pdfUrl" target="_blank" class="text-blue-600 hover:underline" v-if="item.pdfUrl">设备详情</a>
                <el-upload
                  class="upload-demo"
                  action="#"
                  :on-success="(file) => handlePdfSuccess(file, index)"
                  :auto-upload="false"
                >
                  <el-button size="small" type="primary">导入设备详情pdf</el-button>
                </el-upload>
              </div>
              <div class="text-right mt-4">
                <el-button type="primary" size="small" @click="editCard(index)">编辑</el-button>
              </div>
            </div>
          </div>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="editDialogVisible = false">关闭</el-button>
              <el-button type="primary" @click="handleSave">
                保存
              </el-button>
            </span>
          </template>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { User } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

// 响应式变量，控制编辑对话框的显示
const editDialogVisible = ref(false)
// 响应式变量，存储当前编辑的设备信息
const currentEquipment = ref({})

// 响应式变量，存储设备详细信息数组
const equipmentDetails = ref([
  { imageUrl: '', name: '', manufacturer: '', pdfUrl: '' },
  { imageUrl: '', name: '', manufacturer: '', pdfUrl: '' },
  { imageUrl: '', name: '', manufacturer: '', pdfUrl: '' },
  { imageUrl: '', name: '', manufacturer: '', pdfUrl: '' }
])

// 响应式变量，存储表格数据
const tableData = ref([
  { type: '天平', name: 'UID型天平', manufacturer: '107厂' },
  { type: '酸度计', name: '', manufacturer: '' }
])

// 显示添加对话框的方法
const showAddDialog = () => {
  currentEquipment.value = { type: '', name: '', manufacturer: '' }
  resetEquipmentDetails()
  editDialogVisible.value = true
}

// 处理编辑按钮点击事件的方法
const handleEdit = (index, row) => {
  currentEquipment.value = { ...row }
  equipmentDetails.value = equipmentDetails.value.map(() => ({
    imageUrl: '',
    name: '',
    manufacturer: '',
    pdfUrl: ''
  }))
  editDialogVisible.value = true
}

// 重置设备详细信息的方法
const resetEquipmentDetails = () => {
  equipmentDetails.value = equipmentDetails.value.map(() => ({ imageUrl: '', name: '', manufacturer: '', pdfUrl: '' }))
}

// 保存编辑内容的方法
const handleSave = () => {
  if (currentEquipment.value.type) {
    const index = tableData.value.findIndex(item => item.type === currentEquipment.value.type)
    if (index > -1) {
      tableData.value[index] = { ...currentEquipment.value }
    } else {
      tableData.value.push({ ...currentEquipment.value })
    }
    editDialogVisible.value = false
    ElMessage.success('保存成功')
  } else {
    ElMessage.error('请填写完整信息')
  }
}

// 文件移除前的钩子
const handleRemove = (file, fileList) => {
  console.log(file, fileList)
}

// 文件预览的钩子
const handlePreview = (file) => {
  console.log(file)
}

// 文件超出限制的钩子
const handleExceed = (files, fileList) => {
  ElMessage.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`)
}

// 文件移除前的确认
const beforeRemove = (file, fileList) => {
  return ElMessageBox.confirm(`确定移除 ${file.name}？`)
}

// 图片上传成功的处理
const handleImageSuccess = (file, index) => {
  equipmentDetails.value[index].imageUrl = URL.createObjectURL(file.raw)
}

// PDF上传成功的处理
const handlePdfSuccess = (file, index) => {
  equipmentDetails.value[index].pdfUrl = URL.createObjectURL(file.raw)
}

// 编辑卡片的方法
const editCard = (index) => {
  ElMessage.info(`编辑卡片 ${index + 1}`)
}

// 用户信息的响应式变量
const user = ref({
  name: '张三',
  username: 'zhangsan',
  organization: 'ABC 公司',
  contact: 'zhangsan@example.com',
  avatar: '/placeholder.svg?height=40&width=40'
})

// 头像加载失败的处理
const errorHandler = () => {
  // 如果头像加载失败，使用用户图标作为备选
}

// 处理退出登录的方法
const handleLogout = () => {
  ElMessage.success('退出登录成功')
  // 实际的退出登录逻辑应在这里实现
}
</script>

<style scoped> 
.el-tabs { --el-tabs-header-height: 40px; }
 .user-popover { padding: 0; }
 </style>