import { createPinia } from 'pinia'
import { createApp } from 'vue'

import App from './App.vue'
import router from './router'

import draggable from 'vuedraggable'
import { useCoreStore } from './stores/core'
import { table } from './types/table'

import 'element-plus/es/components/message-box/style/css'
import 'element-plus/es/components/message/style/css'
import 'element-plus/es/components/notification/style/css'
import './assets/main.css'

const app = createApp(App)
app.config.globalProperties.$table = table
app.use(createPinia())
app.use(router)

const store = useCoreStore()
store.initAuth()

router.beforeEach((to) => {
  if (store.auth.token) {
    if (to.name === 'login') {
      return '/'
    }
  } else {
    if (to.name !== 'login') {
      return { name: 'login' }
    }
  }
})

router.afterEach((to) => {
  if (store.routeAllow(to)) {
    store.setError('0')
  } else {
    store.setError('403')
  }
})

app.component('drag-sort', draggable)

app.mount('#app')
