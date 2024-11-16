<template>
  <div id="Login">
    <RouterLink to="/standard" replace>跳过登录前往标准查询</RouterLink>
    <div class="login-register-page">
    <div class="form-container">
      <h1 class="title">医疗器械管理系统</h1>
      <div class="tab-buttons">
        <button @click="isLogin = true" :class="{ active: isLogin }">登录</button>
        <button @click="isLogin = false" :class="{ active: !isLogin }">注册</button>
      </div>
      
      <form @submit.prevent="handleSubmit">
        <template v-if="isLogin">
          <div class="form-group">
            <label for="username">用户名</label>
            <input id="username" v-model="loginForm.username" type="text" required>
          </div>
          <div class="form-group">
            <label for="password">密码</label>
            <input id="password" v-model="loginForm.password" type="password" required>
          </div>
        </template>
        
        <template v-else>
          <div class="form-group">
            <label for="reg-username">用户名</label>
            <input id="reg-username" v-model="registerForm.username" type="text" required>
          </div>
          <div class="form-group">
            <label for="reg-password">密码</label>
            <input id="reg-password" v-model="registerForm.password" type="password" required>
          </div>
          <div class="form-group">
            <label for="realName">真实姓名</label>
            <input id="realName" v-model="registerForm.realName" type="text" required>
          </div>
          <div class="form-group">
            <label for="organization">所属机构</label>
            <input id="organization" v-model="registerForm.organization" type="text" required>
          </div>
          <div class="form-group">
            <label for="contact">联系方式</label>
            <input id="contact" v-model="registerForm.contact" type="text" required>
          </div>
        </template>
        
        <button type="submit" class="submit-btn">{{ isLogin ? '登录' : '注册' }}</button>
      </form>
    </div>
  </div>
  </div>

</template>

<script setup>
    import { ref, reactive } from 'vue'
    import { useRoute, useRouter } from 'vue-router'
    import { RouterLink } from 'vue-router'

    const isLogin = ref(true)

    const router = useRouter()
    const route = useRoute()
    
    const loginForm = reactive({
      username: '',
      password: ''
    })
    
    const registerForm = reactive({
      username: '',
      password: '',
      realName: '',
      organization: '',
      contact: ''
    })
    
    const handleSubmit = async () => {
      try {
        if (isLogin.value) {
          // 登录逻辑
          const response = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(loginForm)
          })
          if (response.ok) {
            alert('登录成功')
            // 处理登录成功后的逻辑，如跳转到主页
          } else {
            alert('登录失败，请检查用户名和密码')
          }
        } else {
          // 注册逻辑
          const response = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(registerForm)
          })
          if (response.ok) {
            alert('注册成功，请登录')
            isLogin.value = true // 切换到登录表单
          } else {
            alert('注册失败，请稍后再试')
          }
        }
      } catch (error) {
        console.error('Error:', error)
        alert('发生错误，请稍后再试')
      }
    }
</script>

<style scoped>

#background{
    width: max-width;
    height: 500px;
}

#Login{
  display: block;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  margin-top: 5%;
  display: grid;
  padding: 0 2rem;
}

/* 设置整个登录注册页面的样式 */
.login-register-page {
  display: block;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
}

/* 设置表单容器的样式 */
.form-container {
  background-color: rgba(255, 255, 255, 0.8); /* 背景颜色为半透明的白色 */
  padding: 2rem; /* 内边距为20px */
  border-radius: 10px; /* 边框圆角为10px */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* 添加阴影效果 */
  width: 30vw; /* 宽度为视口宽度的30% */
  max-height: 90vh; /* 最大高度为视口高度的90% */
  overflow-y: auto; /* 如果内容超出高度，则显示滚动条 */
  display: flex; /* 使用flex布局 */
  flex-direction: column; /* 子元素垂直排列 */
}

/* 设置标题的样式 */
.title {
  text-align: center; /* 文本居中 */
  margin-bottom: 1rem; /* 底部外边距为10px */
  font-size: 1.5rem; /* 字体大小为1.5rem */
  font-weight: bold; /* 字体加粗 */
  color: #333; /* 字体颜色为深灰色 */
}

/* 设置标签按钮组的样式 */
.tab-buttons {
  display: flex; /* 使用flex布局 */
  margin-bottom: 1rem; /* 底部外边距为10px */
}

/* 设置单个标签按钮的样式 */
.tab-buttons button {
  flex: 1; /* 按钮占据等宽的空间 */
  padding: 0.5rem; /* 内边距为5px */
  border: none; /* 无边框 */
  background-color: #f0f0f0; /* 背景颜色为浅灰色 */
  cursor: pointer; /* 鼠标悬停时显示指针 */
  transition: background-color 0.3s; /* 背景颜色变化时有0.3秒的过渡效果 */
}

/* 设置激活状态下的标签按钮样式 */
.tab-buttons button.active {
  background-color: #007bff; /* 背景颜色为蓝色 */
  color: white; /* 文本颜色为白色 */
}

/* 设置表单组的样式 */
.form-group {
  margin-bottom: 1rem; /* 底部外边距为10px */
}

/* 设置标签的样式 */
label {
  display: block; /* 标签显示为块级元素 */
  margin-bottom: 0.5rem; /* 底部外边距为5px */
}

/* 设置输入框的样式 */
input {
  width: 100%; /* 宽度为100% */
  padding: 0.5rem; /* 内边距为5px */
  border: 1px solid #ccc; /* 边框为1px的灰色 */
  border-radius: 4px; /* 边框圆角为4px */
}

/* 设置提交按钮的样式 */
.submit-btn {
  width: 100%; /* 宽度为100% */
  padding: 0.75rem; /* 内边距为7.5px */
  background-color: #007bff; /* 背景颜色为蓝色 */
  color: white; /* 文本颜色为白色 */
  border: none; /* 无边框 */
  border-radius: 4px; /* 边框圆角为4px */
  cursor: pointer; /* 鼠标悬停时显示指针 */
  transition: background-color 0.3s; /* 背景颜色变化时有0.3秒的过渡效果 */
}

/* 设置提交按钮悬停时的样式 */
.submit-btn:hover {
  background-color: #0056b3; /* 悬停时背景颜色变深 */
}

/* 媒体查询：当屏幕宽度小于1024px时 */
@media (max-width: 1024px) {
  .form-container {
    width: 50vw; /* 宽度调整为视口宽度的50% */
    height: 60vh; /* 高度调整为视口高度的60% */
  }
}

/* 媒体查询：当屏幕宽度小于768px时 */
@media (max-width: 768px) {
  .form-container {
    width: 90vw; /* 宽度调整为视口宽度的90% */
    height: 70vh; /* 高度调整为视口高度的70% */
  }
}
</style>