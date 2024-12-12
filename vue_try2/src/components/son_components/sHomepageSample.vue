<template>
    <el-tab-pane label="物料" name="materials">
        <el-button id="exportSamplePdf" type="success" @click="exportToPDF">导出样品需求清单</el-button>

        <!-- Request List -->
        <div class="request-list">
            <el-card v-for="(item, index) in allLists" :key="index" class="request-card">
                <div class="request-info">
                  <p>清单编号：{{ item.order_id }}</p>
                  <p class="request_people">申请人：{{ item.user.name }}</p>
                  <p class="status">
                      状态：
                      <span class="status-text" :class="item.order_state === 'Finish' ? 'released' : 'pending'">
                      {{ item.order_state }}
                      </span>
                  </p>
                  <!-- <div class="status-button" v-if="request.status === '已发放'">
                      <el-button type="success" size="small">已发放</el-button>
                  </div> -->
                </div>
                <div class="action-buttons">
                    <el-button type="primary" size="small" @click="showDetails(item)">详情</el-button>
                    <el-button type="danger" size="small" @click="deleteRequest(item)">删除</el-button>
                </div>
            </el-card>
        </div>

        <!-- Details Dialog -->
        <el-dialog
        v-model="detailsVisible"
        :title="selectedRequest ? `清单详情` : ''"
        width="77%"
        class="details-dialog"
        :close-on-click-modal="true"
        >
            <template v-if="selectedRequest">
              <div class="details-header">
                <div>清单编号：{{ selectedRequest.order_id }}</div>
                <div>记录时间：{{ selectedRequest.order_time }}</div>
                <div>需求人：{{ selectedRequest.user.name }}</div>
                <div class="status-line">
                    状态：<span class="status-text">{{ selectedRequest.order_state }}</span>
                </div>
              </div>
              
              <el-table :data="selectedRequest.detail" style="width: 100%">
                <el-table-column prop="standardNo" label="标准编号" width="180">
                  <template #default="scope">
                    {{ scope.row.samplenumber || '/' }}
                  </template>
                </el-table-column>

                <el-table-column prop="productName" label="产品名称" width="120">
                  <template #default="scope">
                    {{ scope.row.typename || '/' }}
                  </template>
                </el-table-column>

                <el-table-column label="样品编号" width="120">
                  <template #default="scope">
                    {{ scope.row.sampleid || '/' }}
                  </template>
                </el-table-column>

                <el-table-column prop="sampleName" label="样品名称" width="150">
                  <template #default="scope">
                    {{ scope.row.samplename || '/' }}
                  </template>
                </el-table-column>

                <el-table-column prop="specModel" label="规格型号" width="100">
                  <template #default="scope">
                    {{ scope.row.model || '/' }}
                  </template>
                </el-table-column>

                <el-table-column label="申请数量" width="120">
                  <template #default="scope">
                    {{ scope.row.number || '/' }}
                  </template>
                </el-table-column>

                <el-table-column prop="actualQuantity" label="实际数量" width="120">
                  <template #default="scope">
                    {{ scope.row.number || '/' }}
                  </template>
                </el-table-column>
                <!-- <el-table-column label="操作" width="120">
                    <template #default="scope">
                    <el-button
                        size="small"
                        @click="editActualQuantity(scope.$index, scope.row)"
                    >
                        编辑实际数量
                    </el-button>
                    </template>
                </el-table-column> -->
              </el-table>
            </template>

            <template #footer>
                <!-- <div class="dialog-footer">
                  <el-button type="danger" @click="detailsVisible = false">关闭</el-button>
                </div> -->
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
  import { ref, onMounted, inject } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import html2pdf from 'html2pdf.js'
  import axios from 'axios'

  const detailsVisible = ref(false)
  const editQuantityVisible = ref(false)
  const selectedRequest = ref(null)
  const editingItem = ref(null)
  const editingIndex = ref(-1)
  const baseurl = inject('baseurl')

  // const sampleRequests = ref([
  //   {
  //     id: '20132453467',
  //     date: '2024.10.23 14:23:21',
  //     requester: '甲',
  //     status: '计划采购',
  //     items: [
  //       { name: '酸度计', quantity: 10 },
  //       { name: '天平', quantity: 30 }
  //     ],
  //     detailItems: [
  //       {
  //         standardCode: 'GB 19083-2023 4.1',
  //         productName: '酸度计',
  //         sampleName: 'WDJ型酸度计',
  //         manufacturer: 'Xxx公司/厂',
  //         specification: '/',
  //         requestQuantity: '要10个',
  //         actualQuantity: 10,
  //         operation: '编辑实际数量'
  //       },
  //       {
  //         standardCode: 'GB 19083-2023 4.1',
  //         productName: '酸度计',
  //         sampleName: 'KIU型酸度计',
  //         manufacturer: 'Xxx公司/厂',
  //         specification: '/',
  //         requestQuantity: '要20个',
  //         actualQuantity: 20,
  //         operation: '编辑实际数量'
  //       },
  //       {
  //         standardCode: 'GB 19083-2023 4.2',
  //         productName: '天平',
  //         sampleName: 'LIO型天平',
  //         manufacturer: 'Xxx公司/厂',
  //         specification: '/',
  //         requestQuantity: '要30个',
  //         actualQuantity: 30,
  //         operation: '编辑实际数量'
  //       }
  //     ]
  //   }
  // ])

  const showDetails = (request) => {
    selectedRequest.value = request
    detailsVisible.value = true
  }

  const deleteRequest = (request) => {
    ElMessageBox.confirm(`是否确定删除样品记录 ${request.order_id}?`, '警告', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      const index = allLists.value.indexOf(request)
      allLists.value.splice(index, 1)
      // axios.post('http://localhost:8080/del_sample', {
      //     sample_id: request.order_id
      // },{
      //     headers: {
      //     'Content-Type': 'application/x-www-form-urlencoded'
      //     }
      // }).then(function (response){
      //   if(response.data.data === true) ElMessage.success('样品记录删除成功')
      //   else ElMessage.error('样品记录删除失败')
      // }).catch(function (error){
      //   if (error.response) {
      //     // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
      //     console.log(error.response.data);
      //     console.log(error.response.status);
      //     console.log(error.response.headers);
      //   } else if (error.request) {
      //     // 请求已经成功发起，但没有收到响应
      //     // `error.request` 在浏览器中是 XMLHttpRequest 的实例，
      //     // 而在node.js中是 http.ClientRequest 的实例
      //     console.log(error.request);
      //   } else {
      //     // 发送请求时出了点问题
      //     console.log('Error', error.message);
      //   }
      //   console.log(error.config)
      //   ElMessage.error('样品记录删除失败')
      // })
    }).catch(() => {
      ElMessage({
        type: 'info',
        message: '已取消删除'
      })
    })
  }

  const exportToPDF = () => {
    // Create a temporary div for PDF content
    const tempDiv = document.createElement('div')
    tempDiv.className = 'pdf-content'
    
    allLists.value.forEach(list => {
      const listDiv = document.createElement('div')
      listDiv.innerHTML = `
        <h2>样品需求清单</h2>
        <div class="list-info">
          <p>清单编号：${list.order_id}</p>
          <p>申请人：${list.user.name}</p>
          <p>记录时间：${list.order_time}</p>
          <p>状态：${list.order_state}</p>
        </div>
        <div class="sample-details">
          <h3>样品信息：</h3>
          ${list.detail.map(item => `
            <div class="sample-item">
              <p>标准ID：${item.sampleid}</p>
              <p>样品名称：${item.samplename}</p>
              <p>编号：${item.samplenumber}</p>
              <p>种类名称：${item.typename}</p>
              <p>来源：${item.source}</p>·
            </div>
          `).join('')}
        </div>
        <hr>
      `
      tempDiv.appendChild(listDiv)
    })

    document.body.appendChild(tempDiv)

    const opt = {
      margin: 1,
      filename: '样品需求清单.pdf',
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

  // 获取所有所有人清单
  const allLists = ref([])
  function getAllLists() {
    axios.get(baseurl + '/get_all_sample_order')
    .then(function (response) {
      allLists.value = response.data.data
    })
    .catch(function (error) {
      console.error('Error:', error);
      ElMessage.error('获取样品清单失败')
    });
  }

  // 组件挂载时执行
  onMounted(() => {
    getAllLists()
  })

</script>

<style scoped>
#exportSamplePdf {
  margin-bottom: 1rem;
}

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
  display: grid;
}

.request-info {
  display: flex;
  line-height: 2;
}

.materials {
  margin: 10px 0;
}

.request_people {
  margin-left: 2rem;
}

.status {
  margin-left: 2rem;
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
  margin-top: -1.8rem;
  gap: 10px;
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