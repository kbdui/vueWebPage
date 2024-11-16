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

    // menu 菜单
    const activeIndex1 = ref('4')
    const handleSelect1 = (key: string, keyPath: string[]) => {
        if(key.match('1')) router.push('/details/')
        if(key.match('2')) router.push('/machinefirst')
        if(key.match('3')) router.push('/Regulations')
        console.log(key, keyPath)
    }
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
</template>

<style>
     #top1{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
</style>