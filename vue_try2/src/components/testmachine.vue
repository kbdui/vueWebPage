<script lang="ts" setup>
    import { ref, onMounted, computed, inject } from 'vue'
    import { useRouter } from 'vue-router'
    import headshot from './headshot.vue'
    import { user_data } from '@/status'
    import { ElMessage ,ElMessageBox} from 'element-plus'
    import axios from 'axios'
    import html2canvas from 'html2canvas'
    import jsPDF from 'jspdf'

    const router = useRouter()
    const baseurl = inject('baseurl')

    // page header 页头
    const goBack = () => {
        router.push('/entry')
        console.log('go back')
    }

    const list = ref(true)
    const yulist = ref(false)
    // menu 菜单
    const activeIndex1 = ref('4')
    const activeIndex2 = ref('1')
    const handleSelect1 = (key: string, keyPath: string[]) => {
        if(key.match('3')) router.push('/people13')
        if(key.match('5')) router.push('/Regulations18')
        if(key.match('6')) router.push('/samplep19')
        console.log(key, keyPath)
    }
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
//控制显示按钮
const status1 = ref('已采购');
const status2 = ref('点击完成');
//显示表单
const showModal = ref(false);

// 定义一个方法来更新状态
function updateStatus(newStatus) {
  if (status1.value === '点击完成') {
    status1.value = newStatus;
  }
  if (status2.value === '点击完成') {
    status2.value = newStatus;
  }
}
// 定义完成任务的方法
const formData = ref({
  name: '',
  email: ''
});
// 方法
const submitForm = () => {
  console.log('表单数据：', formData.value);
  // 这里可以添加发送数据到服务器的代码
};
//预置清单显示表格
const tableData = ref([])
const equipmentList = ref([])
const generatePresetList = () => {
  console.log('Generating preset list')
  ElMessage.success('预置清单已生成')
}
const exportToPDF = async () => {
  ElMessage.info('正在生成PDF，请稍候...')
  
  const element = document.getElementById('content-to-export')
  if (!element) {
    ElMessage.error('无法找到要导出的内容')
    return
  }

  try {
    const canvas = await html2canvas(element)
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const imgProps = pdf.getImageProperties(imgData)
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    pdf.save('equipment_management.pdf')
    ElMessage.success('PDF已成功导出')
  } catch (error) {
    console.error('PDF导出失败:', error)
    ElMessage.error('PDF导出失败，请重试')
  }
}
const preformedEquipmentList = ref([])
function fetchpreformedEquipmentOrders() {
  axios.post(baseurl + '/get_personal_equip_order', {
    uid: user_data.value.accountid,
    type: 'Preformed'
  },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => {
    if (response.data.code === 1) {
      preformedEquipmentList.value = response.data.data
      console.log("preformedEquipmentList.value",preformedEquipmentList.value)
    } else {
      console.log(response.data.data)
      ElMessage.error('Failed to fetch equipment orders')
    }
  })
  .catch(error => {
    console.error('Error fetching equipment orders:', error)
    ElMessage.error('Error fetching equipment orders')
  })
}
function fetchEquipmentOrders() {
  axios.post(baseurl + '/get_personal_equip_order', {
    uid: user_data.value.accountid
  },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => {
    if (response.data.code === 1) {
      equipmentList.value = response.data.data
      console.log(equipmentList.value)
    } else {
      console.log(response.data.data)
      ElMessage.error('Failed to fetch equipment orders')
    }
  })
  .catch(error => {
    console.error('Error fetching equipment orders:', error)
    ElMessage.error('Error fetching equipment orders')
  })
}

const exportAndClearPreformedList = async () => {
  ElMessage.info('正在导出清单并清空预置清单，请稍候...')

  // Export the preformed equipment list to PDF
  const element = document.getElementById('content-to-export')
  if (!element) {
    ElMessage.error('无法找到要导出的内容')
    return
  }

  try {
    const canvas = await html2canvas(element)
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const imgProps = pdf.getImageProperties(imgData)
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    pdf.save('preformed_equipment_list.pdf')
    ElMessage.success('清单已成功导出')

    // Clear the preformed equipment list
    preformedEquipmentList.value = []
    ElMessage.success('预置清单已清空')
  } catch (error) {
    console.error('导出清单失败:', error)
    ElMessage.error('导出清单失败，请重试')
  }
}
function changeStatus(item){
  axios.post(baseurl + '/change_preformed_order_state', {
    order_id: item.order_id,
  }, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }).then(response => {
    if (response.data.data === true) {
      ElMessage.success('状态已成功改变')
      fetchpreformedEquipmentOrders()
      fetchEquipmentOrders()
      console.log('Status changed successfully')
    } else {
      console.log('Failed to change status')
    }
  }).catch(error => {
    console.error('Error changing status:', error)
  })
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
    axios.post(baseurl + '/del_order', {
      order_id: item.order_id,
  }, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  .then(response => { 
    if (response.data.data === true) {
  
    //  ElMessage.success('清单已成功删除')
       fetchEquipmentOrders()
    } else {
      ElMessage.error('Failed to delete list')
    }
  })
})
}
function changefinish(item){
  axios.post(baseurl + '/change_order_state', {
    order_id: item.order_id,
  }, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  .then(response => {
    if (response.data.data === true) {
      ElMessage.success('状态已成功改变')
      fetchEquipmentOrders()
    } else {
      ElMessage.error('Failed to change status')
    }
  })
}
onMounted(() => {
  fetchEquipmentOrders()
  fetchpreformedEquipmentOrders()
})
</script>

<template>
  <div id="content-to-export">
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

    <el-menu
      :default-active="activeIndex1"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect1"
    >
      <el-menu-item index="3">人员</el-menu-item>
      <el-menu-item index="4">设备</el-menu-item>
      <el-menu-item index="5">规程</el-menu-item>
      <el-menu-item index="6">样品</el-menu-item>
    </el-menu>
    <el-menu
      :default-active="activeIndex2"
      class="el-menu-demo"
      mode="horizontal"
      active-text-color="#ffd04b"
      @select="handleSelect2"
    >
      <el-menu-item index="1">清单</el-menu-item>
      <el-menu-item index="2" >预置清单</el-menu-item>
    </el-menu>
  </div>
<br>
<div v-if="list" id="list">
  <!-- 导出清单按钮 -->
  <el-button type="success" id="export" size="mini">导出清单</el-button>
  <!-- //list-->
  <div class="lists-container">
    <el-card v-for="list in equipmentList" :key="list.order_id" class="list-card">
      <div class="list-header" style="font-size: 16px;">
        <div>用户名：{{ list.user.name }}</div>
        <div>订单ID：{{ list.order_id }}</div>
        <div>订单时间：{{ list.order_time }}</div>
        <div>订单状态：{{ list.order_state }}</div>
        <div v-if="list.order_state === 'Ongoing'" style="text-align: right;">
          <el-button type="primary" @click="changefinish(list)">点击完成</el-button>
        </div>
      </div>

      <div class="equipment-list" style="font-size: 16px;">
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
      <div class="action-buttons" style="text-align: right">
        <el-button type="primary" @click="deleteList(list)">删除清单</el-button>
      </div>
    </el-card>
  </div>
</div>
<div v-else-if="yulist">
  <div class="lists-container">
    <el-card v-for="list in preformedEquipmentList" :key="list.order_id" class="list-card">
      <div class="list-header" style="font-size: 16px;">
        <div>用户名：{{ list.user.name }}</div>
        <div>订单ID：{{ list.order_id }}</div>
        <div>订单时间：{{ list.order_time }}</div>
        <div>订单状态：{{ list.order_state }}</div>
      </div>

      <div class="equipment-list" style="font-size: 16px;">
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
      <div class="action-buttons" style="text-align: right">
        <el-button type="primary" @click="changeStatus(list)">生成清单</el-button>
      </div>
    </el-card>
  </div>
</div>
  </div>

</template>

<style>
    #top1{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    #menu2{
        width: 80%;
        float: left;
    }
    #button1{
        width: 20%;
        height: auto;
        margin-left: 80%;
        display: flex;
    }
    #leave{
        margin-left: 1rem;
        margin-top: 2rem;
    }
    #add{
        margin-top: 2rem;
    }
    #p1{
        margin-top: 2rem;
    }
    #download{
        margin-top: 15px;
    }
    .radius {
        height: auto;
        border: 1px solid var(--el-border-color);
        border-radius: 0;
        margin-top: 15px;
        padding: 1rem 0 1rem 0.5rem;
    }
    #myvideo{
        height: 24rem;
    }
    .video1{
        width: auto;
        height: 10rem;
    }
    .line1{
        display: flex;
        margin-bottom: 0.5rem;
    }
    .line1 button{
        margin-left: 2rem;
    }
    #content3 #testPaper{
        margin-top: 3rem;
    }
    #content3 h2{
        margin-bottom: 0.5em;
    }
    #content3 p{
        margin-top: 0.5em;
    }
    #content3 #testVideo{
        margin-top: 2em;
    }
    #content3 #authorization{
        margin-top: 2em;
    }
    #list{
        margin-top: 1rem;
        margin-left: 1rem;
        font-size: large;
        color: rgb(5, 79, 5);
    }
    #download{
        margin-top: 0;
    }
    #index{
       font-size:10px;
        font-family:'宋体';
        color:gray;
    }
    #time{
        font-size:10px;
        font-family:'宋体';
        color:gray;
    }
    #delete{
        margin-top: 1rem;
       float: right;
       margin-left: 1rem;
    }
    #detail{
        margin-top: 1rem;
        float: right;
        margin-left: 1rem;
    }
    .modal {
        display: flex;
        justify-content: center;
        align-items: center;
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        z-index: 1000;
      }
      
      .modal-content {
        background-color: white;
        padding: 20px;
        border-radius: 5px;
        width: 50%;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      }
      
      .close {
        cursor: pointer;
        float: right;
        font-size: 25px;
        font-weight: bold;
      }
      .action-buttons {
        margin-top: 20px;
        text-align: center;
        display: flex;
        justify-content: center;
        gap: 10px;
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
</style>

function data() {
  throw new Error('Function not implemented.');
}

