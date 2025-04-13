// src/store/user.js
import { defineStore } from 'pinia'

export const useAdminStore = defineStore('admin', {
  state: () => ({
    adminId: null,
    adminName: '',
    token: ''
  }),
  actions: {
    // 登录成功后存储用户数据
    setAdmin(admin) {
      this.adminId = admin.adminId
      this.adminName = admin.adminName
      this.token = admin.token
    },
    // 退出登录清空用户数据
    logout() {
      this.adminId = null
      this.adminName = ''
      this.token = ''
    }
  }
})
