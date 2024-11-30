<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 页头 -->
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

    <!-- Main Content -->
    <div class="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">

      <div class="bg-white p-6 rounded-lg shadow">
        <div class="flex justify-between items-center mb-4">
          <p class="text-gray-600">(6/10) 若要检测本项目，可能用到以下设备</p>
          <el-button type="primary" @click="dialogVisible = true">
            添加记录
          </el-button>
        </div>

        <!-- Table -->
        <div class="equipment-table">
          <el-table :data="equipmentList" style="width: 100%">
            <el-table-column prop="equipmentid" label="ID" />
            <el-table-column prop="equipmentname" label="Name" />
            <el-table-column label="操作" width="120" align="right">
              <template #default="scope">
                <el-button 
                  type="primary" 
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)"
                >
                  点击详情
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      
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

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { project_id } from '@/status'
import axios from 'axios'
import { onMounted } from 'vue'
const router = useRouter()

// page header 页头
const goBack = () => {
    router.push('/supportStandardQuery')
    console.log('go back')
}

// menu 菜单
const activeIndex1 = ref('2')
const handleSelect1 = (key: string, keyPath: string[]) => {
    if(key.match('1')) router.push('/supportDetails/')
    if(key.match('3')) router.push('/supprotp36')
    if(key.match('4')) router.push('/p38')
    console.log(key, keyPath)
}
const projectid=project_id
 const data=ref({
     equipmengid:'',
     projectid:'',
     equipmentname:''
 })
 const equipmentList = ref([]);
 function getallmachine()
 {
    axios.post('http://localhost:8080/equipments_by_project',{
      project_id : project_id.value
            },
            {
              headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
            }).then(function(response){
             equipmentList.value=response.data.data
            }).catch(function(error){
                console.log(error)
            })
 }
 function loadprojectid() {
    const savedData = localStorage.getItem('project_id');
    if (savedData) {
        project_id.value = JSON.parse(savedData);
        console.log(project_id.value)
    }
}
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
onMounted(() => {
    loadprojectid()
    getallmachine()
      })
const handleEdit = (index, row) => {
  form.value.type = row.type
  dialogVisible.value = true
}
</script>
<style scoped>
.el-tabs {
  --el-tabs-header-height: 40px;
}
.text-gray-600{
  margin: 1rem 0 1rem 0;
}
</style>
