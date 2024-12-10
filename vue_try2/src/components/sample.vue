<script lang="ts" setup>
    import { ref, onMounted } from 'vue'
    import { useRouter } from 'vue-router'
    import headshot from './headshot.vue'
    import { project_id } from '@/status'
    import axios from 'axios'
    import topMessage from './son_components/topMessage.vue'
    import { ElMessage } from 'element-plus'

    const router = useRouter()
    const input1 = ref('')

    // menu 菜单
    const activeIndex1 = ref('4')
    const handleSelect1 = (key: string, keyPath: string[]) => {
        if(key.match('1')) router.push('/details/')
        if(key.match('2')) router.push('/machinefirst')
        if(key.match('3')) router.push('/Regulations')
        console.log(key, keyPath)
    }

    // 打开/关闭小窗口
    const showModal2 = ref(false)
    function openModal(i: number){
        showModal2.value = true
    }
    function closeModal(i: number) {
        showModal2.value = false
    }

    //调整窗口的CSS
    const styleProps2 = ref({
        height: '35rem'
    });

  // 通过项目ID获取样品列表
  const sampleList = ref([])
  function getSampleList() {
    axios.post('http://localhost:8080/get_sample_by_id', {
      project_id: project_id.value
    },{
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(function (response){
      sampleList.value = response.data.data
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
      ElMessage.error('获取样品列表失败')
    })
  } 

  // 加载project_id和sampleNumber
  function loadData() {
      const projectId = localStorage.getItem('project_id')
      if (projectId) project_id.value = JSON.parse(projectId)
  }

  // 挂载组件时执行的方法
  onMounted(() => {
      loadData()
      getSampleList()
  })

</script>

<template>
  <div id="top">
    <div id="top1">
        <!-- page header 页头 -->
        <topMessage></topMessage>

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

  <!-- 菜单下方的内容 -->
  <div id="scontent1">
    <!-- <H2 color=" light green"> GB 19083-2003 医用防护口罩</H2> -->
    <el-button id="s_leave" @click="openModal(2)" type="primary" plain>留言</el-button>
  </div>

    <el-table :data="sampleList" style="width: 100%">
      <el-table-column prop="sampleid" label="样品ID">
        <template #default="scope">
          {{ scope.row.sampleid || '/' }}
        </template>
      </el-table-column>

      <el-table-column prop="source" label="生产厂家">
        <template #default="scope">
          {{ scope.row.source || '/' }}
        </template>
      </el-table-column>

      <el-table-column prop="samplename" label="样品名称">
        <template #default="scope">
          {{ scope.row.samplename || '/' }}
        </template>
      </el-table-column>

      <el-table-column prop="model" label="型号规格">
        <template #default="scope">
          {{ scope.row.model || '/' }}
        </template>
      </el-table-column>

      <el-table-column prop="typename" label="类型">
        <template #default="scope">
          {{ scope.row.typename || '/' }}
        </template>
      </el-table-column>
      
      <el-table-column prop="typename" label="申请数量">
        <template #default="scope">
          <el-input v-model="input1" style="width: 100px" placeholder="输入申请数量" />
        </template>
      </el-table-column>
      
      <el-table-column prop="typename" label="添加到预置清单">
        <template #default="scope">
          <el-button @click="" type="primary" plain>添加</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 留言窗口 -->
    <outWindow 
      :isVisible = "showModal2"
      :styleProps = "styleProps2"
      :messageType = "'Sample'"
      :outWindowType = true
      @closeModal = "closeModal(2)"
    >
    </outWindow>
</template>

<style>
    #top1{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    #scontent1{
        display: flex;
        margin-bottom: 1rem;
    }
    #scontent1 #s_leave{
      margin-left: 90%;
      margin-top: 1em;
    }
    #scontent1 p{
        font-size: small;
    }
    #scontent1 #test{
        margin-top: 1em;
        font-size: large;
    }
    #scontent1 #detail{
        margin-top: -2.2rem;
        margin-right: 0rem;
    }
</style>