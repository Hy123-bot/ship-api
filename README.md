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
3. **删除所有现有变量**（如果有）
4. 粘贴以下内容：

```
COZE_SUPABASE_URL=https://br-kind-kea-0ee194d7.supabase2.aidap-global.cn-beijing.volces.com
COZE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjMzNTU1MjY2NjAsInJvbGUiOiJhbm9uIn0.u2Sz-NfyKFdY_y3Vvp10DqVAAlbu_xAtpfgTN2ZKjyU
COZE_BUCKET_ENDPOINT_URL=https://integration.coze.cn/coze-coding-s3proxy/v1
COZE_BUCKET_NAME=bucket_1775013530057
COZE_WORKLOAD_IDENTITY_API_KEY=<你的Base64 API Key>
```

### 🔑 关于 COZE_WORKLOAD_IDENTITY_API_KEY

这个变量用于 AI 功能认证。你有两个选择：

#### 选项 A：从 Coze 平台获取 Base64 API Key

1. 访问 Coze 平台的工作负载身份设置页面
2. 创建或复制 Base64 格式的 API Key
3. 将其粘贴到环境变量中

#### 选项 B：自己生成 Base64 API Key

如果你有以下信息：
- `client_id`: 工作负载身份的客户端 ID
- `private_key`: 私钥内容

可以使用以下命令生成 Base64 API Key：

```bash
# 在本地环境执行
echo -n '{"client_id":"你的client_id","private_key":"你的私钥内容"}' | base64 -w 0
```

然后将生成的 Base64 字符串填入 `COZE_WORKLOAD_IDENTITY_API_KEY`。

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

### 第七步：验证部署

访问以下地址验证功能：

1. **环境变量检查**：
   ```
   https://你的域名/api/ship-designs/debug-env
   ```
   应该看到 `COZE_WORKLOAD_IDENTITY_API_KEY: SET (长度: xxx)`

2. **AI 聊天测试**：
   ```bash
   curl -X POST "https://你的域名/api/ship-designs/chat" \
     -H "Content-Type: application/json" \
     -d '{"message":"你好"}'
   ```
   应该返回正常的 AI 回复

---

## ❓ 常见问题

### Q1: 环境变量显示 NOT SET

**原因**：变量没有正确保存或部署未更新

**解决**：
1. 删除所有现有变量
2. 使用 Raw Editor 重新粘贴
3. 点击 "Add Variables"
4. 等待自动重新部署（或手动触发）

### Q2: AI 接口返回 500 错误

**原因**：`COZE_WORKLOAD_IDENTITY_API_KEY` 格式错误或无效

**解决**：
1. 访问 `/api/ship-designs/debug-env` 检查变量状态
2. 确认 API Key 是 Base64 格式
3. 重新生成 API Key 并配置

### Q3: 如何获取 Base64 API Key

**方法一**：从 Coze 平台复制
- 登录 Coze 平台
- 进入工作负载身份管理
- 复制已有的 Base64 API Key

**方法二**：从私钥生成
```bash
# 准备 JSON 字符串（注意：私钥中的换行符需要用 \n 表示）
JSON='{"client_id":"你的client_id","private_key":"-----BEGIN PRIVATE KEY-----\n你的私钥内容\n-----END PRIVATE KEY-----\n"}'

# 生成 Base64
echo -n "$JSON" | base64 -w 0
```

---

## 📞 技术支持

如果部署过程中遇到问题，请检查：
1. GitHub 仓库是否正确创建
2. Railway 是否成功连接 GitHub
3. 环境变量是否正确配置
4. 部署日志中是否有错误信息

---

## 🎉 部署成功后

你的 API 地址将是：
```
https://你的域名.up.railway.app
```

小程序可以通过这个地址调用所有 AI 功能！
