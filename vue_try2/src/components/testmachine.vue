<script lang="ts" setup>
    import { ref, onMounted, computed } from 'vue'
    import { useRouter } from 'vue-router'
    import headshot from './headshot.vue'
    import { user_data } from '@/status'
    import { ElMessage } from 'element-plus'
    import axios from 'axios'
    import html2canvas from 'html2canvas'
    import jsPDF from 'jspdf'
    const router = useRouter()

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

function fetchEquipmentOrders() {
  axios.post('http://localhost:8080/get_personal_equip_order', {
    uid: user_data.value.accountid
  },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(response => {
    if (response.data.code === 1) {
      
      response.data.data.forEach(order => {
        order.detail.forEach(item => {
          equipmentList.value.push({
            id: item.scheme_id,
            name: item.scheme_name,
            source: item.source, 
            quantity: item.num,
            schemeNumber: item.scheme_number,
            time: order.order_time,
            status: order.order_state
          })
        })
      })
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

// 使用computed计算属性来获取去重后的设备列表
const uniqueEquipmentList = computed(() => {
  // 使用Map按设备名称分组存储设备信息
  const equipmentMap = new Map()

  // 遍历设备列表,按名称分组
  equipmentList.value.forEach(equipment => {
    if (!equipmentMap.has(equipment.name)) {
      // 如果是新的设备名称,创建新条目
      equipmentMap.set(equipment.name, {
        ids: new Set([equipment.id]),
        name: equipment.name,
        sources: new Set([equipment.source]),
        quantities: new Set([equipment.quantity]), 
        schemeNumbers: new Set([equipment.schemeNumber]),
        times: new Set([equipment.time]),
        statuses: new Set([equipment.status])
      })
    } else {
      // 已存在的设备名称,添加到现有集合中
      const existing = equipmentMap.get(equipment.name)
      existing.ids.add(equipment.id)
      existing.sources.add(equipment.source)
      existing.quantities.add(equipment.quantity)
      existing.schemeNumbers.add(equipment.schemeNumber) 
      existing.times.add(equipment.time)
      existing.statuses.add(equipment.status)
    }
  })

  // 将Map转换为数组
  const equipmentArray = Array.from(equipmentMap.values()).map(item => ({
    ids: Array.from(item.ids).join(', '),
    name: item.name,
    sources: Array.from(item.sources).join(', '),
    quantities: Array.from(item.quantities).join(', '),
    schemeNumbers: Array.from(item.schemeNumbers).join(', '),
    times: Array.from(item.times).join(', '),
    statuses: Array.from(item.statuses).join(', ')
  }))

  return {
    equipments: equipmentArray,
    items: equipmentList.value
  }
})
onMounted(() => {
  fetchEquipmentOrders()

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
      <el-menu-item index="2">预置清单</el-menu-item>
    </el-menu>
  </div>
<br>
<div v-if="list" id="list">
<!-- 导出清单按钮 -->
<el-button type="success" id="export" size="mini" >导出清单</el-button>
  <!-- //list-->

    <div v-for="(equipment, index) in uniqueEquipmentList.equipments" :key="index">
      <el-card style="max-width: 100%" color="light blue" class="mb-2">
        <P id="index">清单编号：{{ equipment.ids }}</P>
        <P id="time">记录时间：{{ equipment.times }}</P>
        <P>设备信息：{{ equipment.name }}</P>
        <p :id="'status' + index">状态：{{ equipment.statuses }}</p>
        <el-button 
          v-if="equipment?.statuses !== 'Finish'"
          type="success" 
          :id="'download' + index" 
          size="mini"
        >标为完成</el-button>
        <el-button type="success" :id="'delete' + index" size="mini">删除</el-button>
     </el-card>
    </div>
    <!-- //点击预置清单 -->
</div>
<div v-else-if="yulist">
    <el-table :data="tableData" style="width: 100%" height="25%">
        <el-table-column prop="标准编号" label="标准编号" width="120" />
        <el-table-column prop="器械品类" label="器械品类" width="120" />
        <el-table-column prop="设备名称" label="设备名称" />
        <el-table-column prop="生产厂家" label="生产厂家" />
        <el-table-column prop="设备详情" label="设备详情" />
        <el-table-column prop="购买数量" label="购买数量" />  
        <el-table-column label="操作" width="200">
                <template >
                  <el-button type="primary" size="mini" >修改数量</el-button>
                  <el-button type="danger" size="mini">详情</el-button>
                </template>
              </el-table-column>
    </el-table>
    <el-table :data="tableData" style="width: 100%"  height="25%">
        <el-table-column prop="标准编号" label="标准编号" width="120" />
        <el-table-column prop="器械品类" label="器械品类" width="120" />
        <el-table-column prop="设备名称" label="设备名称" />
        <el-table-column prop="生产厂家" label="生产厂家" />
        <el-table-column prop="设备详情" label="设备详情" />
        <el-table-column prop="购买数量" label="购买数量" />  
        <el-table-column label="操作" width="200">
                <template>
                  <el-button type="primary" size="mini">修改数量</el-button>
                  <el-button type="danger" size="mini">详情</el-button>
                </template>
              </el-table-column>
    </el-table>
    <el-table :data="tableData" style="width: 100%"  height="25%">
        <el-table-column prop="标准编号" label="标准编号" width="120" />
        <el-table-column prop="器械品类" label="器械品类" width="120" />
        <el-table-column prop="设备名称" label="设备名称" />
        <el-table-column prop="生产厂家" label="生产厂家" />
        <el-table-column prop="设备详情" label="设备详情" />
        <el-table-column prop="购买数量" label="购买数量" />  
        <el-table-column label="操作" width="200">
                <template #default="scope">
                  <el-button type="primary" size="mini">修改数量</el-button>
                  <el-button type="danger" size="mini">详情</el-button>
                </template>
              </el-table-column>
    </el-table>
    <el-table :data="tableData" style="width: 100%" height="25%">
        <el-table-column prop="标准编号" label="标准编号" width="120" />
        <el-table-column prop="器械品类" label="器械品类" width="120" />
        <el-table-column prop="设备名称" label="设备名称" />
        <el-table-column prop="生产厂家" label="生产厂家" />
        <el-table-column prop="设备详情" label="设备详情" />
        <el-table-column prop="购买数量" label="购买数量" />  
        <el-table-column label="操作" width="200">
                <template #default="scope">
                  <el-button type="primary" size="mini">修改数量</el-button>
                  <el-button type="danger" size="mini">详情</el-button>
                </template>
              </el-table-column>
    </el-table>
    </div>
    <div class="action-buttons">
      <el-button type="primary" @click="exportToPDF">生成清单</el-button>
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
</style>

function data() {
  throw new Error('Function not implemented.');
}

