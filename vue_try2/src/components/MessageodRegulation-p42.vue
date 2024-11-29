<template>
    <div class="message-management">
        <Top
        :_name="user_data.name"
        :username="user_data.username"
        :institution="user_data.institution"
        :contact="user_data.contact"
        :accountType="user_data.accountType"
        ></Top>
        <div class="secondary-nav">
            <span class="current-page">留言管理</span>
        <router-link to="/message" class="nav-link">清单管理</router-link>

      </div>
      
      <!-- Action Buttons -->
      <div class="action-buttons">
        <el-button type="success" @click="exportToPDF">
          导出增加内容提醒清单
        </el-button>
      </div>
  
      <!-- Category Tabs -->
      <el-tabs v-model="activeTab" class="message-tabs">

        <el-tab-pane label="人员" name="personnel"></el-tab-pane>
        <el-tab-pane label="设备" name="equipment"></el-tab-pane>

        <el-tab-pane label="规程" name="regulation">
          <div class="tab-header">
            <el-button type="primary" @click="markAllResolved">
              全部标记为已解决
            </el-button>
          </div>
  
          <!-- Message List -->
          <div class="message-list">
            <el-card v-for="message in messages" :key="message.id" class="message-item">
              <div class="message-header">
                <div class="message-info">
                  <p>留言编号：{{ message.id }}</p>
                  <p>留言时间：{{ message.time }}</p>
                  <p>留言人：{{ message.sender }}</p>
                </div>
                <div class="message-source">
                  <p>来自</p>
                  <el-link type="primary">{{ message.source }}</el-link>
                </div>
              </div>
              <div class="message-status">
                状态：{{ message.resolved ? '已解决' : '未解决' }}
              </div>
              <div class="message-actions">
                <el-button type="primary" @click="openMessageDialog(message)">
                  打开留言框
                </el-button>
                <el-button 
                  type="success" 
                  @click="markResolved(message)"
                  v-if="!message.resolved"
                >
                  标记为已解决
                </el-button>
              </div>
            </el-card>
          </div>
        </el-tab-pane>
    
        <el-tab-pane label="物料" name="material"></el-tab-pane>
      </el-tabs>
  
      <!-- Message Dialog -->
      <el-dialog
        v-model="dialogVisible"
        title="留言详情"
        width="50%"
      >
        <div v-if="selectedMessage" class="message-dialog-content">
          <p>留言编号：{{ selectedMessage.id }}</p>
          <p>留言时间：{{ selectedMessage.time }}</p>
          <p>留言人：{{ selectedMessage.sender }}</p>
          <p>留言项目：{{ selectedMessage.source }}</p>
          <el-input
            v-model="selectedMessage.content"
            type="textarea"
            rows="4"
            placeholder="留言内容"
          />
        </div>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="saveMessage">保存</el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { ElMessage } from 'element-plus'
  import jsPDF from 'jspdf'
  import Top from './Top.vue'
  import { user_data } from '@/status'
  // State
  const activeMenu = ref('2')
  const activeTab = ref('regulation')
  const dialogVisible = ref(false)
  const selectedMessage = ref(null)
  const messages = ref([
    {
      id: '1932403245',
      time: '2024.11.07 23:23:21',
      sender: '甲',
      source: 'GB 19083-2003 4.3 医用防护口罩 > 呼吸阻力(点击自动跳转到对应项目界面)',
      content: '需要审核确认',
      resolved: false
    },
    {
      id: '1932403246',
      time: '2024.11.07 12:23:21',
      sender: '乙',
      source: 'GB 19083-2003 4.3 医用防护口罩 > 呼吸阻力(点击自动跳转到对应项目界面)',
      content: '已完成检查',
      resolved: true
    }
  ])
  
  // Methods
  const markAllResolved = () => {
    messages.value = messages.value.map(message => ({
      ...message,
      resolved: true
    }))
    ElMessage.success('所有留言已标记为已解决')
  }
  
  const markResolved = (message) => {
    message.resolved = true
    ElMessage.success('留言已标记为已解决')
  }
  
  const openMessageDialog = (message) => {
    selectedMessage.value = { ...message }
    dialogVisible.value = true
  }
  
  const saveMessage = () => {
    const index = messages.value.findIndex(m => m.id === selectedMessage.value.id)
    if (index !== -1) {
      messages.value[index] = { ...selectedMessage.value }
      ElMessage.success('留言已保存')
      dialogVisible.value = false
    }
  }
  
  const exportToPDF = () => {
    const doc = new jsPDF()
    let yPos = 20
  
    doc.setFont('helvetica', 'bold')
    doc.text('增加内容提醒清单', 20, yPos)
    
    messages.value.forEach((message, index) => {
      yPos += 20
      doc.setFont('helvetica', 'normal')
      doc.text(`${index + 1}. 留言编号: ${message.id}`, 20, yPos)
      yPos += 10
      doc.text(`   时间: ${message.time}`, 20, yPos)
      yPos += 10
      doc.text(`   状态: ${message.resolved ? '已解决' : '未解决'}`, 20, yPos)
      yPos += 10
      doc.text(`   内容: ${message.content}`, 20, yPos)
      yPos += 10
    })
  
    doc.save('留言清单.pdf')
    ElMessage.success('PDF导出成功')
  }
  </script>
  
  <style scoped>
  .top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: -30px;
}
.secondary-nav {
    margin-bottom: 20px;
    font-size: 20px;
  }
  .nav-link {
    color: #409EFF;
    text-decoration: none;
    margin-right: 20px;

  }
  .current-page {
    color: #000;
    margin-right: 20px;

  }
  .message-management {
    padding: 20px;
  }
  
  .nav-menu {
    margin-bottom: 20px;
  }
  

  .action-buttons {
    font-size: 18px;
    margin-bottom: 15px;

  }
  
  .message-tabs {
    margin-top: 20px;
  }
  
  .tab-header {
    margin-bottom: 20px;
  }
  
  .message-item {
    margin-bottom: 20px;
  }
  
  .message-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 15px;
  }
  
  .message-info p {
    margin: 5px 0;
  }
  
  .message-source {
    text-align: right;
  }
  
  .message-status {
    margin: 10px 0;
  }
  
  .message-actions {
    display: flex;
    gap: 10px;
    margin-top: 15px;
  }
  
  .message-dialog-content {
    padding: 20px;
  }
  
  .message-dialog-content p {
    margin-bottom: 10px;
  }
  </style>