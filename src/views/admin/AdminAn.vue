<template>
    <AdminNavbar>
        <div style="margin-bottom: 50px">
            <el-button type="primary" style="float: right" @click="showDialog = true">+添加公告</el-button>
        </div>
        <el-table :data="tableData" border style="width: 100%;margin-bottom:20px;height:400px ;margin-top: 20px">
            <el-table-column prop="title" label="公告标题" width="225" />
            <el-table-column prop="content" label="公告内容" width="300" />
            <el-table-column label="发布时间" width="225">
                <template #default="{ row }">
                    {{ formatTime(row.publishedTime) }}
                </template>
            </el-table-column>
            <el-table-column prop="adminName" label="发布人" width="200" />
            <el-table-column label="操作">
                <template #default="{ row }">
                    <el-button style="color: white; " type="success" size="30px"
                        @click="handleEdit(row.announcementId)">编辑</el-button>
                    <el-button style="color: white; " type="danger" size="30px"
                        @click="handleDelete(row.announcementId)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination background layout="sizes, prev, pager, next,jumper,total" :current-page="page.page"
            :page-size="page.pagesize" :total="total" @current-change="handleCurrentChange"
            @size-change="handleSizeChange" />

        <!-- 新增弹窗 -->
        <el-dialog v-model="showDialog" title="添加公告" width="50%" @close="handleClose">
            <el-form ref="formRef" :model="formData" :rules="formRules" label-width="120px" label-position="right">
                <el-form-item label="公告名称" prop="title">
                    <el-input v-model="formData.title" placeholder="请输入公告名称" clearable />
                </el-form-item>
                <el-form-item label="公告内容" prop="content">
                    <el-input v-model="formData.content" type="textarea" :autosize="{ minRows: 4, maxRows: 10 }"
                        placeholder="请输入公告内容" clearable />
                </el-form-item>
            </el-form>
            <template #footer>
                <el-button @click="showDialog = false" type="default">取消</el-button>
                <el-button type="primary" @click="handleSubmit">确认添加</el-button>
            </template>
        </el-dialog>

        <!-- 编辑弹窗 -->
        <el-dialog v-model="showDialog2" title="编辑酒店" width="50%" @close="handleClose">
            <el-form ref="formRef" :model="formData2" :rules="formRules" label-width="120px" label-position="right">
                <el-form-item label="公告名称" prop="title">
                    <el-input v-model="formData2.title" placeholder="请输入公告名称" clearable />
                </el-form-item>
                <el-form-item label="公告内容" prop="content">
                    <el-input v-model="formData2.content" type="textarea" :autosize="{ minRows: 4, maxRows: 10 }"
                        placeholder="请输入公告内容" clearable />
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
import { ref, onMounted } from 'vue';
import axiosInstance from '@/utils/axiosInstance'
import dayjs from 'dayjs';
import { ElMessage, ElMessageBox } from 'element-plus';
import {useAdminStore} from '@/store/admin'

const adminStore = useAdminStore()

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
        const response = await axiosInstance.get('/admin/announcements/page', {
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
const handleDelete = async (announcementId) => {
    try {
        await ElMessageBox.confirm(
            '确定删除该公告吗？', '提示',
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
            }
        )
        const response = await axiosInstance.delete(`/admin/announcements/${announcementId}`);
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
const formData = ref({
    title: '',
    content: '',
    adminId: adminStore.adminId
})

// 提交添加管理员表单
const handleSubmit = async () => {
    try {
        const response = await axiosInstance.post('/admin/announcements', formData.value);
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
    title: '',
    content: '',
})
const showDialog2 = ref(false)

const handleEdit = async (announcementId) => {
    try {
        const response = await axiosInstance.get(`/admin/announcements/${announcementId}`);
        if (response.data.code === 1) {
            formData2.value = response.data.data; // 关键：回填数据到表单
            showDialog2.value = true; // 显示编辑弹窗
        } else {
            ElMessage.error('获取公告信息失败');
        }
    } catch (error) {
        console.error('编辑请求错误:', error);
        ElMessage.error('请求异常');
    }
}


// 修改表单
const handleSubmit2 = async () => {
    try {
        const response = await axiosInstance.put('/admin/announcements/update', formData2.value);
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