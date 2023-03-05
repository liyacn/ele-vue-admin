<script setup lang="ts">
import RouteMenu from './RouteMenu.vue'
import api from '@/api'
import { menus } from '@/router/menu'
import { useCoreStore } from '@/stores/core'
import { MenuBranch, MenuItem } from '@/types/route'
import { Avatar, Expand, Fold, HomeFilled, Lock, SwitchButton } from '@element-plus/icons-vue'
import { ref } from 'vue'
import { RouteLocationNormalizedLoaded, onBeforeRouteUpdate, useRouter } from 'vue-router'

const minSide = '64px'
const maxSide = '260px'
const collapse = ref(false)
const active = ref('')
const router = useRouter()
const store = useCoreStore()

function dfs(mb: MenuBranch[]): MenuItem[] {
  let arr: MenuItem[] = []
  for (let item of mb) {
    let mi: MenuItem = {
      name: item.name,
      title: item.title,
      icon: item.icon
    }
    if (item.sub) {
      let sub = dfs(item.sub)
      if (sub.length > 0) {
        mi.sub = sub
        arr.push(mi)
      }
    } else {
      if (store.menuAllow(item.authKey)) {
        arr.push(mi)
      }
    }
  }
  return arr
}

const menuItems = dfs(menus)

const logout = () => {
  api.logout
    .do({})
    .then(() => {
      store.removeAuth()
      router.push('/login')
    })
    .catch(api.void0)
}

const setActiveMenu = (to: RouteLocationNormalizedLoaded) => {
  if (to.name) {
    active.value = to.name.toString()
  }
}

{
  setActiveMenu(router.currentRoute.value)
  onBeforeRouteUpdate((to) => {
    setActiveMenu(to)
  })
}
</script>

<template>
  <el-container>
    <el-aside :width="collapse ? minSide : maxSide">
      <div class="logo" @click="$router.push('/')">
        <img src="@/assets/logo.svg" alt="" />
        <span>Element Vue Admin</span>
      </div>
      <el-scrollbar>
        <el-menu
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          :collapse="collapse"
          :default-active="active"
          router
        >
          <RouteMenu :items="menuItems" />
        </el-menu>
      </el-scrollbar>
      <div class="collapse" @click="collapse = !collapse">
        <el-icon v-if="collapse"><Expand /></el-icon>
        <el-icon v-else><Fold /></el-icon>
      </div>
    </el-aside>

    <el-container class="box" :style="{ 'margin-left': collapse ? minSide : maxSide }">
      <el-header>
        <el-breadcrumb v-if="store.routeAllow($route)">
          <el-breadcrumb-item>
            <el-icon><HomeFilled /></el-icon>
          </el-breadcrumb-item>
          <el-breadcrumb-item v-for="(title, index) in $route.meta.title" :key="index">
            {{ title }}
          </el-breadcrumb-item>
        </el-breadcrumb>
        <el-dropdown>
          <span>
            <el-icon><Avatar /></el-icon>
            {{ store.auth.user }}
          </span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item :icon="Lock" @click="$router.push('/password')">
                修改密码
              </el-dropdown-item>
              <el-dropdown-item :icon="SwitchButton" @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>

      <el-main>
        <el-result
          v-if="store.error.code"
          :icon="store.error.icon"
          :title="store.error.title"
          :sub-title="store.error.subTitle"
        >
          <template #extra>
            <el-button type="primary" @click="$router.push('/')">Back</el-button>
            <el-button
              v-show="store.error.code === '500' || store.error.code === 'error'"
              @click="$router.replace($route)"
            >
              Retry
            </el-button>
          </template>
        </el-result>
        <RouterView v-else />
      </el-main>
    </el-container>
  </el-container>
</template>

<style scoped>
.el-aside {
  background-color: #545c64;
  color: #fff;
  position: fixed;
  & > .logo {
    height: 60px;
    line-height: 60px;
    font-size: 18px;
    overflow: hidden;
    cursor: pointer;
    & > img {
      width: 32px;
      margin: auto 16px;
      vertical-align: middle;
    }
  }
  & .el-menu {
    border-right: none;
    height: calc(100vh - 110px);
  }
  & > .collapse {
    line-height: 50px;
    font-size: 16px;
    text-align: center;
    cursor: pointer;
    transition: 0.3s;
    &:hover {
      color: #ffd04b;
    }
    & > .el-icon {
      vertical-align: middle;
    }
  }
}
.box {
  min-height: 100vh;
  background-color: var(--el-fill-color);
}
.el-header {
  background-color: #fff;
  display: flex;
  justify-content: space-between;
  & > .el-breadcrumb {
    line-height: 60px;
  }
  & > .el-dropdown {
    line-height: 60px;
    font-size: 18px;
    cursor: pointer;
    & .el-icon {
      vertical-align: middle;
    }
  }
}
.el-tooltip__trigger:focus {
  outline: 0;
}
.el-main {
  background-color: #fff;
  margin: 18px;
}
</style>
