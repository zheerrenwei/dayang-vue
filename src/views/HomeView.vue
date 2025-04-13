<template>
  <div id="home" class="button-container">
    <el-button type="primary" @click="$router.push('/adminlogin')">管理员登录</el-button>
    <el-button @click="$router.push('/userlogin')">用户登录</el-button>
  </div>
</template>

<script>
export default {
  name: 'HomeView'
}
</script>

<style scoped>
.button-container {
  display: flex;
  justify-content: center;
  gap: 20px;
  padding: 2rem;
}
</style>