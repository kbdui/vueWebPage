<template>
  <div class="standard-details">
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
      </div>

      <div class="equipment-table">
        <el-table :data="equipmentList" style="width: 100%">
          <el-table-column prop="equipmentid" label="ID" />
          <el-table-column prop="equipmentname" label="Name" />
          <el-table-column label="操作" width="120" align="right">
            <template #default="scope">
              <el-button type="primary" @click="showDetails(scope.row)">
                点击详情
              </el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <el-dialog
        v-model="detailsVisible"
        :title="selectedEquipment?.name"
        width="80%"
        destroy-on-close
      >
      <div class="equipment-container">
        <!-- 顶部操作栏 -->
        <div class="top-bar">
          <h2 class="dialog-title">天平(2/4)</h2>
          <el-button type="success" @click="handleAdd">添加</el-button>
        </div>
    
        <!-- 设备列表 -->
        <div class="equipment-details">
          <div class="equipment-grid" v-if="equipmentDetails.length > 0">
            <el-card
              v-for="item in equipmentDetails"
              :key="item.id"
              class="equipment-card"
              shadow="hover"
            >
              <div class="equipment-content">
                <div class="equipment-image">
                  <el-image
                    :src="item.picture_url"
                    fit="cover"
                    :fallback="'/placeholder.svg?height=200&width=200'"
                  >
                    <template #error>
                      <div class="image-placeholder">
                        <el-icon><Picture /></el-icon>
                        <span>没有照片</span>
                      </div>
                    </template>
                  </el-image>
                  <el-tag size="small" type="success" class="image-tag">专入照片</el-tag>
                </div>
                
                <div class="equipment-info">
                  <div class="info-row">
                    <span class="label">设备名称:</span>
                    <span class="value">{{ item.scheme_name }}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">生产厂家:</span>
                    <span class="value">{{ item.source }}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">生产编号:</span>
                    <span class="value">{{ item.scheme_number }}</span>
                  </div>
                  <div class="info-row">
                    <span class="label">设备ID:</span>
                    <span class="value">{{ item.scheme_id }}</span>
                  </div>
                  
                  <div class="equipment-actions">
                    <el-link
                      type="primary"
                      class="pdf-link"
                      @click="viewPdf(item)"
                    >
                      设备详情(点击后查看设备详情.pdf)
                    </el-link>
                    
                    <div class="quantity-section">
                      <span class="quantity-label">需求数量</span>
                      <el-input-number
                        v-model="item.quantity"
                        :min="1"
                        size="small"
                        :controls-position="'right'"
                      />
                    </div>
                    
                    <div class="button-group">
                      <el-button
                        type="primary"
                        @click="addToPreset(item)"
                      >
                        加入到预置清单
                      </el-button>
                      <el-button
                        type="primary"
                        plain
                        @click="handleEdit(item)"
                      >
                        编辑
                      </el-button>
                    </div>
                  </div>
                </div>
              </div>
            </el-card>
          </div>
          
          <!-- 空状态 -->
          <el-empty
            v-else
            description="暂无设备信息"
          />
        </div>
        <!-- 添加设备对话框 -->
        <equipmentinput ref="inputDialogRef" @submit="handleEquipmentSubmit" />
      </div>
    <!-- 底部操作栏 -->
    <template #footer>
      <div class="dialog-footer">
        <el-button type="danger" @click="handleClose">关闭</el-button>
      </div>
    </template>
  </el-dialog>
      <!-- Add Dialog -->
      <el-dialog
        v-model="dialogVisible"
        title="添加器械品类"
        width="30%"
        :close-on-click-modal="false"
      >
        <el-form :model="form">
          <el-form-item label="器械品类">
            <el-input v-model="form.name"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary"  @click="handleSubmition">
              添加
            </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { equipment_id, project_id } from '@/status'
import axios from 'axios'
import { onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import equipmentinput from './equipmentinput.vue'

const inputDialogRef = ref(null)
const router = useRouter()
const activeTab = ref('equipment')
const detailsVisible = ref(false)
const selectedEquipment = ref(null)
const equipmentDetails = ref([]);
const dialogVisible = ref(false)
const isSampleExist = ref(false);
const newmachinename = ref('')
const projectid=project_id
const newname = ref('')
const newsource = ref('')
 const data=ref({
     equipmengid:'',
     projectid:'',
     equipmentname:''
 })
 const form = ref({
  name: ''
})
 const equipmentList = ref([]);
// page header 页头
const goBack = () => {
    router.push('/supportStandardQuery')
    console.log('go back')
}
const newEquipment = ref([])
// menu 菜单
const activeIndex1 = ref('2')
const handleSelect1 = (key: string, keyPath: string[]) => {
    if(key.match('1')) router.push('/supportDetails/')
    if(key.match('3')) router.push('/supprotp36')
    if(key.match('4')) router.push('/p38')
    console.log(key, keyPath)
}

const handleEquipmentSubmit = (newEquipment) => {
   console.log(newEquipment)
  newname.value=newEquipment.name
  newsource.value=newEquipment.source
  console.log(newname.value,newsource.value)
  // ElMessage.success('设备添加成功')
  addnewscheme()
}

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
 function getallequipments()
 {
    axios.post('http://localhost:8080/schemes_by_equipment',{
      equipment_id : equipment_id.value
 },
 {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
 }).then(function(response){
   equipmentDetails.value=response.data.data
   console.log(response.data.data)
   console.log(equipmentDetails.value)
 }).catch(function(error){
  console.log(error)
 })
}
 function addnewmachine(){
    axios.post('http://localhost:8080/add_equip',{
      project_id : project_id.value,
      equipment_name : newmachinename.value
    },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(function(response){
      const data = response.data.data;
    console.log(data);
    if (data) {
      ElMessage.success( '添加成功');
      getallmachine()
    } else {
      ElMessage.error('添加失败,已有同名样品');
    }
    dialogVisible.value = false;
    }).catch(function(error){
      dialogVisible.value=false
    }).catch(function(error){
      console.log(error)
 })
}
function addnewscheme(){
    axios.post('http://localhost:8080/add_equip_scheme',{
      equipment_id : equipment_id.value,
      name: newname.value,
      source: newsource.value,
    },
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(function(response){
      const data = response.data.data;
      console.log(data);
      if (data) {
        ElMessage.success( '添加成功');
        getallequipments()
      } else {
        ElMessage.error('添加失败,已有同名样品');
      }
      dialogVisible.value = false;
    }).catch(function(error){
      console.log("foiewshofiew")
 })
}
 function loadprojectid() {
    const savedData = localStorage.getItem('project_id');
    if (savedData) {
        project_id.value = JSON.parse(savedData);
        console.log(project_id.value)
    }
}
function saveequipmentid() {
        localStorage.setItem('equipment_id', JSON.stringify(equipment_id.value));
    }

const showDetails = (row) => {
  selectedEquipment.value = row 
   equipment_id.value=row.equipmentid
   saveequipmentid() 
   console.log("equipment_id是",equipment_id.value)
  detailsVisible.value = true
  getallequipments()
}
function handleSubmition() {
  newmachinename.value=form.value.name
  console.log(newmachinename.value)
  addnewmachine()
}
const handleClose = () => {
  dialogVisible.value = false
}


const handleEdit = (item) => {
  ElMessage.success(`正在编辑设备: ${item.scheme_name}`)
}
const handleAdd = () => {
  inputDialogRef.value.open()
}
const viewPdf = (item) => {
  ElMessage.success(`查看${item.scheme_detail}的PDF详情`)
}

const addToPreset = (item) => {
  ElMessage.success(`已将${item.name}添加到预置清单，数量：${item.quantity}`)
}
onMounted(() => {
    loadprojectid()
    getallmachine()
      })
// const handleEdit = (index, row) => {
//   form.value.type = row.type
//   dialogVisible.value = true
// }
</script>
<style scoped>
.header {
  margin-bottom: 20px;
}

.back-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.title {
  font-size: 18px;
  margin: 0;
}

.notice-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
}

.notice-section p{
  margin-left: 1rem;
}

#m_leave{
  margin-right: 2rem;
}

.notice-button {
  width: 100%;
}

.equipment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.equipment-card {
  border: 1px solid #dcdfe6;
  border-radius: 4px;
  padding: 16px;
}

.equipment-image {
  background-color: #f5f7fa;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  color: #909399;
}

.equipment-info {
  display: grid;
  gap: 12px;
}

.equipment-name,
.manufacturer {
  color: #606266;
}

.pdf-link {
  color: #409EFF;
}

.quantity-section {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.dialog-footer {
  text-align: center;
  margin-top: 20px;
}

:deep(.el-dialog__header) {
  margin-right: 0;
}

:deep(.el-dialog__body) {
  padding-top: 10px;
}

:deep(.el-input-number) {
  width: 120px;
}
.equipment-container {
  padding: 20px;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.dialog-title {
  font-size: 20px;
  margin: 0;
}

.equipment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.equipment-card {
  border-radius: 8px;
}

.equipment-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.equipment-image {
  position: relative;
  width: 100%;
  height: 200px;
  background-color: #f5f7fa;
  border-radius: 4px;
  overflow: hidden;
}

.image-placeholder {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #909399;
  font-size: 14px;
}

.image-placeholder .el-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.image-tag {
  position: absolute;
  top: 8px;
  left: 8px;
}

.equipment-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.label {
  color: #606266;
  min-width: 80px;
}

.value {
  color: #303133;
  flex: 1;
}

.equipment-actions {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 12px;
}

.quantity-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.quantity-label {
  color: #606266;
}

.button-group {
  display: flex;
  gap: 12px;
}

.dialog-footer {
  text-align: right;
}

:deep(.el-dialog__body) {
  padding: 0;
}

:deep(.el-input-number) {
  width: 120px;
}
.equipment-container {
  padding: 20px;
}

.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.dialog-title {
  font-size: 20px;
  margin: 0;
}

.equipment-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
}

.equipment-card {
  border-radius: 8px;
}

.equipment-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.equipment-image {
  position: relative;
  width: 100%;
  height: 200px;
  background-color: #f5f7fa;
  border-radius: 4px;
  overflow: hidden;
}

.image-placeholder {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #909399;
  font-size: 14px;
}

.image-placeholder .el-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.image-tag {
  position: absolute;
  top: 8px;
  left: 8px;
}

.equipment-info {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.label {
  color: #606266;
  min-width: 80px;
}

.value {
  color: #303133;
  flex: 1;
}

.equipment-actions {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 12px;
}

.quantity-section {
  display: flex;
  align-items: center;
  gap: 12px;
}

.quantity-label {
  color: #606266;
}

.button-group {
  display: flex;
  gap: 12px;
}
</style>
