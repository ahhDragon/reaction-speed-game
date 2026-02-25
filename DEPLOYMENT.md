# 🎮 反应速度测试游戏 - 部署和分享指南

## ✅ 构建完成！

你的游戏已经成功构建，所有文件都在 `dist/` 文件夹中。

## 📦 分享方式

### 方式 1: 使用 GitHub Pages（推荐，免费）

这是最简单的免费托管方式：

1. **创建 GitHub 仓库**
   - 访问 https://github.com/new
   - 创建一个新仓库（可以是公开或私有）

2. **上传代码**
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Reaction Speed Game"
   git branch -M main
   git remote add origin https://github.com/你的用户名/你的仓库名.git
   git push -u origin main
   ```

3. **启用 GitHub Pages**
   - 进入仓库的 Settings → Pages
   - Source 选择 "GitHub Actions"
   - 创建文件 `.github/workflows/deploy.yml`：

   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [ main ]

   jobs:
     build-and-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         
         - name: Setup Node.js
           uses: actions/setup-node@v3
           with:
             node-version: '18'
             
         - name: Install dependencies
           run: npm install
           
         - name: Build
           run: npm run build
           
         - name: Deploy to GitHub Pages
           uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

4. **访问你的游戏**
   - 几分钟后，访问：`https://你的用户名.github.io/你的仓库名/`

---

### 方式 2: 使用 Netlify（推荐，免费）

1. **访问 Netlify**
   - 打开 https://www.netlify.com/
   - 注册/登录账号

2. **部署方式 A - 拖拽部署（最简单）**
   - 点击 "Add new site" → "Deploy manually"
   - 直接拖拽 `dist` 文件夹到页面
   - 完成！会得到一个 `https://随机名称.netlify.app` 的链接

3. **部署方式 B - 连接 GitHub**
   - 点击 "Add new site" → "Import an existing project"
   - 连接你的 GitHub 仓库
   - Build command: `npm run build`
   - Publish directory: `dist`
   - 点击 "Deploy site"

---

### 方式 3: 使用 Vercel（推荐，免费）

1. **访问 Vercel**
   - 打开 https://vercel.com/
   - 注册/登录账号

2. **导入项目**
   - 点击 "Add New" → "Project"
   - 导入你的 GitHub 仓库
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - 点击 "Deploy"

3. **访问你的游戏**
   - 会得到一个 `https://你的项目名.vercel.app` 的链接

---

### 方式 4: 本地分享（适合局域网）

如果只想在本地网络分享：

1. **预览构建版本**
   ```bash
   npm run preview
   ```

2. **查看网络地址**
   - 终端会显示类似：`Network: http://192.168.x.x:4173/`
   - 同一网络的其他人可以通过这个地址访问

3. **使用 ngrok 临时公开**
   ```bash
   # 安装 ngrok: https://ngrok.com/
   npx ngrok http 4173
   ```
   - 会得到一个临时的公网地址，可以分享给任何人

---

### 方式 5: 直接分享文件

最简单但需要对方有技术背景：

1. **压缩 dist 文件夹**
   - 将整个 `dist` 文件夹压缩成 zip
   
2. **分享给朋友**
   - 对方解压后，双击 `index.html` 即可在浏览器中打开游戏

---

## 🎯 推荐方案

**最佳选择**: Netlify 拖拽部署
- ✅ 最简单（30秒完成）
- ✅ 完全免费
- ✅ 自动 HTTPS
- ✅ 全球 CDN 加速
- ✅ 可以自定义域名

**步骤**:
1. 访问 https://app.netlify.com/drop
2. 拖拽 `dist` 文件夹
3. 完成！复制链接分享给朋友

---

## 📱 分享链接后

你的朋友可以：
- 在任何设备的浏览器中打开链接
- 立即开始玩游戏
- 无需安装任何东西
- 支持手机、平板、电脑

---

## 🔄 更新游戏

如果你修改了代码，想更新线上版本：

1. **重新构建**
   ```bash
   npm run build
   ```

2. **重新部署**
   - GitHub Pages: 推送代码到 GitHub
   - Netlify: 重新拖拽 `dist` 文件夹，或推送到 GitHub（如果连接了）
   - Vercel: 推送代码到 GitHub

---

## 📊 当前构建信息

- 构建时间: 138ms
- 文件大小:
  - HTML: 0.58 kB (gzip: 0.42 kB)
  - CSS: 1.69 kB (gzip: 0.72 kB)
  - JS: 6.27 kB (gzip: 2.38 kB)
- 总大小: ~8.5 kB (gzip: ~3.5 kB)

非常轻量，加载速度极快！⚡

---

## 🎉 开始分享吧！

选择一个方式，几分钟内就能让全世界的人玩到你的游戏！
