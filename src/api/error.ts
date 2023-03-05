import router from '@/router'
import { useCoreStore } from '@/stores/core'
import { AxiosError, AxiosResponse } from 'axios'
import { ElMessage } from 'element-plus'

const store = useCoreStore()

const showLogin = (): boolean => {
  if (router.currentRoute.value.name === 'login') {
    return false
  }
  ElMessage.warning('登录已失效')
  store.removeAuth()
  router.push('/login')
  return true
}

// 不同接口的错误提示方式有所不同，所以抽出来手动控制。如果错误提示都一样，也可以放响应拦截器统一处理。
const errorMsg = (err: AxiosError) => {
  if (err === undefined || err.response === undefined || err.code === 'ERR_NETWORK') {
    ElMessage.error('网络错误')
    return
  }
  const {
    status,
    statusText,
    data: { code, msg },
  } = <AxiosResponse>err.response
  if (status === 401 && showLogin()) {
    return
  }
  if (status < 500) {
    ElMessage.warning(`(${code || status}) ${msg || statusText}`)
  } else {
    ElMessage.error(`(${code || status}) ${msg || '服务器开小差啦'}`)
  }
}

// 401回登录页，其余显示错误页
const errorPage = (err: AxiosError) => {
  if (err === undefined || err.response === undefined || err.code === 'ERR_NETWORK') {
    store.setError('error')
    return
  }
  const {
    status,
    statusText,
    data: { code, msg },
  } = <AxiosResponse>err.response
  switch (status) {
    case 401:
      showLogin()
      break
    case 403:
      store.setError('403')
      break
    case 404:
      store.setError('404')
      break
    default:
      if (status < 500) {
        store.setErrorResult({
          code: 'error',
          icon: 'warning',
          title: 'Request Failed',
          subTitle: `(${code || status}) ${msg || statusText}`,
        })
      } else {
        store.setError('500')
      }
  }
}

// 返回错误信息的文本描述，用于页面展示，401回登录页
const errorText = (err: AxiosError): string => {
  if (err === undefined || err.response === undefined || err.code === 'ERR_NETWORK') {
    return '网络错误'
  }
  const {
    status,
    statusText,
    data: { code, msg },
  } = <AxiosResponse>err.response
  if (status === 401) {
    showLogin()
  }
  return `(${code || status}) ${msg || statusText}`
}

export default {
  errorMsg,
  errorPage,
  errorText,
}
