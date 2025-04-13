// src/store/user.js
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    userId: null,
    username: '',
    token: ''
  }),
  actions: {
    // 登录成功后存储用户数据
    setUser(user) {
      this.userId = user.userId
      this.username = user.username
      this.token = user.token
    },
    // 退出登录清空用户数据
    logout() {
      this.userId = null
      this.username = ''
      this.token = ''
    }
  },
  persist: true // 持久化存储
})
