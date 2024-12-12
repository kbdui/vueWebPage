<template>
  <div class="message-management">
    <Top></Top>
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
    <!-- <div class="action-buttons">
      <el-button type="success" @click="exportToPDF">
        导出增加内容提醒清单
      </el-button>
    </div> -->

    <!-- Category Tabs -->
    <el-tabs v-model="activeTab" class="message-tabs">
      <!-- 人模块的留言 -->
      <el-tab-pane label="人员" name="Offiers">
        <!-- Action Buttons -->
        <!-- <div class="action-buttons">
          <el-button type="success" @click="exportToPDF">
            导出增加内容提醒清单
          </el-button>
        </div> -->
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
                查看留言
              </el-button>
              <el-button
                type="success"
                @click="markResolved(message.messageid)"
                v-if="message.isResolvedButtonVisible && message.state !== 'Finish'"
              >
                标记为已解决
              </el-button>
            </div>
          </el-card>
        </div>
      </el-tab-pane>

      <!-- 机模块的留言 -->
      <el-tab-pane label="设备" name="equipment">
        <!-- Action Buttons -->
        <!-- <div class="action-buttons">
          <el-button type="success" @click="exportToPDF">
            导出增加内容提醒清单
          </el-button>
        </div> -->
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
                查看留言
              </el-button>
              <el-button
                type="success"
                @click="markResolved(message.messageid)"
               v-if="message.isResolvedButtonVisible && message.state !== 'Finish'"
              >
                标记为已解决
              </el-button>
            </div>
          </el-card>
        </div>
      </el-tab-pane>

      <!-- 法模块的留言 -->
      <el-tab-pane label="规程" name="Stander">
        <!-- Action Buttons -->
        <!-- <div class="action-buttons">
          <el-button type="success" @click="exportToPDF">
            导出增加内容提醒清单
          </el-button>
        </div> -->
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
                查看留言
              </el-button>
              <el-button
                type="success"
                @click="markResolved(message.messageid)"
               v-if="message.isResolvedButtonVisible && message.state !== 'Finish'"
              >
                标记为已解决
              </el-button>
            </div>
          </el-card>
        </div>
      </el-tab-pane>

      <!-- 料模块的留言 -->
      <el-tab-pane label="物料" name="Sample">
        <!-- Action Buttons -->
        <!-- <div class="action-buttons">
          <el-button type="success" @click="exportToPDF">
            导出增加内容提醒清单
          </el-button>
        </div> -->
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
                查看留言
              </el-button>
              <el-button
                type="success"
                @click="markResolved(message.messageid)"
                v-if="message.isResolvedButtonVisible && message.state !== 'Finish'"
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
      </div>
    </el-dialog>
  </div>
</template>
  
<script lang="ts" setup>
import { ref, onMounted, watch, inject } from 'vue';
import { ElMessage } from 'element-plus';
import { useRouter } from 'vue-router';
import Top from './Top.vue';
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
  isResolvedButtonVisible: boolean; // 用来判断留言状态是否确认成功,确认的同时进行get操作
}

// 用于存储留言数据的响应式变量
const messages = ref<MessageList[]>([]);
const dialogVisible = ref(false);
const selectedMessage = ref<MessageList | null>(null);
const activeTab = ref('Offiers');
const activeIndex1 = ref('1');
const router = useRouter();
const baseurl = inject('baseurl')

function fetchMessages(messageType: string) {
  axios.post(baseurl + '/get_message', {
    message_type: messageType
  }, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  .then(response => {
    if (response.data.code === 1) {
      const data = response.data.data.map(msg => ({
        ...msg,
        isResolvedButtonVisible: msg.state !== 'Finish' // 根据留言状态初始化按钮的可见性
      }));
      messages.value = data;
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

// 确认留言的方法
const markResolved = (messageId) => {
  axios.post(baseurl + '/finish_message', {
    message_id: messageId
  }, {
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  })
  .then(function(response) {
    // 检查后端响应，如果成功则处理结果
    if (response.status === 200) {
      ElMessage.success('留言状态已更新为已解决');
      // 查找对应的留言对象并更新其属性
      const message = messages.value.find(m => m.messageid === messageId);
      if (message) {
        message.state = 'Finish'; // 更新留言状态
        message.isResolvedButtonVisible = false; // 隐藏按钮
      }
    } else {
      // 如果后端返回错误，显示错误信息
      ElMessage.error('更新留言状态失败');
    }
  })
  .catch(function(error) {
    // 网络或其他请求错误处理
    console.error('请求错误:', error);
    ElMessage.error('请求错误: ' + error.message);
  });
};
// 打开留言框详情
const openMessageDialog = (message) => {
  selectedMessage.value = { ...message };
  dialogVisible.value = true;
};

const handleSelect1 = (key) => {
  if (key === '2') {
    router.push('/PersonnelReviewP44');
  }
  console.log("handleSelect1方法打印的key:"+key);
};

// pdf导出代码(乱码)
const exportToPDF = () => {
  try {
    const doc = new jsPDF();

    const fontName = "宋体";

    doc.setFont(fontName, 'bold');
    doc.setFontSize(16);
    doc.text('对比测试清单', 20, 20);
    doc.setFont(fontName, 'normal');
    doc.setFontSize(12);

    let yPosition = 25; // 从25开始，为标题留出空间
    messages.value.forEach((message, index) => {
      doc.text(`留言编号：${message.messageid}`, 20, yPosition);
      yPosition += 10; // 移动到下一行

      doc.text(`留言时间：${message.messagetime}`, 20, yPosition);
      yPosition += 10; // 移动到下一行

      doc.text(`留言人：${message.accountid}`, 20, yPosition);
      yPosition += 10; // 移动到下一行

      doc.text(`留言项目：${message.projectid}`, 20, yPosition);
      yPosition += 10; // 移动到下一行

      doc.text(`留言内容：${message.message}`, 20, yPosition);
      yPosition += 10; // 移动到下一行，为下一条留言留出空间
    });

    // 保存 PDF
    doc.save('对比测试清单.pdf');

    // 显示成功消息
    ElMessage({
      message: 'PDF导出成功！',
      type: 'success'
    });
  } catch (error) {
    // 显示错误消息
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