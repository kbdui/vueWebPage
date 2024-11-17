<!-- 头部组件，左上角首页和右上角头像弹窗 -->

<template>
  <div class="top-bar">
    <router-link to="/" class="home-text">首页</router-link>
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
              <p><strong>姓名：</strong>{{ userInfo.name }}</p>
              <p><strong>用户名：</strong>{{ userInfo.username }}</p>
              <p><strong>所属机构：</strong>{{ userInfo.organization }}</p>
              <p><strong>联系方式：</strong>{{ userInfo.contact }}</p>
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
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

const userInfo = ref({
  name: '张三',
  username: 'zhangsan',
  organization: 'ABC公司',
  contact: 'zhangsan@example.com'
})

const userAvatar = ref('https://example.com/avatar.jpg')

const userInitials = computed(() => {
  return userInfo.value.name.slice(0, 2)
})

const handleCommand = (command) => {
  if (command === 'logout') {
    ElMessage.success('退出登录成功')
    // You would typically clear user session and redirect to login page
    // router.push('/login')
  }
  else if(command === 'jumpToHomepage1'){
      router.push('/people13')
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