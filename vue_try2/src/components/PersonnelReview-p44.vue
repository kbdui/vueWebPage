<template>
  <div class="container mx-auto p-4">
    <Top/>
    <!-- 大的导航栏 -->
    <div class="mb-4">
      <el-tabs v-model="activeMainTab">
        <el-tab-pane label="留言管理" name="messages"></el-tab-pane>
        <el-tab-pane label="清单管理" name="lists"></el-tab-pane>
      </el-tabs>
    </div>

    <!-- 小的导航栏 -->
    <div class="mb-4">
      <el-tabs v-model="activeSecondaryTab">
        <el-tab-pane label="人员" name="personnel">
          <!-- 更小的导航栏 -->
          <div class="border-b pb-2 mb-4">
            <el-radio-group v-model="activeTertiaryTab" size="small">
              <el-radio-button label="审核提醒"></el-radio-button>
              <el-radio-button label="授权清单"></el-radio-button>
              <el-radio-button label="培训清单"></el-radio-button>
            </el-radio-group>
          </div>

          <!-- 标准项目 -->
          <div class="standards-list">
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
        </el-tab-pane>
        <el-tab-pane label="设备" name="equipment"></el-tab-pane>
        <el-tab-pane label="规程" name="procedures"></el-tab-pane>
        <el-tab-pane label="物料" name="materials"></el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import Top from './Top.vue';
const activeMainTab = ref('lists')
const activeSecondaryTab = ref('personnel')
const activeTertiaryTab = ref('审核提醒')

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
</script>

<style scoped>
.standard-item {
  transition: background-color 0.3s;
  font-size: small;
}

.standard-item:hover {
  background-color: #f5f7fa;
}

:deep(.el-tabs__item) {
  font-size: 20px;
}

:deep(.el-radio-button__inner) {
  font-size: 14px;

}
</style>