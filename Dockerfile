# 构建阶段
FROM node:20-slim AS builder

WORKDIR /app

# 安装编译工具（TypeScript 编译需要）
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 \
    make \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# 复制 package.json 和 lock 文件
COPY package.json package-lock.json* ./

# 安装所有依赖（包括 devDependencies，用于编译）
RUN npm ci --no-audit --no-fund

# 复制源代码和配置文件
COPY . .

# 编译 TypeScript
RUN npm run build

# 生产阶段
FROM node:20-slim

WORKDIR /app

# 复制 package.json 和 lock 文件
COPY package.json package-lock.json* ./

# 只安装生产依赖
RUN npm ci --omit=dev --no-audit --no-fund

# 从构建阶段复制编译后的代码
COPY --from=builder /app/dist ./dist

# 暴露端口
EXPOSE 3000

# 启动
CMD ["node", "dist/main.js"]
