<template>
    <HomeNavbar>
        <div class="logout">
            <el-card v-for="item in tableData" :key="item" class="item">
                <div class="card-content">
                    <img :src="item.image" alt="景点图片" style="width: 250px; height: 160px; object-fit: cover;">
                    <div class="text">
                        <p class="p" id="p1">{{ item.name }}</p>
                        <p class="p" id="p2">地址:{{ item.address }}</p>
                        <p class="p" id="p3">{{ item.description }}</p>
                    </div>
                    <el-button size="medium" id="open" @click="showTicketDetail(item)">
                        查看详情
                    </el-button>
                </div>
            </el-card>
        </div>
        <el-pagination background layout="sizes, prev, pager, next,jumper,total" :current-page="page.page"
            :page-size="page.pagesize" :total="total" @current-change="handleCurrentChange"
            @size-change="handleSizeChange" />



        <!-- 弹窗 -->
        <el-dialog v-model="showDialog" title="酒店详情" width="50%" @close="handleClose">
            <div v-if="currentTicket">
                <div style="display: flex;">
                    <img :src="currentTicket.image" alt="门票图片" style="width: 250px; height: 160px; object-fit: cover;">
                    <div class="text">
                        <p class="p" id="p4">{{ currentTicket.name }}</p>
                        <p class="p" style="font-size:15px">{{ currentTicket.description }}</p>
                    </div>

                </div>
            </div>
            <el-card v-for="item in tableData2" :key="item" class="item2" :body-style="{ padding: '3px' }">
                <div>
                    <div>
                        <p class="p2" style="line-height: 1.5; margin:5px 0">房间类型:{{ item.roomType }}</p>
                        <p class="p2" style="line-height: 1.5; margin:5px 0">具体信息:{{ item.description }}</p>
                        <div style="display: flex;margin:0 0;">
                            <p class="p2" style="line-height: 1.5; margin:5px 0;margin-right:50px">价格:{{ item.price }}
                            </p>
                            <p class="p2" style="line-height: 1.5; margin:5px 0;margin-right:50px">床数:{{ item.bedCount
                                }}</p>
                            <p class="p2" style="line-height: 1.5; margin:5px 0;margin-right:50px">剩余房间:{{
                                item.availableCount }}</p>
                        </div>
                        <div style="display: flex;margin:0 0;">
                            入住日期:<el-date-picker v-model="item.checkInDate" type="date" placeholder="Pick a day"
                                :size="size" style="height: 23px;width:120px" format="YYYY-MM-DD"
                                value-format="YYYY-MM-DD" />
                            退房日期:<el-date-picker v-model="item.checkOutDate" type="date" placeholder="Pick a day"
                                :size="size" style="height: 23px;width:120px" format="YYYY-MM-DD"
                                value-format="YYYY-MM-DD" />
                            <el-button size="medium" id="open2" @click="handleEditSubmit(item)">
                                预约
                            </el-button>
                        </div>
                    </div>
                </div>
            </el-card>
        </el-dialog>
    </HomeNavbar>
</template>

<script setup>
import HomeNavbar from '@/components/HomeNavbar.vue';
import { onMounted, reactive, ref } from 'vue';
import axiosInstance from '@/utils/axiosInstance';
import { useUserStore } from '@/store/user'
import { ElMessage } from 'element-plus';

//使用pinia的用户store
const useStore = useUserStore();

// 分页请求数据
const page = ref({
    name: '',
    page: '1',
    pagesize: '10'
})

//景点数据
const tableData = ref([])
const total = ref(0)

// 分页请求数据
// 获取酒店信息
const getData = async () => {
    try {
        const response = await axiosInstance.get('/common/hotel/page', {
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
// 页面加载时调用
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




//当前选中的数据
const currentTicket = ref(null)
// 弹窗控制
const showDialog = ref(false)
// 打开弹窗并设置当前门票
const showTicketDetail = (ticket) => {
    currentTicket.value = ticket
    getData2()
    showDialog.value = true
}
// 关闭弹窗
const handleClose = () => {
    showDialog.value = false
}
// 酒店房间数据
// 分页请求数据
const page2 = ref({
    name: '',
    page: '1',
    pagesize: '10'
})

//景点数据
const tableData2 = ref([])
//获取酒店房间数据
const getData2 = async () => {
    try {
        page2.value.name = currentTicket.value.name
        const response = await axiosInstance.get('/common/room/page', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            // GET 请求参数会拼接在 URL 上
            params: page2.value
        })
        if (response.data.code === 1) {
            tableData2.value = response.data.data.records.map(item => ({
                ...item,
                checkInDate: '',
                checkOutDate: '',
            }));
            console.log('信息获取成功', response.data.data)
        } else {
            console.log('信息获取失败', response.data.msg)
        }
    } catch (error) {
        console.error('请求错误：', error)
    }
}

// 添加表单数据
const formData = reactive({
    userId: '',
    hotelId: '',
    roomId: '',
    checkInDate: '',
    checkOutDate: '',
    totalPrice: ''
})

// 点击预约
const handleEditSubmit = async (item) => {
    formData.userId = useStore.userId; // 从用户store中获取userId
    formData.hotelId = currentTicket.value.hotelId;
    formData.roomId = item.roomId
    formData.totalPrice = item.price; // 计算总价
    formData.checkInDate = item.checkInDate;
    formData.checkOutDate = item.checkOutDate;
    if (item.availableCount < 1) {
        ElMessage.error('预约数量不能大于剩余数量');
        return;
    }
    if (useStore.userId === null) {
        ElMessage.error('请先登录');
        return;
    }
    try {
        const response = await axiosInstance.post('/users/hotel_reservations', formData);
        if (response.data.code === 1) {
            ElMessage.success('预约成功');
            showDialog.value = false; // 关闭弹窗
            getData(); // 刷新页面
        } else {
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
    margin-top: 0px;
    margin-left: 30px;
}

.p {
    letter-spacing: 5px;
}

#p1 {
    margin: 10px 0;
    font-family:
        'Helvetica Neue',
        'Segoe UI',
        'PingFang SC',
        'Microsoft YaHei',
        sans-serif;
    /* 现代字体栈 */
    font-size: 20px;
    font-weight: bold;
}

#p2 {
    margin: 0px 0;
    font-size: 13px;
    color: #8b8383;
}

#p3 {
    margin: 0px 0;
    font-size: 16px;
}

#open {
    position: relative;
    top: 130px;
    width: 100px;
    height: 30px;
    background-color: #ff9602;
    color: #fff;
}

#p4 {
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

.item2 {
    width: 700px;
    height: auto;
    margin: 10px 0;
}

.text2 {
    width: 100%;
}

#open2 {
    position: relative;
    width: 100px;
    height: 30px;
    left: 220px;
    background-color: #ff9602;
    color: #fff;
}
</style>