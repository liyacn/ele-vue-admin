import { SysMenu } from 'models'
import { Component } from 'vue'
import { RouteComponent, RouteRecordRaw } from 'vue-router'

export type MenuTreeNode = {
  title: string
  icon?: Component
  sub?: MenuTree // 有sub则忽略以下
  conponent?: RouteComponent
  isPub?: boolean
  hide?: boolean
  props?: object
}

export type MenuTree = { [key: string]: MenuTreeNode }

export type MenuBranch = {
  name: string
  title: string
  icon?: Component
  sub?: MenuBranch[] //有sub则忽略以下
  authKey?: string
}

export type MenuItem = {
  name: string
  title: string
  icon?: Component
  sub?: MenuItem[]
}

export const dfsTree = (tree: MenuTree, pnames: string[] = [], ptitles: string[] = []) => {
  const menus: MenuBranch[] = []
  const sys: SysMenu[] = []
  const routes: RouteRecordRaw[] = []
  for (const k in tree) {
    const names = pnames.concat(k)
    const titles = ptitles.concat(tree[k].title)
    const branch: MenuBranch = {
      name: names.join('.'),
      title: tree[k].title,
      icon: tree[k].icon
    }
    const simple: SysMenu = {
      name: branch.name,
      title: branch.title
    }
    if (tree[k].sub) {
      const result = dfsTree(tree[k].sub as MenuTree, names, titles)
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
          title: titles
        }
      })
    }
    if (!tree[k].hide) {
      menus.push(branch)
    }
  }
  return { menus, sys, routes }
}
