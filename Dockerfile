# syntax=docker/dockerfile:1.7

# ----------- BUILD STAGE -----------
FROM node:20-bookworm AS builder

WORKDIR /app

# Install build deps for native modules
RUN apt-get update && apt-get install -y python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy package files & install only prod deps
COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# Copy source & build
COPY . .
RUN npm run build

# Optional: prune devDependencies (if you installed any)
RUN npm prune --production

# ----------- RUNTIME STAGE -----------
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

# Copy only what is needed for runtime
COPY --from=builder /app/.next/standalone /app
COPY --from=builder /app/.next/static /app/.next/static
COPY --from=builder /app/public /app/public

EXPOSE 3000
CMD ["node", "server.js"]