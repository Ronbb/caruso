---
title: 构建
subtitle: build
datetime: 2020-12-01 12:00:00
tags: 
  - typescript
  - test
---

## 构建

当项目开发完毕，只需要运行一行命令就可以打包你的应用：

```bash
npm run build
```

由于 Ant Design Pro 使用的工具 [Umi](https://umijs.org/) 已经将复杂的流程封装完毕，构建打包文件只需要一个命令 `umi build`，构建打包成功之后，会在根目录生成 `dist` 文件夹，里面就是构建打包好的文件，通常是 `*.js`、`*.css`、`index.html` 等静态文件。

如果需要自定义构建，比如指定 `dist` 目录等，可以通过 `config/config.ts` 进行配置，详情参看：[Umi 配置](https://umijs.org/guide/config.html)。

### 分析构建文件体积

如果你的构建文件很大，你可以通过 `analyze` 命令构建并分析依赖模块的体积分布，从而优化你的代码。

```bash
npm run analyze
```

上面的命令会自动在浏览器打开显示体积分布数据的网页。
