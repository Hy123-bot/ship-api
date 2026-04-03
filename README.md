# 🚀 AI船舶分析师 - 简易部署指南

## 📦 部署包已准备好

所有需要的文件都在 `deploy-package` 目录中。

---

## ⚡ 快速部署步骤

### 第一步：注册 GitHub 账号

1. 访问 https://github.com → **Sign up**
2. 完成注册和邮箱验证

---

### 第二步：创建 GitHub 仓库

1. 登录 GitHub
2. 点击 **+** → **New repository**
3. Repository name: `ship-api`
4. 选择 **Public**
5. 点击 **Create repository**

---

### 第三步：上传代码

**最简单的方式：网页上传**

1. 在刚创建的仓库页面，点击 **uploading an existing file**
2. 将 `deploy-package` 目录中的**所有文件**拖拽上传
3. 点击 **Commit changes**

---

### 第四步：部署到 Railway

1. 访问 https://railway.app
2. 点击 **Login with GitHub** → 授权
3. 点击 **+ New Project**
4. 选择 **Deploy from GitHub repo**
5. 选择 `ship-api` 仓库
6. 点击 **Deploy Now**

---

### 第五步：配置环境变量（重要！）

在 Railway 项目页面：

1. 点击 **Variables** 标签
2. 点击 **Raw Editor**
3. 粘贴以下内容：

```
COZE_SUPABASE_URL=https://br-kind-kea-0ee194d7.supabase2.aidap-global.cn-beijing.volces.com
COZE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjMzNTU1MjY2NjAsInJvbGUiOiJhbm9uIn0.u2Sz-NfyKFdY_y3Vvp10DqVAAlbu_xAtpfgTN2ZKjyU
COZE_BUCKET_ENDPOINT_URL=https://integration.coze.cn/coze-coding-s3proxy/v1
COZE_BUCKET_NAME=bucket_1775013530057
```

4. 点击 **Add Variables**
5. 等待自动重新部署

---

### 第六步：获取公网地址

1. 点击 **Settings** 标签
2. 滚动到 **Domains**
3. 点击 **Generate Domain**
4. 获得地址，例如：
   ```
   https://ship-api-production-abc123.up.railway.app
   ```

---

### 第七步：测试

在浏览器中访问你的地址：
```
https://你的地址/api/health
```

看到 `{"status":"ok"}` 就成功了！

---

## 🌐 配置网页版

打开 `smart.html` 文件，在 **API服务地址** 输入框填写：
```
https://你的Railway地址
```

然后：
1. 分享 `smart.html` 给任何人
2. 他们打开后 AI 功能就能正常使用！

---

## 💰 费用说明

Railway 免费版：
- 每月 500 小时执行时间
- 足够船舶分析师应用使用
- 不会产生费用

---

## ❓ 遇到问题？

告诉我：
1. 在哪一步卡住了
2. 错误信息是什么
3. 我会帮你解决！
