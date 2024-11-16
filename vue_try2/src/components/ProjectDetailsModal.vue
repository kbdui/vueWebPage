<!-- 规程页面2使用的弹窗 -->
<template>
    <el-dialog
      :title="'对比实验记录编号:' + project.id"
      v-model="dialogVisible"
      width="50%"
      @close="handleClose"
    >
      <div class="project-details">
        <h2>对比测试项目</h2>
        <p>{{ project.project }}</p>
  
        <h3>申请人员表</h3>
        <el-table :data="project.applicants" style="width: 100%">
          <el-table-column prop="name" label="姓名" />
          <el-table-column prop="institution" label="所属机构" />
          <el-table-column prop="contact" label="联系方式" />
        </el-table>
      </div>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">关闭</el-button>
        </span>
      </template>
    </el-dialog>
  </template>
  
  <script setup>
  import { ref, watch } from 'vue'
  
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
  </style>