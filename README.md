# Cloud Desktop - 基于 Vue 的可定制化浏览器桌面

## 项目简介

Cloud Desktop 是一个基于 `vue-grid-layout-v3` 构建的高度可定制化的浏览器桌面应用。用户可以自由添加、删除、拖拽和缩放桌面上的应用和组件，实现个性化的桌面布局。所有数据将通过一个可扩展的中间件保存，默认为浏览器本地存储，未来可以轻松扩展为通过 API 与后端服务同步。

## 核心功能

- **栅格化桌面布局**: 桌面被划分为网格，所有元素都可以吸附到网格上，方便对齐。
- **拖拽与缩放**: 用户可以随意拖动桌面元素的位置，并调整其大小。
- **左侧边栏**: 屏幕左侧有一个可覆盖在桌面上的侧边栏，用于放置常用工具或应用列表。
- **应用管理**: 支持添加和删除预设的应用。
- **自定义组件**: 用户可以通过编写 HTML, CSS, 和 JavaScript 代码来创建自己的组件，并将其添加到桌面上。
- **数据持久化**: 布局和组件数据将被保存在浏览器本地（`localStorage`），确保刷新后配置不丢失。
- **可扩展的数据层**: 设计一个中间件来处理数据，使其易于从本地存储切换到后端 API。
- **全屏壁纸**: 桌面背景支持设置为全屏壁纸。

## 技术栈

- **前端框架**: Vue 3 (Composition API)
- **布局**: [vue-grid-layout-v3](https://github.com/Hafid-j/vue-grid-layout-v3)
- **构建工具**: Vite
- **状态管理**: Pinia (如果需要)
- **路由**: Vue Router (如果需要)

## 项目结构 (初步设计)

```
.
├── public/
├── src/
│   ├── assets/             # 静态资源 (图片, 字体等)
│   ├── components/         # 可复用的 Vue 组件
│   │   ├── Sidebar.vue     # 侧边栏
│   │   └── Desktop.vue     # 桌面
│   ├── layouts/            # 布局组件
│   │   └── MainLayout.vue
│   ├── services/           # 服务层 (例如，数据持久化)
│   │   ├── dataService.js
│   │   └── middleware/
│   │       └── localStorage.js
│   ├── stores/             # Pinia 状态管理
│   ├── views/              # 页面级组件
│   │   └── Home.vue
│   ├── App.vue             # 根组件
│   └── main.js             # 应用入口
├── .gitignore
├── index.html
├── package.json
└── README.md
```

## 开发计划

1.  **[进行中] 创建项目说明 (README.md)**
2.  搭建项目结构
3.  实现核心布局 (侧边栏 + 桌面)
4.  实现数据持久化中间件
5.  实现应用/组件的添加、删除、拖拽和缩放功能
6.  实现自定义组件功能
7.  UI/UX 优化
