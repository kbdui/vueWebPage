<template>
  <div class="standard-details">
    <!-- Header Section -->
    <div class="header">
      <div id="top1">
          <!-- page header 页头 -->
          <el-page-header @back="goBack">
          <template #content>
              <span class="text-large font-600 mr-3">
              GB 19083-2003 4.1 医用防护口罩>基本要求
              </span>
          </template>
          </el-page-header>

          <!-- 头像框 -->
          <headshot></headshot>
      </div>

      <!-- Navigation Tabs -->
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

      <!-- Primary Notice -->
      <div class="notice-section">
        <p>若要检测本项目，可能要用到以下产品</p>
        <el-button id="m_leave" type="primary" plain>留言</el-button>
      </div>

      <!-- Equipment List Table -->
      <div class="equipment-table">
        <el-table :data="equipmentList" style="width: 100%">
          <el-table-column prop="name" label="Name" />
          <el-table-column label="操作" width="120" align="right">
            <template #default="scope">
              <el-button 
                type="primary" 
                @click="showDetails(scope.row)"
              >
                点击详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </div>

    <!-- Details Dialog -->
    <el-dialog
      v-model="detailsVisible"
      :title="selectedEquipment?.name"
      width="80%"
      destroy-on-close
    >
      <div class="equipment-details">
        <div class="equipment-grid">
          <div v-for="item in equipmentDetails" :key="item.id" class="equipment-card">
            <div class="equipment-image">
              设备照片
            </div>
            <div class="equipment-info">
              <div class="equipment-name">设备名称: {{ item.name }}</div>
              <div class="manufacturer">生产厂家: {{ item.manufacturer }}</div>
              <el-link 
                type="primary" 
                class="pdf-link"
                @click="viewPdf(item)"
              >
                设备详情(点击后查看设备详情.pdf)
              </el-link>
              <div class="quantity-section">
                <span>需求数量</span>
                <el-input-number 
                  v-model="item.quantity" 
                  :min="1"
                  size="small"
                />
              </div>
              <el-button 
                type="primary"
                @click="addToPreset(item)"
              >
                加入到预置清单
              </el-button>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <el-button 
            type="danger" 
            @click="detailsVisible = false"
          >
            关闭
          </el-button>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import headshot from './headshot.vue'
import { user_data } from '@/status'

const activeTab = ref('equipment')
const detailsVisible = ref(false)
const selectedEquipment = ref(null)
const router = useRouter()

    const activeIndex1 = ref('2')
    const handleSelect1 = (key: string, keyPath: string[]) => {
        if(key.match('1')) router.push('/details/')
        if(key.match('3')) router.push('/Regulations')
        if(key.match('4')) router.push('/sample')
        console.log(key, keyPath)
    }

const equipmentList = ref([
  { id: 1, name: '天平' },
  { id: 2, name: '酸度计' },
  { id: 3, name: '...' },
  { id: 4, name: '...' },
  { id: 5, name: '...' },
  { id: 6, name: '...' },
  { id: 7, name: '...' },
  { id: 8, name: '...' }
])

const equipmentDetails = ref([
  {
    id: 1,
    name: 'UID型天平',
    manufacturer: '107厂',
    quantity: 1
  },
  {
    id: 2,
    name: 'WDQ型天平',
    manufacturer: '107厂',
    quantity: 1
  },
  {
    id: 3,
    name: 'CKD型天平',
    manufacturer: '107厂',
    quantity: 1
  },
  {
    id: 4,
    name: 'XJK型天平',
    manufacturer: '107厂',
    quantity: 1
  }
])

const goBack = () => {
  router.push('/standard')
  console.log('go back')
}

const showDetails = (equipment) => {
  selectedEquipment.value = equipment
  detailsVisible.value = true
}

const viewPdf = (item) => {
  ElMessage.success(`查看${item.name}的PDF详情`)
}

const addToPreset = (item) => {
  ElMessage.success(`已将${item.name}添加到预置清单，数量：${item.quantity}`)
}
</script>

<style scoped>
.header {
  margin-bottom: 20px;
}

.back-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.title {
  font-size: 18px;
  margin: 0;
}

.notice-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
}

.notice-section p{
  margin-left: 1rem;
}

#m_leave{
  margin-right: 2rem;
}

.notice-button {
  width: 100%;
}

.equipment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.equipment-card {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 16px;
}

.equipment-image {
  background-color: #f5f7fa;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  color: #909399;
}

.equipment-info {
  display: grid;
  gap: 12px;
}

.equipment-name,
.manufacturer {
  color: #606266;
}

.pdf-link {
  color: #409EFF;
}

.quantity-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dialog-footer {
  text-align: center;
  margin-top: 20px;
}

:deep(.el-dialog__header) {
  margin-right: 0;
}

:deep(.el-dialog__body) {
  padding-top: 10px;
}

:deep(.el-input-number) {
  width: 120px;
}
</style>