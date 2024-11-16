<script lang="ts" setup>
    import { ref } from 'vue'
    import outWindow from './outWindow.vue';
    // page header 页头
    const goBack = () => {
      console.log('go back')
    }

    // menu 菜单
    const activeIndex1 = ref('1')
    const activeIndex2 = ref('5')
    const handleSelect1 = (key: string, keyPath: string[]) => {
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
</script>

<template>
  <div id="top">
    <!-- page header 页头 -->
    <el-page-header @back="goBack">
        <template #content>
          <span class="text-large font-600 mr-3"> 因为不知道起什么所以就先这样 </span>
        </template>
      </el-page-header>
    <el-menu
      :default-active="activeIndex1"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect1"
    >
      <el-menu-item index="1">留言管理</el-menu-item>
      <el-menu-item index="2">清单管理</el-menu-item>
    <!-- menu 菜单 --></el-menu>
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
  </div>

  <el-tag type="success" id="list">导出设备采购清单</el-tag>
  <!-- //list-->
  <el-card style="max-width: 100%"  color="light blue">
  <P>清单编号：201123029433</P>
   <P>记录时间：2023.10.12 23:11:23</P>
   <P>计划采购人：张三</P>
   <P>计划采购设备：设备,设备2,设备3</P>
   <p id="status1">状态：已采购</p>
   <el-button v-if="status1 !== '已采购'" type="success" id="download" size="mini" >标为完成</el-button>
   <el-button type="success" id="delete" size="mini" >删除</el-button>
   <el-button type="success" @click="showModal = true" id="detail" size="mini">详情</el-button>

  </el-card>
  <!-- //list-->
  <el-card style="max-width: 100%"  color="light blue">
  <P>清单编号：201123029433</P>
   <P>记录时间：2023.10.12 23:11:23</P>
   <P>计划采购人：张三</P>
   <P>计划采购设备：设备,设备2,设备3</P>
   <p id="status2" name="任务1">状态：点击完成</p>
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
</template>

<style>
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
