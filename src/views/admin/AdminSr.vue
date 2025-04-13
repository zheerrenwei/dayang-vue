<template>
  <AdminNavbar>
    <div style="margin-bottom: 20px">
      <label style="margin-right: 5px">
        根据景点名称查询:
      </label>
      <el-input placeholder="请输入评论相关景点名称" style="width: 15%" v-model="page.name" />
      <label style="margin-right: 5px">
        敏感词查询:
      </label>
      <el-input placeholder="请输入评论敏感词" style="width: 15%" v-model="page.comment" />
      <el-button type="primary" style="margin-left: 20px" @click="pageQuery">查询</el-button>
    </div>
    <el-table :data="tableData" border style="width: 100%;margin-bottom:20px;height:420px">
      <el-table-column prop="name" label="关联景点" width="210" />
      <el-table-column prop="username" label="评论用户" width="210" />
      <el-table-column prop="rating" label="用户评分" width="210" />
      <el-table-column prop="comment" label="评论内容" width="250" />
      <el-table-column label="评论时间" width="210">
        <template #default="{ row }">
          {{ formatTime(row.reviewDate) }}
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button style="color: white; " type="danger" size="30px"
            @click="handleDelete(row.reviewId)">删除</el-button>
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
import dayjs from 'dayjs';
import { ElMessage, ElMessageBox } from 'element-plus';

const formatTime = (time) => {
  // 格式化为 'YYYY/MM/DD HH:mm:ss' 格式
  return dayjs(time).format('YYYY/MM/DD HH:mm:ss');
};

// 分页请求数据
const page = ref({
  name: '',
  comment: '',
  page: '1',
  pagesize: '10'
})

//管理员数据
const tableData = ref([])

const total = ref(0)

// 获取管理员信息
const getData = async () => {
  try {
    const response = await axiosInstance.get('/admin/scenic_reviews/page', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      // GET 请求参数会拼接在 URL 上
      params: page.value
    })
    if (response.data.code === 1) {
      tableData.value = response.data.data.records;
      total.value = response.data.data.total;
      console.log('管理员信息获取成功', response.data.data)
    } else {
      console.log('管理员信息获取失败', response.data.msg)
    }
  } catch (error) {
    console.error('请求错误：', error)
  }
}
// 页面加载时获取数据
onMounted(() => {
  getData()
})
// 查询按钮触发
const pageQuery = () => {
  getData()
}
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
const handleDelete = async (reviewId) => {
  try {
    await ElMessageBox.confirm(
      '确定删除该评论吗？', '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    const response = await axiosInstance.delete(`/admin/scenic_reviews/${reviewId}`);
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
</script>
<style scoped></style>
