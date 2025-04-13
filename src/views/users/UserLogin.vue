<template>
    <div class="login-container">
        <div class="form-container">
            <h2>用户登录</h2>
            <el-form ref="loginFormRef" :model="loginForm" label-width="80px">
                <el-form-item label="用户名">
                    <el-input v-model="loginForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码">
                    <el-input v-model="loginForm.password" type="password"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="handleLogin">登录</el-button>
                    <el-button @click="handleRegister">注册</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import {useUserStore} from '@/store/user'
import axiosInstance from '@/utils/axiosInstance'
import { ElMessage } from 'element-plus';
//定义表单数据
const loginForm = ref({
    username: "",
    password: ""
});
//使用pinia的用户store
const useStore = useUserStore();
// 登录处理函数
const handleLogin = async () => {
    try {
       // 发起post请求
       const response = await axiosInstance.post('/users/login', loginForm.value);
       if(response.data.code === 1){
        // 登录成功，存储用户信息到pinia
        useStore.setUser(response.data.data);
        // 跳转到用户信息更新页面
        console.log('登录成功', response.data.data)
        ElMessage.success('登录成功')
        router.push('/user/update')
       }else{
        console.log('登录失败', response.data.msg)
        ElMessage.error('登录失败')
       }
    }catch (error) {
    console.error('请求错误：', error)
    ElMessage.error('登录失败')
  }
};


// 获取路由实例
const router = useRouter();

// 定义表单引用
const loginFormRef = ref(null);

// 注册处理函数
const handleRegister = () => {
    router.push('/userregister');
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
