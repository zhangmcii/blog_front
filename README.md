# responsive

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Customize configuration

See [Vite Configuration Reference](https://vitejs.dev/config/).

## Project Setup

```sh
npm install
```

### Compile and Hot-Reload for Development

```sh
npm run dev
```

### Compile and Minify for Production

```sh
npm run build
```

### Lint with [ESLint](https://eslint.org/)

```sh
npm run lint
```

**响应式设计**

移动设备浏览器当然也可以直接访问桌面端网页，但这些情况下产品的可用性，可读性，可访问性很难得到保障，没有用户愿意历经艰难险阻才能使用产品。

响应式面临的问题：

1. 像素密度 ppi (像素/每英寸) （点数/每英寸）
   1.1 设备像素和css像素
   1个像素可有多个设备像素组成
   标准图片在高清设备上呈现出同样的大小，由于高清设备有更多的设备像素，所以他会在1像素上占用多个设备像素点。

2.如何区分高清设备和标清设备？如何做到为不同设备，不同的网络环境，提供不同的图片素材

    我们都希望以系统分辨率的宽度来渲染页面，以免尽可能地避免缩放。
    content="width=device-width" 把获取具体系统分辨率宽度这个任务交给浏览器

开发：

1. 导航栏的展开
