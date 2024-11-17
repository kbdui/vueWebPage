<template>
    <div class="auth-management">
        <Top/>
      <!-- Navigation Tabs -->
      <el-tabs v-model="activeTab" class="main-tabs">
        <el-tab-pane label="留言管理" name="messages"></el-tab-pane>
        <el-tab-pane label="清单管理" name="lists"></el-tab-pane>
      </el-tabs>
  
      <!-- Sub Navigation -->
      <el-tabs v-model="activeSubTab" class="sub-tabs">
        <el-tab-pane label="人员" name="personnel">
          <div class="sub-nav">
            <el-tabs v-model="innerTab">
              <el-tab-pane label="审核提醒" name="audit"></el-tab-pane>
              <el-tab-pane label="授权清单" name="authorization"></el-tab-pane>
              <el-tab-pane label="培训清单" name="training"></el-tab-pane>
            </el-tabs>
          </div>
  
          <!-- Export Button -->
          <el-button 
            type="success" 
            class="export-btn"
            @click="exportToPDF"
          >
            导出授权人员清单
          </el-button>
  
          <!-- Authorization List Table -->
          <el-table :data="authList" style="width: 100%;font-size: 16px">
            <el-table-column 
              prop="name" 
              label="被授权人"
              width="180"
            />
            <el-table-column 
              prop="authItem" 
              label="授权项目"
            />
          </el-table>
        </el-tab-pane>

        
        <el-tab-pane label="设备" name="equipment"></el-tab-pane>
        <el-tab-pane label="规程" name="rules"></el-tab-pane>
        <el-tab-pane label="物料" name="materials"></el-tab-pane>
      </el-tabs>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  import { ElMessage } from 'element-plus'
  import jsPDF from 'jspdf'
  import Top from './Top.vue';
  
  // Tab states
  const activeTab = ref('lists')
  const activeSubTab = ref('personnel')
  const innerTab = ref('authorization')
  
  // Mock data for the authorization list
  const authList = ref([
    {
      name: '甲',
      authItem: 'GB 19083-2003 4.1 医用防护口罩>基本要求'
    },
    {
      name: '乙',
      authItem: 'GB 19083-2003 4.1 医用防护口罩>基本要求'
    },
    {
      name: '丙',
      authItem: 'GB 19083-2003 4.1 医用防护口罩>基本要求'
    }
  ])
  
  // Function to export PDF
  const exportToPDF = () => {
    try {
      const doc = new jsPDF()
      
      // Add title
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(16)
      doc.text('授权人员清单', 20, 20)
      
      // Add content
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(12)
      
      let yPosition = 40
      authList.value.forEach((item, index) => {
        doc.text(`${index + 1}. 被授权人：${item.name}`, 20, yPosition)
        doc.text(`   授权项目：${item.authItem}`, 20, yPosition + 7)
        yPosition += 20
      })
      
      // Save the PDF
      doc.save('授权人员清单.pdf')
      
      ElMessage({
        message: 'PDF导出成功！',
        type: 'success'
      })
    } catch (error) {
      ElMessage({
        message: '导出失败，请重试',
        type: 'error'
      })
      console.error('PDF export error:', error)
    }
  }
  </script>
  
  <style scoped>
  .auth-management {
    padding: 20px;
  }
  
  .main-tabs {
    margin-bottom: 20px;
  }
  
  .sub-tabs {
    margin-bottom: 20px;
  }
  
  .export-btn {
    margin: 20px 0;
    font-size: 16px;
  }
  
  :deep(.el-tabs__item) {
    font-size: 16px;
  }
  
  :deep(.el-tabs__item.is-active) {
    color: #409EFF;
  }
  
  :deep(.el-table) {
    margin-top: 20px;
  }
  
  .auth-item-column {
    text-align: right; /* 使授权项目列内容右对齐 */
    padding-right: 20px; /* 根据需要调整间距 */
  }
  .el-table_1_column_2 el-table__cell{
    text-align: right;
  }
  .cell{
    text-align: right;
  }
  </style>