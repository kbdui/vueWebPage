<template>
  <div class="standard-search">
    <!-- Search Bar -->
    <el-row class="mb-4">
      <el-col :span="24">
        <el-input
          v-model="searchQuery"
          placeholder="请输入标准号"
          class="search-input"
        >
          <template #append>
            <el-button type="danger" @click="handleSearch">搜索</el-button>
          </template>
        </el-input>
      </el-col>
    </el-row>

    <!-- Search Results -->
    <el-scrollbar height="calc(100vh - 180px)">
      <el-card v-for="(result, index) in displayedResults" :key="index" class="mb-4 result-card">
        <div class="flex justify-between items-start">
          <div class="flex-grow">
            <h3>
              <span class="text-gray-600">GB</span>
              <span class="text-danger mx-1">{{data.number}}</span>
              <span class="text-primary">{{ result.title }}</span>
            </h3>
            <el-divider></el-divider>
            <p class="text-gray-400">{{ result.description }}</p>
          </div>
          <el-button
            type="danger"
            size="small"
            @click="deleteResult(index)"
            class="delete-button"
          >
            删除
          </el-button>
        </div>
      </el-card>
    </el-scrollbar>

    <!-- Pagination -->
    <div class="pagination-container">
      <el-pagination
        v-model:current-page="currentPage"
        v-model:page-size="pageSize"
        :page-sizes="[5, 10, 20, 50]"
        :small="false"
        :disabled="false"
        :background="true"
        layout="total, sizes, prev, pager, next, jumper"
        :total="searchResults.length"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, inject } from 'vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'

const searchQuery = ref('')
const currentPage = ref(1)
const pageSize = ref(5)
const baseurl = inject('baseurl')

// Sample data - replace with actual API call results
const searchResults = ref({
  data:''
})
const searchstate = ref(true)
function search() {
  if (searchstate.value) {
    // 如果后端接口支持GET请求带参数，使用params传递
    axios.get(baseurl + '/all_project', {
      params: searchResults.data
    })
    .then(function (response) {
      // 更新响应式变量
      searchResults.data = response.data;
      console.log(response.data); // 打印所有项目信息
    })
    .catch(function (error) {
      // 处理请求错误
      console.error('Error:', error);
    });
  }
}
 onMounted(() => {
  search(); // 组件挂载后发送请求
});
// const searchResults = ref([
//   {
//     number: '19083-2023 4.1',
//     title: '医用防护口罩>基本要求',
//     description: '.........................'
//   },
//   {
//     number: '19083-2023 4.2',
//     title: '医用防护口罩>口罩带连接强度',
//     description: '.........................'
//   },
//   {
//     number: '19083-2023 4.3',
//     title: '医用防护口罩>过滤效率',
//     description: '.........................'
//   },
//   {
//     number: '19083-2023 4.4',
//     title: '医用防护口罩>呼吸阻力',
//     description: '.........................'
//   },
//   {
//     number: '19083-2023 4.5',
//     title: '医用防护口罩>死腔',
//     description: '.........................'
//   },
  // 添加更多示例数据以测试分页
//   ...Array.from({ length: 20 }, (_, i) => ({
//     number: `19083-2023 ${i + 5}.${i + 1}`,
//     title: `医用防护口罩>示例标题 ${i + 6}`,
//     description: '.........................'
//   }))
// ])

const displayedResults = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value
  const end = start + pageSize.value
  return searchResults.value.slice(start, end)
})

const handleSearch = () => {
  // Implement actual search logic here
  ElMessage.success(`搜索关键词: ${searchQuery.value}`)
}

const deleteResult = (index) => {
  const actualIndex = (currentPage.value - 1) * pageSize.value + index
  searchResults.value.splice(actualIndex, 1)
  
  // Adjust current page if necessary
  if (displayedResults.value.length === 0 && currentPage.value > 1) {
    currentPage.value--
  }
  ElMessage.success('删除成功')
}

const handleSizeChange = (val) => {
  pageSize.value = val
  currentPage.value = 1 // Reset to first page when changing page size
}

const handleCurrentChange = (val) => {
  currentPage.value = val
}
</script>

<style scoped>
.standard-search {
  height: 100vh;
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.search-input {
  width: 100%;
}

.search-input :deep(.el-input-group__append) {
  background-color: var(--el-color-danger);
  border-color: var(--el-color-danger);
  color: white;
}

.search-input :deep(.el-input__wrapper) {
  box-shadow: 0 0 0 1px var(--el-border-color) inset;
}

.search-input :deep(.el-input__inner) {
  height: 50px;
  font-size: 16px;
}

.search-input :deep(.el-input-group__append button.el-button) {
  height: 50px;
  font-size: 16px;
  padding: 0 20px;
}

.result-card {
  transition: all 0.3s ease;
}

.result-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.delete-button {
  margin-left: 10px;
}

.text-danger {
  color: var(--el-color-danger);
}

.text-primary {
  color: var(--el-color-primary);
}

.pagination-container {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}

:deep(.el-pagination) {
  justify-content: center;
}

:deep(.el-pagination .el-select .el-input) {
  width: 110px;
}
</style>