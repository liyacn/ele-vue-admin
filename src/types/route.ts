import { Component } from 'vue'
import { RouteComponent, RouteRecordRaw } from 'vue-router'

type RouteItem = {
  title: string
  icon?: Component
  sub?: RouteTree // 有sub则忽略以下
  conponent?: RouteComponent
  isPub?: boolean
  hide?: boolean
  props?: object
}

export type RouteTree = { [key: string]: RouteItem }

export type MenuItem = {
  name: string
  title: string
  icon?: Component
  sub?: MenuItem[]
  authKey?: string
}

export type SystemMenu = {
  name: string
  title: string
  sub?: SystemMenu[]
}

export const dfsTree = (tree: RouteTree, pnames: string[] = [], ptitles: string[] = []) => {
  const menus: MenuItem[] = [] //全部侧边菜单
  const sys: SystemMenu[] = [] //需要权限控制的侧边菜单
  const routes: RouteRecordRaw[] = [] //路由表
  for (const k in tree) {
    const names = pnames.concat(k)
    const titles = ptitles.concat(tree[k].title)
    const branch: MenuItem = {
      name: names.join('.'),
      title: tree[k].title,
      icon: tree[k].icon,
    }
    const simple: SystemMenu = {
      name: branch.name,
      title: branch.title,
    }
    if (tree[k].sub) {
      const result = dfsTree(tree[k].sub as RouteTree, names, titles)
      branch.sub = result.menus
      routes.push(...result.routes)
      if (result.sys.length > 0) {
        simple.sub = result.sys
        sys.push(simple)
      }
    } else {
      if (!tree[k].isPub) {
        branch.authKey = branch.name
        sys.push(simple)
      }
      routes.push({
        name: branch.name,
        path: names.join('/'),
        component: tree[k].conponent as RouteComponent,
        props: tree[k].props,
        meta: {
          authKey: branch.authKey,
          title: titles,
        },
      })
    }
    if (!tree[k].hide) {
      menus.push(branch)
    }
  }
  return { menus, sys, routes }
}
