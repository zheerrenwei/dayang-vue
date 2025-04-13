<template>
  <div class="login-container">
    <div class="form-container">
      <h1>管理员登录</h1>
      <el-form ref="loginFormRef" :model="loginForm" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="loginForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {useAdminStore} from '@/store/admin'
import axiosInstance from '@/utils/axiosInstance'
import { ElMessage } from 'element-plus';
// 定义表单数据
const loginForm = ref({
  username: '',
  password: ''
});
// 使用pinia的用户store
const useStore = useAdminStore();

// 定义表单引用
const loginFormRef = ref(null);

// 获取路由实例
const router = useRouter();

// 登录处理函数
const handleLogin = async() => {
  try {
    // 发起post请求
    const response = await axiosInstance.post('/admin/login', loginForm.value)
    if(response.data.code === 1){
      // 登录成功，存储用户信息到pinia
      useStore.setAdmin(response.data.data) 
      // 跳转到用户信息更新页面
      console.log('登录成功', response.data.data)
      ElMessage.success('登录成功')
      router.push('/admin/admin')
    }else{
      console.log('登录失败', response.data.msg)
      ElMessage.error('登录失败')
    }
  }catch (error) {
    console.error('请求错误：', error)
    ElMessage.error('登录失败')
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url(../../assets/11.jpg);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.form-container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.8);
  border: 2px solid #ddd;
  box-shadow: 0 0 15px rgba(0, 0, 0, 0.15);
  padding: 30px;
  width: 350px;
  height: auto;
  border-radius: 15px;
}
</style>