<template>
  <home-navbar>
    <h1>中国古城镇活化石</h1>
    <el-carousel :interval="4000" type="card" height="500px">
      <el-carousel-item v-for="item in tableData" :key="item">
        <img :src="item.image" alt="景点图片" style="width: 100%; height: 100%; object-fit: cover;">
      </el-carousel-item>
    </el-carousel>
    <div class="scenic">
      <p id="p1">古镇推荐</p>
      <div style="display:flex;justify-content:space-between;margin-bottom:20px">
        <p>在这里，我们一起感受来自古代生活的美......</p>
      </div>
      <div style="display:flex;justify-content:space-between;">
        <el-card class="item" :body-style="{ padding: '10px' }">
          <img src="../assets/民俗1.png" alt="景点图片" style="width: 280px; height:220px; object-fit: cover;">
          <p id="p2">民俗特色</p>
          <el-button size="medium" id="open" @click="openLink('https://mp.weixin.qq.com/s/eEE9hQZVDzg74NRz_ROOnA')">
            查看详情
          </el-button>
        </el-card>
        <el-card class="item" :body-style="{ padding: '10px' }">
          <img src="../assets/民俗2.png" alt="景点图片" style="width: 280px; height:220px; object-fit: cover;">
          <p id="p2">美食佳肴</p>
          <el-button size="medium" id="open" @click="openLink('https://mp.weixin.qq.com/s/Iu-DROezwoAcF8UpaPgKPQ')">
            查看详情
          </el-button>
        </el-card>
        <el-card class="item" :body-style="{ padding: '10px' }">
          <img src="../assets/民俗3.png" alt="景点图片" style="width: 280px; height:220px; object-fit: cover;">
          <p id="p2">十大必知</p>
          <el-button size="medium" id="open" @click="openLink('https://mp.weixin.qq.com/s/2s_Yg9QgCa5ulS2vGXt-WA')">
            查看详情
          </el-button>
        </el-card>
        <el-card class="item" :body-style="{ padding: '10px' }">
          <img src="../assets/民俗4.png" alt="景点图片" style="width: 280px; height:220px; object-fit: cover;">
          <p id="p2">十大必到</p>
          <el-button size="medium" id="open" @click="openLink('https://mp.weixin.qq.com/s/NSuqtmnlPjA7lXfyCf03Zg')">
            查看详情
          </el-button>
        </el-card>
      </div>
    </div>
    <div class="aa">
      <h2>景区交通</h2>
      <img src="../assets/景区交通.jpg" alt="景点图片" style="width: 85%; object-fit: cover;">
    </div>
  </home-navbar>
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
</script>

<style scoped>
.el-carousel__item h3 {
  color: #475669;
  opacity: 0.75;
  line-height: 400px;
  margin: 0;
  text-align: center;
}

.aa {
  width: 75%;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.scenic {
  width: 85%;
  margin: 50px auto;
}

#p1 {
  font-size: 40px;
  letter-spacing: 5px;
  font-family:
    'Helvetica Neue',
    'Segoe UI',
    'PingFang SC',
    'Microsoft YaHei',
    sans-serif;
  /* 现代字体栈 */
  margin-bottom: 20px;
}

.item {
  width: 300px;
  height: 400px;
  margin: 10px 0;
  border: 1px solid #eeecec;
  border-radius: 0;
  box-shadow: none;
}

#p2 {
  font-size: 20px;
  letter-spacing: 5px;
  font-family:
    'Helvetica Neue',
    'Segoe UI',
    'PingFang SC',
}

#open {
  width: 100px;
  height: 40px;
  background-color: #54c064;
  border: none;
  border-radius: 2px;
  margin-top: 20px;
  color: white;
  margin-left: 170px;
  font-size: 18px;
}
</style>