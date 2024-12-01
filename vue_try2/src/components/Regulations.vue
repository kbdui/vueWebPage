<script lang="ts" setup>
    import { ref,onMounted } from 'vue'
    import { useRouter } from 'vue-router'
    import headshot from './headshot.vue'
    import outWindow from './outWindow.vue'
    import { project_id } from '@/status'
    import axios from 'axios'

    const router = useRouter()

    // page header 页头
    const goBack = () => {
        router.push('/standard')
        console.log('go back')
    }

    // menu 菜单
    const activeIndex1 = ref('3')
    const handleSelect1 = (key: string, keyPath: string[]) => {
        if(key.match('1')) router.push('/details/')
        if(key.match('2')) router.push('/machinefirst')
        if(key.match('4')) router.push('/sample')
        console.log(key, keyPath)
    }

    // 打开/关闭小窗口
    const showModal2 = ref(false)
    function openModal(){
        showModal2.value = true
    }
    function closeModal() {
        showModal2.value = false
    }

    //给边框使用
    const getCssVarName = (type: string) => {
        return `--el-box-shadow${type ? '-' : ''}${type}`
    }

    // 留言-文本框设置
    const textarea = ref('')

    // 调整窗口的CSS
    const styleProps2 = ref({
        height: '35rem'
    });

    // 加载project_id
    function loadprojectid() {
        const savedData = localStorage.getItem('project_id');
        if (savedData) {
            project_id.value = JSON.parse(savedData);
            console.log(project_id.value)
        }
    }

    // 获取所有的操作规程
    const operationList = ref([])
    function getAllOperations(){
        axios.post('http://localhost:8080/download_operation_procedure',{
            project_id : project_id.value
        },{
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        }).then(function(response){
            operationList.value=response.data.data
            for(var i=0;i<operationList.value.length;i++){
                operationList.value[i] = (String)(operationList.value[i]).split('/').pop()
            }
        }).catch(function(error){
            console.log(error)
        })
    }

    const compareList = ref()
    function getAllcompare(){
        axios.post('http://localhost:8080/download_compare_plan',{
            project_id : project_id.value
        },{
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        }
        }).then(function(response){
            compareList.value=response.data.data
            compareList.value = (String)(compareList.value).split('/').pop()
        }).catch(function(error){
            console.log(error)
        })
    }

    // 组件挂载时执行的事件
    onMounted(() => {
        loadprojectid()
        getAllOperations()
        getAllcompare()
    })
</script>

<template>
    <div id="top">
    <div id="top1">
        <!-- page header 页头 -->
        <el-page-header @back="goBack">
        <template #content>
            <span style="color: rgb(30, 193, 30);" class="text-large font-600 mr-3">
            GB 19083-2003 4.1 医用防护口罩>基本要求
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

  <el-button id="leave" @click="openModal()" type="primary" plain>留言</el-button>
  
  <!-- 操作规程 -->
   <div id="r_content1">
        <h2>操作规程</h2>
        <div v-for="operation in operationList" class="content_pdf">
            <p>{{ operation }}</p>
            <!-- <el-button type="primary" plain>查看</el-button> -->
            <el-button type="success" plain>下载</el-button>
        </div>
   </div>

   <!-- 对比实验 -->
    <div id="r_content2">
        <h2>对比实验</h2>
        <div v-if="compareList != 'null'" class="content_compare">
            <p>{{ compareList }}</p>
            <!-- <el-button type="primary" plain>查看</el-button> -->
            <el-button type="success" plain>下载</el-button>
        </div>
        <div v-if="compareList != 'null'" class="content_status">
            <!-- <p>申请状态</p> -->
            <el-button type="primary" plain>申请对比实验</el-button>
        </div>
    </div>

   <!-- 留言窗口 -->
    <outWindow 
    :isVisible = "showModal2"
    :styleProps = "styleProps2"
    :messageType = "'Stander'"
    :outWindowType = true
    @closeModal = "closeModal()"
   >
   </outWindow>
</template>

<style>
     #top1{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    #leave{
        float: right;
        margin-right: 3rem;
    }
    #r_content1{
        margin-top: 3rem;
        margin-left: 2rem;
    }
    #r_content1 h2{
        margin-bottom: 1.5rem;
    }
    .content_pdf{
        display: flex;
        margin-bottom: 1rem;
    }
    .content_pdf p{
        margin-right: 3rem;
    }
    #r_content2{
        margin-top: 3rem;
        margin-left: 2rem;
    }
    #r_content2 h2{
        margin-bottom: 1.5rem;
    }
    .content_compare{
        display: flex;
        margin-bottom: 1rem;
    }
    .content_compare p{
        margin-right: 3rem;
    }
    .content_status{
        display: flex;
        margin-bottom: 1rem;
    }
    .content_status p{
        margin-right: 3rem;
    }
</style>