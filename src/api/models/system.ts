declare module 'models' {
  type SysMenu = {
    name: string
    title: string
    sub?: SysMenu[]
  }
  type SystemActionSub = {
    key_name: string
    title: string
    sort: number
  }
  type SystemAction = SystemActionSub & {
    sub: SystemActionSub[]
  }
  type SystemActionMenuListResp = {
    actions: SystemAction[]
    menus: SysMenu[]
  }
  type UpdateSystemActionArgs = {
    key_name: string
    title: string
    sort: number
  }
}
