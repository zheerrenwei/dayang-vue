<template>
    <div class="common-layout">
        <el-header class="header">
            <img src="../assets/logo.jpg" alt="标志" id="logo">
            <p id="p1">大阳古镇旅游网站</p>
            <el-button v-if="admin===null && user===null" size="medium" id="login" @click="$router.push('/userlogin')">
                点击登录
            </el-button>
            <img v-if="user !== null" src="../assets/用户.png" alt="用户" id="user" @click="$router.push('/user/update')"/>
            <img v-if="admin !== null" src="../assets/管理员.png" alt="管理员" id="user" @click="$router.push('/admin/admin')"/>
            <el-popover placement="left-end" :width="150" trigger="hover">
                <template #reference>
                    <img src="../assets/二维码 .png" alt="QRCode" id="QRCode">
                </template>
                <div style="text-align: center;">
                    <p>扫描二维码关注公众号</p>
                    <img src="../assets/公众号二维码.png" alt="QRCode" style="width: 100px; height: 100px;">
                </div>
            </el-popover>

            <el-row id="navigation">
                <el-col :span="3">
                    <p id="aa" @click="$router.push('/home')">首页</p>
                </el-col>
                <el-col :span="3">
                    <p id="aa" @click="$router.push('/scenic')">景点</p>
                </el-col>
                <el-col :span="3">
                    <p id="aa" @click="$router.push('/ticket')">门票</p>
                </el-col>
                <el-col :span="3">
                    <p id="aa" @click="$router.push('/hotel')">酒店</p>
                </el-col>
                <el-col :span="3">
                    <p id="aa" @click="$router.push('/announcement')">公告</p>
                </el-col>
                <el-col :span="3">
                    <p id="aa" @click="$router.push('/review')">留言</p>
                </el-col>
                <el-col :span="3">
                    <p id="aa" @click="$router.push('/about')">关于我们</p>
                </el-col>
            </el-row>
        </el-header>
        <el-main class="main">
            <slot>

            </slot>
        </el-main>
        <el-footer class="footer">
            <p style="color: #f3ecec;">Copyright © 2020
                山西晋城大阳古镇旅游发展有限公司
                晋ICP备05017153号-1
                客服:4008899808、0355-2590999
                地址： 中国山西省晋城市大阳古镇人民路005号
            </p>
            <p style="color: #bfb1b1;">
                <img src="../assets/image.png" alt="icp" style="width: 15px; height: 15px;">
                晋公网安备 34100220200215号 ICP证:晋B2-20180057
                营业执照 旅游投诉电话0355-12345
            </p>
            <p style="color: #bfb1b1;">
                用户协议 隐私政策
            </p>
        </el-footer>
    </div>
</template>

<script setup>
import {useAdminStore} from '@/store/admin'
import { useUserStore } from '@/store/user'

const adminStore = useAdminStore()
const userStore = useUserStore()

// 检查用户是否已登录
const admin = adminStore.adminId;
const user = userStore.userId;
</script>

<style scoped>
.header {
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    width: 80%;
    height: 100px;
    margin: 0 10%;
    background-color: #ffffff;
}

#logo {
    width: 110px;
    height: 110px;
    margin-right: 10px;
    position: absolute;
    left: 10px;
}

#p1 {
    font-size: 25px;
    color: #0b593f;
    letter-spacing: 5px;
    font-family:
        'Helvetica Neue',
        'Segoe UI',
        'PingFang SC',
        'Microsoft YaHei',
        sans-serif;
    /* 现代字体栈 */
    text-shadow:
        2px 2px 4px rgba(0, 0, 0, 0.2),
        /* 主阴影 */
        0 0 8px rgba(255, 255, 255, 0.3);
    /* 光晕效果 */
    font-weight: 600;
    /* 中等字重 */
    transform: perspective(100px) rotateX(2deg);
    /* 微3D效果 */
    position: absolute;
    left: 140px;
    bottom: 30px;
}

#login {
    width: 100px;
    height: 30px;
    background: linear-gradient(45deg, #f2f5f2, #377717);
    ;
    color: #fff;
    position: absolute;
    right: 20px;
    top: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

#login:hover {
    background: linear-gradient(45deg, #377717, #f2f5f2);
    ;
    transform:
        perspective(100px) rotateX(0deg) translateY(-2px);
}

#user {
    width: 40px;
    position: absolute;
    right: 20px;
    top: 10px;
}

#navigation {
    width: 700px;
    height: 40px;
    position: absolute;
    bottom: 15px;
    left: 150px;
}

#aa {
    font-family:
        'Helvetica Neue',
        'Segoe UI',
        'PingFang SC',
        'Microsoft YaHei',
        sans-serif;
    /* 现代字体栈 */
    font-size: 20px;
}

#aa:hover {
    transform:
        perspective(100px) rotateX(0deg) translateY(-2px);
}

#QRCode {
    width: 70px;
    height: 70px;
    position: fixed;
    right: 30px;
    top: 150px;
    z-index: 1000;
}

.main {
    min-height: 73vh;
    height: auto;
}

.footer {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: rgba(6, 0, 0, 0.9);
    height: 200px;
    letter-spacing: 3px;
    line-height: 20px;
}
</style>