<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
// page header 页头
    const goBack = () => {
        router.push('/standard')
        console.log('go back')
    }

// 页面跳转
function jumpToList(){
  router.push('/testmachine')
}
// 菜单部分
const activeIndex1 = ref('4')
const handleSelect1 = (key: string, keyPath: string[]) => {
  if(key.match('3')) router.push('/details/')
  if(key.match('5')) router.push('/Regulations')
  if(key.match('6')) router.push('/sample')
  console.log(key, keyPath)
}
// 表格部分
const tableData = [
  {
    name: '天平',
   
  },
  {
    name: '酸度计',
  },
  {
    name: '...',
  },
  {
    name: '...',
  },
  {
    name: '...',
  },
  {
    name: '...',
  },
  {
    name: '...',
  },
  {
    name: '...',
  },
]
// 详情部分
const showDialog = ref(false);
const items = ref([
  { name: 'UID型天平' },
  { name: 'IWO型天平' },
  { name: 'CKD型天平' },
  { name: 'XJK型天平' }
]);
</script>

<template>
    <!-- 页头部分 -->
<div id=" header">
    <el-page-header @back="goBack">
        <template #content>
          <span class="text-large font-600 mr-3">  GB 19083-2003 4.1 医用防护口罩>基本要求</span>
        </template>
      </el-page-header>
</div>
<!-- 菜单部分 -->
<div id="menu">
    <el-menu
    :default-active="activeIndex1"
    class="el-menu-demo"
    mode="horizontal"
    @select="handleSelect1"
  >
    <el-menu-item index="3">人员</el-menu-item>
    <el-menu-item index="4">设备</el-menu-item>
    <el-menu-item index="5">规程</el-menu-item>
    <el-menu-item index="6">样品</el-menu-item>
  </el-menu>
</div>
<p>若要检测本项目，可能要用到以下产品</p>
<el-button type="primary" id="message">Primary</el-button>
<div id="table">
    <el-table :data="tableData" style="width: 200%">
        <el-table-column prop="name" label="Name" width="600" />
        <el-table-column label="操作" width="200">
          
              <el-button type="primary" size="mini"  @click="showDialog = true" >点击详情</el-button>
              <el-dialog
              title="天平"
              v-model="showDialog"
              width="80%"
              center
            >
              <div class="modal-content">
                <div v-for="(item, index) in items" :key="index" class="device-info">
                  <img class="device-image" src="./images/photo2.png"/>
                  <p>设备名称: {{ item.name }}</p>
                  <p>生产厂家: 107厂</p>
                  <a href="#">设备详情(点击后查看设备详情pdf)</a>
                  <div>
                    <label for="quantity">需求数量:</label>
                    <input type="number" id="quantity" placeholder="数字输入框" />
                  </div>
                  <el-button type="primary" size="mini" @click="jumpToList">加入到预置清单</el-button>
                </div>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button @click="showDialog = false">关闭</el-button>
              </span>
            </el-dialog>
          </el-table-column>
      </el-table>
</div>
</template>
<style scoped>
 #message{
    display: flex;
    float: right;
    margin-top: -47px;
 }
 .modal-content {
    display: flex;
    justify-content: space-around; /* 使四个设备信息块在同一行内平均分布 */
    align-items: flex-start; /* 使内容从顶部开始 */
    flex-wrap: nowrap; /* 禁止换行 */
    padding: 20px;
  }
  
  .device-info {
    width: 80%; /* 调整宽度以适应四个块在同一行内 */
    margin: 0 10px; /* 减少左右间距 */
    padding: 10px; /* 减少内边距 */
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
    background-color: #f9f9f9;
    text-align: left; /* 标题居左 */
    transition: transform 0.3s, box-shadow 0.3s;
  }
  
  .device-info:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
  }
  
  .device-image {
    width: 100px; /* 调整图片宽度 */
    height: 100px; /* 调整图片高度 */
    object-fit: cover; /* 确保图片覆盖整个容器，同时保持宽高比 */
    border-radius: 4px;
    margin-bottom: 10px;
  }
  .device-info p {
    margin: 5px 0;
    color: #333;
    font-size: 14px; /* 减小字体大小以适应更小的空间 */
  }
  
  .device-info a {
    color: #007bff;
    text-decoration: none;
  }
  
  .device-info a:hover {
    text-decoration: underline;
  }
  
  .device-info input[type="number"] {
    width: 100%; /* 使输入框宽度占满整个设备信息块的宽度 */
    padding: 1px;
    margin: 5px 0;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  .device-info .el-button {
    margin-top: 10px;
    padding: 8px 16px;
    border-radius: 4px;
  }
</style>