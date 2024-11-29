<template>
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

    <!-- 内容 -->
    <div id="content18">
        <h2>对比实验申请记录</h2>
        <div v-for="(project, index) in records" :key="index" class="project-item18">
          <el-card>
            <div class="project-content18">
              <!-- Project Title -->
              <el-link type="primary" class="project-title">
                {{ project.title }}
              </el-link>
  
              <!-- Status Section -->
                <div class="status-item18">
                  进行状态：
                  <el-tag 
                    :type="project.Status ? 'primary' : 'success'"
                    effect="plain"
                  >
                    {{ project.Status ? '计划' : '完成' }}
                  </el-tag>
                </div>
            </div>
          </el-card>
        </div>
    </div>
</template>

<script lang="ts" setup>
    import { ref } from 'vue'
    import { useRouter } from 'vue-router'
    import headshot from './headshot.vue'
    import { user_data } from '@/status'

    const router = useRouter()

    // page header 页头
    const goBack = () => {
        router.push('/entry')
        console.log('go back')
    }

    // menu 菜单
    const activeIndex1 = ref('3')
    const handleSelect1 = (key: string, keyPath: string[]) => {
        if(key.match('1')) router.push('/people13')
        if(key.match('2')) router.push('/testmachine')
        if(key.match('4')) router.push('/samplep19')
        console.log(key, keyPath)
    }

    // 列表内容
    const records = ref([
        {
        title: '项目GB 19083-2003 4.1 医用防护口罩>基本要求(点击跳转到对应项目界面)',
        Status: true,
        },
        {
        title: '项目GB 19083-2003 4.2 医用防护口罩> 口罩带连接强度(点击跳转到对应项目界面)',
        Status: false,
        }
    ])
</script>

<style>
#content18{
    margin-top: 2rem;
    margin-left: 1rem;
}
.project-item18{
    margin-top: 1rem;
}
.project-content18{
    display: flex;
    justify-content: space-between;
    align-items: center;
}
</style>