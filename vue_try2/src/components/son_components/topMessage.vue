<template>
    <el-page-header @back="goBack">
        <template #content>
            <span style="color: rgb(30, 193, 30);" class="text-large font-600 mr-3">
                {{ title }}
            </span>
        </template>
        </el-page-header>
</template>

<script setup>
    import { useRouter } from 'vue-router'
    import { onMounted } from 'vue'
    import { title, user_data } from '@/status'

    const router = useRouter()

    // 一个用于从localStorage加载title的函数
    function loadTitle() {
        const savedData = localStorage.getItem('title');
        if (savedData) {
            title.value = JSON.parse(savedData);
        }
    }

    // 一个用于从localStorage加载user_data的函数
    function loadUserData() {
        const savedData = localStorage.getItem('user_data');
        if (savedData) {
            user_data.value = JSON.parse(savedData);
        }
    }

    // page header 页头
    const goBack = () => {
        if(user_data.value.accountType === "Experimenters") router.push('/standard')
        else if(user_data.value.accountType === "Supportstaff") router.push('/supportStandardQuery')
        console.log('go back')
    }

    // 组件挂载时执行的函数
    onMounted(() => {
        loadTitle()
        loadUserData()
    })
</script>
