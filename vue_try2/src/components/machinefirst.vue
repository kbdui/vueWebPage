<template>
  <div class="standard-details">
    <!-- Header Section -->
    <div class="header">
      <div class="back-section">
        <el-button link @click="goBack">
          <el-icon><ArrowLeft /></el-icon>
          Back
        </el-button>
        <h1 class="title">GB 19083-2003 4.1 医用防护口罩>基本要求</h1>
      </div>

      <!-- Navigation Tabs -->
      <el-tabs v-model="activeTab">
        <el-tab-pane label="人员" name="personnel" />
        <el-tab-pane label="设备" name="equipment" />
        <el-tab-pane label="规程" name="procedure" />
        <el-tab-pane label="样品" name="sample" />
      </el-tabs>

      <!-- Primary Notice -->
      <div class="notice-section">
        <el-button type="primary" class="notice-button">
          若要检测本项目，可能要用到以下产品
        </el-button>
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

<script setup>
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { ArrowLeft } from '@element-plus/icons-vue'

const activeTab = ref('equipment')
const detailsVisible = ref(false)
const selectedEquipment = ref(null)

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
  ElMessage.success('返回上一页')
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
.standard-details {
  padding: 20px;
}

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
  margin: 20px 0;
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