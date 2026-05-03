FROM node:20-alpine AS builder
WORKDIR /app
COPY pnpm-lock.yaml ./
COPY package.json ./
COPY pnpm-workspace.yaml ./
COPY apps/frontend/package.json ./apps/frontend/
RUN npm install -g pnpm
RUN pnpm install --filter frontend
COPY apps/frontend/ ./apps/frontend/
RUN pnpm --filter frontend build

FROM nginx:alpine AS production
COPY --from=builder /app/apps/frontend/dist /usr/share/nginx/html
COPY apps/frontend/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
