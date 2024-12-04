<template>
  <div class="container mx-auto p-4">
    <Top></Top>
    <!-- 大的导航栏 -->
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

    <!-- 小的导航栏 -->
    <div class="mb-4">
      <el-tabs v-model="activeSecondaryTab" class="message-tabs">
        <!-- 人员 -->
        <el-tab-pane label="人员" name="personnel">

          <!-- 更小的导航栏 -->
          <div class="border-b pb-2 mb-4">
            <el-radio-group v-model="activeTertiaryTab" size="small">
              <el-radio-button @click="chooseR1" label="审核提醒"></el-radio-button>
              <el-radio-button @click="chooseR2" label="授权清单"></el-radio-button>
              <el-radio-button @click="chooseR3" label="培训清单"></el-radio-button>
            </el-radio-group>
          </div>

          <!-- 审核提醒 -->
          <div v-if="r1" id="personReview1" class="standards-list">
            <el-input class="searchInput" v-model="input1" style="width: 240px" placeholder="输入项目ID查询" />
            <el-button class="searchButton" type="success" plain>查询</el-button>
            <div v-for="(standard, index) in standards" :key="index" class="standard-item mb-3 flex justify-between items-center">
              <el-link type="primary" :href="standard.link">
                {{ standard.title }}
              </el-link>
              <div class="flex gap-4">
                <div class="flex items-center" v-if="standard.pendingVideos !== undefined">
                  <span class="mr-2">待审核视频:</span>
                  <el-tag type="danger" size="small">{{ standard.pendingVideos }}</el-tag>
                </div>
                <div class="flex items-center" v-if="standard.pendingTests !== undefined">
                  <span class="mr-2">待审核试卷:</span>
                  <el-tag type="danger" size="small">{{ standard.pendingTests }}</el-tag>
                </div>
              </div>
            </div>
          </div>

          <!-- 授权清单 -->
          <div v-else-if="r2" id="personReview1">
            <el-input class="searchInput" v-model="input2" style="width: 240px" placeholder="输入项目ID查询" />
            <el-button class="searchButton" @click="getAuthList" type="success" plain>查询</el-button>
            <!-- Export Button -->
            <el-button 
              type="success" 
              class="export-btn"
              @click="exportToPDF"
            >
              导出授权人员清单
            </el-button>
    
            <!-- Authorization List Table -->
            <el-table :data="allAuthList" style="width: 100%;font-size: 16px">
              <el-table-column 
                prop="user_id" 
                label="被授权人"
                width="180"
              />
              <el-table-column 
                prop="examination_state" 
                label="授权状态"
              />
            </el-table>
          </div>

          <!-- 培训清单 -->
          <div v-else-if="r3" id="personReview1">
            <el-input class="searchInput" v-model="input3" style="width: 240px" placeholder="输入项目ID查询" />
            <el-button class="searchButton" @click="getTrainList" type="success" plain>查询</el-button>
            <!-- Export Button -->
            <el-button 
              type="success" 
              class="export-button"
              @click="exportToPDF"
            >
              导出培训清单
            </el-button>
        
            <!-- Training List Table -->
            <el-table :data="allTrainList" style="width: 100%; font-size: 16PX;">
              <el-table-column 
                prop="name" 
                label="培训人" 
                width="180"
              />
              <el-table-column 
                prop="training" 
                label="培训情况"
                width="180"
              />
              <el-table-column 
                prop="examination" 
                label="考核状态"
              />
            </el-table>
          </div>
        </el-tab-pane>

        <!-- 设备 -->
        <sHomepageMachine></sHomepageMachine>

        <!-- 规程 -->
        <sHomepageRegulation></sHomepageRegulation>

        <!-- 物料 -->
        <sHomepageSample></sHomepageSample>
      </el-tabs>
    </div>
  </div>
  
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import jsPDF from 'jspdf'
import Top from './Top.vue'
import sHomepageMachine from './son_components/sHomepageMachine.vue'
import sHomepageRegulation from './son_components/sHomepageRegulation.vue'
import sHomepageSample from './son_components/sHomepageSample.vue'
import axios from 'axios'

const activeMainTab = ref('lists')
const activeSecondaryTab = ref('personnel')
const activeTertiaryTab = ref('审核提醒')
const r1 = ref(true)
const r2 = ref(false)
const r3 = ref(false)
const input1 = ref()
const input2 = ref()
const input3 = ref()

function chooseR1(){
  r1.value = true
  r2.value = false
  r3.value = false
}

function chooseR2(){
  r1.value = false
  r2.value = true
  r3.value = false
}

function chooseR3(){
  r1.value = false
  r2.value = false
  r3.value = true
}

// Mock data
const procurementLists = ref([
  {
    id: '201123029432',
    recordTime: '2023.10.12 23:11:23',
    purchaser: '甲',
    status: '计划采购',
    equipment: [
      {
        standardCode: 'GB 19083-2023 4.1',
        category: '酸度计',
        name: 'UIO型酸度计',
        manufacturer: 'Xxx公司/厂',
        quantity: 10
      },
      {
        standardCode: 'GB 19083-2023 4.1',
        category: '酸度计',
        name: 'XCJ型天平',
        manufacturer: 'Xxx公司/厂',
        quantity: 5
      }
    ]
  },
  {
    id: '2013245367',
    recordTime: '2024.10.23 14:23:21',
    purchaser: '荣成',
    status: '计划采购',
    equipment: [
      {
        standardCode: 'GB 19083-2023 4.1',
        category: '酸度计',
        name: 'WDJ型酸度计',
        manufacturer: 'Xxx公司/厂',
        quantity: 10
      },
      {
        standardCode: 'GB 19083-2023 4.1',
        category: '酸度计',
        name: 'KIU型酸度计',
        manufacturer: 'Xxx公司/厂',
        quantity: 20
      },
      {
        standardCode: 'GB 19083-2023 4.2',
        category: '天平',
        name: 'LIO型天平',
        manufacturer: 'Xxx公司/厂',
        quantity: 30
      }
    ]
  }
])

const standards = ref([
  {
    title: 'GB 19083-2003 4.1 医用防护口罩>基本要求(点击跳转到对应页面)',
    link: '#',
    pendingVideos: 38,
    pendingTests: 38
  },
  {
    title: 'GB 19083-2003 4.2 医用防护口罩>口罩带连接强度',
    link: '#',
    pendingVideos: 45,
    pendingTests: 2
  },
  {
    title: 'GB 19083-2003 4.3 医用防护口罩>过滤效率',
    link: '#',
    pendingVideos: 3,
    pendingTests: 66
  },
  {
    title: 'GB 19083-2003 4.4 医用防护口罩>呼吸阻力',
    link: '#',
    pendingVideos: 4,
    pendingTests: 9
  },
  {
    title: 'GB 19083-2003 4.5 医用防护口罩>死腔',
    link: '#',
    pendingVideos: 1,
    pendingTests: 5
  },
  {
    title: 'GB 19083-2003 4.5 医用防护口罩>死腔',
    link: '#',
    pendingTests: 5
  },
  {
    title: 'GB 19083-2003 4.5 医用防护口罩>死腔',
    link: 'https://www.baidu.com',
    pendingVideos: 5
  }
])

const router = useRouter()

// 切换至留言页面
const activeIndex1 = ref('2')
const handleSelect1 = (key, keyPath) => {
    if(key.match('1')) router.push('/MessageofPersonP40')
    console.log(key, keyPath)
}

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

  const trainingData = ref([
    {
      trainee: '甲',
      course: 'GB 19083-2003 4.1 医用防护口罩>基本要求'
    },
    {
      trainee: '乙',
      course: 'GB 19083-2003 4.1 医用防护口罩>基本要求'
    },
    {
      trainee: '丙',
      course: 'GB 19083-2003 4.1 医用防护口罩>基本要求'
    }
  ])

  // 获取授权清单
  const allAuthList = ref([])
  function getAuthList() {
    axios.post('http://localhost:8080/authorize_msg', {
        project_id: input2.value
    },{
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(function (response){
        allAuthList.value = response.data.data
    }).catch(function (error){
        if (error.response) {
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // `error.request` 在浏览器中是 XMLHttpRequest 的实例，
        // 而在node.js中是 http.ClientRequest 的实例
        console.log(error.request);
        } else {
        // 发送请求时出了点问题
        console.log('Error', error.message);
        }
        console.log(error.config)
        ElMessage.error('获取授权清单失败')
    })
  }

  // 获取培训清单
  const allTrainList = ref([])
  function getTrainList() {
    axios.post('http://localhost:8080/observe_progress', {
        project_id: input3.value
    },{
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
        }
    }).then(function (response){
        allTrainList.value = response.data.data
    }).catch(function (error){
        if (error.response) {
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // `error.request` 在浏览器中是 XMLHttpRequest 的实例，
        // 而在node.js中是 http.ClientRequest 的实例
        console.log(error.request);
        } else {
        // 发送请求时出了点问题
        console.log('Error', error.message);
        }
        console.log(error.config)
        ElMessage.error('获取培训清单失败')
    })
  }

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
.standard-item {
  transition: background-color 0.3s;
  font-size: small;
}

.standard-item:hover {
  background-color: #f5f7fa;
}

.message-tabs {
  margin-top: 20px;
}

:deep(.el-tabs__item) {
  font-size: 20px;
}

:deep(.el-radio-button__inner) {
  font-size: 14px;

}
.searchInput {
  margin: 0.5rem 0.5rem 0.5rem 0;
}
.searchButton {
  margin: 0.5rem 1rem 0.5rem 0;
}
</style>