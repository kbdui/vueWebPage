<template>
  <div class="purchase-management">
    <!-- Main Navigation -->
    <el-tabs v-model="activeMainTab">
      <el-tab-pane label="人员" name="personnel"></el-tab-pane>
      <el-tab-pane label="设备" name="equipment"></el-tab-pane>
      <el-tab-pane label="规程" name="procedure"></el-tab-pane>
      <el-tab-pane label="样品" name="sample"></el-tab-pane>
    </el-tabs>

    <!-- Sub Navigation -->
    <el-tabs v-model="activeSubTab" @tab-click="handleSubTabClick">
      <el-tab-pane label="清单" name="list"></el-tab-pane>
      <el-tab-pane label="预置清单" name="preset"></el-tab-pane>
    </el-tabs>

    <!-- Export Button -->
    <el-button 
      v-if="activeSubTab === 'list'"
      type="success" 
      class="export-btn"
    >
      导出清单
    </el-button>

    <!-- Preset List View -->
    <template v-if="activeSubTab === 'preset'">
      <el-table :data="presetTableData" border style="width: 100%" class="mb-4">
        <el-table-column prop="standardNo" label="标准编号" min-width="180" />
        <el-table-column prop="category" label="器械品类" min-width="120" />
        <el-table-column prop="name" label="设备名称" min-width="150" />
        <el-table-column prop="manufacturer" label="生产厂家" min-width="150" />
        <el-table-column label="设备详情" width="100" align="center">
          <template #default="scope">
            <el-link type="primary" @click="showDetails(scope.row)">详情</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="购买数量" width="100" align="center" />
        <el-table-column label="操作" width="200" align="center">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="modifyQuantity(scope.row)"
            >
              修改数量
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="deletePresetItem(scope.$index)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="bottom-buttons">
        <el-button type="primary" @click="submitPresetList">提交</el-button>
        <el-button type="danger" @click="clearPresetList">清空</el-button>
      </div>
    </template>

    <!-- List View -->
    <template v-else>
      <div class="list-items">
        <el-card v-for="item in listItems" :key="item.id" class="mb-4">
          <div class="list-item-content">
            <div class="item-header">
              <div>清单编号：{{ item.id }}</div>
              <div>记录时间：{{ item.timestamp }}</div>
            </div>
            <div class="item-details">
              <div>计划采购设备：</div>
              <div v-for="(equipment, index) in item.equipments" :key="index" class="ml-4">
                {{ equipment }}
              </div>
              <div class="item-status">
                状态：<span :class="{ 'status-completed': item.status === '购置完成' }">
                  {{ item.status }}
                </span>
              </div>
            </div>
            <div class="item-actions">
              <el-button type="danger" @click="deleteListItem(item.id)">删除</el-button>
              <el-button type="primary" @click="showListDetails(item)">详情</el-button>
            </div>
          </div>
        </el-card>
      </div>
    </template>

    <!-- Details Dialog -->
    <el-dialog
      v-model="detailsDialogVisible"
      :title="'清单详情'"
      width="80%"
      :before-close="handleDialogClose"
    >
      <div class="list-header mb-4">
        <div>清单编号：{{ selectedItem?.id }}</div>
        <div>记录时间：{{ selectedItem?.timestamp }}</div>
      </div>

      <div class="status-section mb-4">
        <span>状态：</span>
        <span class="status">{{ selectedItem?.status || '计划采购' }}</span>
      </div>

      <el-table :data="detailsTableData" border style="width: 100%">
        <el-table-column prop="standardNo" label="标准编号及条款号" width="180" />
        <el-table-column prop="category" label="器械品类" width="120" />
        <el-table-column prop="name" label="设备名称" width="150" />
        <el-table-column prop="manufacturer" label="生产厂家" width="150" />
        <el-table-column label="设备详情" width="100">
          <template #default="scope">
            <el-link type="primary" @click="showEquipmentDetails(scope.row)">详情</el-link>
          </template>
        </el-table-column>
        <el-table-column prop="quantity" label="购买数量" width="100" />
        <el-table-column label="操作" width="200">
          <template #default="scope">
            <el-link type="primary" class="mr-4" @click="modifyQuantityInDetails(scope.row)">
              修改数量
            </el-link>
            <el-link type="danger" @click="deleteEquipmentInDetails(scope.$index)">
              删除
            </el-link>
          </template>
        </el-table-column>
      </el-table>

      <template #footer>
        <span class="dialog-footer">
          <el-button type="danger" @click="detailsDialogVisible = false">关闭</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- Modify Quantity Dialog -->
    <el-dialog
      v-model="quantityDialogVisible"
      title="修改数量"
      width="30%"
    >
      <el-form>
        <el-form-item label="数量">
          <el-input-number v-model="newQuantity" :min="1" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="quantityDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="confirmQuantityModification">
            确定
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const activeMainTab = ref('equipment')
const activeSubTab = ref('list')
const detailsDialogVisible = ref(false)
const quantityDialogVisible = ref(false)
const newQuantity = ref(1)
const selectedRow = ref(null)
const selectedItem = ref(null)
const detailsTableData = ref([])

// Preset list data
const presetTableData = ref([
  {
    standardNo: 'GB 19083-2023 4.1',
    category: '酸度计',
    name: 'WDJ型酸度计',
    manufacturer: 'Xxx公司厂',
    quantity: 10
  },
  {
    standardNo: 'GB 19083-2023 4.1',
    category: '酸度计',
    name: 'WDJ型酸度计',
    manufacturer: 'Xxx公司厂',
    quantity: 10
  }
])

// List items data
const listItems = ref([
  {
    id: '201123029432',
    timestamp: '2023.10.12 23:11:23',
    status: '计划采购',
    equipments: [
      'UIO型酸度计 x10',
      'XCJ型天平 x5'
    ],
    details: [
      {
        standardNo: 'GB 19083-2023 4.1',
        category: '酸度计',
        name: 'UIO型酸度计',
        manufacturer: 'Xxx公司厂',
        quantity: 10
      },
      {
        standardNo: 'GB 19083-2023 4.2',
        category: '天平',
        name: 'XCJ型天平',
        manufacturer: 'Xxx公司厂',
        quantity: 5
      }
    ]
  },
  {
    id: '206849329432',
    timestamp: '2023.10.12 23:11:23',
    status: '购置完成',
    equipments: [
      'IFU型酸度计 x10',
      'XJD型酸度计 x5'
    ],
    details: [
      {
        standardNo: 'GB 19083-2023 4.1',
        category: '酸度计',
        name: 'IFU型酸度计',
        manufacturer: 'Xxx公司厂',
        quantity: 10
      },
      {
        standardNo: 'GB 19083-2023 4.1',
        category: '酸度计',
        name: 'XJD型酸度计',
        manufacturer: 'Xxx公司厂',
        quantity: 5
      }
    ]
  }
])

const handleSubTabClick = (tab) => {
  // Handle tab switch if needed
}

const showDetails = (row) => {
  selectedItem.value = { status: '计划采购' }
  detailsTableData.value = [row]
  detailsDialogVisible.value = true
}

const showListDetails = (item) => {
  selectedItem.value = item
  detailsTableData.value = item.details
  detailsDialogVisible.value = true
}

const handleDialogClose = (done) => {
  done()
}

const modifyQuantity = (row) => {
  selectedRow.value = row
  newQuantity.value = row.quantity
  quantityDialogVisible.value = true
}

const modifyQuantityInDetails = (row) => {
  selectedRow.value = row
  newQuantity.value = row.quantity
  quantityDialogVisible.value = true
}

const confirmQuantityModification = () => {
  if (selectedRow.value) {
    selectedRow.value.quantity = newQuantity.value
    quantityDialogVisible.value = false
    ElMessage.success('数量修改成功')
  }
}

const deletePresetItem = (index) => {
  ElMessageBox.confirm(
    '确认删除该设备？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    presetTableData.value.splice(index, 1)
    ElMessage.success('删除成功')
  })
}

const deleteEquipmentInDetails = (index) => {
  ElMessageBox.confirm(
    '确认删除该设备？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    detailsTableData.value.splice(index, 1)
    // Update the equipments list in the main view if needed
    if (selectedItem.value) {
      const item = listItems.value.find(i => i.id === selectedItem.value.id)
      if (item) {
        item.details = detailsTableData.value
        item.equipments = detailsTableData.value.map(
          d => `${d.name} x${d.quantity}`
        )
      }
    }
    ElMessage.success('删除成功')
  })
}

const deleteListItem = (id) => {
  ElMessageBox.confirm(
    '确认删除该清单？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    listItems.value = listItems.value.filter(item => item.id !== id)
    ElMessage.success('删除成功')
  })
}

const showEquipmentDetails = (equipment) => {
  ElMessage.info('查看设备详情：' + equipment.name)
}

const submitPresetList = () => {
  if (presetTableData.value.length === 0) {
    ElMessage.warning('清单为空，无法提交')
    return
  }
  ElMessageBox.confirm(
    '确认提交预置清单？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'info',
    }
  ).then(() => {
    ElMessage.success('提交成功')
  })
}

const clearPresetList = () => {
  if (presetTableData.value.length === 0) {
    ElMessage.warning('清单已经为空')
    return
  }
  ElMessageBox.confirm(
    '确认清空预置清单？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    presetTableData.value = []
    ElMessage.success('清单已清空')
  })
}
</script>

<style scoped>
.purchase-management {
  padding: 20px;
}

.export-btn {
  margin-bottom: 20px;
}

.mb-4 {
  margin-bottom: 16px;
}

.ml-4 {
  margin-left: 16px;
}

.mr-4 {
  margin-right: 16px;
}

.list-item-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item-header {
  color: #666;
  font-size: 14px;
}

.item-details {
  font-size: 14px;
}

.item-actions {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.status-completed {
  color: #67C23A;
}

.bottom-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.list-header {
  color: #666;
  font-size: 14px;
}

.status-section {
  font-size: 14px;
}

.status {
  color: #409EFF;
}

:deep(.el-table) {
  margin-bottom: 20px;
}

:deep(.el-button--small) {
  margin: 0 5px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
}
</style>