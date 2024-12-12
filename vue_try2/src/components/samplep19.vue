<template>
    <div class="purchase-management">
      <div id="top">
        <div id="top1">
            <!-- page header 页头 -->
            <el-page-header @back="goBack">
            <template #content>
                <span class="text-large font-600 mr-3">
                个人主页
                </span>
            </template>
            </el-page-header>

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

      <!-- Sub Navigation -->
      <el-menu
        id = "s19_sub_nav"
        :default-active="activeIndex2"
        class="el-menu-demo"
        mode="horizontal"
        active-text-color="#ffd04b"
        @select="handleSelect2"
      >
        <el-menu-item index="1">清单</el-menu-item>
        <el-menu-item index="2">预置清单</el-menu-item>
      </el-menu>
  
      <!-- List View -->
      <template v-if="list">
        <div class="list-items">
          <div v-for="item in listItems2" :key="item.id" class="list-item">
            <div class="list-item-content">
              <div class="list-item-header">
                <div>清单编号：{{ item.order_id }}</div>
                <div>记录时间：{{ item.order_time }}</div>
              </div>
              <div class="list-item-body">
                <div>计划申请物料：</div>
                <div v-for="(material, index) in item.detail" :key="index" class="material-item">
                  我需要{{ material.number }}个 {{ material.samplename }}
                </div>
                <div class="status-line">
                  状态：<span :class="['status', transformState(item.order_state)]">{{ item.order_state }}</span>
                </div>
              </div>
              <div class="list-item-footer">
                <!-- <el-button 
                  type="danger" 
                  @click="handleDelete(item)"
                >
                  删除
                </el-button> -->
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
      <template v-else-if="yulist">
        <el-table :data="presetListData[0].detail" style="width: 100%">
          <el-table-column prop="standardNo" label="标准编号">
            <template #default="scope">
              {{ scope.row.samplenumber || '/' }}
            </template>
          </el-table-column>

          <el-table-column prop="productName" label="产品名称">
            <template #default="scope">
              {{ scope.row.typename || '/' }}
            </template>
          </el-table-column>

          <el-table-column prop="sampleName" label="样品名称">
            <template #default="scope">
              {{ scope.row.samplename || '/' }}
            </template>
          </el-table-column>
          
          <el-table-column prop="specModel" label="规格型号">
            <template #default="scope">
              {{ scope.row.model || '/' }}
            </template>
          </el-table-column>

          <el-table-column label="申请数量">
            <template #default="scope">
              {{ scope.row.number || '/' }}
            </template>
          </el-table-column>

          <el-table-column label="操作" fixed="right">
            <template #default="scope">
              <!-- <el-button
                type="primary"
                link
                @click="modifyPresetRequest(scope.row)"
              >
                修改需求
              </el-button> -->
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
        width="60%"
        :show-close="false"
        destroy-on-close
      >
        <div v-if="selectedItem" class="details-dialog">
          <div class="dialog-header">
            <div>清单编号：{{ selectedItem.order_id }}</div>
            <div>记录时间：{{ selectedItem.order_time }}</div>
          </div>
          <div class="status-section">
            状态：<span :class="['status', transformState(selectedItem.order_state)]">
              {{ selectedItem.order_state }}
            </span>
          </div>
          
          <el-table :data="selectedItem.detail" style="width: 100%">
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
            <el-table-column prop="sampleName" label="样品名称" width="150">
              <template #default="scope">
                {{ scope.row.samplename || '/' }}
              </template>
            </el-table-column>
            <!-- <el-table-column prop="manufacturer" label="生产厂家" width="150">
              <template #default="scope">
                {{ scope.row.samplenumber || '/' }}
              </template>
            </el-table-column> -->
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
            <!-- <el-table-column label="操作" width="200">
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
            </el-table-column> -->
          </el-table>
  
          <!-- <div class="dialog-footer">
            <el-button 
              type="danger" 
              @click="detailsDialogVisible = false"
            >
              关闭
            </el-button>
          </div> -->
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
  
  <script lang="ts" setup>
  import { ref, computed,onMounted, inject } from 'vue'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { useRouter } from 'vue-router'
  import headshot from './headshot.vue'
  import axios from 'axios'
  import { user_data } from '@/status'
  import { de } from 'element-plus/es/locale'

    const router = useRouter()
    const baseurl = inject('baseurl')

    // page header 页头
    const goBack = () => {
        router.push('/entry')
        console.log('go back')
    }

    // menu 菜单
    const activeIndex1 = ref('4')
    const handleSelect1 = (key: string, keyPath: string[]) => {
        if(key.match('1')) router.push('/people13')
        if(key.match('2')) router.push('/testmachine')
        if(key.match('3')) router.push('/Regulations18')
        console.log(key, keyPath)
    }

    // Sub Navigation
    const list = ref(true)
    const yulist = ref(false)
    const activeIndex2 = ref('1')
    const handleSelect2 = (key: string, keyPath: string[]) => {
        if(key.match('1')){
            list.value = true
            yulist.value = false
        }
        else if(key.match('2')){
            list.value = false
            yulist.value = true
        }
        console.log(key, keyPath)
    }
  
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
  // const presetListData = ref([
  //   {
  //     standardNo: 'GB 19083-2023',
  //     productName: '医用防护口罩',
  //     sampleName: '一次性N95口罩',
  //     manufacturer: '107厂',
  //     specModel: '/',
  //     quantity: 10,
  //     status: '申请需求'
  //   },
  //   {
  //     standardNo: 'GB 19083-2023',
  //     productName: '医用防护口罩',
  //     sampleName: '一次性普通口罩',
  //     manufacturer: '107厂',
  //     specModel: '/',
  //     quantity: 10,
  //     status: '申请需求'
  //   },
  //   {
  //     standardNo: 'GB 19083-2023',
  //     productName: '医用防护口罩',
  //     sampleName: '一次性N75口罩',
  //     manufacturer: '107厂',
  //     specModel: '/',
  //     quantity: 10,
  //     status: '申请需求'
  //   },
  //   {
  //     standardNo: 'GB 19083-2023',
  //     productName: '医用防护口罩',
  //     sampleName: '一次性N95口罩',
  //     manufacturer: '113厂',
  //     specModel: '/',
  //     quantity: 10,
  //     status: '申请需求'
  //   }
  // ])
  
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
  
  function handleDetails(item) {
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
  
  // 删除预置清单中的条目
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
      axios.post(baseurl + '/delete_one_good', {
        order_id: presetListData.value[0].order_id,
        good_id: presetListData.value[0].detail[index].sampleid
      },{
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(function (response){
        if(response.data.data === true) ElMessage.success('删除成功')
        else ElMessage.error('删除失败')
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
        ElMessage.error('删除失败')
      })
      presetListData.value[0].detail.splice(index, 1)
    }).catch(() => {
      ElMessage.info('已取消删除')
    })
  }
  
  // const submitPresetList = () => {
  //   if (hasRequestStatus.value) {
  //     ElMessage.warning('存在申请需求状态的项目，无法提交')
  //     return
  //   }
  //   ElMessageBox.confirm(
  //     '确定要提交预置清单吗？',
  //     '提示',
  //     {
  //       confirmButtonText: '确定',
  //       cancelButtonText: '取消',
  //       type: 'info',
  //     }
  //   ).then(() => {
  //     ElMessage.success('提交成功')
  //   })
  // }
  
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
      axios.post(baseurl + '/del_order', {
        order_id: presetListData.value[0].order_id
      },{
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(function (response){
        if(response.data.data === true) ElMessage.success('清空成功')
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
        ElMessage.error('清空失败')
      })
      presetListData.value[0].detail = []
    })
  }
  
  const confirmModify = () => {
    if (selectedRequest.value) {
      selectedRequest.value.quantity = modifyQuantity.value
      modifyDialogVisible.value = false
      ElMessage.success('修改成功')
    }
  }

  function transformState(state : String) {
    return state === 'Finish' ? 'completed' : 'pending'
  }
 
  // 获取个人清单
  const listItems2 = ref([])
  function getPersonalList() {
    axios.post(baseurl + '/show_my_order', {
        account_id: user_data.value.accountid
    },{
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(function (response){
      listItems2.value = response.data.data
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
      ElMessage.error('个人清单获取失败')
    })
  }

  // 获取预置清单
  const presetListData = ref([
    {
      status: 'XXX',
      order_id: 1,
      detail: []
    }
  ])
  function getPresetList() {
    axios.post(baseurl + '/show_my_order', {
        account_id: user_data.value.accountid,
        type: 'Preformed'

    },{
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(function (response){
      if(response.data.data.length > 0) presetListData.value = response.data.data
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
      ElMessage.error('预置清单获取失败')
    })
  }

  // 提交预置清单
  function submitPresetList() {
    axios.post(baseurl + '/change_preformed_order_state', {
        order_id: presetListData.value[0].order_id,
    },{
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(function (response){
      if (response.data.data === true) {
        presetListData.value[0].detail = []
        ElMessage.success('提交成功')
      }
      else ElMessage.error('提交失败')
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
      ElMessage.error('提交失败')
    })
  }

  // 在刷新页面时重新加载用户数据
  function loadUserData() {
      const savedData = localStorage.getItem('user_data');
      if (savedData) {
          user_data.value = JSON.parse(savedData);
      }
  }

  // 组件挂载时加载数据
  onMounted(() => {
    loadUserData()
    getPersonalList()
    getPresetList()
  })

  </script>
  
  <style scoped>
  
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
  #s19_sub_nav {
    margin-bottom: 2rem;
  }
  </style>