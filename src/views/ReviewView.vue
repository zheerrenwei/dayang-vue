<template>
    <HomeNavbar>
        <div class="logout">
            <el-button type="primary" @click="handleClick" id="button1">
                发布评论
            </el-button>
            <el-card v-for="item in tableData" :key="item" class="item" :body-style="{ padding: '10px' }">
                <div class="card-content">
                    <div class="text">
                        <p class="p" id="p1">{{ item.username }}</p>
                        <p class="p" id="p2">{{ item.comment }}</p>
                        <div style="display:flex">
                            <p class="p" id="p3">{{ item.name }}</p>
                            <p class="p" id="p4">游客评分:{{ item.rating }}</p>
                            <p class="p" id="p5">{{ formatTime(item.reviewDate) }}</p>
                        </div>
                    </div>
                </div>
            </el-card>
        </div>
        <el-pagination background layout="sizes, prev, pager, next,jumper,total" :current-page="page.page"
            :page-size="page.pagesize" :total="total" @current-change="handleCurrentChange"
            @size-change="handleSizeChange" />

        <!-- 评论弹窗 -->
        <el-dialog v-model="showDialog" title="发表评论" width="50%" @close="handleClose">
            <div class="review-form">
                <el-form :model="Data" label-width="80px">
                    <el-form-item label="留言内容">
                        <el-input v-model="Data.comment" type="textarea" :rows="3" placeholder="请输入您的留言"
                            style="width:400px" />
                    </el-form-item>
                    <el-form-item label="景点名称">
                        <el-select v-model="Data.scenicId" placeholder="Select" size="large" style="width: 240px">
                            <el-option v-for="item in tableData2" :key="item.scenicId" :label="item.name"
                                :value="item.scenicId" />
                        </el-select>
                    </el-form-item>
                    <el-form-item label="景区评分">
                        <el-rate v-model="Data.rating" />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submitReview">提交</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
    </HomeNavbar>
</template>

<script setup>
import HomeNavbar from '@/components/HomeNavbar.vue';
import { ref, onMounted } from 'vue';
import axiosInstance from '@/utils/axiosInstance';
import { useUserStore } from '@/store/user';
import { ElMessage } from 'element-plus';
import dayjs from 'dayjs';

const formatTime = (time) => {
    // 格式化为 'YYYY/MM/DD HH:mm:ss' 格式
    return dayjs(time).format('YYYY/MM/DD HH:mm:ss');
};
//使用pinia的用户store
const useStore = useUserStore();

// 分页请求数据
const page = ref({
    name: '',
    comment: '',
    page: '1',
    pagesize: '10'
})

//景点数据
const tableData = ref([])
const total = ref(0)

// 获取景点信息
const getData = async () => {
    try {
        const response = await axiosInstance.get('/common/review/page', {
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

// 分页请求数据
const page2 = ref({
    name: '',
    page: '1',
    pagesize: '99999'
})

//景点数据
const tableData2 = ref([])
const total2 = ref(0)
// 获取景点信息
const getData2 = async () => {
    try {
        const response = await axiosInstance.get('/common/scenic/page', {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            // GET 请求参数会拼接在 URL 上
            params: page2.value
        })
        if (response.data.code === 1) {
            tableData2.value = response.data.data.records;
            total2.value = response.data.data.total;
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
    getData2()
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




// 弹窗控制
const showDialog = ref(false)
// 关闭弹窗
const handleClose = () => {
    showDialog.value = false
}
// 打开弹窗
const handleClick = () => {
    showDialog.value = true;
}
// 添加表单数据
const Data = ref({
    scenicId: '',
    userId: '',
    rating: '',
    comment: '',
})

const submitReview = async () => {
    if (useStore.userId === null) {
        ElMessage.error('请先登录');
        return;
    }
    if (!Data.value.scenicId) {
        ElMessage.error('请选择景点');
        return;
    }
    Data.value.userId = useStore.userId; // 从用户store中获取userId
    try {
        const response = await axiosInstance.post('/users/scenic_reviews', Data.value);
        if (response.data.code === 1) {
            ElMessage.success('留言成功');
            showDialog.value = false; // 关闭弹窗
            getData(); // 刷新页面
        } else {
            ElMessage.error('留言失败');
            showDialog.value = false; // 关闭弹窗
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
    min-height: 75vh;
}

.item {
    width: 83%;
    height: auto;
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
}

.p {
    letter-spacing: 5px;
}

#p1 {
    font-size: 20px;
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
    line-height: 1.5;
    margin: 5px 0;
}

#p2 {
    font-size: 15px;
    letter-spacing: 5px;
    line-height: 1;
    margin: 20px 0;
    text-indent: 2em;
}

#p3 {
    width: 200px;
    color: #000;
    font-size: 13px;
    letter-spacing: 5px;
    line-height: 1;
    margin: 5px 0;
}

#p4 {
    width: 500px;
    color: #000;
    font-size: 13px;
    letter-spacing: 5px;
    line-height: 1;
    margin: 5px 0;
}

#p5 {
    font-size: 13px;
    letter-spacing: 5px;
    line-height: 1;
    margin: 5px 0;
}

#button1 {
    margin: 10px 0;
    width: 100px;
}
</style>