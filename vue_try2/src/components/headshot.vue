<script setup>
    import { ref,computed } from 'vue'
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
            <el-dropdown-item divided command="jumpToHomepage1">个人主页</el-dropdown-item>
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