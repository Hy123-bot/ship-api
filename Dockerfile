# 使用 Node.js 20 作为基础镜像
FROM node:20-alpine

# 设置工作目录
WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 复制 package.json 文件
COPY package.json ./

# 安装依赖
RUN pnpm install --prod

# 复制编译后的代码
COPY dist ./dist

# 暴露端口
EXPOSE 3000

# 启动命令
CMD ["node", "dist/main.js"]
