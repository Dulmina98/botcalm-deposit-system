FROM node:18-alpine AS builder
WORKDIR /app
COPY pnpm-lock.yaml ./
COPY package.json ./
COPY pnpm-workspace.yaml ./
COPY apps/backend/package.json ./apps/backend/
RUN npm install -g pnpm
RUN pnpm install --filter backend
COPY apps/backend/tsconfig.json ./apps/backend/
COPY apps/backend/src/ ./apps/backend/src/
RUN pnpm --filter backend build

FROM node:18-alpine AS production
WORKDIR /app
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY apps/backend/src/migrations/ ./apps/backend/dist/migrations/
RUN mkdir -p logs
EXPOSE 5000
CMD ["node", "apps/backend/dist/server.js"]
