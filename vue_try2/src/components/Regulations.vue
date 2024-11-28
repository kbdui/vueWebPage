<script lang="ts" setup>
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import headshot from './headshot.vue'
    import outWindow from './outWindow.vue'
    import { user_data } from '@/status'

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

    //调整窗口的CSS
    const styleProps2 = ref({
        height: '35rem'
    });
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
        <headshot
        :_name="user_data.name"
        :username="user_data.username"
        :institution="user_data.institution"
        :contact="user_data.contact"
        :accountType="user_data.accountType"
        ></headshot>
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
        <div class="content_pdf">
            <p>规程1.pdf</p>
            <el-button type="primary" plain>查看</el-button>
            <el-button type="success" plain>下载</el-button>
        </div>
        <div class="content_pdf">
            <p>规程1.pdf</p>
            <el-button type="primary" plain>查看</el-button>
            <el-button type="success" plain>下载</el-button>
        </div>
        <div class="content_pdf">
            <p>规程1.pdf</p>
            <el-button type="primary" plain>查看</el-button>
            <el-button type="success" plain>下载</el-button>
        </div>
   </div>

   <!-- 对比实验 -->
    <div id="r_content2">
        <h2>对比实验</h2>
        <div class="content_compare">
            <p>医用防护口罩基本要求对比方案</p>
            <el-button type="primary" plain>查看</el-button>
            <el-button type="success" plain>下载</el-button>
        </div>
        <div class="content_status">
            <p>申请状态</p>
            <el-button type="primary" plain>申请对比实验</el-button>
        </div>
    </div>

   <!-- 留言窗口 -->
    <outWindow 
    :isVisible = "showModal2"
    :styleProps = "styleProps2"
    @closeModal = "closeModal()"
   >
        <div
            id="message_block"
            h="30"
            w="30"
            m="2"
            :style="{
            boxShadow: `var(${getCssVarName('light')})`,
            }"
        >
            <el-card class="message" style="max-width: 480px" shadow="hover">
                <template class="header" #header>
                <div class="card-header">
                    <span>检测人员:甲 留言于2024.11.07 23:23:21</span>
                </div>
                </template>
                <p class="text item">请添加---!</p>
            </el-card>
            <el-card class="message" style="max-width: 480px" shadow="hover">
                <template class="header" #header>
                <div class="card-header">
                    <span>检测人员:甲 留言于2024.11.07 23:23:21</span>
                </div>
                </template>
                <p class="text item">请添加---!</p>
            </el-card>
            <el-card class="message" style="max-width: 480px" shadow="hover">
                <template class="header" #header>
                <div class="card-header">
                    <span>检测人员:甲 留言于2024.11.07 23:23:21</span>
                </div>
                </template>
                <p class="text item">请添加---!</p>
            </el-card>
        </div>

        <el-input
            id="text_input"
            v-model="textarea"
            style="width: 240px"
            :rows="2"
            type="textarea"
            placeholder="请输入留言内容"
        />
        <el-button id="send_text" type="success">发送</el-button>
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