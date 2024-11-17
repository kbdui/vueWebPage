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

// 登录页面
import LoginRegister from './components/LoginRegister.vue'

// 检测人员页面(从上到下依次是标准查询、人机法料)
import StandardQuery from './components/StandardQuery.vue'
import people from './components/people.vue'
import Machinefirst from './components/machinefirst.vue'
import Regulations from './components/Regulations.vue'
import sample from './components/sample.vue'

// 检测人员个人主页(从上到下依次是人机法料)
import p13 from './components/p13.vue'
import testmachine from './components/testmachine.vue'

// 支持人员页面(从上到下依次是标准查询、人机法料)
import machineSelect from './components/machineSelect.vue'
import testmachinep from './components/testmachine_people.vue' // 这与上面那个是同个界面

// 

// 支持人员个人主页清单管理（从上到下依次是人机法料）
import machine from './components/machine.vue'
import RegulationPage2 from './components/RegulationPage2.vue'
import SampleRequestListP51 from './components/SampleRequestList-p51.vue'


import RegulationPage from './components/RegulationPage.vue'


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
    { path: '/people13', component: p13 },
    { path: '/machineSelect', component: machineSelect },
    { path: '/RegulationPage', component: RegulationPage },
    { path: '/RegulationPage2', component: RegulationPage2 },
    { path: '/SampleRequestListP51', component: SampleRequestListP51 },
    { path: '/testmachinep', component: testmachinep },
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
