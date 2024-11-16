<script lang="ts" setup>
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import headshot from './headshot.vue'

    const router = useRouter()

    // page header 页头
    const goBack = () => {
        router.push('/standard')
        console.log('go back')
    }

    const list = ref(true)
    const yulist = ref(false)
    // menu 菜单
    const activeIndex1 = ref('4')
    const activeIndex2 = ref('1')
    const handleSelect1 = (key: string, keyPath: string[]) => {
        if(key.match('3')) router.push('/details/')
        if(key.match('5')) router.push('/Regulations')
        if(key.match('6')) router.push('/sample')
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
const detailInfo = ref({
  id: '201123029433',
  time: '2023.10.12 23:11:23',
  person: '张三',
  equipment: '设备,设备2,设备3'
});
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
const tableData = [
  {
    标准编号: 'GB-19083-2023 4.1',
    器械品类: '酸度计',
    设备名称: 'WDJ型酸度计',
    生产厂家:'Xxx公司/厂',
    设备详情:'详情',
    购买数量:10,
  },
]
</script>

<template>
  <div id="top">
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
  <!-- menu 菜单 --></el-menu>
  </div>
<br>
<div v-if="list" id="list">
<!-- 导出清单按钮 -->
<el-button type="success" id="export" size="mini" >导出清单</el-button>
  <!-- //list-->
  <el-card style="max-width: 100%"  color="light blue">
  <P id="index">清单编号：201123029433</P>
   <P id="time">记录时间：2023.10.12 23:11:23</P>
   <P>计划采购设备：设备,设备2,设备3</P>
   <p id="status1">状态：购置完成</p>
   <el-button v-if="status1 !== '已采购'" type="success" id="download" size="mini" >标为完成</el-button>
   <el-button type="success" id="delete" size="mini" >删除</el-button>
   <el-button type="success" @click="showModal = true" id="detail" size="mini">详情</el-button>
  </el-card>
  <!-- //list-->
  <el-card style="max-width: 100%"  color="light blue">
  <P  id="index">清单编号：201123029433</P>
   <P id="time">记录时间：2023.10.12 23:11:23</P>
   <P>计划采购设备：设备,设备2,设备3</P>
   <p id="status2" name="任务1">状态：计划采购</p>
   <el-button v-if="status2 !== '已采购'" type="success" id="download" size="mini" >标为完成</el-button>
   <el-button type="success" id="delete" size="mini" >删除</el-button>
   <el-button type="success" @click="showModal = true" id="detail" size="mini">详情</el-button>
   <div v-if="showModal" class="modal">
    <div class="modal-content" style="text-align: center;">
      <span class="close" @click="showModal = false">&times;</span>
      <h2>设备详情</h2>
      <el-form>
        <el-form-item label="清单编号">
          <el-input v-model="detailInfo.id" disabled></el-input>
        </el-form-item>
        <el-form-item label="记录时间">
          <el-input v-model="detailInfo.time" disabled></el-input>
        </el-form-item>
        <el-form-item label="计划采购人">
          <el-input v-model="detailInfo.person" disabled></el-input>
        </el-form-item>
        <el-form-item label="计划采购设备">
          <el-input v-model="detailInfo.equipment" disabled></el-input>
        </el-form-item>
      </el-form>
    </div>
  </div>
  </el-card>
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
                <template #default="scope">
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
                <template #default="scope">
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
</style>

function data() {
  throw new Error('Function not implemented.');
}
