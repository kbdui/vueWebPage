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
            <el-button 
              type="success" 
              class="export-btn"
              @click="exportauthorPDF()"
            >
              导出授权人员清单
            </el-button>
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
            <el-button 
              type="success" 
              class="export-button"
              @click="exportTrainPDF(allTrainList)"
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
// import jsPDF from 'jspdf'
import Top from './Top.vue'
import sHomepageMachine from './son_components/sHomepageMachine.vue'
import sHomepageRegulation from './son_components/sHomepageRegulation.vue'
import sHomepageSample from './son_components/sHomepageSample.vue'
import axios from 'axios'
import { jsPDF } from 'jspdf';

const activeSecondaryTab = ref('personnel')
const activeTertiaryTab = ref('审核提醒')
const r1 = ref(true)
const r2 = ref(false)
const r3 = ref(false)
const input1 = ref()
const input2 = ref()
const input3 = ref()
const pdf = new jsPDF();
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

const standards = ref([])

const router = useRouter()

// 切换至留言页面
const activeIndex1 = ref('2')
const handleSelect1 = (key, keyPath) => {
    if(key.match('1')) router.push('/MessageofPersonP40')
    console.log(key, keyPath)
}
  // // 获取授权清单
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
        console.log("返回的数据为："+response.data.data)
    }).catch(function (error){
        if (error.response) {
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
        } else if (error.request) {
        console.log(error.request);
        } else {
        console.log('Error', error.message);
        }
        console.log(error.config)
        ElMessage.error('获取授权清单失败')
    })
  }
// 获取授权清单
// function getAuthList() {
//   axios.post('http://localhost:8080/authorize_msg', {
//       project_id: input2.value
//   },{
//       headers: {
//       'Content-Type': 'application/x-www-form-urlencoded'
//       }
//   }).then(function (response){
//       allAuthList.value = response.data.data
//   }).catch(function (error){
//       if (error.response) {
//       console.log(error.response.data);
//       console.log(error.response.status);
//       console.log(error.response.headers);
//       } else if (error.request) {
//       console.log(error.request);
//       } else {
//       console.log('Error', error.message);
//       }
//       console.log(error.config)
//       ElMessage.error('获取授权清单失败')
//   })
// }

// 导出授权人员清单为PDF
function exportauthorPDF() {
  // 确保数据已加载
  if (allAuthList.value.length === 0) {
    ElMessage.warning('请先获取授权清单数据');
    return;
  }

  // 创建一个新的jsPDF实例
  const pdf = new jsPDF.default('p', 'pt', 'a4');

  // 添加标题
  pdf.setFontSize(20);
  pdf.text('授权人员清单', 40, 30);

  // 添加子标题和表格头
  pdf.setFontSize(16);
  pdf.text('项目ID: ' + input2.value, 40, 60);
  pdf.setFontSize(12);
  pdf.text('被授权人 | 授权状态', 40, 80);

  // 添加数据行
  allAuthList.value.forEach((item, index) => {
    pdf.setFontSize(12);
    pdf.text(item.user_id + ' | ' + item.examination_state, 40, 100 + index * 20);
  });

  // 保存PDF文件
  pdf.save('授权人员清单.pdf');
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
      allTrainList.value = response.data.data ;
      console.log("返回的数据为：", allTrainList.value);
  }).catch(function (error){
      if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
      } else if (error.request) {
      console.log(error.request);
      } else {
      console.log('Error', error.message);
      }
      console.log(error.config)
      ElMessage.error('获取培训清单失败')
  })
}


// 导出培训清单为PDF
function exportTrainPDF(allTrainListData) {
  console.log('allTrainListData中的数据为：' + JSON.stringify(allTrainListData));

  const pdf = new jsPDF('p', 'pt', 'a4');

  // 确保字体文件路径正确
  pdf.addFont('src/assets/simsun.ttf', 'SimSun', 'normal');
  pdf.setFont('SimSun', 'normal');

  pdf.setFontSize(20);
  const title = '培训清单';
  const titleWidth = pdf.getStringUnitWidth(title) + 80; // 计算标题宽度
  const titleX = (pdf.internal.pageSize.getWidth() - titleWidth) / 2; // 计算标题X坐标使其居中
  pdf.text(title, titleX, 20); // 标题居中

  pdf.setFontSize(16);
  const subTitles = ['人员ID', '人员真实姓名', '人员联系方式', '培训情况', '考核状态', '授权状态'];
  const dataStartY = 80; // 数据开始的Y坐标
  const lineHeight = 20; // 每行数据的高度
  const columnWidths = [60, 100, 120, 100, 100, 100]; // 定义每列的宽度
  const startX = 40; // 表格开始的X坐标

  // 打印表头（子标题）
  let currentX = startX;
  subTitles.forEach((subTitle, index) => {
    pdf.text(subTitle, currentX, dataStartY - lineHeight); // 子标题的Y坐标调整
    currentX += columnWidths[index];
  });

  // 打印数据
  allTrainListData.forEach((item, index) => {
    pdf.setFontSize(12);
    const yPosition = dataStartY + index * lineHeight; // 数据的Y坐标
    currentX = startX;
    // 将数据按照列宽依次打印
    [item.user_id, item.name, item.contact, item.training, item.examination, item.authorize].forEach((data, idx) => {
      pdf.text(String(data), currentX, yPosition);
      currentX += columnWidths[idx];
    });
  });

  // 保存PDF文件
  pdf.save('培训清单.pdf');
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