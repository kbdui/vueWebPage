<template>
  <div class="message-management">
      <Top
      :_name="user_data.name"
      :username="user_data.username"
      :institution="user_data.institution"
      :contact="user_data.contact"
      :accountType="user_data.accountType"
      ></Top>
      <div class="mb-4">
        <el-menu
          :default-active="activeIndex1"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect1"
        >
          <el-menu-item index="1">留言管理</el-menu-item>
          <el-menu-item index="2">清单管理</el-menu-item>
        </el-menu>
      </div>
    
    <!-- Action Buttons -->
    <div class="action-buttons">
      <el-button type="success" @click="exportToPDF">
        导出增加内容提醒清单
      </el-button>
    </div>

    <!-- Category Tabs -->
    <el-tabs v-model="activeTab" class="message-tabs">
      <!-- 人模块的留言 -->
      <el-tab-pane label="人员" name="personnel">
        <div class="tab-header">
          <el-button type="primary" @click="markAllResolved">
            全部标记为已解决
          </el-button>
        </div>

        <!-- Message List -->
        <div class="message-list">
          <el-card v-for="message in messages" :key="message.messageid" class="message-item">
            <div class="message-header">
              <div class="message-info">
                <p>留言编号：{{ message.messageid }}</p>
                <p>留言时间：{{ message.messagetime }}</p>
                <p>留言人：{{ message.accountid }}</p>
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
      
      <!-- 机模块的留言 -->
      <el-tab-pane label="设备" name="equipment">
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

      <!-- 法模块的留言 -->
      <el-tab-pane label="规程" name="procedure">
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

      <!-- 料模块的留言 -->
      <el-tab-pane label="物料" name="material">
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

<script lang="ts" setup>
import { ref, onMounted,watch } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import jsPDF from 'jspdf'
import Top from './Top.vue'
import { user_data } from '@/status'
import html2pdf from 'html2pdf.js';
const activeTab = ref('personnel')
const dialogVisible = ref(false)
const selectedMessage = ref(null)
import axios from 'axios' // 引入axios
// 定义留言的接口响应类型
interface MessageList {
messageid: number;
projectid: number;
accountid: number;
messagetype: string;
state: string;
messagetime: string;
message: string;
}
const messages = ref<MessageList[]>([]);
// 新增获取留言的方法
const fetchMessages = async (messageType: string) => {
try {
  const response = await axios.post('http://localhost:8080/get_message', {
    message_type: messageType
  });
  if (response.data.code ===101) {
    messages.value = response.data; // 更新messages数组
    console.log("success");
    console.log(response.data.messageid);
  } else {
    console.log(response.data.code);
    ElMessage.error('获取留言失败');
  }
} catch (error) {
  console.error('请求错误:', error);
  ElMessage.error('请求错误');
}
};

// 在组件挂载时获取留言
onMounted(() => {
fetchMessages(activeTab.value); // 根据当前激活的标签页获取对应模块的留言
});

// 监听标签页变化，获取对应模块的留言
watch(activeTab, async (newVal) => {
await fetchMessages(newVal);
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
const router = useRouter()

const activeIndex1 = ref('1')
const handleSelect1 = (key: string, keyPath: string[]) => {
    if(key.match('2')) router.push('/PersonnelReviewP44')
    console.log(key, keyPath)
}
</script>

<style scoped>
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
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