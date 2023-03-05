# ele-vue-admin

基于 vue3.x 搭建的内容管理后台前端项目

### 项目目录

```
.env.*              #环境配置
index.html          #首页
tsconfig.json       #编译配置
vite.config.ts      #开发配置
public/             #公共资源
src/                #源码目录
   api/             #后端接口封装
      models/       #请求响应数据模型
      index.ts      #统一导出入口
   assets/          #资源文件(图片、样式)
   components/      #组件
   router/          #路由
      index.ts      #基础路由
      menu.ts       #多级菜单和路由定义
   stores/          #状态管理
   types/           #类型和映射
   utils/           #辅助函数方法
   views/           #视图页面
   App.vue          #根组件
   main.ts          #项目核心文件
Dockerfile          #部署Dockerfile
nginx.conf          #构建image使用的nginx配置
```

## 推荐的 IDE 设置

[VSCode](https://code.visualstudio.com/) +
[Vue - Official](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## 开发环境建议

- node v24.x

## 项目安装

```sh
npm install
```

### 代码检查

```sh
npm run lint
npm run type-check
```

### 代码格式化

```sh
npm run format
```

### 开发环境编译和热重载

```sh
npm run dev
```

- 开发联调可修改`vite.config.ts`的`proxy`.`/api`.`target`
- 本地运行测试环境：`npm run test`

### 编译构建

```sh
npm run build
```

测试环境编译：`npm run build:test`

## 项目部署

根据Dockerfile构建容器部署，Dockerfile指向的dist目录地址和应该和nginx.conf指定的root目录匹配。

本地构建docker镜像：

```sh
docker build . #生产构建，可省略 --build-arg env=prod
docker build --build-arg env=test . #测试构建
```

## 参考文档

- [Vue.js](https://cn.vuejs.org/)
- [Vue Router](https://router.vuejs.org/zh/)
- [Pinia](https://pinia.vuejs.org/zh/)
- [Vite](https://cn.vitejs.dev/)
- [TypeScript](https://www.typescriptlang.org/zh/docs/)
- [Element Plus](https://element-plus.org/zh-CN/)

---

- 接口 mock 工具: [ApiFox](https://www.apifox.cn/)
- 预览地址: [Preview](http://ele-vue-admin.liyacn.top/) ~ 用户名：`admin` 密码：`123456`
