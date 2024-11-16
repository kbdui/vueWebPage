<script setup>
    import { ref,computed } from 'vue';

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
            // Implement logout logic here
            ElMessage.success('退出登录成功')
            // You would typically clear user session and redirect to login page
            // router.push('/login')
        }
    }

    function handleAvatarError(){
      console.log("handleAvatarError is error")
    }
</script>

<template>
    <el-dropdown id="head" trigger="hover" @command="handleCommand">
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
            <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
    </el-dropdown>
</template>

<style>
#head{
    float: right;
}

.avatar-wrapper {
  cursor: pointer;
}
.user-info {
  padding: 10px;
  min-width: 200px;
  /* margin-left: 90%; */
}

.user-info p {
  margin: 5px 0;

}
</style>