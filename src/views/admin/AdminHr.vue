<template>
  <AdminNavbar>
    <div style="margin-bottom: 50px">
      <label style="margin-right: 5px">
        根据门票名:
      </label>
      <el-input placeholder="请输入门票名" style="width: 15%" v-model="page.name" />
      <el-button type="primary" style="margin-left: 20px" @click="pageQuery">查询</el-button>
    </div>
    <el-table :data="tableData" border style="width: 100%;margin-bottom:20px;height:420px">
      <el-table-column prop="username" label="用户名" width="125" />
      <el-table-column prop="name" label="酒店名" width="125" />
      <el-table-column prop="roomType" label="房间类型" width="130" />
      <el-table-column prop="totalPrice" label="价格" width="125" />
      <el-table-column prop="status" label="预约状态" width="130" />
      <el-table-column prop="checkInDate" label="入住时间" width="130" />
      <el-table-column prop="checkOutDate" label="退房日期" width="130" />
      <el-table-column label="时间" width="130">
        <template #default="{ row }">
          {{ formatTime(row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button style="color: white; " type="success" size="30px"
            @click="handleEdit(row.reservationId)">完成</el-button>
          <el-button style="color: white; " type="danger" size="30px"
            @click="handleDelete(row.reservationId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="sizes, prev, pager, next,jumper,total" :current-page="page.page"
      :page-size="page.pagesize" :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange" />
  </AdminNavbar>
</template>

<script setup>
import AdminNavbar from '@/components/AdminNavbar.vue';
import { ref, onMounted } from 'vue';
import axiosInstance from '@/utils/axiosInstance'
import { ElMessage, ElMessageBox } from 'element-plus';
import dayjs from 'dayjs';


const formatTime = (time) => {
  // 格式化为 'YYYY/MM/DD HH:mm:ss' 格式
  return dayjs(time).format('YYYY/MM/DD HH:mm:ss');
};


// 分页请求数据
const page = ref({
  page: '1',
  pagesize: '10'
})
//景点数据
const tableData = ref([])
const total = ref(0)
// 获取景点信息
const getData = async () => {
  try {
    const response = await axiosInstance.get('/admin/hotel_reservations/page', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      // GET 请求参数会拼接在 URL 上
      params: page.value
    })
    if (response.data.code === 1) {
      tableData.value = response.data.data.records;
      total.value = response.data.data.total;
      console.log('信息获取成功', response.data.data)
    } else {
      console.log('信息获取失败', response.data.msg)
    }
  } catch (error) {
    console.error('请求错误：', error)
  }
}
// 页面加载时获取数据
onMounted(() => {
  getData()
})

// 页码变化时触发
const handleCurrentChange = (newPage) => {
  page.value.page = newPage;
  getData();
};
// 每页条数变化时触发
const handleSizeChange = (newSize) => {
  page.value.pagesize = newSize;
  // 每次改变条数时，建议从第一页开始显示
  page.value.page = 1;
  getData();
};







// 删除按钮触发
const handleDelete = async (reservationId) => {
  try {
    await ElMessageBox.confirm(
      '确定删除该么预约吗？', '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    const response = await axiosInstance.delete(`/admin/hotel_reservations/${reservationId}`);
    if (response.data.code === 1) {
      ElMessage.success('删除成功');
      getData();
    } else {
      ElMessage.error(response.data.msg || '删除失败');
    }
  } catch (error) {
    if (error === 'cancel' || error === 'close') {
      ElMessage.info('已取消删除');
    } else {
      console.error('删除错误:', error);
      ElMessage.error('删除请求失败');
    }
  }
};


// 完成按钮触发

const handleEdit = async (reservationId) => {
  try {
    const response = await axiosInstance.post(`/admin/hotel_reservations/${reservationId}`);
    if (response.data.code === 1) {
      ElMessage.success('修改成功');
      getData();                // 刷新数据
    } else {
      ElMessage.error('修改信息失败');
    }
  } catch (error) {
    console.error('请求错误:', error);
    ElMessage.error('请求异常');
  }
}
</script>

<style scoped></style>