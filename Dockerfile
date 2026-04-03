# 构建阶段 - 使用更轻量的镜像
# v2: 强制 Railway 重新构建
FROM node:20-alpine AS builder

WORKDIR /app

# 复制 package.json 和 lock 文件
COPY package.json package-lock.json* ./

# 安装所有依赖（包括 devDependencies，用于编译）
RUN npm ci --no-audit --no-fund --prefer-offline

# 复制源代码和配置文件
COPY . .

# 编译 TypeScript
RUN npm run build

# 生产阶段
FROM node:20-alpine

WORKDIR /app

# 复制 package.json 和 lock 文件
COPY package.json package-lock.json* ./

# 只安装生产依赖
RUN npm ci --omit=dev --no-audit --no-fund --prefer-offline

# 从构建阶段复制编译后的代码
COPY --from=builder /app/dist ./dist

# 暴露端口
EXPOSE 3000

# 启动
CMD ["node", "dist/main.js"]
