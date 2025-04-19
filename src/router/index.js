import { createRouter, createWebHashHistory } from 'vue-router'
import {
  useUserStore
} from '@/store/user'
import {
  useAdminStore
} from '@/store/admin'

const routes = [
  // 重定向
  {
    path: '/',
    redirect: '/home'
  },


  //    前台
  //导航组件
  {
    path: '/home/navbar',
    name: 'homeNavbar',
    component: () => import('../components/HomeNavbar.vue')
  },
  // 首页
  {
    path: '/home',
    name: 'home',
    component: () => import('../views/HomeView.vue')
  },
  // 景点
  {
    path: '/scenic',
    name: 'scenic',
    component: () => import('../views/ScenicView.vue')
  },
  // 门票
  {
    path: '/ticket',
    name: 'ticket',
    component: () => import('../views/TicketView.vue')
  },
  // 酒店
  {
    path: '/hotel',
    name: 'hotel',
    component: () => import('../views/HotelView.vue')
  },
  // 公告
  {
    path: '/announcement',
    name: 'announcement',
    component: () => import('../views/AnView.vue')
  },
  // 留言板
  {
    path: '/review',
    name: 'review',
    component: () => import('../views/ReviewView.vue')
  },
  // 关于我们
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/AboutView.vue')
  },

  //   管理员
  // 登录
  {
    path: '/adminlogin',
    name: 'adminLogin',
    component: () => import('../views/admin/AdminLogin.vue')
  },
  // 后台管理组件
  {
    path: '/admin/navbar',
    name: 'adminNavbar',
    component: () => import('../components/AdminNavbar.vue')
  },
  // 管理员管理
  {
    path: '/admin/admin',
    name: 'adminAdmin',
    component: () => import('../views/admin/AdminAdmin.vue')
  },
  // 游客管理
  {
    path: '/admin/user',
    name: 'adminUser',
    component: () => import('../views/admin/AdminUser.vue')
  },
  //景点信息管理
  {
    path: '/admin/scenic',
    name: 'adminScenic',
    component: () => import('../views/admin/AdminSs.vue')
  },
  // 景点评论管理
  {
    path: '/admin/review',
    name: 'adminReview',
    component: () => import('../views/admin/AdminSr.vue')
  },
  // 门票信息管理
  {
    path: '/admin/ticket',
    name: 'adminTicket',
    component: () => import('../views/admin/AdminTk.vue')
  },
  // 门票预约管理
  {
    path: '/admin/ticketReservation',
    name: 'adminTicketReservation',
    component: () => import('../views/admin/AdminTr.vue')
  },
  // 酒店信息管理
  {
    path: '/admin/hotel',
    name: 'adminHotel',
    component: () => import('../views/admin/AdminHo.vue')
  },
  // 酒店房间管理
  {
    path: '/admin/room',
    name: 'adminRoom',
    component: () => import('../views/admin/AdminHroom.vue')
  },
  // 酒店预约管理
  {
    path: '/admin/hotelReservation',
    name: 'adminHotelReservation',
    component: () => import('../views/admin/AdminHr.vue')
  },
  // 景区公告管理
  {
    path: '/admin/announcement',
    name: 'adminAnnouncement',
    component: () => import('../views/admin/AdminAn.vue')
  },

  //    用户
  // 登录
  {
    path: '/userlogin',
    name: 'userLogin',
    component: () => import('../views/users/UserLogin.vue')
  },
  // 注册
  {
    path: '/userregister',
    name: 'userRegister',
    component: () => import('../views/users/UserRegister.vue')
  },
  // 个人中心
  {
    path: '/user/navbar',
    name: 'userNavbar',
    component: () => import('../components/UserNavbar.vue')
  },
  // 信息管理
  {
    path: '/user/update',
    name: 'userUpdate',
    component: () => import('../views/users/UserUpdate.vue')
  },
  // 门票预约信息
  {
    path: '/user/ticket',
    name: 'userTicket',
    component: () => import('../views/users/UserTicket.vue')
  },
  // 酒店预约信息
  {
    path: '/user/hotel',
    name: 'userHotel',
    component: () => import('../views/users/UserHotel.vue')
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 路由守卫
// 全局路由守卫
router.beforeEach(async (to, from, next) => {
  const adminStore = useAdminStore()
  const userStore = useUserStore()

  // 管理员路由拦截逻辑
  if (to.path.startsWith('/admin')) {
    // 白名单放行
    if (to.path === '/adminlogin') return next()
    
    // 未登录管理员重定向
    if (adminStore.adminId=== null) {
      next({ path: '/adminlogin', query: { redirect: to.fullPath } })
    } else {
      next()
    }
  }

  // 用户路由拦截逻辑
  else if (to.path.startsWith('/user')) {
    // 白名单放行
    if (['/userlogin', '/userregister'].includes(to.path)) return next()
    
    // 未登录用户重定向
    if (userStore.userId === null) {
      next({ path: '/userlogin', query: { redirect: to.fullPath } })
    } else {
      next()
    }
  }

  // 公共路由放行
  else {
    next()
  }
})
export default router
