<template>
  <UserNavbar>
    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column prop="ticketName" label="门票类型" width="180" />
      <el-table-column prop="quantity" label="门票数量" width="180" />
      <el-table-column prop="totalPrice" label="总价格" width="180" />
      <el-table-column prop="status" label="预约状态" width="180" />
      <el-table-column label="预约时间">
        <template #default="{ row }">
          {{ formatTime(row.createTime) }}
        </template>
      </el-table-column>
    </el-table>
  </UserNavbar>
</template>

<script setup>
import UserNavbar from '@/components/UserNavbar.vue';
import { onMounted, ref } from 'vue';
import { useUserStore } from '@/store/user'
import axiosInstance from '@/utils/axiosInstance'
import dayjs from 'dayjs';

const formatTime = (time) => {
  // 格式化为 'YYYY/MM/DD HH:mm:ss' 格式
  return dayjs(time).format('YYYY/MM/DD HH:mm:ss');
};

const tableData = ref([]);

const userStore = useUserStore();

const userId = userStore.userId;

onMounted(async () => {
  try {
    const response = await axiosInstance.get(`/users/ticket_reservations/${userId}`);
    if (response.data.code === 1) {
      tableData.value = response.data.data;
      console.log('用户信息获取成功', response.data.data)
    } else {
      console.log('用户信息获取失败', response.data.msg)
    }
  } catch (error) {
    console.error('请求错误：', error)
  }
})
</script>

<style scoped></style>