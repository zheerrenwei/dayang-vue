<template>
    <div class="common-layout">
        <el-container class="container">
            <el-header class="header">
                <span id="aa">大阳古镇管理员后台界面</span>
                <img src="../assets/登出.png" alt="登出" class="logo" id="logout" @click="goToLogout">
                <img src="../assets/首页.png" alt="首页" class="logo" id="home" @click="goToHome">
            </el-header>
            <el-container>
                <el-aside width="200px" class="aside">
                    <el-scrollbar height="580px">
                        <el-menu :default-openeds="[]" class="menu" active-text-color="#3da9fc"
                            v-model:default-active="activeIndex" text-color="2d2d29" @open="handleOpen"
                            @close="handleClose">
                            <el-menu-item index="1" @click="goToAdmin">员工信息管理</el-menu-item>
                            <el-menu-item index="2" @click="goToUser">用户信息管理</el-menu-item>
                            <el-sub-menu index="3">
                                <template #title>
                                    <i class="el-icon-message"></i>
                                    <span>景点管理</span>
                                </template>
                                <el-menu-item index="3-1" @click="goToAdminSs">景点信息管理</el-menu-item>
                                <el-menu-item index="3-2" @click="goToAdminSr">景点评论管理</el-menu-item>
                            </el-sub-menu>
                            <el-sub-menu index="4">
                                <template #title>
                                    <i class="el-icon-message"></i>
                                    <span>门票管理</span>
                                </template>
                                <el-menu-item index="4-1" @click="goToAdminTk">门票信息管理</el-menu-item>
                                <el-menu-item index="4-2" @click="goToAdminTr">门票预约管理</el-menu-item>
                            </el-sub-menu>
                            <el-sub-menu index="5">
                                <template #title>
                                    <i class="el-icon-message"></i>
                                    <span>酒店管理</span>
                                </template>
                                <el-menu-item index="5-1" @click="goToAdminHo">酒店信息管理</el-menu-item>
                                <el-menu-item index="5-2" @click="goToAdminHroom">酒店房间管理</el-menu-item>
                                <el-menu-item index="5-3" @click="goToAdminHr">酒店预约管理</el-menu-item>
                            </el-sub-menu>
                            <el-menu-item index="6" @click="goToAdminAn">景区公告管理</el-menu-item>
                        </el-menu>
                    </el-scrollbar>
                </el-aside>
                <el-main class="main">
                    <slot>

                    </slot>
                </el-main>
            </el-container>
        </el-container>
    </div>

</template>

<script setup>
import { useRouter ,useRoute} from 'vue-router';
import { useAdminStore } from '@/store/admin';
import { ref, onMounted, watch } from 'vue';
import {  } from '@element-plus/icons-vue';

const route = useRoute();
const router = useRouter();

// 根据当前路由的 path 自动设置激活状态
const activeIndex = ref('');
const updateActiveIndex = () => {
    const currentPath = route?.path;
    if (!currentPath) return;
    if (currentPath.includes('/admin/admin')) {
        activeIndex.value = '1';
    } else if (currentPath.includes('/admin/user')) {
        activeIndex.value = '2';
    } else if (currentPath.includes('/admin/scenic')) {
        activeIndex.value = '3-1';
    }else if (currentPath.includes('/admin/review')) {
        activeIndex.value = '3-2';
    }else if (currentPath.includes('/admin/ticket')) {
        activeIndex.value = '4-1';
    }else if (currentPath.includes('/admin/ticketReservation')) {
        activeIndex.value = '4-2';
    }else if (currentPath.includes('/admin/hotel')) {
        activeIndex.value = '5-1';
    }else if (currentPath.includes('/admin/room')) {
        activeIndex.value = '5-2';
    }else if (currentPath.includes('/admin/hotelReservation')) {
        activeIndex.value = '5-3';
    }else if (currentPath.includes('/admin/announcement')) {
        activeIndex.value = '6';
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
    const adminStore = useAdminStore(); // 使用管理员存储
    adminStore.logout(); // 调用管理员的登出方法
    router.push('/home');
}


// 跳转到管理员信息管理页面
const goToAdmin = () => {
    router.push('/admin/admin');
};

// 跳转到用户信息管理页面
const goToUser = () => {
    router.push('/admin/user');
};

// 跳转到景点信息管理页面
const goToAdminSs = () => {
    router.push('/admin/scenic');
};

// 跳转到景点评论管理页面
const goToAdminSr = () => {
    router.push('/admin/review');
};

// 跳转到门票信息管理页面
const goToAdminTk = () => {
    router.push('/admin/ticket');
};

// 跳转到门票预约管理页面
const goToAdminTr = () => {
    router.push('/admin/ticketReservation');
};

// 跳转到酒店信息管理页面
const goToAdminHo = () => {
    router.push('/admin/hotel');
};

// 跳转到酒店房间管理页面
const goToAdminHroom = () => {
    router.push('/admin/room');
};

// 跳转到酒店预约管理页面
const goToAdminHr = () => {
    router.push('/admin/hotelReservation');
};

// 跳转到景区公告管理页面
const goToAdminAn = () => {
    router.push('/admin/announcement');
}
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