import { ErrorCode, ErrorResult, errorMap } from '@/types/errors'
import { MD5, RC4Drop } from 'crypto-js'
import Utf8 from 'crypto-js/enc-utf8'
import { defineStore } from 'pinia'
import { RouteLocationNormalizedLoaded } from 'vue-router'

type Auth = {
  token: string
  user: string
  super?: boolean
  actions?: string[]
  menus?: string[]
}

type CoreState = {
  auth: Auth
  error: ErrorResult
}

const agent = navigator.userAgent
const storeKey = MD5(agent.slice(agent.length >> 2)).toString()
const cryptoKey = MD5(agent.slice(0, -(agent.length >> 2)))

export const useCoreStore = defineStore('core', {
  state: (): CoreState => ({
    auth: { token: '', user: '' },
    error: errorMap[0],
  }),
  getters: {
    permit(state) {
      return (key: string) => state.auth.super || state.auth.actions?.includes(key) || false
    },
    menuAllow(state) {
      return (key?: string) => !key || state.auth.super || state.auth.menus?.includes(key) || false
    },
    routeAllow() {
      return (route: RouteLocationNormalizedLoaded) => this.menuAllow(route.meta.authKey)
    },
  },
  actions: {
    initAuth() {
      const s = localStorage.getItem(storeKey)
      if (s) {
        try {
          const dec = RC4Drop.decrypt(s, cryptoKey).toString(Utf8)
          const data = JSON.parse(dec)
          this.auth = data
        } catch {
          localStorage.removeItem(storeKey)
        }
      }
    },
    setAuth(data: Auth) {
      this.auth = data
      const s = RC4Drop.encrypt(JSON.stringify(data), cryptoKey).toString()
      localStorage.setItem(storeKey, s)
    },
    removeAuth() {
      this.auth = { token: '', user: '' }
      localStorage.removeItem(storeKey)
    },
    setError(code: ErrorCode) {
      this.error = errorMap[code]
    },
    setErrorResult(result: ErrorResult) {
      this.error = result
    },
  },
})
