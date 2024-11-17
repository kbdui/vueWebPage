<template>
    <div class="comment-management">
      <el-tabs v-model="activeTab" class="main-tabs">
        <el-tab-pane label="留言管理" name="comments"></el-tab-pane>
        <el-tab-pane label="清单管理" name="lists"></el-tab-pane>
      </el-tabs>
  
      <el-button type="success" class="export-btn">
        导出增加内容提醒清单
      </el-button>
  
      <el-tabs v-model="activeFilter" class="filter-tabs">
        <el-tab-pane label="人员" name="personnel"></el-tab-pane>
        <el-tab-pane label="设备" name="equipment"></el-tab-pane>
        <el-tab-pane label="规程" name="procedures"></el-tab-pane>
        <el-tab-pane label="物料" name="materials"></el-tab-pane>
      </el-tabs>
  
      <div class="mark-all-resolved">
        <el-button type="primary" @click="markAllAsResolved">
          全部标为已解决
        </el-button>
      </div>
  
      <div class="comments-list">
        <el-card v-for="comment in comments" :key="comment.id" class="comment-card">
          <div class="comment-header">
            <div>留言编号：{{ comment.id }}</div>
            <div>留言时间：{{ comment.timestamp }}</div>
            <div>留言人：{{ comment.author }}</div>
          </div>
          <div class="comment-content">
            <div class="comment-title">{{ comment.title }}</div>
            <el-link type="primary" class="comment-link">{{ comment.gbReference }}</el-link>
            <div class="comment-status">
              状态：<span :class="{ 'resolved': comment.resolved, 'unresolved': !comment.resolved }">
                {{ comment.resolved ? '已解决' : '未解决' }}
              </span>
            </div>
          </div>
          <div class="comment-actions">
            <el-button type="success" plain @click="openCommentDialog(comment)">打开留言框</el-button>
            <el-button 
              v-if="!comment.resolved"
              type="primary" 
              @click="markAsResolved(comment.id)"
            >
              标为已解决
            </el-button>
          </div>
        </el-card>
      </div>
  
      <!-- 留言对话框 -->
      <el-dialog
        v-model="dialogVisible"
        title="留言详情"
        width="50%"
      >
        <template v-if="selectedComment">
          <h3>{{ selectedComment.title }}</h3>
          <p><strong>留言编号：</strong>{{ selectedComment.id }}</p>
          <p><strong>留言时间：</strong>{{ selectedComment.timestamp }}</p>
          <p><strong>留言人：</strong>{{ selectedComment.author }}</p>
          <p><strong>参考标准：</strong>{{ selectedComment.gbReference }}</p>
          <p><strong>状态：</strong>{{ selectedComment.resolved ? '已解决' : '未解决' }}</p>
          <el-input
            v-model="commentContent"
            type="textarea"
            :rows="4"
            placeholder="请输入留言内容"
          ></el-input>
        </template>
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button type="primary" @click="saveComment">
              保存
            </el-button>
          </span>
        </template>
      </el-dialog>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const activeTab = ref('comments')
  const activeFilter = ref('personnel')
  const dialogVisible = ref(false)
  const selectedComment = ref(null)
  const commentContent = ref('')
  
  const comments = ref([
    {
      id: '19324032345',
      timestamp: '2024.11.07 23:23:21',
      author: '张三',
      title: '未有',
      gbReference: 'GB 19083-2003 4.3 医用防护口罩 > 呼吸阻力(点击自动跳转到对应项目界面)',
      resolved: false,
      content: ''
    },
    {
      id: '19324032345',
      timestamp: '2024.11.07 12:23:21',
      author: '李四',
      title: '未有',
      gbReference: 'GB 19083-2003 4.3 医用防护口罩 > 呼吸阻力(点击自动跳转到对应项目界面)',
      resolved: true,
      content: ''
    }
  ])
  
  const markAsResolved = (id) => {
    const comment = comments.value.find(c => c.id === id)
    if (comment) {
      comment.resolved = true
    }
  }
  
  const markAllAsResolved = () => {
    comments.value.forEach(comment => {
      comment.resolved = true
    })
  }
  
  const openCommentDialog = (comment) => {
    selectedComment.value = comment
    commentContent.value = comment.content
    dialogVisible.value = true
  }
  
  const saveComment = () => {
    if (selectedComment.value) {
      selectedComment.value.content = commentContent.value
      dialogVisible.value = false
    }
  }
  </script>
  
  <style scoped>
  .comment-management {
    padding: 20px;
    max-width: 1200px;
    margin: 0 auto;
  }
  
  .main-tabs {
    margin-bottom: 20px;
  }
  
  .export-btn {
    margin-bottom: 20px;
  }
  
  .filter-tabs {
    margin-bottom: 20px;
  }
  
  .mark-all-resolved {
    text-align: right;
    margin-bottom: 20px;
  }
  
  .comment-card {
    margin-bottom: 20px;
  }
  
  .comment-header {
    font-size: 14px;
    color: #999;
    margin-bottom: 10px;
  }
  
  .comment-content {
    margin-bottom: 15px;
  }
  
  .comment-title {
    font-weight: bold;
    margin-bottom: 5px;
  }
  
  .comment-link {
    margin-bottom: 5px;
    display: block;
  }
  
  .comment-status {
    margin-bottom: 10px;
  }
  
  .resolved {
    color: #67C23A;
  }
  
  .unresolved {
    color: #E6A23C;
  }
  
  .comment-actions {
    display: flex;
    justify-content: space-between;
  }
  
  @media (max-width: 768px) {
    .comment-actions {
      flex-direction: column;
      gap: 10px;
    }
    
    .comment-actions .el-button {
      width: 100%;
    }
  }
  
  .dialog-footer {
    display: flex;
    justify-content: flex-end;
    margin-top: 20px;
  }
  </style>