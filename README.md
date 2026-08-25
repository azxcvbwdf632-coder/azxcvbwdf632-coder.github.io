# 邱孝淼 / 淼淼 · 个人作品集

面向内容运营岗位的个人网站。交互采用固定全屏舞台、滚轮切换场景与像素水层过场，视觉素材来自本人真实拍摄的海洋、跳水、沙丁鱼风暴和鲸鲨。

## 本地运行

```powershell
npm ci
npm run dev
```

## 构建

```powershell
npm run build
```

生产构建会输出到 `dist`。网站使用 `#about`、`#operations`、`#films`、`#contact`
等哈希地址，因此刷新页面时仍然请求根目录的 `index.html`，不需要额外的 SPA
重写规则。

## EdgeOne 构建配置

- 生产分支：`main`
- Root Directory：`/`（仓库根目录）
- Install Command：`npm ci`
- Build Command：`npm run build`
- Output Directory：`dist`
- Node.js Version：`22`

网站内容：

- 关于我
- 账号运营与真实数据证据
- 微电影与摄影作品
- 邮件联系

## 字体

中文像素字体使用 Fusion Pixel Font，并按 SIL Open Font License 1.1 随项目保留授权文本。
