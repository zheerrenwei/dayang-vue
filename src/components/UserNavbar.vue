<template>
    <div class="common-layout">
        <el-container class="container">
            <el-header class="header">
                <span id="aa">游客个人中心</span>
                <img src="../assets/登出.png" alt="登出" class="logo" id="logout" @click="goToLogout">
                <img src="../assets/首页.png" alt="首页" class="logo" id="home" @click="goToHome">
            </el-header>
            <el-container>
                <el-aside width="220px" class="aside">
                    <el-menu :default-openeds="['1', '2']" class="menu" active-text-color="#3da9fc"
                         v-model:default-active="activeIndex" text-color="2d2d29" 
                        @open="handleOpen" @close="handleClose">
                        <el-sub-menu index="1">
                            <template #title>
                                <el-icon>
                                    <User />
                                </el-icon>
                                <span>用户中心</span>
                            </template>
                            <el-menu-item index="1-1" @click="goToUserInfo"><el-icon>
                                    <EditPen />
                                </el-icon>信息管理</el-menu-item>
                        </el-sub-menu>
                        <el-sub-menu index="2">
                            <template #title>
                                <el-icon>
                                    <Calendar />
                                </el-icon>
                                <span>用户预约</span>
                            </template>
                            <el-menu-item index="2-1" @click="goToTicketBooking"><el-icon>
                                    <Ticket />
                                </el-icon>门票预约</el-menu-item>
                            <el-menu-item index="2-2" @click="goToHotelBooking"><el-icon>
                                    <HomeFilled />
                                </el-icon>酒店预约</el-menu-item>
                        </el-sub-menu>
                    </el-menu>
                </el-aside>
                <el-main class="main">
                    <slot></slot>
                </el-main>
            </el-container>
        </el-container>

    </div>
</template>

<script setup>
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/store/user';
import { ref, onMounted, watch } from 'vue';
import { User, Calendar, EditPen, Ticket, HomeFilled } from '@element-plus/icons-vue'

const route = useRoute();
const router = useRouter();

// 根据当前路由的 path 自动设置激活状态
const activeIndex = ref('');

const updateActiveIndex = () => {
    const currentPath = route?.path;
    if (!currentPath) return;
    if (currentPath.includes('/user/update')) {
        activeIndex.value = '1-1';
    } else if (currentPath.includes('/user/ticket')) {
        activeIndex.value = '2-1';
    } else if (currentPath.includes('/user/hotel')) {
        activeIndex.value = '2-2';
    } else {
        activeIndex.value = ''; // 或设置默认值
    }
};

onMounted(() => {
    updateActiveIndex();
});

watch(() => route.path, () => {
    updateActiveIndex();
});

// 跳转到主页
const goToHome = () => {
    router.push('/home');
};
//登出账号
const goToLogout = () => {
    // 清除用户信息
    const userStore = useUserStore();
    userStore.logout();
    router.push('/home');
};
// 跳转到用户信息管理页面
const goToUserInfo = () => {
    router.push('/user/update');
};
// 跳转到门票预约页面
const goToTicketBooking = () => {
    router.push('/user/ticket');
};

// 跳转到酒店预约页面
const goToHotelBooking = () => {
    router.push('/user/hotel');
};
</script>

<style scoped>
.common-layout {
    background: #f8f9fa;
    /* 使用渐变背景替代纯色 */
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;

}

.container {
    width: 90%;
    height: 100vh;
    border: none;
    overflow: hidden;
}

.header {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border-radius: 10px;
    margin-bottom: 20px;
    padding: 0 20px;
    height: 85px;
    background: linear-gradient(45deg, #fff, #3498db);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    /* 增加层次感 */
}

#aa {
    font-size: 2.5rem;
    /* 改用相对单位 (约40px) */
    color: #f0f4f8;
    font-family:
        'Helvetica Neue',
        'Segoe UI',
        'PingFang SC',
        'Microsoft YaHei',
        sans-serif;
    /* 现代字体栈 */
    font-weight: 600;
    /* 中等字重 */
    letter-spacing: 1.5px;
    /* 字间距 */
    text-shadow:
        2px 2px 4px rgba(0, 0, 0, 0.2),
        /* 主阴影 */
        0 0 8px rgba(255, 255, 255, 0.3);
    /* 光晕效果 */
    position: relative;
    display: inline-block;
    padding: 0 20px;
    transform: perspective(100px) rotateX(2deg);
    /* 微3D效果 */
    transition: all 0.3s ease;
}

/* 悬停动画效果 */
#aa:hover {
    transform:
        perspective(100px) rotateX(0deg) translateY(-2px);
    text-shadow:
        3px 3px 6px rgba(0, 0, 0, 0.3),
        0 0 12px rgba(255, 255, 255, 0.4);
}

.logo {
    position: absolute;
    cursor: pointer;
    transition: all 0.3s ease;
    /* 添加过渡动画 */
    transform: perspective(100px) rotateX(2deg);
    /* 微3D效果 */

}

#logout {
    width: 40px;
    right: 80px;
}

#home {
    width: 50px;
    right: 20px;
    top: 18px;
}

/* 悬停时调整颜色和缩放 */
.logo:hover {
    transform:
        perspective(100px) rotateX(0deg) translateY(-2px);
}


.aside {
    background-color: #ffffff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    border-radius: 10px;
    overflow-y: auto;
}

.main {
    padding: 24px;
    margin-left: 20px;
    background: #ffffff;
    border-radius: 10px;
    overflow-y: auto;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* 菜单整体字体与高度统一设置 */
::v-deep(.el-menu) {
    height: 100%;
    border: none;
}
::v-deep(.el-menu-item),
::v-deep(.el-sub-menu__title) {
    font-size: 15px;
    height: 56px;
    line-height: 56px;
}

/* 控制菜单项缩进，减少内边距 */
::v-deep(.el-menu-item) {
    padding-left: 20px;
}

/* 图标大小也可以适当调整 */
::v-deep(.el-sub-menu__title i),
::v-deep(.el-menu-item i) {
    font-size: 20px;
}

/* 响应式 */
@media (max-width: 768px) {
    .container {
        height: 100vh;
    }

    .aside {
        width: 180px !important;
    }

    .header {
        font-size: 24px;
        line-height: 56px;
    }
}
</style>