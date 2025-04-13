<template>
  <AdminNavbar>
    <div style="margin-bottom: 20px">
      <label style="margin-right: 5px">
        用户名:
      </label>
      <el-input placeholder="请输入用户姓名" style="width: 15%" v-model="page.username" />
      <el-button type="primary" style="margin-left: 20px" @click="pageQuery">查询</el-button>
    </div>
    <el-table :data="tableData" border style="width: 100%;margin-bottom:20px;height:420px">
      <el-table-column prop="username" label="用户名" width="180" />
      <el-table-column prop="password" label="密码" width="190" />
      <el-table-column prop="email" label="邮箱" width="190" />
      <el-table-column prop="phone" label="电话号码" width="190" />
      <el-table-column label="创建时间" width="190">
        <template #default="{ row }">
          {{ formatTime(row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="状态管理" width="90">
        <template #default="{ row }">
          <el-switch v-model="row.status" :active-value="1"  :inactive-value="0"
            @change="handleStatusChange(row.userId, row.status)"
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button style="color: white; " type="success" size="30px"
            @click="handleEdit(row.userId)">编辑</el-button>
          <el-button style="color: white;" type="danger"  size="30px"
            @click="handleDelete(row.userId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="sizes, prev, pager, next,jumper,total" :current-page="page.page"
      :page-size="page.pagesize" :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange" />


    <!-- 编辑弹窗 -->
    <el-dialog v-model="showDialog2" title="编辑用户" width="50%" @close="handleClose">
      <el-form ref="formRef" :model="formData2" :rules="formRules" label-width="120px" label-position="right">
        <el-form-item label="用户姓名" prop="username">
          <el-input v-model="formData2.username" placeholder="请输入用户姓名" clearable />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="formData2.password" type="password" placeholder="请输入密码" show-password clearable />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData2.email" placeholder="请输入有效邮箱" clearable />
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="formData2.phone" placeholder="请输入手机号码" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDialog2 = false" type="default">取消</el-button>
        <el-button type="primary" @click="handleEditSubmit">确认修改</el-button>
      </template>
    </el-dialog>
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
  username: '',
  page: '1',
  pagesize: '10'
})

//用户数据
const tableData = ref([])

const total = ref(0)

const handleStatusChange = async (userId,status) => {
  try {
    const response = await axiosInstance.post('/admin/users/status',
      { status: status, userId: userId },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }

      });
    if (response.data.code === 1) {
      ElMessage.success('状态更新成功');
    } else {
      ElMessage.error('状态更新失败');
    }
  } catch (error) {
    console.error('更新状态错误:', error);
    ElMessage.error('请求错误');
  }
};

// 获取用户信息
const getData = async () => {
  try {
    const response = await axiosInstance.get('/admin/users/page', {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      // GET 请求参数会拼接在 URL 上
      params: page.value
    })
    if (response.data.code === 1) {
      tableData.value = response.data.data.records;
      total.value = response.data.data.total;
      console.log('用户信息获取成功', response.data.data)
    } else {
      console.log('用户信息获取失败', response.data.msg)
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
const handleDelete = async (user_id) => {
  try {
    await ElMessageBox.confirm(
      '确定删除该用户吗？', '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    const response = await axiosInstance.delete(`/admin/users/${user_id}`);
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

// 编辑按钮触发


const formData2 = ref({
  userId: '',
  username: '',
  password: '',
  email: '',
  phone: ''
})
// 控制编辑弹窗显示
const showDialog2 = ref(false)

// 关闭弹窗处理[6,7](@ref)
const formRef = ref(null)
const handleClose = () => {
  formRef.value?.resetFields()
}

const handleEdit = async (user_id) => {
  try {
    const response = await axiosInstance.get(`/admin/users/${user_id}`);
    if (response.data.code === 1) {
      formData2.value = response.data.data; // 关键：回填数据到表单
      showDialog2.value = true; // 显示编辑弹窗
    } else {
      ElMessage.error('获取用户信息失败');
    }
  } catch (error) {
    console.error('编辑请求错误:', error);
    ElMessage.error('请求异常');
  } 
}

const handleEditSubmit = async () => {
  try {
      const response = await axiosInstance.put('/admin/users/update', formData2.value);
      if (response.data.code === 1) {
        ElMessage.success('修改成功');
        showDialog2.value = false;
        getData(); // 刷新表格数据
      } else {
        ElMessage.error(response.data.msg || '修改失败');
      }
    } catch (error) {
      console.error('修改请求错误:', error);
      ElMessage.error('服务器异常');
    }
}
</script>

<style scoped></style>