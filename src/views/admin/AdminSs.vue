<template>
  <AdminNavbar>
    <div style="margin-bottom: 20px">
      <label style="margin-right: 5px">
        景点名称:
      </label>
      <el-input placeholder="请输景点名称" style="width: 15%" v-model="page.name" />
      <el-button type="primary" style="margin-left: 20px" @click="pageQuery">查询</el-button>
      <el-button type="primary" style="float: right" @click="showDialog = true">+添加景点</el-button>
    </div>
    <el-table :data="tableData" border style="width: 100%;margin-bottom:20px;height:420px">
      <el-table-column prop="name" label="景点名称" width="125" />
      <el-table-column prop="description" label="景点描述" width="140" />
      <el-table-column prop="address" label="地址" width="125" />
      <el-table-column prop="phone" label="电话号码" width="125" />
      <el-table-column prop="openTime" label="开放时间" width="130" />
      <el-table-column label="创建时间" width="130">
        <template #default="{ row }">
          {{ formatTime(row.createTime) }}
        </template>
      </el-table-column>
      <el-table-column label="更新时间" width="130">
        <template #default="{ row }">
          {{ formatTime(row.updateTime) }}
        </template>
      </el-table-column>
      <el-table-column label="图片" width="130">
        <template #default="{ row }">
          <el-image :src="row.image" :preview-src-list="[row.image]" preview-teleported="true"
            style="width: 80px; height: 80px" />
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template #default="{ row }">
          <el-button style="color: white;" type="success" size="30px"
            @click="handleEdit(row.scenicId)">编辑</el-button>
          <el-button style="color: white;" type="danger" size="30px"
            @click="handleDelete(row.scenicId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination background layout="sizes, prev, pager, next,jumper,total" :current-page="page.page"
      :page-size="page.pagesize" :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange" />

    <!-- 新增弹窗 -->
    <el-dialog v-model="showDialog" title="添加景点" width="50%" @close="handleClose">
      <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px" label-position="right">
        <el-form-item label="景点名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入景点名称" clearable />
        </el-form-item>
        <el-form-item label="景点描述" prop="description">
          <el-input v-model="formData.description" type="textarea" :autosize="{ minRows: 4, maxRows: 6 }"
            placeholder="请输入景点描述" clearable />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="formData.address" placeholder="请输入地址" clearable />
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="formData.phone" placeholder="请输入手机号码" clearable />
        </el-form-item>
        <el-form-item label="营业时间" prop="openTime">
          <el-time-picker v-model="formData.openTime" placeholder="选择时间" format="HH:mm" value-format="HH:mm" />
        </el-form-item>
        <el-form-item label="图片" prop="image">
          <el-upload method="post" list-type="picture-card" :limit="1" :auto-upload="false"
            :on-change="handleFileChange" :file-list="fileList">
            <el-icon class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDialog = false" type="default">取消</el-button>
        <el-button type="primary" @click="handleSubmit">确认添加</el-button>
      </template>
    </el-dialog>

    <!-- 编辑弹窗 -->
    <el-dialog v-model="showDialog2" title="编辑景点" width="50%" @close="handleClose">
      <el-form ref="formRef" :model="formData2" :rules="formRules" label-width="120px" label-position="right">
        <el-form-item label="景点名称" prop="name">
          <el-input v-model="formData2.name" placeholder="请输入景点名称" clearable />
        </el-form-item>
        <el-form-item label="景点描述" prop="description">
          <el-input v-model="formData2.description" type="textarea" :autosize="{ minRows: 4, maxRows: 6 }"
            placeholder="请输入景点描述" clearable />
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="formData2.address" placeholder="请输入地址" clearable />
        </el-form-item>
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="formData2.phone" placeholder="请输入手机号码" clearable />
        </el-form-item>
        <el-form-item label="营业时间" prop="openTime">
          <el-time-picker v-model="formData2.openTime" placeholder="选择时间" format="HH:mm" value-format="HH:mm" />
        </el-form-item>
        <el-form-item label="图片" prop="image">
          <el-upload method="post" list-type="picture-card" :limit="1" :auto-upload="false"
            :on-change="handleFileChange2" :file-list="fileList2">
            <el-icon class="avatar-uploader-icon">
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="showDialog2 = false" type="default">取消</el-button>
        <el-button type="primary" @click="handleSubmit2">确认修改</el-button>
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
  name: '',
  page: '1',
  pagesize: '10'
})
//景点数据
const tableData = ref([])
const total = ref(0)
// 获取景点信息
const getData = async () => {
  try {
    const response = await axiosInstance.get('/admin/scenic_spots/page', {
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
const handleDelete = async (scenicId) => {
  try {
    await ElMessageBox.confirm(
      '确定删除该景点吗？', '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      }
    )
    const response = await axiosInstance.delete(`/admin/scenic_spots/${scenicId}`);
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






// 控制添加管理员弹窗显示
const showDialog = ref(false)
// 关闭弹窗处理[6,7](@ref)
const formRef = ref(null)
const handleClose = () => {
  formRef.value?.resetFields()
}
// 添加管理员表单数据
const formData = reactive({
  name: '',
  description: '',
  address: '',
  phone: '',
  openTime: '',
  image: ''
})
const fileList = ref([]);
// 文件选择监听
const handleFileChange = (file) => {
  fileList.value = [file]; // 更新预览列表
};
// 独立的图片上传方法
const uploadImage = async () => {
  if (!fileList.value.length) { // 检查是否有文件
    ElMessage.error('请选择图片');
    throw new Error('未选择文件'); // 抛出错误阻止后续执行
  }
  const formData1 = new FormData();
  formData1.append('file', fileList.value[0].raw);
  try {
    const response = await axiosInstance.post('common/upload', formData1);
    if (response.data.code === 1) {
      ElMessage.success('图片上传成功');
      fileList.value = []; // 清空文件列表
      return response.data.data; // 返回上传后的图片路径
    } else {
      ElMessage.error('图片上传失败');
      throw new Error('图片上传失败'); // 抛出错误阻止后续执行
    }
  } catch (error) {
    console.error('图片上传错误:', error);
    ElMessage.error('图片上传失败');
    fileList.value = []; // 清空文件列表
    throw error; // 抛出错误
  }
}
// 提交添加管理员表单
const handleSubmit = async () => {
  try {
    const imageUrl = await uploadImage(); // 上传图片并获取 URL
    formData.image = imageUrl; // 将图片 URL 赋值给 formData.image

    const response = await axiosInstance.post('/admin/scenic_spots', formData);
    if (response.data.code === 1) {
      ElMessage.success('添加成功');
      showDialog.value = false; // 关闭弹窗
      getData();                // 刷新数据
    } else {
      ElMessage.error(response.data.msg || '添加失败');
    }
  } catch (error) {
    console.error('提交错误:', error);
    ElMessage.error('提交异常');
  }
}









// 编辑按钮触发
const formData2 = ref({
  name: '',
  description: '',
  address: '',
  phone: '',
  openTime: '',
  image: ''
})
const showDialog2 = ref(false)

const handleEdit = async (scenicId) => {
  try {
    const response = await axiosInstance.get(`/admin/scenic_spots/${scenicId}`);
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

const fileList2 = ref([]);
// 文件选择监听
const handleFileChange2 = (file) => {
  fileList2.value = [file]; // 更新预览列表
};
// 独立的图片上传方法
const uploadImage2 = async () => {
  if (!fileList2.value.length) { // 检查是否有文件
    ElMessage.error('请选择图片');
    throw new Error('未选择文件'); // 抛出错误阻止后续执行
  }
  const formData3 = new FormData();
  formData3.append('file', fileList2.value[0].raw);
  try {
    const response = await axiosInstance.post('common/upload', formData3);
    if (response.data.code === 1) {
      ElMessage.success('图片上传成功');
      fileList2.value = []; // 清空文件列表
      return response.data.data; // 返回上传后的图片路径
    } else {
      ElMessage.error('图片上传失败');
      throw new Error('图片上传失败'); // 抛出错误阻止后续执行
    }
  } catch (error) {
    console.error('图片上传错误:', error);
    ElMessage.error('图片上传失败');
    fileList2.value = []; // 清空文件列表
    throw error; // 抛出错误
  }
}
// 修改表单
const handleSubmit2 = async () => {
  try {
    const imageUrl = await uploadImage2(); // 上传图片并获取 URL
    formData2.value.image = imageUrl; // 将图片 URL 赋值给 formData.image

    const response = await axiosInstance.put('/admin/scenic_spots/update', formData2.value);
    if (response.data.code === 1) {
      ElMessage.success('修改成功');
      showDialog2.value = false; // 关闭弹窗
      getData();                // 刷新数据
    } else {
      ElMessage.error(response.data.msg || '修改失败');
    }
  } catch (error) {
    console.error('修改错误:', error);
    ElMessage.error('修改异常');
  }
}
</script>

<style scoped></style>
