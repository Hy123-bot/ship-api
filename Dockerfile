# 构建阶段
FROM node:20-alpine AS builder

WORKDIR /app

# 复制 package.json
COPY package.json ./

# 安装所有依赖（包括 devDependencies）
RUN npm install --no-fund --no-audit

# 复制源代码
COPY . .

# 编译 TypeScript
RUN npm run build

# 生产阶段
FROM node:20-alpine

WORKDIR /app

# 复制 package.json
COPY package.json ./

# 只安装生产依赖
RUN npm install --omit=dev --no-fund --no-audit

# 从构建阶段复制编译后的代码
COPY --from=builder /app/dist ./dist

# 暴露端口
EXPOSE 3000

# 启动
CMD ["node", "dist/main.js"]
