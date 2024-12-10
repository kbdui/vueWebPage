<!-- 头部组件，左上角首页和右上角头像弹窗 -->

<template>
  <div class="top-bar">
    <router-link :to=back class="home-text">首页</router-link>
    <el-dropdown trigger="hover" @command="handleCommand">
      <div class="avatar-wrapper">
        <el-avatar :size="40" :src="userAvatar" @error="handleAvatarError">
          {{ userInitials }}
        </el-avatar>
      </div>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item disabled>
            <div class="user-info">
              <p><strong>姓名：</strong>{{ user_data.name }}</p>
              <p><strong>用户名：</strong>{{ user_data.username }}</p>
              <p><strong>所属机构：</strong>{{ user_data.institution }}</p>
              <p><strong>联系方式：</strong>{{ user_data.contact }}</p>
            </div>
          </el-dropdown-item>
          <el-dropdown-item divided command="jumpToHomepage1">个人主页</el-dropdown-item>
          <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
import { ref, computed,onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { useRouter } from 'vue-router'
import { user_data } from '@/status'

const router = useRouter()

// 一个用于从localStorage加载user_data的函数
function loadUserData() {
    const savedData = localStorage.getItem('user_data');
    if (savedData) {
        user_data.value = JSON.parse(savedData);
    }
}

onMounted(loadUserData)

const back = user_data.value.accountType === "Experimenters" ? ref('/entry') : ref('/supportentry')

const userAvatar = ref('https://example.com/avatar.jpg')

const userInitials = computed(() => {
  return user_data.value.name.slice(0, 2)
})

const handleCommand = (command) => {
  if (command === 'logout') {
    ElMessage.success('退出登录成功')
    user_data.value.name = ''
    user_data.value.username = ''
    user_data.value.contact = ''
    user_data.value.institution = ''
    user_data.value.accountType = ''
    localStorage.setItem('user_data', JSON.stringify(user_data.value))
    router.push('/')
  }
  else if(command === 'jumpToHomepage1'){
    if(user_data.value.accountType === "Experimenters") router.push('/people13')
    else if(user_data.value.accountType === "Supportstaff") router.push('/MessageofPersonP40')
  }
}

const handleAvatarError = () => {
  // Handle avatar error, e.g., set a default avatar
}
</script>

<style scoped>
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.home-text {
  color: #409EFF;
  text-decoration: none;
  font-size: 16px;
}
.home-text:hover {
  text-decoration: underline;
}
.avatar-wrapper {
  cursor: pointer;
}
.user-info {
  padding: 10px;
  min-width: 200px;
}
.user-info p {
  margin: 5px 0;
}
</style>