<template>
  <HomeNavbar>
    <div class="logout">
      <el-card v-for="item in tableData" :key="item" class="item">
        <div class="card-content">
          <img :src="item.image" alt="景点图片" style="width: 250px; height: 160px; object-fit: cover;">
          <div class="text">
            <p class="p" id="p1">{{ item.name }}</p>
            <p class="p" id="p2">地址:{{ item.address }}</p>
            <p class="p" id="p3">营业时间:{{ item.openTime }}</p>
            <p class="p" id="p4">{{ item.description }}</p>
          </div>
          <el-button size="medium" id="open" @click="openLink(item.link)">
            查看详情
          </el-button>
        </div>
      </el-card>
    </div>
    <el-pagination background layout="sizes, prev, pager, next,jumper,total" :current-page="page.page"
      :page-size="page.pagesize" :total="total" @current-change="handleCurrentChange" @size-change="handleSizeChange" />
  </HomeNavbar>
</template>

<script setup>
import HomeNavbar from '@/components/HomeNavbar.vue';
import { ref, onMounted } from 'vue';
import axiosInstance from '@/utils/axiosInstance'

// 新增打开链接方法
const openLink = (url) => {
  window.open(url, '_blank'); // 在新标签页打开链接
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
    const response = await axiosInstance.get('/common/scenic/page', {
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

#p2,
#p3 {
  margin: 0px 0;
  font-size: 13px;
  color: #8b8383;
}

#p4 {
  margin: 0px 0;
  font-size: 16px;
}

#open {
  margin-top: 20px;
  width: 100px;
  height: 30px; 
  background-color: #ff9602;
  color: #fff;
}
</style>