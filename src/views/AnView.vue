<template>
  <HomeNavbar>
    <div class="logout">
      <el-card v-for="item in tableData" :key="item" class="item">
        <div class="card-content">
          <p class="p" id="p1">{{ item.title }}</p>
          <p class="p" id="p2">{{ item.content }}</p>
          <p class="p" id="p3">{{ formatTime(item.publishedTime) }}</p>
        </div>
      </el-card>
      <el-pagination background layout="sizes, prev, pager, next,jumper,total" :current-page="page.page"
          :page-size="page.pagesize" :total="total" @current-change="handleCurrentChange"
          @size-change="handleSizeChange" />
    </div>
  </HomeNavbar>
</template>

<script setup>
import HomeNavbar from '@/components/HomeNavbar.vue';
import { ref, onMounted } from 'vue'
import axiosInstance from '@/utils/axiosInstance'
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
//数据
const tableData = ref([])
const total = ref(0)
// 获点信息
const getData = async () => {
  try {
    const response = await axiosInstance.get('/common/announcements/page', {
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
  height: auto;
  margin: 10px 0;
  border: 1px solid #eeecec;
  border-radius: 0;
  box-shadow: none;
}

#p1 {
  font-size: 22px;
  font-weight: bold;
  color: #333; 
}

#p2 {
  font-size: 16px;
  color: #666;
}

#p3 {
  position: relative;
  font-size: 14px;
  color: #999;
  left: 780px;
}
</style>