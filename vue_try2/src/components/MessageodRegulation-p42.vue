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
import { ref } from 'vue';
import Top from './Top.vue';
import { user_data } from '@/status';

// 用于存储留言数据的响应式变量
const messages = ref([]);
const dialogVisible = ref(false);
const selectedMessage = ref(null);
const activeTab = ref('Offiers');
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