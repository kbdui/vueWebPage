<template>
    <div class="message-management">
        <Top></Top>
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
import { ref, onMounted, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import Top from './Top.vue';
import { user_data } from '@/status';
import axios from 'axios';

// 定义留言的数据结构
function MessageList(messageid, projectid, accountid, messagetype, state, messagetime, message) {
  this.messageid = messageid;
  this.projectid = projectid;
  this.accountid = accountid;
  this.messagetype = messagetype;
  this.state = state;
  this.messagetime = messagetime;
  this.message = message;
}

// 用于存储留言数据的响应式变量
const messages = ref([]);
const dialogVisible = ref(false);
const selectedMessage = ref(null);
const activeTab = ref('Offiers');

function fetchMessages(messageType) {
  axios.post('http://localhost:8080/get_message', {
    message_type: messageType
  }, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  .then(response => {
    if (response.data.code === 1) {
      messages.value = response.data.data.map(item => new MessageList(item.messageid, item.projectid, item.accountid, item.messagetype, item.state, item.messagetime, item.message));
      console.log("规程规程规程")
    } else {
      ElMessage.error('获取留言失败: ' + response.data.message);
    }
  })
  .catch(error => {
    console.error('请求错误:', error);
    ElMessage.error('请求错误: ' + error.message);
  });
}

// 在组件挂载时获取留言
onMounted(() => {
  fetchMessages(activeTab.value); // 根据当前激活的标签页获取对应模块的留言
  console.log("组件挂载时："+activeTab.value);
});

// 监听标签页变化，获取对应模块的留言
watch(activeTab, (newVal) => {
  fetchMessages(newVal);
});
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