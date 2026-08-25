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

`edgeone.json` 同时保存了正式环境的构建参数与缓存规则；`npm run build`
会把它复制到 `dist`，因此 Git 连接构建和本地直传使用同一份配置。

## 图片处理与审计

原始 JPG/WebP 都放在 `public/assets`，页面只使用 `/assets/...` 形式的同源路径。
需要补充图片时，先放入对应作品文件夹，再运行：

```powershell
python scripts/prepare_images.py
```

脚本不会覆盖原图，只会生成适合手机、平板和电脑的响应式 WebP/AVIF，随后更新
`src/imageManifest.js`。逐图正式 URL、体积、格式、尺寸、Git 状态和引用位置记录在
`docs/IMAGE_AUDIT.csv`；摘要在 `docs/IMAGE_AUDIT.md`。

构建后可以用 `node scripts/verify_image_urls.mjs http://127.0.0.1:4173 GET`
逐一检查产物中的图片状态、类型和实际字节数。

网站内容：

- 关于我
- 账号运营与真实数据证据
- 微电影与摄影作品
- 邮件联系

## 字体

中文像素字体使用 Fusion Pixel Font，并按 SIL Open Font License 1.1 随项目保留授权文本。
