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
import StandardQuery from './components/StandardQuery.vue' // 标准查询
import people from './components/people.vue' // 人
import Machinefirst from './components/machinefirst.vue' // 机
import Regulations from './components/Regulations.vue' // 法
import sample from './components/sample.vue' // 料

// 检测人员个人主页(从上到下依次是人机法料)
import p13 from './components/p13.vue' // 人
import testmachine from './components/testmachine.vue' // 机
import Regulations18 from './components/Regulations18.vue' // 法

// 支持人员页面(从上到下依次是标准查询、人机法料)
import supportStandardQuery from './components/supportStandardQuery.vue' // 标准查询
import people28 from './components/people28.vue' // 人
import machineSelect from './components/machineSelect.vue' // 机
import testmachinep from './components/testmachine_people.vue' // 这与上一个是同个界面，画重了

// 支持人员个人主页留言管理(从上到下依次是人机法料)

// 支持人员个人主页清单管理(从上到下依次是人机法料)
import PersonnelReviewP44 from './components/PersonnelReview-p44.vue'
import PersonnelauthorizationlistP45 from './components/Personnelauthorizationlist-p45.vue'
import StaffTrainingListP46 from './components/StaffTrainingList-p46.vue' // 44-46是人
import machine from './components/machine.vue' // 机
import EquipmentListP47 from './components/EquipmentList-p47.vue' // 这与上一个是同个界面，画重了
import RegulationPage2 from './components/RegulationPage2.vue' // 法
import SampleRequestListP51 from './components/SampleRequestList-p51.vue' // 料


import RegulationPage from './components/RegulationPage.vue' // 这与 RegulationPage2 之间弄不清


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
    { path: '/Regulations18', component: Regulations18 },
    { path: '/PersonnelReviewP44', component: PersonnelReviewP44 },
    { path: '/PersonnelauthorizationlistP45', component: PersonnelauthorizationlistP45 },
    { path: '/StaffTrainingListP46', component: StaffTrainingListP46 },
    { path: '/EquipmentListP47', component: EquipmentListP47 },
    { path: '/supportStandardQuery', component: supportStandardQuery },
    { path: '/supportDetails/:num(.*)', component: people28 },
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
