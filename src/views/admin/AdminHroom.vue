<template>
  <AdminNavbar>
    <div style="margin-bottom: 20px">
      <label style="margin-right: 5px">
        根据酒店名称:
      </label>
      <el-input placeholder="请输入酒店名称" style="width: 15%" v-model="page.name" />
      <el-button type="primary" style="margin-left: 20px" @click="pageQuery">查询</el-button>
      <el-button type="primary" style="float: right" @click="showDialog = true">+添加房间</el-button>
    </div>
    <el-table :data="tableData" border style="width: 100%;margin-bottom:20px;height:420px">
      <el-table-column prop="name" label="酒店名称" width="150" />
      <el-table-column prop="roomType" label="房间名称" width="150" />
      <el-table-column prop="description" label="房间描述" width="190" />
      <el-table-column prop="price" label="房价价格" width="130" />
      <el-table-column prop="bedCount" label="床数" width="130" />
      <el-table-column prop="capacity" label="可住人数" width="130" />
      <el-table-column prop="availableCount" label="剩余数量" width="130" />
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button style="color: white; " type="success" size="30px"
            @click="handleEdit(row.roomId)">编辑</el-button>
          <el-button style="color: white; " type="danger" size="30px"
            @click="handleDelete(row.roomId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="sizes, prev, pager, next,jumper,total" :current-page="page.page"
      :page-size="page.pagesize" :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange" />


    <!-- 新增弹窗 -->
    <el-dialog v-model="showDialog" title="添加房间" width="50%" @close="handleClose">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px" label-position="right">
        <el-form-item label="房间所属酒店" prop="name">
          <el-input v-model="formData.name" placeholder="请输入所属酒店" clearable />
        </el-form-item>
        <el-form-item label="房型名称" prop="roomType">
          <el-input v-model="formData.roomType"  placeholder="请输入房型名称"  clearable />
        </el-form-item>
        <el-form-item label="房型描述" prop="description">
          <el-input v-model="formData.description" type="textarea" placeholder="请输入房间描述" clearable />
        </el-form-item>
        <el-form-item label="房价" prop="price">
          <el-input v-model="formData.price" placeholder="请输入房价单价" clearable />
        </el-form-item>
        <el-form-item label="床数" prop="bedCount">
          <el-input v-model="formData.bedCount" placeholder="请输入房间床数" clearable />
        </el-form-item>
        <el-form-item label="可住人数" prop="capacity">
          <el-input v-model="formData.capacity" placeholder="请输入可住人数" clearable />
        </el-form-item>
        <el-form-item label="剩于房间" prop="availableCount">
          <el-input v-model="formData.availableCount" placeholder="请输入剩余房间" clearable />
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
        <el-form-item label="房间所属酒店" prop="name">
          <el-input v-model="formData2.name" placeholder="请输入所属酒店" clearable />
        </el-form-item>
        <el-form-item label="房型名称" prop="roomType">
          <el-input v-model="formData2.roomType"  placeholder="请输入房型名称"  clearable />
        </el-form-item>
        <el-form-item label="房型描述" prop="description">
          <el-input v-model="formData2.description" type="textarea" placeholder="请输入房间描述" clearable />
        </el-form-item>
        <el-form-item label="房价" prop="price">
          <el-input v-model="formData2.price" placeholder="请输入房价单价" clearable />
        </el-form-item>
        <el-form-item label="床数" prop="bedCount">
          <el-input v-model="formData2.bedCount" placeholder="请输入房间床数" clearable />
        </el-form-item>
        <el-form-item label="可住人数" prop="capacity">
          <el-input v-model="formData2.capacity" placeholder="请输入可住人数" clearable />
        </el-form-item>
        <el-form-item label="剩于房间" prop="availableCount">
          <el-input v-model="formData2.availableCount" placeholder="请输入剩余房间" clearable />
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
import { ElMessage, ElMessageBox } from 'element-plus';


// 分页请求数据
const page = ref({
  name: '',
  page: '1',
  pagesize: '10'
})

//管理员数据
const tableData = ref([])

const total = ref(0)

// 获取管理员信息
const getData = async () => {
  try {
    const response = await axiosInstance.get('/admin/rooms/page', {
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
const handleDelete = async (roomId) => {
  try {
    await ElMessageBox.confirm(
      '确定删除该房型吗？', '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    const response = await axiosInstance.delete(`/admin/rooms/${roomId}`);
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
  name: '',
  roomType: '',
  description: '',
  price: '',
  bedCount: '',
  capacity: '',
  availableCount: ''
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
    const response = await axiosInstance.post('/admin/rooms', formData);
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
  roomId: '',
  name: '',
  roomType: '',
  description: '',
  price: '',
  bedCount: '',
  capacity: '',
  availableCount: ''
})
const showDialog2 = ref(false)

const handleEdit = async (hotelId) => {
  try {
    const response = await axiosInstance.get(`/admin/rooms/${hotelId}`);
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
      const response = await axiosInstance.put('/admin/rooms/update', formData2.value);
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