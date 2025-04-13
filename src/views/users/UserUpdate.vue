<template>
  <div>
    <UserNavbar>
      <!-- 用户信息展示 -->
      <el-card class="user-info-card">
        <div class="user-info">
          <p>用户名: {{ userInfo.username }}</p>
          <p>密码: {{ userInfo.password }}</p>
          <p>邮箱: {{ userInfo.email }}</p>
          <p>电话: {{ userInfo.phone }}</p>
        </div>
        <el-button type="primary" @click="showDialog = true">修改信息</el-button>
      </el-card>
      <!-- 修改信息弹窗 -->
      <el-dialog v-model="showDialog" title="修改用户信息" width="30%">
        <el-form :model="updateFrom" label-width="80px">
          <el-form-item label="用户名">
            <el-input v-model="updateFrom.username"></el-input>
          </el-form-item>
          <el-form-item label="密码">
            <el-input v-model="updateFrom.password" type="password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="updateFrom.email"></el-input>
          </el-form-item>
          <el-form-item label="电话">
            <el-input v-model="updateFrom.phone"></el-input>
          </el-form-item>
        </el-form>
        <template #footer>
          <el-button type="default" @click="showDialog = false">取消</el-button>
          <el-button type="primary" @click="updateUserInfo">确认修改</el-button>
        </template>
      </el-dialog>
    </UserNavbar>
  </div>
</template>

<script setup>
import UserNavbar from '@/components/UserNavbar.vue';
import { onMounted, ref } from 'vue';
import {useUserStore} from '@/store/user'
import axiosInstance from '@/utils/axiosInstance'

// 用户信息数据
const userInfo = ref({
  username: '',
  password: '',
  email: '',
  phone: ''
});

//使用pinia的用户store
const useStore = useUserStore();
//从pinia中获取用户id
const userId = useStore.userId;
//在组件挂载后，通过 GET 请求获取用户数据
onMounted(async () => {
  try {
    const response = await axiosInstance.get(`/users/${userId}`);
    if(response.data.code === 1){
      userInfo.value = response.data.data; // 将返回的数据赋值给 userInfo
      console.log('用户信息获取成功', response.data.data) 
    }else{
      console.log('用户信息获取失败', response.data.msg)
    }
  }catch (error) {
    console.error('请求错误：', error)
  }
})
// 控制弹窗显示
const showDialog = ref(false);

// 修改用户数据
const updateFrom = ref(
  {
  userId: userId,
  username: "",
  password: "",
  email: "",
  phone: ""
}
);
// 修改用户信息方法
const updateUserInfo = async() => {
  //提交修改
  try {
    const response = await axiosInstance.put('/users/update', updateFrom.value);
    if(response.data.code === 1){
      console.log('用户信息修改成功', response.data.data) 
      //刷新界面
      location.reload();
    }else{
      console.log('用户信息修改失败', response.data.msg)
    }
  }catch (error) {
    console.error('请求错误：', error)
  }
  // 这里可以添加提交修改的逻辑
  console.log('修改后的用户信息:', updateFrom.value);
  // 关闭弹窗
  showDialog.value = false;
};
</script>

<style>
@import '../../css/button.css';
</style>

<style scoped>

.user-info-card {
  margin: 20px;
  padding: 20px;
}

.user-info p {
  margin: 10px 0;
}

</style>