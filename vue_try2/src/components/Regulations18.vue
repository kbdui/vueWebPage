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
        <div v-for="(record, index) in records" :key="index" class="project-item18">
          <el-card>
            <div class="project-content18">
              <!-- Project Title -->
              <el-link type="primary" class="project-title">
                {{ record.projectTest.testid }}  {{ record.project.categories }}  {{ record.project.projecttype }}  {{ record.project.projectname }}
              </el-link>
  
              <!-- Status Section -->
                <div class="status-item18">
                  进行状态：
                  <el-tag 
                    :type="record.projectTest.state === 'Finish' ? 'success' : 'primary'"
                    effect="plain"
                  >
                    {{ record.projectTest.state === 'Finish' ? '完成' : '计划' }}
                  </el-tag>
                </div>
            </div>
          </el-card>
        </div>
    </div>
</template>

<script lang="ts" setup>
  import { ref,onMounted } from 'vue'
  import { useRouter } from 'vue-router'
  import headshot from './headshot.vue'
  import { user_data } from '@/status'
  import axios from 'axios'
  import { ElMessage } from 'element-plus'

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

  // 获取对比实验申请记录
  const records = ref([])
  function getRecords() {
    axios.post('http://localhost:8080/show_my_compare_plan',{
        account_id : user_data.value.accountid
    },{
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    }).then(function(response){
        records.value = response.data.data
    }).catch(function(error){
        console.log(error)
        ElMessage.error('获取对比实验申请记录失败')
    })
  }


  // 一个用于从localStorage加载user_data的函数
  function loadUserData() {
      const savedData = localStorage.getItem('user_data');
      if (savedData) {
          user_data.value = JSON.parse(savedData);
      }
  }

  // 组件挂载时执行的函数
  onMounted(() => {
      loadUserData();
      getRecords();
  })

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