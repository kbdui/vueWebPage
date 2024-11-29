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
      <el-tab-pane label="人员" name="Offiers">
        <div class="tab-header">
          <el-button type="primary" @click="markAllResolved">
            全部标记为已解决
          </el-button>
        </div>

        <!-- Message List -->
        <div class="message-list">
          <el-card
            v-for="message in messages"
            :key="message.messageid"
            class="message-item"
          >
            <div class="message-header">
              <div class="message-info">
                <p>留言编号：{{ message.messageid }}</p>
                <p>留言时间：{{ message.messagetime }}</p>
                <p>留言人：{{ message.accountid }}</p>
              </div>
              <div class="message-source">
                <p>来自</p>
                <el-link type="primary">{{ message.projectid }}</el-link>
              </div>
            </div>
            <div class="message-status">
              状态：{{ message.state }}
            </div>
            <div class="message-actions">
              <el-button type="primary" @click="openMessageDialog(message)">
                打开留言框
              </el-button>
              <el-button
                type="success"
                @click="markResolved(message)"
                v-if="message.state !== 'Finish'"
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
          <el-card
            v-for="message in messages"
            :key="message.messageid"
            class="message-item"
          >
            <div class="message-header">
              <div class="message-info">
                <p>留言编号：{{ message.messageid }}</p>
                <p>留言时间：{{ message.messagetime }}</p>
                <p>留言人：{{ message.accountid }}</p>
              </div>
              <div class="message-source">
                <p>来自</p>
                <el-link type="primary">{{ message.projectid }}</el-link>
              </div>
            </div>
            <div class="message-status">
              状态：{{ message.state }}
            </div>
            <div class="message-actions">
              <el-button type="primary" @click="openMessageDialog(message)">
                打开留言框
              </el-button>
              <el-button
                type="success"
                @click="markResolved(message)"
                v-if="message.state !== 'Finish'"
              >
                标记为已解决
              </el-button>
            </div>
          </el-card>
        </div>
      </el-tab-pane>

      <!-- 法模块的留言 -->
      <el-tab-pane label="规程" name="Stander">
        <div class="tab-header">
          <el-button type="primary" @click="markAllResolved">
            全部标记为已解决
          </el-button>
        </div>

        <!-- Message List -->
        <div class="message-list">
          <el-card
            v-for="message in messages"
            :key="message.messageid"
            class="message-item"
          >
            <div class="message-header">
              <div class="message-info">
                <p>留言编号：{{ message.messageid }}</p>
                <p>留言时间：{{ message.messagetime }}</p>
                <p>留言人：{{ message.accountid }}</p>
              </div>
              <div class="message-source">
                <p>来自</p>
                <el-link type="primary">{{ message.projectid }}</el-link>
              </div>
            </div>
            <div class="message-status">
              状态：{{ message.state }}
            </div>
            <div class="message-actions">
              <el-button type="primary" @click="openMessageDialog(message)">
                打开留言框
              </el-button>
              <el-button
                type="success"
                @click="markResolved(message)"
                v-if="message.state !== 'Finish'"
              >
                标记为已解决
              </el-button>
            </div>
          </el-card>
        </div>
      </el-tab-pane>

      <!-- 料模块的留言 -->
      <el-tab-pane label="物料" name="Sample">
        <div class="tab-header">
          <el-button type="primary" @click="markAllResolved">
            全部标记为已解决
          </el-button>
        </div>

        <!-- Message List -->
        <div class="message-list">
          <el-card
            v-for="message in messages"
            :key="message.messageid"
            class="message-item"
          >
            <div class="message-header">
              <div class="message-info">
                <p>留言编号：{{ message.messageid }}</p>
                <p>留言时间：{{ message.messagetime }}</p>
                <p>留言人：{{ message.accountid }}</p>
              </div>
              <div class="message-source">
                <p>来自</p>
                <el-link type="primary">{{ message.projectid }}</el-link>
              </div>
            </div>
            <div class="message-status">
              状态：{{ message.state }}
            </div>
            <div class="message-actions">
              <el-button type="primary" @click="openMessageDialog(message)">
                打开留言框
              </el-button>
              <el-button
                type="success"
                @click="markResolved(message)"
                v-if="message.state !== 'Finish'"
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
        <p>留言编号：{{ selectedMessage.messageid }}</p>
        <p>留言时间：{{ selectedMessage.messagetime }}</p>
        <p>留言人：{{ selectedMessage.accountid }}</p>
        <p>留言项目：{{ selectedMessage.projectid }}</p>
        <p>留言内容：{{ selectedMessage.message }}</p>
        <!-- <el-input
          v-model="selectedMessage.message"
          type="textarea"
          rows="4"
          placeholder="留言内容"
        /> -->
      </div>
      <template #footer>
        <span class="dialog-footer">
          <!-- <el-button>退出</el-button> -->
          <!-- <el-button @click="dialogVisible = false">取消</el-button> -->
          <!-- <el-button type="primary" @click="saveMessage">保存</el-button> -->
        </span>
      </template>
    </el-dialog>
  </div>
</template>
  
<script lang="ts" setup>
import { ref, onMounted, watch } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import Top from './Top.vue';
import { user_data } from '@/status';
import axios from 'axios';
import jsPDF from 'jspdf';
// 定义留言的数据结构
interface MessageList {
  messageid: number;
  projectid: number;
  accountid: number;
  messagetype: string;
  state: string;
  messagetime: string;
  message: string;
}

// 用于存储留言数据的响应式变量
const messages = ref<MessageList[]>([]);
const dialogVisible = ref(false);
const selectedMessage = ref<MessageList | null>(null);
const activeTab = ref('Offiers');
const activeIndex1 = ref('1');

function fetchMessages(messageType: string) {
  axios.post('http://localhost:8080/get_message', {
    message_type: messageType
  }, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  .then(response => {
    if (response.data.code === 1) {
      messages.value = response.data.data;
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
});

// 监听标签页变化，获取对应模块的留言
watch(activeTab, (newVal) => {
fetchMessages(newVal);
});

// 其他方法...
const markAllResolved = () => {
messages.value = messages.value.map((message) => ({
...message,
state: 'Finish',
}));
ElMessage.success('所有留言已标记为已解决');
};

const markResolved = (message) => {
message.state = 'Finish';
ElMessage.success('留言已标记为已解决');
};

const openMessageDialog = (message) => {
selectedMessage.value = { ...message };
dialogVisible.value = true;
};

const saveMessage = () => {
const index = messages.value.findIndex(
(m) => m.messageid === selectedMessage.value.messageid
);
if (index !== -1) {
messages.value[index] = { ...selectedMessage.value };
ElMessage.success('留言已保存');
dialogVisible.value = false;
}
};

const handleSelect1 = (key) => {
if (key === '2') {
useRouter().push('/PersonnelReviewP44');
}
console.log(key);
};

const exportToPDF = () => {
  try {
    const doc = new jsPDF()
    // Add title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text('留言提醒清单', 20, 20);

    // Add content
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    let yPosition = 40;
    
    messages.value.forEach((message, index) => {
      doc.text(`${index + 1}. 留言编号：${message.messageid}`, 20, yPosition);
      doc.text(`   留言时间：${message.messagetime}`, 20, yPosition + 10);
      doc.text(`   留言人：${message.accountid}`, 20, yPosition + 20);
      doc.text(`   项目ID：${message.projectid}`, 20, yPosition + 30);
      doc.text(`   状态：${message.state}`, 20, yPosition + 40);
      yPosition += 50;
    });

    // Save the PDF
    doc.save('留言清单提醒.pdf');

    ElMessage({
      message: 'PDF导出成功！',
      type: 'success'
    });
  } catch (error) {
    ElMessage({
      message: '导出失败，请重试',
      type: 'error'
    });
    console.error('PDF export error:', error);
  }
};
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