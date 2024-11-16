<template>
  <div class="min-h-screen bg-gray-50">
    <top/>
    <!-- Main Content -->
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 class="text-2xl font-semibold text-gray-900 mb-2">GB 19083-2003 4.1</h1>
      <h2 class="text-xl text-gray-700 mb-6">医用防护口罩>基本要求</h2>

      <!-- Tabs -->
      <el-tabs class="mb-6">
        <el-tab-pane label="人员"></el-tab-pane>
        <el-tab-pane label="设备" name="equipment"></el-tab-pane>
        <el-tab-pane label="规程"></el-tab-pane>
        <el-tab-pane label="样品"></el-tab-pane>
      </el-tabs>

      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex justify-between items-center mb-4">
          <p class="text-gray-600">(6/10) 若要检测本项目，可能用到以下设备</p>
          <el-button type="primary" @click="dialogVisible = true">
            添加记录
          </el-button>
        </div>

        <!-- Table -->
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="type" label="器械品类" min-width="70%">
          </el-table-column>
          <el-table-column label="操作" min-width="30%">
            <template #default="scope">
              <el-button
                type="primary"
                size="small"
                @click="handleEdit(scope.$index, scope.row)"
              >
                编辑
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <!-- Add Dialog -->
        <el-dialog
          v-model="dialogVisible"
          title="添加器械品类"
          width="30%"
          :close-on-click-modal="false"
        >
          <el-form :model="form">
            <el-form-item label="器械品类">
              <el-input v-model="form.type"></el-input>
            </el-form-item>
          </el-form>
          <template #footer>
            <span class="dialog-footer">
              <el-button @click="dialogVisible = false">取消</el-button>
              <el-button type="primary" @click="handleAdd">
                添加
              </el-button>
            </span>
          </template>
        </el-dialog>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Top from './Top.vue'
const dialogVisible = ref(false)
const form = ref({
  type: ''
})

const tableData = ref([
  { type: '天平' },
  { type: '酸度计' }
])

const handleAdd = () => {
  if (form.value.type) {
    tableData.value.push({
      type: form.value.type
    })
    form.value.type = ''
    dialogVisible.value = false
  }
}

const handleEdit = (index, row) => {
  form.value.type = row.type
  dialogVisible.value = true
}

</script>

<style scoped>
.el-tabs {
  --el-tabs-header-height: 40px;
}
</style>