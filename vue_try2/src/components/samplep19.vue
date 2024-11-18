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
      <el-tabs v-model="activeSubTab">
        <el-tab-pane label="清单" name="list"></el-tab-pane>
        <el-tab-pane label="预置清单" name="preset"></el-tab-pane>
      </el-tabs>
  
      <!-- List View -->
      <template v-if="activeSubTab === 'list'">
        <div class="list-items">
          <div v-for="item in listItems" :key="item.id" class="list-item">
            <div class="list-item-content">
              <div class="list-item-header">
                <div>清单编号：{{ item.id }}</div>
                <div>记录时间：{{ item.timestamp }}</div>
              </div>
              <div class="list-item-body">
                <div>计划申请物料：</div>
                <div v-for="(material, index) in item.materials" :key="index" class="material-item">
                  {{ material.name }} 我需要{{ material.quantity }}个
                </div>
                <div class="status-line">
                  状态：<span :class="['status', item.status.type]">{{ item.status.text }}</span>
                </div>
              </div>
              <div class="list-item-footer">
                <el-button 
                  type="danger" 
                  @click="handleDelete(item)"
                >
                  删除
                </el-button>
                <el-button 
                  type="primary" 
                  @click="handleDetails(item)"
                >
                  详情
                </el-button>
              </div>
            </div>
          </div>
        </div>
      </template>
  
      <!-- Preset List View -->
      <template v-if="activeSubTab === 'preset'">
        <el-table :data="presetListData" border style="width: 100%">
          <el-table-column prop="standardNo" label="标准编号" min-width="150" />
          <el-table-column prop="productName" label="产品名称" min-width="150" />
          <el-table-column prop="sampleName" label="样品名称" min-width="150" />
          <el-table-column prop="manufacturer" label="生产厂家" min-width="120">
            <template #default="scope">
              <span style="color: #0066FF">{{ scope.row.manufacturer }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="specModel" label="规格型号" min-width="120">
            <template #default="scope">
              {{ scope.row.specModel || '/' }}
            </template>
          </el-table-column>
          <el-table-column label="申请需求" min-width="120">
            <template #default="scope">
              我需要{{ scope.row.quantity }}个
            </template>
          </el-table-column>
          <el-table-column label="操作" width="200" fixed="right">
            <template #default="scope">
              <el-button
                type="primary"
                link
                @click="modifyPresetRequest(scope.row)"
              >
                修改需求
              </el-button>
              <el-button
                type="danger"
                link
                @click="deletePresetItem(scope.$index)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
        </el-table>
  
        <div class="warning-text" v-if="hasRequestStatus">
          如果有清单状态为:申请需求 则不能提交
        </div>
  
        <div class="bottom-actions">
          <el-button 
            type="primary" 
            @click="submitPresetList"
            :disabled="hasRequestStatus"
          >
            提交
          </el-button>
          <el-button 
            type="danger" 
            @click="clearPresetList"
          >
            清空
          </el-button>
        </div>
      </template>
  
      <!-- Details Dialog -->
      <el-dialog
        v-model="detailsDialogVisible"
        :title="''"
        width="80%"
        :show-close="false"
        destroy-on-close
      >
        <div v-if="selectedItem" class="details-dialog">
          <div class="dialog-header">
            <div>清单编号：{{ selectedItem.id }}</div>
            <div>记录时间：{{ selectedItem.timestamp }}</div>
          </div>
          <div class="status-section">
            状态：<span :class="['status', selectedItem.status.type]">
              {{ selectedItem.status.text }}
            </span>
          </div>
          
          <el-table :data="selectedItem.details" border style="width: 100%">
            <el-table-column prop="standardNo" label="标准编号" width="180" />
            <el-table-column prop="productName" label="产品名称" width="120" />
            <el-table-column prop="sampleName" label="样品名称" width="150" />
            <el-table-column prop="manufacturer" label="生产厂家" width="150" />
            <el-table-column prop="specModel" label="规格型号" width="100">
              <template #default="scope">
                {{ scope.row.specModel || '/' }}
              </template>
            </el-table-column>
            <el-table-column label="申请需求" width="120">
              <template #default="scope">
                要{{ scope.row.quantity }}个
              </template>
            </el-table-column>
            <el-table-column label="操作" width="200">
              <template #default="scope">
                <el-button
                  type="primary"
                  link
                  @click="modifyRequest(scope.row)"
                >
                  修改需求
                </el-button>
                <el-button
                  type="danger"
                  link
                  @click="deleteRequest(scope.row)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
  
          <div class="dialog-footer">
            <el-button 
              type="danger" 
              @click="detailsDialogVisible = false"
            >
              关闭
            </el-button>
          </div>
        </div>
      </el-dialog>
  
      <!-- Modify Request Dialog -->
      <el-dialog
        v-model="modifyDialogVisible"
        title="修改需求"
        width="30%"
      >
        <el-form>
          <el-form-item label="数量">
            <el-input-number 
              v-model="modifyQuantity" 
              :min="1" 
              :max="100"
            />
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="modifyDialogVisible = false">取消</el-button>
            <el-button type="primary" @click="confirmModify">
              确定
            </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  
  const activeMainTab = ref('sample')
  const activeSubTab = ref('list')
  const detailsDialogVisible = ref(false)
  const modifyDialogVisible = ref(false)
  const modifyQuantity = ref(1)
  const selectedItem = ref(null)
  const selectedRequest = ref(null)
  
  // List items data
  const listItems = ref([
    {
      id: '201123029432',
      timestamp: '2023.12.11 21:23:42',
      materials: [
        { name: '一次性普通口罩', quantity: 10 },
        { name: '一次性N95口罩', quantity: 5 }
      ],
      status: { text: '申请需求', type: 'pending' },
      details: [
        {
          standardNo: 'GB 19083-2023 4.1',
          productName: '酸度计',
          sampleName: 'WDJ型酸度计',
          manufacturer: 'Xxx公司厂',
          quantity: 10
        },
        {
          standardNo: 'GB 19083-2023 4.1',
          productName: '酸度计',
          sampleName: 'KIU型酸度计',
          manufacturer: 'Xxx公司厂',
          quantity: 20
        }
      ]
    },
    {
      id: '206849329432',
      timestamp: '2023.12.11 21:23:42',
      materials: [
        { name: '一次性普通口罩', quantity: 10 },
        { name: '一次性N95口罩', quantity: 10 }
      ],
      status: { text: '已发放', type: 'completed' },
      details: [
        {
          standardNo: 'GB 19083-2023 4.1',
          productName: '酸度计',
          sampleName: 'WDJ型酸度计',
          manufacturer: 'Xxx公司厂',
          quantity: 10
        }
      ]
    }
  ])
  
  // Preset list data
  const presetListData = ref([
    {
      standardNo: 'GB 19083-2023',
      productName: '医用防护口罩',
      sampleName: '一次性N95口罩',
      manufacturer: '107厂',
      specModel: '/',
      quantity: 10,
      status: '申请需求'
    },
    {
      standardNo: 'GB 19083-2023',
      productName: '医用防护口罩',
      sampleName: '一次性普通口罩',
      manufacturer: '107厂',
      specModel: '/',
      quantity: 10,
      status: '申请需求'
    },
    {
      standardNo: 'GB 19083-2023',
      productName: '医用防护口罩',
      sampleName: '一次性N75口罩',
      manufacturer: '107厂',
      specModel: '/',
      quantity: 10,
      status: '申请需求'
    },
    {
      standardNo: 'GB 19083-2023',
      productName: '医用防护口罩',
      sampleName: '一次性N95口罩',
      manufacturer: '113厂',
      specModel: '/',
      quantity: 10,
      status: '申请需求'
    }
  ])
  
  const hasRequestStatus = computed(() => {
    return presetListData.value.some(item => item.status === '申请需求')
  })
  
  // List view functions
  const handleDelete = (item) => {
    ElMessageBox.confirm(
      '确定要删除该清单吗？',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(() => {
      const index = listItems.value.findIndex(i => i.id === item.id)
      if (index !== -1) {
        listItems.value.splice(index, 1)
        ElMessage.success('删除成功')
      }
    }).catch(() => {
      ElMessage.info('已取消删除')
    })
  }
  
  const handleDetails = (item) => {
    selectedItem.value = item
    detailsDialogVisible.value = true
  }
  
  // Details dialog functions
  const modifyRequest = (row) => {
    selectedRequest.value = row
    modifyQuantity.value = row.quantity
    modifyDialogVisible.value = true
  }
  
  const deleteRequest = (row) => {
    ElMessageBox.confirm(
      '确定要删除该需求吗？',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(() => {
      const index = selectedItem.value.details.indexOf(row)
      if (index !== -1) {
        selectedItem.value.details.splice(index, 1)
        ElMessage.success('删除成功')
      }
    }).catch(() => {
      ElMessage.info('已取消删除')
    })
  }
  
  // Preset list functions
  const modifyPresetRequest = (row) => {
    selectedRequest.value = row
    modifyQuantity.value = row.quantity
    modifyDialogVisible.value = true
  }
  
  const deletePresetItem = (index) => {
    ElMessageBox.confirm(
      '确定要删除该项目吗？',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(() => {
      presetListData.value.splice(index, 1)
      ElMessage.success('删除成功')
    }).catch(() => {
      ElMessage.info('已取消删除')
    })
  }
  
  const submitPresetList = () => {
    if (hasRequestStatus.value) {
      ElMessage.warning('存在申请需求状态的项目，无法提交')
      return
    }
    ElMessageBox.confirm(
      '确定要提交预置清单吗？',
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
    if (presetListData.value.length === 0) {
      ElMessage.warning('清单已经为空')
      return
    }
    ElMessageBox.confirm(
      '确定要清空预置清单吗？',
      '警告',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    ).then(() => {
      presetListData.value = []
      ElMessage.success('清单已清空')
    })
  }
  
  const confirmModify = () => {
    if (selectedRequest.value) {
      selectedRequest.value.quantity = modifyQuantity.value
      modifyDialogVisible.value = false
      ElMessage.success('修改成功')
    }
  }
  </script>
  
  <style scoped>
  .purchase-management {
    padding: 20px;
  }
  
  .list-container {
    margin-top: 20px;
  }
  
  .list-item {
    border: 1px solid #EBEEF5;
    border-radius: 4px;
    margin-bottom: 16px;
    background-color: #fff;
  }
  
  .list-item-content {
    padding: 16px;
  }
  
  .list-item-header {
    display: flex;
    justify-content: space-between;
    color: #606266;
    font-size: 14px;
    margin-bottom: 12px;
  }
  
  .list-item-body {
    margin-bottom: 16px;
  }
  
  .material-item {
    margin-left: 20px;
    margin-bottom: 4px;
    color: #606266;
  }
  
  .status-line {
    margin-top: 8px;
  }
  
  .status {
    font-weight: bold;
  }
  
  .status.pending {
    color: #409EFF;
  }
  
  .status.completed {
    color: #67C23A;
  }
  
  .list-item-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
  
  .details-dialog {
    padding: 0 20px;
  }
  
  .dialog-header {
    margin-bottom: 16px;
    font-size: 14px;
    color: #606266;
  }
  
  .status-section {
    margin-bottom: 20px;
    font-size: 14px;
  }
  
  .dialog-footer {
    margin-top: 20px;
    text-align: center;
  }
  
  .warning-text {
    color: #F56C6C;
    margin: 20px 0;
    text-align: center;
  }
  
  .bottom-actions {
    margin-top: 20px;
    display: flex;
    justify-content: center;
    gap: 20px;
  }
  
  :deep(.el-dialog__header) {
    display: none;
  }
  
  :deep(.el-dialog__body) {
    padding: 20px 0;
  }
  
  :deep(.el-table) {
    margin-top: 20px;
  }
  
  :deep(.el-button--link) {
    padding: 4px 8px;
  }
  
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
  }
  </style>