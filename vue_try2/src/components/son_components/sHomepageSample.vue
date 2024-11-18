<template>
    <el-tab-pane label="物料" name="materials">
        <!-- Export Button -->
        <div class="button-container">
            <el-button type="success" @click="exportToPDF">导出样品需求清单</el-button>
        </div>

        <!-- Request List -->
        <div class="request-list">
            <el-card v-for="(request, index) in sampleRequests" :key="index" class="request-card">
                <div class="request-info">
                <div>清单编号：{{ request.id }}</div>
                <div>记录时间：{{ request.date }}</div>
                <div>需求人：{{ request.requester }}</div>
                <div class="materials">
                    计划申请物料：
                    <div v-for="(item, itemIndex) in request.items" :key="itemIndex">
                    {{ item.name }} 我需要{{ item.quantity }}个
                    </div>
                    <div>......</div>
                </div>
                <div class="status">
                    状态：
                    <span class="status-text" :class="request.status === '已发放' ? 'released' : 'pending'">
                    {{ request.status }}
                    </span>
                </div>
                <div class="status-button" v-if="request.status === '已发放'">
                    <el-button type="success" size="small">已发放</el-button>
                </div>
                </div>
                <div class="action-buttons">
                    <el-button type="primary" size="small" @click="showDetails(request)">详情</el-button>
                    <el-button type="danger" size="small" @click="deleteRequest(request)">删除</el-button>
                </div>
            </el-card>
        </div>

        <!-- Details Dialog -->
        <el-dialog
        v-model="detailsVisible"
        :title="selectedRequest ? `清单详情` : ''"
        width="80%"
        class="details-dialog"
        :close-on-click-modal="true"
        >
            <template v-if="selectedRequest">
                <div class="details-header">
                <div>清单编号：{{ selectedRequest.id }}</div>
                <div>记录时间：{{ selectedRequest.date }}</div>
                <div>需求人：{{ selectedRequest.requester }}</div>
                <div class="status-line">
                    状态：<span class="status-text">{{ selectedRequest.status }}</span>
                </div>
                </div>
                
                <el-table :data="selectedRequest.detailItems" border style="width: 100%; margin-top: 20px">
                <el-table-column prop="standardCode" label="标准编号" width="180" />
                <el-table-column prop="productName" label="产品名称" width="150" />
                <el-table-column prop="sampleName" label="样品名称" width="150" />
                <el-table-column prop="manufacturer" label="生产厂家" width="150" />
                <el-table-column prop="specification" label="规格型号" width="120" />
                <el-table-column prop="requestQuantity" label="申请需求" width="120" />
                <el-table-column prop="actualQuantity" label="实际数量" width="120" />
                <el-table-column label="操作" width="120">
                    <template #default="scope">
                    <el-button
                        size="small"
                        @click="editActualQuantity(scope.$index, scope.row)"
                    >
                        编辑实际数量
                    </el-button>
                    </template>
                </el-table-column>
                </el-table>
            </template>

            <template #footer>
                <div class="dialog-footer">
                <el-button type="danger" @click="detailsVisible = false">关闭</el-button>
                </div>
            </template>
        </el-dialog>

        <el-dialog
        v-model="editQuantityVisible"
        title="编辑实际数量"
        width="30%"
        :close-on-click-modal="false"
        >
        <el-form :model="editingItem" label-width="100px">
            <el-form-item label="实际数量">
            <el-input-number v-model="editingItem.actualQuantity" :min="0" :max="1000"></el-input-number>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
            <el-button @click="editQuantityVisible = false">取消</el-button>
            <el-button type="primary" @click="saveActualQuantity">确定</el-button>
            </span>
        </template>
        </el-dialog>
    </el-tab-pane>
</template>

<script setup>
import { ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import html2pdf from 'html2pdf.js'
const detailsVisible = ref(false)
const editQuantityVisible = ref(false)
const selectedRequest = ref(null)
const editingItem = ref(null)
const editingIndex = ref(-1)

const sampleRequests = ref([
  {
    id: '20132453467',
    date: '2024.10.23 14:23:21',
    requester: '甲',
    status: '计划采购',
    items: [
      { name: '酸度计', quantity: 10 },
      { name: '天平', quantity: 30 }
    ],
    detailItems: [
      {
        standardCode: 'GB 19083-2023 4.1',
        productName: '酸度计',
        sampleName: 'WDJ型酸度计',
        manufacturer: 'Xxx公司/厂',
        specification: '/',
        requestQuantity: '要10个',
        actualQuantity: 10,
        operation: '编辑实际数量'
      },
      {
        standardCode: 'GB 19083-2023 4.1',
        productName: '酸度计',
        sampleName: 'KIU型酸度计',
        manufacturer: 'Xxx公司/厂',
        specification: '/',
        requestQuantity: '要20个',
        actualQuantity: 20,
        operation: '编辑实际数量'
      },
      {
        standardCode: 'GB 19083-2023 4.2',
        productName: '天平',
        sampleName: 'LIO型天平',
        manufacturer: 'Xxx公司/厂',
        specification: '/',
        requestQuantity: '要30个',
        actualQuantity: 30,
        operation: '编辑实际数量'
      }
    ]
  }
])

const showDetails = (request) => {
  selectedRequest.value = request
  detailsVisible.value = true
}

const deleteRequest = (request) => {
  ElMessageBox.confirm(`是否确定删除清单 ${request.id}?`, '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    const index = sampleRequests.value.indexOf(request)
    sampleRequests.value.splice(index, 1)
    ElMessage({
      type: 'success',
      message: '删除成功'
    })
  }).catch(() => {
    ElMessage({
      type: 'info',
      message: '已取消删除'
    })
  })
}

const exportToPDF = () => {
  const element = document.querySelector('.request-list')
  html2pdf()
    .from(element)
    .save('样品需求清单.pdf')
}

const editActualQuantity = (index, row) => {
  editingItem.value = { ...row }
  editingIndex.value = index
  editQuantityVisible.value = true
}

const saveActualQuantity = () => {
  if (selectedRequest.value && editingIndex.value !== -1) {
    selectedRequest.value.detailItems[editingIndex.value].actualQuantity = editingItem.value.actualQuantity
    editQuantityVisible.value = false
    ElMessage({
      type: 'success',
      message: '实际数量已更新'
    })
  }
}
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  background-color: #f5f7fa;
}

.top-nav {
  background-color: #fff;
  padding: 0 20px;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
  height: 50px;
}

.nav-section {
  display: flex;
  margin-left: 20px;
}

.nav-item {
  padding: 0 20px;
  line-height: 50px;
  cursor: pointer;
  color: #606266;
}

.nav-item.active {
  color: #409EFF;
}

.sub-nav {
  background-color: #fff;
  padding: 0 20px;
  border-bottom: 1px solid #e4e7ed;
}

.nav-tabs {
  display: flex;
  height: 40px;
  align-items: center;
}

.tab {
  padding: 0 20px;
  cursor: pointer;
  color: #606266;
}

.tab.active {
  color: #409EFF;
  border-bottom: 2px solid #409EFF;
}

.button-container {
  padding: 20px;
}

.request-list {
  padding: 0 20px;
}

.request-card {
  margin-bottom: 20px;
}

.request-info {
  line-height: 2;
}

.materials {
  margin: 10px 0;
}

.status {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-text {
  color: #409EFF;
}

.status-text.released {
  color: #67C23A;
}

.status-button {
  margin-top: 10px;
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

.details-dialog :deep(.el-dialog__header) {
  border-bottom: 1px solid #e4e7ed;
  margin-right: 0;
  padding-bottom: 20px;
}

.details-dialog :deep(.el-dialog__body) {
  padding-top: 20px;
}

.details-header {
  line-height: 2;
}

.status-line {
  margin-top: 10px;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 20px;
}

:deep(.el-table th) {
  background-color: #f5f7fa;
}
</style>