import { useCoreStore } from '@/stores/core'
import rand from '@/utils/rand'
import axios from 'axios'
import { Ref } from 'vue'

const store = useCoreStore()

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 9000, // 毫秒
})

// 添加请求拦截器
instance.interceptors.request.use(
  (cfg) => {
    // 在发送请求之前做些什么
    cfg.headers['X-Request-Id'] = rand.lowers()
    const token = store.auth.token
    if (token) cfg.headers['Authorization'] = token
    return cfg //无需指定content-type，body体有内容的时候axios会根据传值类型自动添加
  },
  (err) => {
    // 对请求错误做些什么
    return Promise.reject(err)
  },
)

// 添加响应拦截器
instance.interceptors.response.use(
  (res) => {
    // 2xx 范围内的状态码都会触发该函数。
    // 对响应数据做点什么
    return res.data //这里只取body体内容
  },
  (err) => {
    // 超出 2xx 范围的状态码都会触发该函数。
    // 对响应错误做点什么
    return Promise.reject(err)
  },
)

// 每个接口包装成一个实例，可以前置判断权限，发起请求可以传入Ref<boolean>对象。
class API<D, T> {
  #path: string
  #pub: boolean
  constructor(path: string, pub: boolean) {
    this.#path = path
    this.#pub = pub
  }
  #post(data: D): Promise<T> {
    return instance.post(this.#path, data)
  }
  permit(): boolean {
    return this.#pub || store.permit(this.#path)
  }
  do(data: D, lock?: Ref<boolean>): Promise<T> {
    return new Promise((resolve, reject) => {
      if (!this.permit()) {
        reject({ response: { status: 403, data: { msg: 'Forbidden' } } })
        return
      }
      if (lock) lock.value = true
      this.#post(data)
        .then(resolve)
        .catch(reject)
        .finally(() => {
          if (lock) lock.value = false
        })
    })
  }
}

class Form<D extends Record<string, string | Blob>, T> extends API<unknown, T> {
  constructor(path: string, pub: boolean) {
    super(path, pub)
  }
  do(data: D, lock?: Ref<boolean>): Promise<T> {
    const fd = new FormData()
    for (const k in data) {
      fd.append(k, data[k])
    }
    return super.do(fd, lock)
  }
}

export const api = <D, T>(path: string, pub = false) => new API<D, T>(path, pub)
export const form = <D extends Record<string, string | Blob>, T>(path: string, pub = false) =>
  new Form<D, T>(path, pub)
