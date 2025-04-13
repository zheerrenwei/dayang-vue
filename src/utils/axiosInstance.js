// src/utils/axiosInstance.js
import axios from 'axios'
import {
  useUserStore
} from '@/store/user'
import {
  useAdminStore
} from '@/store/admin'
//axios实例
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080'
})

axiosInstance.interceptors.request.use(
  config => {
    const userStore = useUserStore()
    const adminStore = useAdminStore()

    // 假设后台接口：
    // 1. 管理员接口以 /admin 开头，
    // 2. 用户接口以 /user 开头，
    // 3. 其它接口为公共访问，不需要 token
    if (config.url) {
      if (config.url.includes('/admin')) {
        if (adminStore.token) {
          config.headers['token'] = adminStore.token
        }
      } else if (config.url.includes('/users')) {
        if (userStore.token) {
          config.headers['token'] = userStore.token
        }
      }
      // 公共接口无需添加 token
    }
    return config
  },
  error => Promise.reject(error)
)
export default axiosInstance