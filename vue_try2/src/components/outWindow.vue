<script lang="ts" setup>
  import { ref,onMounted } from 'vue'
  import { Close } from '@element-plus/icons-vue'
  import axios from 'axios'
  import { user_data,project_id } from '@/status'
  import { ElMessage } from 'element-plus'

  const progressStatus = ref('播放中');
  // 传入的props
  const props = defineProps({
      isVisible: Boolean,
      styleProps: Object,
      messageType: String,
      outWindowType: Boolean
  })

  // 监听事件
  const emits = defineEmits([
      'closeModal'
  ])

  //给边框使用
  const getCssVarName = (type: string) => {
      return `--el-box-shadow${type ? '-' : ''}${type}`
  }

  // 留言-文本框设置
  const textarea = ref('')

  // 获取当前项目下所有的留言
  const allMessages = ref([])
  const partMessages = ref([])
  function getMessages() {
      axios.post('http://localhost:8080/get_message', {
        message_type: props.messageType
      },{
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }).then(function (response){
        allMessages.value = response.data.data
        for(let i=0;i<allMessages.value.length;i++) {
          if(allMessages.value[i].messagetype === props.messageType) {
              partMessages.value.push(allMessages.value[i])
          }
        }
      }).catch(function (error){
        if (error.response) {
          // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          // 请求已经成功发起，但没有收到响应
          // `error.request` 在浏览器中是 XMLHttpRequest 的实例，
          // 而在node.js中是 http.ClientRequest 的实例
          console.log(error.request);
        } else {
          // 发送请求时出了点问题
          console.log('Error', error.message);
        }
        console.log(error.config)
        alert('状态码错误')
      })
  }

  // 发送留言
  function sendText() {
    if(textarea.value === '') {
        ElMessage.error('留言内容不能为空')
        return
    }
    axios.post('http://localhost:8080/create_message', {
      account_id: user_data.value.accountid,
      project_id: project_id.value,
      message_type: props.messageType,
      message: textarea.value
    },{
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(function (response){
      ElMessage.success('留言发送成功')
    }).catch(function (error){
      if (error.response) {
        // 请求成功发出且服务器也响应了状态码，但状态代码超出了 2xx 的范围
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // 请求已经成功发起，但没有收到响应
        // `error.request` 在浏览器中是 XMLHttpRequest 的实例，
        // 而在node.js中是 http.ClientRequest 的实例
        console.log(error.request);
      } else {
        // 发送请求时出了点问题
        console.log('Error', error.message);
      }
      console.log(error.config)
      alert('留言发送失败')
    })
  }

  // 在 <outWindow> 组件的 <script> 部分
  const updateProgressStatus = (videoElement) => {
    const progress = (videoElement.currentTime / videoElement.duration) * 100;
    if (progress >= 100) {
      progressStatus.value = '已完成';
    } else {
      progressStatus.value = `${progress.toFixed(2)}%`;
    }
  };

  // 一个用于从localStorage加载信息的函数
  function loadData() {
      const savedData = localStorage.getItem('user_data');
      if (savedData) {
          user_data.value = JSON.parse(savedData);
      }
      const savedProjectId = localStorage.getItem('project_id');
      if (savedProjectId) {
          project_id.value = JSON.parse(savedProjectId);
      }
  }
  
  // 组件挂载时执行事件
  onMounted(() => {
      if(props.outWindowType===true) {
        getMessages()
        loadData()
      }
  })
</script>

<template>
  <div v-if="isVisible" class="modal">
    <div class="modal-content" :style="styleProps">
      <el-button id="exit" type="danger" @click="$emit('closeModal')" :icon="Close" circle />
      <div v-if="outWindowType" id="message_area">
        <div
            id="message_block"
            h="30"
            w="30"
            m="2"
            :style="{
            boxShadow: `var(${getCssVarName('light')})`,
            }"
        >
            <el-card  v-for="message in partMessages" class="message" style="max-width: 480px" shadow="hover">
                <template  #header>
                <div class="card-header">
                    <span>检测人员:{{ message.accountid }} 留言于 {{ message.messagetime }}</span>
                </div>
                </template>
                <p class="text_item">{{ message.message }}</p>
            </el-card>
        </div>

        <el-input
            id="text_input"
            v-model="textarea"
            style="width: 240px"
            :rows="2"
            type="textarea"
            placeholder="请输入留言内容"
        />
        <el-button id="send_text" @click="sendText" type="success">发送</el-button>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<style scoped>
    .modal {
        position: fixed;
        z-index: 1;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        background-color: rgba(0,0,0,0.4);
    }

    .modal-content {
        position: relative;
        background-color: #fefefe;
        margin: 15% auto;
        padding: 20px;
        border: 1px solid #888;
        width: 35rem;
        height: 22.5rem;
    }

    .close {
        color: #aaa;
        float: right;
        font-size: 28px;
        font-weight: bold;
    }

    .close:hover,
    .close:focus {
        color: black;
        text-decoration: none;
        cursor: pointer;
    }
    #exit{
        position: absolute;
        margin-left: 31rem;
    }
    #message_block{
        width: 30rem;
        height: 20rem;
        padding-bottom: 1rem;
        overflow-y: scroll;
        overflow-x: hidden;
    }
    .message{
        margin-top: 0.5rem;
        margin-left: 0.4rem;
        width: 28rem;
        height: 8rem;
    }
    #text_input{
        margin-top: 1rem;
        width: 30rem;
        height: 10rem;
    }
    #send_text{
        position: absolute;
        margin-top: 11.5rem;
        margin-left: 12rem;
    }
</style>