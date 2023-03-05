import error from './error'
import { api, upload } from './request'
import * as M from 'models'

export default {
  ...error,

  uplaodImage: upload<M.UploadResp>('/upload/image'), //上传图片
  uplaodAudio: upload<M.UploadResp>('/upload/audio'), //上传音频
  uplaodVideo: upload<M.UploadResp>('/upload/video'), //上传视频
  uplaodPDF: upload<M.UploadResp>('/upload/pdf'), //上传pdf

  captcha: api<{}, M.CaptchaResp>('/captcha', true), //登录验证码
  login: api<M.LoginArgs, M.LoginResp>('/user/login', true), //登录
  logout: api('/user/logout', true), //退出登录
  changePwd: api<M.PasswordArgs, {}>('/user/password', true), //修改密码

  sysMenuSync: api<{ menus: M.SysMenu[] }, M.SystemActionMenuListResp>('/system/action-menu/sync'), //一键同步接口和菜单
  sysMenuList: api<{}, M.SystemActionMenuListResp>('/system/action-menu/list'), //获取接口列表和菜单树
  sysActionUpdate: api<M.UpdateSystemActionArgs, {}>('/system/action/update'), //更新接口描述
  roleList: api<M.ListArgs, M.RoleListResp>('/system/role/list'), //角色列表
  roleOption: api<{}, M.OptionResp>('/system/role/option'), //角色选项
  roleCreate: api<M.RoleCreateArgs, {}>('/system/role/create'), //创建角色
  roleUpdate: api<M.RoleUpdateArgs, {}>('/system/role/update'), //更新角色
  adminList: api<M.AdminListArgs, M.AdminListResp>('/system/user/list'), //账号列表
  adminCreate: api<M.AdminCreateArgs, {}>('/system/user/create'), //创建账号
  adminSetPwd: api<M.AdminSetPwdArgs, {}>('/system/user/password'), //重置密码
  adminSetRole: api<M.AdminSetRoleArgs, {}>('/system/user/role'), //变更角色
  adminSetStatus: api<M.SwitchStatusArgs, {}>('/system/user/status'), //切换状态

  cryptoEecrypt: api<M.CryptoArgs, M.CryptoResp>('/crypto/encrypt'), // 数据加密
  cryptoDecrypt: api<M.CryptoArgs, M.CryptoResp>('/crypto/decrypt') // 数据解密
}
