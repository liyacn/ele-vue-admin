declare module 'models' {
  type CaptchaResp = {
    session_key: string
    base64_image: string
  }
  type LoginArgs = {
    username: string
    password: string
    captcha: string
    session_key: string
  }
  type LoginResp = {
    token: string
    username: string
    pwd_tip?: string
    is_super?: boolean
    actions?: string[]
    menus?: string[]
  }
  type PasswordArgs = {
    password: string
  }
  type RoleItem = {
    id: number
    name: string
    actions: string[]
    menus: string[]
  }
  type RoleListResp = {
    total: number
    list: RoleItem[]
  }
  type RoleSaveArgs = {
    id?: number
    name: string
    actions: string[]
    menus: string[]
  }
  type AdminListArgs = ListArgs & {
    username: string
    role_id: number
    status: number
  }
  type AdminItem = {
    id: number
    username: string
    role_id: number
    is_super?: boolean
    status: number
  }
  type AdminListResp = {
    total: number
    list: AdminItem[]
  }
  type AdminCreateArgs = {
    username: string
    password: string
    role_id: number
  }
  type AdminSetPwdArgs = {
    id: number
    password: string
  }
  type AdminSetRoleArgs = {
    id: number
    role_id: number
  }
}
