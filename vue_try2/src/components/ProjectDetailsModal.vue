<!-- 规程页面2使用的弹窗 -->
<template>
    <el-dialog
      :title="'对比实验记录编号: ' + project.projectTest.testid"
      v-model="dialogVisible"
      width="50%"
      @close="handleClose"
    >
      <div class="project-details">
        <h2>对比测试项目</h2>
        <p>{{ project.project.projecttype }} {{ project.project.projectname }}</p>
        <h2 id="test-info">对比测试信息</h2>
        <p>轮数: {{ project.projectTest.epoch }}</p>
        <p>状态: {{ project.projectTest.state }}</p>
        <p>测试时间: </p>
        <p>{{ project.projectTest.testtime }}</p>
  
        <h3>申请人员表</h3>
        <el-table :data="allpeoples" style="width: 100%">
          <el-table-column prop="name" label="姓名">
            <template #default="scope">
              <p>{{ scope.row.username }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="institution" label="所属机构">
            <template #default="scope">
              <p>{{ scope.row.institution }}</p>
            </template>
          </el-table-column>
          <el-table-column prop="contact" label="联系方式">
            <template #default="scope">
              <p>{{ scope.row.contact }}</p>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">关闭</el-button>
        </span>
      </template> -->
    </el-dialog>
  </template>
  
  <script setup>
  import { ref, watch, onMounted, inject } from 'vue'
  import axios from 'axios'

  const baseUrl = inject('baseUrl')
  
  const props = defineProps({
    project: {
      type: Object,
      required: true
    }
  })
  
  const emit = defineEmits(['close'])
  
  const dialogVisible = ref(true)
  
  const handleClose = () => {
    dialogVisible.value = false
    emit('close')
  }
  
  watch(() => props.project, () => {
    dialogVisible.value = true
  })

  // 获取该项目正在进行的对比实验人员信息
  const allpeoples = ref([])
  function getPeoples() {
    axios.post(baseUrl + '/show_project_test_ongoing',{
        project_id : props.project.project.projectid
    },{
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
    }).then(function(response){
        allpeoples.value = response.data.data.userAccountList
    }).catch(function(error){
        console.log(error)
        ElMessage.error('获取对比实验人员信息失败')
    })
  }

  onMounted(() => {
    getPeoples()
  })

  </script>
  
  <style scoped>
  .project-details h2 {
    font-size: 18px;
    margin-bottom: 10px;
  }
  
  .project-details h3 {
    font-size: 16px;
    margin-top: 20px;
    margin-bottom: 10px;
  }
  #test-info {
    margin-top: 1rem;
  }
  </style>