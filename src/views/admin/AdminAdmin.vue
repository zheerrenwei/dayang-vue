<template>
  <AdminNavbar>
    <div style="margin-bottom: 20px">
      <label style="margin-right: 5px">
        员工姓名:
      </label>
      <el-input placeholder="请输入员工姓名" style="width: 15%" v-model="page.adminName" />
      <el-button type="primary" style="margin-left: 20px" @click="pageQuery">查询</el-button>
      <el-button type="primary" style="float: right" @click="showDialog = true">+添加员工</el-button>
    </div>
    <el-table :data="tableData" border style="width: 100%;margin-bottom:20px;height:420px">
      <el-table-column prop="adminName" label="管理员用户名" width="180" />
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
          <el-switch v-model="row.role" active-value="normal" inactive-value="super"
            @change="handleStatusChange(row.adminId, row.role)"
            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button style="color: white" size="30px" type="success"
            @click="handleEdit(row.adminId)" >编辑</el-button>
          <el-button style="color: white;" size="30px" type="danger"
            @click="handleDelete(row.adminId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="sizes, prev, pager, next,jumper,total" :current-page="page.page"
      :page-size="page.pagesize" :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange" />
    <!-- 新增弹窗 -->
    <el-dialog v-model="showDialog" title="添加管理员" width="50%" @close="handleClose">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px" label-position="right">
        <el-form-item label="管理员姓名" prop="adminName">
          <el-input v-model="formData.adminName" placeholder="请输入管理员姓名" clearable />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="formData.password" type="password" placeholder="请输入密码" show-password clearable />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="formData.email" placeholder="请输入有效邮箱" clearable />
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入手机号码" clearable />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDialog = false" type="default">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确认添加</el-button>
      </template>
    </el-dialog>
    <!-- 编辑弹窗 -->
    <el-dialog v-model="showDialog2" title="编辑管理员" width="50%" @close="handleClose">
      <el-form ref="formRef" :model="formData2" :rules="formRules" label-width="120px" label-position="right">
        <el-form-item label="管理员姓名" prop="adminName">
          <el-input v-model="formData2.adminName" placeholder="请输入管理员姓名" clearable />
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
import { ref, onMounted, reactive } from 'vue';
import axiosInstance from '@/utils/axiosInstance'
import dayjs from 'dayjs';
import { ElMessage, ElMessageBox } from 'element-plus';

const formatTime = (time) => {
  // 格式化为 'YYYY/MM/DD HH:mm:ss' 格式
  return dayjs(time).format('YYYY/MM/DD HH:mm:ss');
};

// 分页请求数据
const page = ref({
  adminName: '',
  page: '1',
  pagesize: '10'
})

//管理员数据
const tableData = ref([])

const total = ref(0)

const handleStatusChange = async (adminId, role) => {
  const status = ref(0)
  if (role === 'super') {
    status.value = 0;
  } else if (role === 'normal') {
    status.value = 1;
  }
  try {
    const response = await axiosInstance.post('/admin/role',
      { status: status.value, adminId: adminId },
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
// 获取管理员信息
const getData = async () => {
  try {
    const response = await axiosInstance.get('/admin/page', {
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
const handleDelete = async (adminId) => {
  try {
    await ElMessageBox.confirm(
      '确定删除该管理员吗？', '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    const response = await axiosInstance.delete(`/admin/delete/${adminId}`);
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

// 添加管理员表单数据
const formData = reactive({
  adminName: '',
  password: '',
  email: '',
  phone: ''
})

// 控制添加管理员弹窗显示
const showDialog = ref(false)
// 关闭弹窗处理[6,7](@ref)
const formRef = ref(null)
const handleClose = () => {
  formRef.value?.resetFields()
}
// 提交添加管理员表单
const handleSubmit = async () => {
  try {
    const response = await axiosInstance.post('/admin/add', formData);
    if (response.data.code === 1) {
      ElMessage.success('添加成功');
      showDialog.value = false; // 关闭弹窗
      getData(); // 刷新数据
    } else {
      ElMessage.error('failed');
    }
  } catch (error) {
    console.error('error:', error);
    ElMessage.error('401');
  }
}
// 编辑按钮触发
const formData2 = ref({
  adminId: '',
  adminName: '',
  password: '',
  email: '',
  phone: ''
})
const showDialog2 = ref(false)

const handleEdit = async (adminId) => {
  try {
    const response = await axiosInstance.get(`/admin/${adminId}`);
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
      const response = await axiosInstance.put('/admin/update', formData2.value);
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

<style>
@import '../../css/button.css';
</style>
<style scoped></style>
