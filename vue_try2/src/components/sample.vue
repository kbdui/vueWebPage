<script lang="ts" setup>
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import headshot from './headshot.vue'
    import { user_data } from '@/status'

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

    //表格内容}
  const  tableData = [
  {
    name: '医用防护口罩',
    id:"GB 19083-2023",
    productname: '医用防护口罩',
    samplename: '普通口罩',
    product: '107厂',
    size: '/',
    requirement: '输入框',
    opration: '添加到预置清单',
  },
  {
    name: '医用防护口罩',
    id:"GB 19083-2023",
    productname: '医用防护口罩',
    samplename: '普通口罩',
    product: '113厂',
    size: '/',
    requirement: '输入框',
    opration: '添加到预置清单',
  },
  {
    name: '医用防护口罩',
    id:"GB 19083-2023",
    productname: '医用防护口罩',
    samplename: 'N95口罩',
    product: '113厂',
    size: '/',
    requirement: '输入框',
    opration: '添加到预置清单',
  },
  {
    name: '医用防护口罩',
    id:"GB 19083-2023",
    productname: '医用防护口罩',
    samplename: 'N95口罩',
    product: '113厂',
    size: '/',
    requirement: '输入框',
    opration: '添加到预置清单',
  },
  {
    name: '医用防护口罩',
    id:"GB 19083-2023",
    productname: '医用防护口罩',
    samplename: 'N95口罩',
    product: '113厂',
    size: '/',
    requirement: '输入框',
    opration: '添加到预置清单',
  },
  {
    name: '医用防护口罩',
    id:"GB 19083-2023",
    productname: '医用防护口罩',
    samplename: 'N95口罩',
    product: '113厂',
    size: '/',
    requirement: '输入框',
    opration: '添加到预置清单',
  },
  {
    name: '医用防护口罩',
    id:"GB 19083-2023",
    productname: '医用防护口罩',
    samplename: 'N95口罩',
    product: '113厂',
    size: '/',
    requirement: '输入框',
    opration: '添加到预置清单',
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
  <p id="test">检测</p>
  <el-button type="success"  id="detail" size="mini">留言</el-button>
  <H2 color=" light green"> GB 19083-2003 医用防护口罩</H2>
  <p>可能需要以下样品</p>
  </div>

    <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="name" label="标准名称" width="100" />
        <el-table-column prop="id" label="标准编号" width="100" />
        <el-table-column prop="productname" label="产品名称" />
        <el-table-column prop="samplename" label="样品名称" width="100" />
        <el-table-column prop="product" label="生产厂家" width="100" />
        <el-table-column prop="size" label="型号规格" />
        <el-table-column prop="requirement" label="申请需求" width="100" />
        <el-table-column prop="opration" label="操作" width="100" />
    </el-table>
</template>

<style>
    #top1{
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    #scontent1 h2{
        color: rgb(30, 193, 30);
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