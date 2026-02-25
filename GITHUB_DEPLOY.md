# 🚀 GitHub 部署指南

## ✅ 已完成的步骤

- ✅ 代码已提交到本地 Git 仓库
- ✅ `dist` 文件夹已包含在提交中
- ✅ 准备好推送到 GitHub

## 📝 接下来的步骤

### 1. 在 GitHub 上创建仓库

1. 打开浏览器，访问：https://github.com/new
2. 填写仓库信息：
   - **Repository name**: `reaction-speed-game` (或你喜欢的名字)
   - **Description**: `一个测试反应速度的网页游戏`
   - **Public** 或 **Private**: 选择公开或私有
   - ⚠️ **不要**勾选 "Add a README file"
   - ⚠️ **不要**勾选 "Add .gitignore"
   - ⚠️ **不要**勾选 "Choose a license"
3. 点击 **"Create repository"**

### 2. 推送代码到 GitHub

创建仓库后，GitHub 会显示一些命令。在终端中运行：

```bash
# 添加远程仓库（替换成你的 GitHub 用户名和仓库名）
git remote add origin https://github.com/你的用户名/reaction-speed-game.git

# 推送代码
git branch -M main
git push -u origin main
```

**或者直接运行这个命令（记得替换用户名和仓库名）：**

```bash
git remote add origin https://github.com/你的用户名/你的仓库名.git && git branch -M main && git push -u origin main
```

### 3. 启用 GitHub Pages

推送成功后：

1. 进入你的 GitHub 仓库页面：https://github.com/ahhDragon/reaction-speed-game
2. 点击 **Settings** (设置)
3. 在左侧菜单找到 **Pages**
4. 在 **Source** 下：
   - 选择 **GitHub Actions**（不是 Deploy from a branch）
5. 保存后，GitHub Actions 会自动开始构建和部署

### 4. 查看部署状态

1. 在仓库页面点击 **Actions** 标签
2. 你会看到 "Deploy to GitHub Pages" 工作流正在运行
3. 等待绿色的 ✓ 标记（通常需要 1-2 分钟）

### 5. 访问你的游戏

部署完成后，你的游戏就会发布到：

```
https://ahhdragon.github.io/reaction-speed-game/
```

你也可以在 Settings → Pages 页面看到这个链接。

---

## 🎯 快速命令参考

假设你的 GitHub 用户名是 `yourname`，仓库名是 `reaction-speed-game`：

```bash
# 1. 添加远程仓库
git remote add origin https://github.com/yourname/reaction-speed-game.git

# 2. 推送代码
git push -u origin main

# 3. 完成！访问：
# https://yourname.github.io/reaction-speed-game/
```

---

## 🔄 以后更新游戏

当你修改代码后：

```bash
# 1. 提交更改
git add .
git commit -m "Update game"

# 2. 推送到 GitHub
git push

# 3. GitHub Actions 会自动构建和部署，等待 1-2 分钟即可
```

不需要手动运行 `npm run build`，GitHub Actions 会自动处理！

---

## ❓ 遇到问题？

### 推送时要求输入用户名和密码

GitHub 现在使用 Personal Access Token (PAT) 而不是密码：

1. 访问：https://github.com/settings/tokens
2. 点击 **Generate new token** → **Generate new token (classic)**
3. 勾选 `repo` 权限
4. 生成 token 并复制
5. 推送时，用户名输入你的 GitHub 用户名，密码输入这个 token

### 或者使用 GitHub Desktop

下载 GitHub Desktop：https://desktop.github.com/
- 更简单的图形界面
- 自动处理认证

---

## 🎉 完成后

你的游戏将：
- ✅ 托管在 GitHub 上（免费）
- ✅ 有一个公开的链接可以分享
- ✅ 自动 HTTPS 加密
- ✅ 全球 CDN 加速

把链接分享给朋友，让他们体验你的游戏吧！🎮
