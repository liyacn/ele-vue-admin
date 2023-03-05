declare module 'models' {
  type SystemActionSub = {
    key_name: string
    title: string
    sort: number
  }
  type SystemAction = SystemActionSub & {
    sub: SystemActionSub[]
  }
  type SystemActionListResp = {
    list: SystemAction[]
  }
  type SystemActionUpdateArgs = {
    key_name: string
    title: string
    sort: number
  }
}
