import * as M from 'models'
import error from './error'
import { api, form } from './request'

export default {
  ...error,

  uplaodImage: form<M.UploadArgs, M.UploadResp>('/upload/image'), //上传图片
  uplaodAudio: form<M.UploadArgs, M.UploadResp>('/upload/audio'), //上传音频
  uplaodVideo: form<M.UploadArgs, M.UploadResp>('/upload/video'), //上传视频
  uplaodPDF: form<M.UploadArgs, M.UploadResp>('/upload/pdf'), //上传pdf

  captcha: api<unknown, M.CaptchaResp>('/captcha', true), //登录验证码
  login: api<M.LoginArgs, M.LoginResp>('/login', true), //登录
  logout: api('/logout', true), //退出登录
  changePwd: api<M.PasswordArgs, unknown>('/password', true), //修改密码

  sysActionSync: api<unknown, M.SystemActionListResp>('/system/action/sync'), //一键同步接口和菜单
  sysActionList: api<unknown, M.SystemActionListResp>('/system/action/list'), //获取接口列表和菜单树
  sysActionUpdate: api<M.SystemActionUpdateArgs, unknown>('/system/action/update'), //更新接口描述
  roleList: api<M.ListArgs, M.RoleListResp>('/system/role/list'), //角色列表
  roleOption: api<unknown, M.OptionResp>('/system/role/option'), //角色选项
  roleSave: api<M.RoleSaveArgs, unknown>('/system/role/save'), //保存角色
  adminList: api<M.AdminListArgs, M.AdminListResp>('/system/user/list'), //账号列表
  adminCreate: api<M.AdminCreateArgs, unknown>('/system/user/create'), //创建账号
  adminSetPwd: api<M.AdminSetPwdArgs, unknown>('/system/user/password'), //重置密码
  adminSetRole: api<M.AdminSetRoleArgs, unknown>('/system/user/role'), //变更角色
  adminSetStatus: api<M.SwitchStatusArgs, unknown>('/system/user/status'), //切换状态

  cryptoEecrypt: api<M.CryptoArgs, M.CryptoResp>('/crypto/encrypt'), // 数据加密
  cryptoDecrypt: api<M.CryptoArgs, M.CryptoResp>('/crypto/decrypt'), // 数据解密
}
