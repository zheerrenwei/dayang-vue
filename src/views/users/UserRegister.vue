<template>
  <div class="register">
    <div class="register-container">
      <h1>用户注册</h1>
      <el-form ref="registerFormRef" :model="registerForm" label-width="80px">
        <el-form-item label="用户名">
          <el-input v-model="registerForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="registerForm.password" type="password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="registerForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号">
          <el-input v-model="registerForm.phone"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleRegister">注册</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import axiosInstance from '@/utils/axiosInstance'
import { ElMessage } from 'element-plus';
// 获取路由实例
const router = useRouter();

// 定义表单引用
const registerFormRef = ref(null);

// 定义表单数据
const registerForm = ref({
  username: '',
  password: '',
  email: '',
  phone: '',
});
// 注册处理函数
const handleRegister = async () => {
  try {
    // 发起post请求
    const response = await axiosInstance.post('/users/register', registerForm.value)
    if(response.data.code === 1){
      console.log('注册成功')
      ElMessage.success('注册成功')
      router.push('/userlogin')
    }else{
      console.log('注册失败')
      ElMessage.error('注册失败')
    }
  } catch (error) {
    console.error('请求错误：', error)
    ElMessage.error('注册失败')
  }
};
  
</script>

<style scoped>
.register {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-image: url(../../assets/11.jpg);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
}

.register-container {
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