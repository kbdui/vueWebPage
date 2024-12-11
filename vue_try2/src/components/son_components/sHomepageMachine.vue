<template>
<el-tab-pane label="设备" name="equipment">
    <!-- Export Button -->
    <el-button 
        type="success" 
        class="export-btn"
        @click="exportToPDF"
    >
        导出设备采购清单
    </el-button>

    <!-- Procurement Lists -->
    <div class="lists-container">
        <el-card v-for="list in allEquipmentOrders" 
                :key="list.order_id" 
                class="list-card"
        >
        <div class="list-header">
            <div>用户名：{{ list.user.name }}</div>
            <div>订单ID：{{ list.order_id }}</div>
            <div>订单时间：{{ list.order_time }}</div>
            <div>订单状态：{{ list.order_state }}</div>
        </div>
        
        <div class="equipment-list">
            <div>设备信息：</div>
            <ul>
                <li v-for="item in list.detail" :key="item.scheme_id">
                    {{ item.scheme_name }} x{{ item.num }}
                    <div>设备ID：{{ item.scheme_id }}</div>
                    <div>来源：{{ item.source }}</div>
                    <div>方案编号: {{ item.scheme_number }}</div>
                </li>
            </ul>
        </div>

        <div class="list-footer">
            <div class="action-buttons">
                <el-button 
                    v-if="list.order_state === '计划采购'"
                    type="warning"
                    @click="markAsComplete(list)"
                >
                    标为完成
                </el-button>
                <el-button 
                    type="danger"
                    @click="deleteList(list)"
                >
                    删除
                </el-button>
             
            </div>
        </div>
        </el-card>
    </div>
</el-tab-pane>

<!-- Details Dialog -->
<el-dialog
    v-model="detailsVisible"
    :title="`设备ID：${selectedList?.ids || ''}`"
    width="80%"
    destroy-on-close
>
    <div class="dialog-content">
    <div class="dialog-header">
        <div>记录时间：{{ selectedList?.times }}</div>
        <div>来源：{{ selectedList?.sources }}</div>
        <div class="status">
        状态：<span :class="getStatusClass(selectedList?.statuses)">
            {{ selectedList?.statuses }}
        </span>
        </div>
    </div>

    <el-table :data="selectedList?.equipment || []">
        <el-table-column 
        prop="standardCode" 
        label="标准编号及条款号" 
        min-width="180"
        />
        <el-table-column 
        prop="category" 
        label="器械品类" 
        min-width="120"
        />
        <el-table-column 
        prop="name" 
        label="设备名称" 
        min-width="150"
        />
        <el-table-column 
        prop="manufacturer" 
        label="生产厂家" 
        min-width="150"
        />
        <el-table-column 
        label="设备详情" 
        min-width="100"
        >
        <template #default="scope">
            <el-button
            type="primary"
            link
            size="small"
            @click="showEquipmentDetails(scope.row)"
            >
            详情
            </el-button>
        </template>
        </el-table-column>
        <el-table-column 
        prop="quantity" 
        label="购买数量" 
        min-width="100"
        />
    </el-table>
    </div>
    
    <template #footer>
    <el-button 
        type="danger" 
        @click="detailsVisible = false"
    >
        关闭
    </el-button>
    </template>
</el-dialog>

<!-- Equipment Details Dialog -->
<el-dialog
    v-model="equipmentDetailsVisible"
    title="设备详情"
    width="30%"
    append-to-body
>
    <div v-if="selectedEquipment">
    <p><strong>标准编号：</strong>{{ selectedEquipment.standardCode }}</p>
    <p><strong>器械品类：</strong>{{ selectedEquipment.category }}</p>
    <p><strong>设备名称：</strong>{{ selectedEquipment.name }}</p>
    <p><strong>生产厂家：</strong>{{ selectedEquipment.manufacturer }}</p>
    <p><strong>购买数量：</strong>{{ selectedEquipment.quantity }}</p>
    </div>
</el-dialog>

</template>

<script setup>
import { onMounted, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import html2pdf from 'html2pdf.js';
const activeTab = ref('lists')
const subTab = ref('equipment')
const detailsVisible = ref(false)
const equipmentDetailsVisible = ref(false)
const allEquipmentOrders = ref([])
const selectedList = ref(null)
const selectedEquipment = ref(null)
import axios from 'axios'
import { computed } from 'vue'
// Mock data
// Mark list as complete
const markAsComplete = (list) => {
  ElMessageBox.confirm(
    '是否确认将该采购清单标记为完成？',
    '提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      list.status = '购置完成'
      ElMessage({
        type: 'success',
        message: '状态已更新',
      })
    })
    .catch(() => {})
}
function getAllEquipmentOrders() {
  axios.get('http://localhost:8080/get_all_equip_order')
    .then(function (response) {
     allEquipmentOrders.value = response.data.data
     console.log("所拥有的数据为",response.data.data)

     })
    .catch(function (error) {
      if (error.response) {
   
      } else if (error.request) {
        console.log(error.request)
      } else {
        console.log('Error', error.message)
      }
      console.log(error.config)
      ElMessage.error('获取设备订单列表失败')
    })
}
console.log("allEquipmentOrders.value",allEquipmentOrders.value)
// Show details
const showDetails = (list) => {
  selectedList.value = list
  detailsVisible.value = true
}

// Show equipment details
const showEquipmentDetails = (equipment) => {
  selectedEquipment.value = equipment
  equipmentDetailsVisible.value = true
}
function deleteList(item){
  ElMessageBox.confirm(
    '是否确认删除该设备记录？',
    '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
  .then(() => {
    axios.post('http://localhost:8080/del_order', {
      order_id: item.order_id,
  }, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  .then(response => { 
    if (response.data.data === true) {
  
    //  ElMessage.success('清单已成功删除')
      getAllEquipmentOrders()
    } else {
      ElMessage.error('Failed to delete list')
    }
  })
})
}
// Export to PDF
const exportToPDF = () => {
  // Create a temporary div for PDF content
  const tempDiv = document.createElement('div')
  tempDiv.className = 'pdf-content'
  
  procurementLists.value.forEach(list => {
    const listDiv = document.createElement('div')
    listDiv.innerHTML = `
      <h2>采购清单</h2>
      <div class="list-info">
        <p>清单编号：${list.id}</p>
        <p>记录时间：${list.recordTime}</p>
        <p>计划采购人：${list.purchaser}</p>
        <p>状态：${list.status}</p>
      </div>
      <table>
        <thead>
          <tr>
            <th>标准编号及条款号</th>
            <th>器械品类</th>
            <th>设备名称</th>
            <th>生产厂家</th>
            <th>购买数量</th>
          </tr>
        </thead>
        <tbody>
          ${list.equipment.map(item => `
            <tr>
              <td>${item.standardCode}</td>
              <td>${item.category}</td>
              <td>${item.name}</td>
              <td>${item.manufacturer}</td>
              <td>${item.quantity}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `
    tempDiv.appendChild(listDiv)
  })

  document.body.appendChild(tempDiv)

  const opt = {
    margin: 1,
    filename: '设备采购清单.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2 },
    jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' }
  }

  html2pdf().set(opt).from(tempDiv).save().then(() => {
    document.body.removeChild(tempDiv)
    ElMessage({
      type: 'success',
      message: 'PDF导出成功',
    })
  })
}
// 添加状态样式处理方法
const getStatusClass = (status) => {
  if (status.includes('计划采购')) {
    return 'status-planned'
  }
  if (status.includes('购置完成')) {
    return 'status-completed'
  }
  return ''
}

onMounted(() => {
  getAllEquipmentOrders()
})
</script>

<style scoped>
.procurement-page {
  padding: 20px;
}

.export-btn {
  margin-bottom: 20px;
}

.list-card {
  margin-bottom: 20px;
}

.list-header {
  margin-bottom: 15px;
}

.list-header div {
  margin-bottom: 5px;
}

.equipment-list {
  margin-bottom: 15px;
}

.equipment-list ul {
  list-style: none;
  padding-left: 20px;
  margin: 10px 0;
}

.list-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 15px;
}

.status-planned {
  color: #409EFF;
}

.status-completed {
  color: #67C23A;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.dialog-content {
  padding: 0 20px;
}

.dialog-header {
  margin-bottom: 20px;
}

.dialog-header div {
  margin-bottom: 8px;
}

:deep(.el-dialog__header) {
  margin-right: 0;
  border-bottom: 1px solid #DCDFE6;
  padding-bottom: 20px;
}

:deep(.el-dialog__footer) {
  border-top: 1px solid #DCDFE6;
  padding-top: 20px;
}

:deep(.el-table th) {
  background-color: #F5F7FA;
}

:deep(.el-button--danger) {
  background-color: #F56C6C;
  border-color: #F56C6C;
  color: white;
}

:deep(.el-dialog__headerbtn) {
  display: none;
}

/* PDF Styles */
.pdf-content {
  padding: 20px;
}

.pdf-content .list-info {
  margin: 20px 0;
}

.pdf-content table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 30px;
}

.pdf-content th,
.pdf-content td {
  border: 1px solid #dcdfe6;
  padding: 12px 8px;
  text-align: left;
}

.pdf-content th {
  background-color: #f5f7fa;
}
</style>