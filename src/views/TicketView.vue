<template>
    <HomeNavbar>
        <div class="logout">
            <el-card v-for="item in tableData" :key="item" class="item">
                <div class="card-content">
                    <img src="../assets/ticket.png" alt="门票图片" style="width: 250px; height: 160px; object-fit: cover;">
                    <div class="text">
                        <p class="p" id="p1">{{ item.ticketName }}</p>
                    </div>
                    <el-button size="medium" id="open" @click="showTicketDetail(item)">
                        点击预约
                    </el-button>
                </div>
            </el-card>
        </div>

        <!-- 预约弹窗 -->
        <el-dialog v-model="showDialog" title="门票详情" width="50%" @close="handleClose">
            <div v-if="currentTicket">
                <div style="display: flex;">
                    <img src="../assets/ticket.png" alt="门票图片" style="width: 250px; height: 160px; object-fit: cover;">
                    <p class="p">{{ currentTicket.ticketName }}</p>
                </div>
                <p id="p">门票价格:{{ currentTicket.price }}</p>
                <p id="p">门票描述:{{ currentTicket.description }}</p>
                <p id="p">剩余数量:{{ currentTicket.availableCount }}</p>
                <el-input-number v-model="formData.quantity" :min="1" :max="10" @change="handleChange" />
            </div>
            <template #footer>
                <el-button type="default" @click="showDialog = false">取消</el-button>
                <el-button type="primary" @click="handleEditSubmit">确认</el-button>
            </template>
        </el-dialog>
    </HomeNavbar>
</template>

<script setup>
import HomeNavbar from '@/components/HomeNavbar.vue';
import { ref, onMounted } from 'vue'
import axiosInstance from '@/utils/axiosInstance';
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus';

//使用pinia的用户store
const useStore = useUserStore();

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
        const response = await axiosInstance.get('/common/ticket/page', {
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

//当前选中的门票数据
const currentTicket = ref(null)
// 弹窗控制
const showDialog = ref(false)
// 打开弹窗并设置当前门票
const showTicketDetail = (ticket) => {
    currentTicket.value = ticket
    showDialog.value = true
}

// 关闭弹窗
const handleClose = () => {
    showDialog.value = false
}

// 添加表单数据
const formData = ref({
    userId: '',
    ticketId: '',
    quantity: 1,
    totalPrice: ''
})

// 点击预约
const handleEditSubmit = async () => {
    formData.value.userId = useStore.userId; // 从用户store中获取userId
    formData.value.ticketId = currentTicket.value.ticketId; // 从当前门票中获取ticketId
    formData.value.totalPrice = currentTicket.value.price * formData.value.quantity; // 计算总价 
    if (formData.value.quantity > currentTicket.value.availableCount) {
        ElMessage.error('预约数量不能大于剩余数量');
        return;
    }
    if (useStore.userId === null) {
        ElMessage.error('请先登录');
        return;
    }
    try {
        const response = await axiosInstance.post('/users/ticket_reservations', formData.value);
        if (response.data.code === 1) {
            ElMessage.success('预约成功');
            showDialog.value = false; // 关闭弹窗
            getData(); // 刷新页面
        }else{
            ElMessage.error('预约失败');
        }
    } catch (error) {
        console.error('error:', error);
        ElMessage.error('401');
    }
}
</script>

<style scoped>
.logout {
    display: flex;
    flex-direction: column;
    justify-self: center;
    width: 80%;
    margin: 0 auto;
}

.item {
    width: 83%;
    height: 200px;
    margin: 10px 0;
    border: 1px solid #eeecec;
    border-radius: 0;
    box-shadow: none;
}

.card-content {
    display: flex;
}

.text {
    width: 450px;
    margin-top: 0px;
    margin-left: 20px;
}

.p {
    font-size: 25px;
    letter-spacing: 5px;
    font-family:
        'Helvetica Neue',
        'Segoe UI',
        'PingFang SC',
        'Microsoft YaHei',
        sans-serif;
    /* 现代字体栈 */
    font-weight: 600;
    /* 中等字重 */
    transform: perspective(100px) rotateX(2deg);
    /* 微3D效果 */
}

#open {
    position: relative;
    top: 130px;
    left: 100px;
    background-color: #ff9602;
    color: #fff;
}

#p {
    font-size: 18px;
    letter-spacing: 2px;
}
</style>