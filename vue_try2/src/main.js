// 新建文件时一开始就自带的CSS
import './assets/main.css'

// 其他一些东西的引用
import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { createWebHashHistory, createRouter } from 'vue-router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 引用的组件
import App from './App.vue'
import LoginRegister from './components/LoginRegister.vue'
import testmachine from './components/testmachine.vue'
import machine from './components/machine.vue'
import people from './components/people.vue'
import StandardQuery from './components/StandardQuery.vue'
import Machinefirst from './components/machinefirst.vue'
import Regulations from './components/Regulations.vue'
import sample from './components/sample.vue'

// Aue Router，路由相关的注册
const routes = [
    { path: '/', component: LoginRegister },
    { path: '/machinefirst', component: Machinefirst },
    { path: '/testmachine', component: testmachine },
    { path: '/machine', component: machine },
    { path: '/details/:num(.*)', component: people },
    { path: '/Regulations', component: Regulations },
    { path: '/sample', component: sample },
    { path: '/standard', component: StandardQuery },
]
const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

const app = createApp(App)

// 引入图标库
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}

app.use(router)
   .use(ElementPlus, { size: 'small', zIndex: 3000 })
   .mount('#app')
