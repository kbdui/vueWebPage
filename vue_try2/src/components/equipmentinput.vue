<template>
    <el-dialog
      v-model="dialogVisible"
      title="输入设备信息"
      width="50%"
      :before-close="handleClose"
    >
      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="100px"
        class="equipment-form"
      >
        <el-form-item label="设备名称" prop="name">
          <el-input v-model="form.name" placeholder="请输入设备名称" />
        </el-form-item>
  
        <el-form-item label="生产厂家" prop="source">
          <el-input v-model="form.source" placeholder="请输入生产厂家" />
        </el-form-item>
  
        <el-form-item label="设备ID" prop="equipmentId">
          <el-input v-model="form.equipmentId" placeholder="请输入设备ID" />
        </el-form-item>
  
        <el-form-item label="需求数量" prop="quantity">
          <el-input-number
            v-model="form.quantity"
            :min="1"
            :controls-position="'right'"
          />
        </el-form-item>
      </el-form>
  
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleClose">取消</el-button>
          <el-button type="primary" @click="handleSubmit">确定</el-button>
        </span>
      </template>
    </el-dialog>
  </template>
  
  <script setup>
  import { ref, reactive } from 'vue'
  import { ElMessage } from 'element-plus'
  const emit = defineEmits(['submit'])
  const dialogVisible = ref(false)
  const formRef = ref(null)
  import equipmenginput from './equipmentinput.vue'
  const form = reactive({
    name: '',
    source: '',
    equipmentId: '',
    quantity: 1
  })
  
  const rules = {
    name: [
      { required: true, message: '请输入设备名称', trigger: 'blur' }
    ],
    manufacturer: [
      { required: true, message: '请输入生产厂家', trigger: 'blur' }
    ],
    equipmentId: [
      { required: true, message: '请输入设备ID', trigger: 'blur' }
    ],
    quantity: [
      { required: true, message: '请输入需求数量', trigger: 'blur' }
    ]
  }
  
  const handleClose = () => {
    dialogVisible.value = false
    formRef.value?.resetFields()
  }
  
  const handleSubmit = async () => {
    if (!formRef.value) return
  
    try {
      await formRef.value.validate()
      emit('submit', { ...form })
      // 这里添加提交逻辑
      console.log('提交的表单数据:', form)
      console.log('Emitting submit event with data:', { ...form })
   //   ElMessage.success('设备信息提交成功')
      handleClose()
    } catch (error) {
      console.error('表单验证失败:', error)
      ElMessage.error('请填写完整的设备信息')
    }
  }
  
  const open = () => {
    dialogVisible.value = true
  }
  
  defineExpose({
    open
  })
  </script>
  
  <style scoped>
  .equipment-form {
    padding: 20px;
  }
  
  .dialog-footer {
    padding-top: 20px;
    text-align: right;
  }
  </style>