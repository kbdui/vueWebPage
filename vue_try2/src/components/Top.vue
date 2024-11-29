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
import { useRouter } from 'vue-router'
import { user_data } from '@/status'

const router = useRouter()

const props = defineProps({
  _name : String,
  username : String,
  contact : String,
  institution : String,
  accountType : String
})

const back = props.accountType === "Experimenters" ? ref('/entry') : ref('/supportentry')

const userInfo = ref({
  name: props._name,
  username: props.username,
  organization: props.institution,
  contact: props.contact,
  accountType: props.accountType
})

const userAvatar = ref('https://example.com/avatar.jpg')

const userInitials = computed(() => {
  return userInfo.value.name.slice(0, 2)
})

const handleCommand = (command) => {
  if (command === 'logout') {
    ElMessage.success('退出登录成功')
    user_data.value.name = ''
    user_data.value.username = ''
    user_data.value.contact = ''
    user_data.value.institution = ''
    user_data.value.accountType = ''
    router.push('/')
  }
  else if(command === 'jumpToHomepage1'){
    if(props.accountType === "Experimenters") router.push('/people13')
    else if(props.accountType === "Supportstaff") router.push('/MessageofPersonP40')
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