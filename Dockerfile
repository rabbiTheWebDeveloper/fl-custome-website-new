# syntax=docker/dockerfile:1.7

# ----------- BUILD STAGE -----------
FROM node:20-bookworm AS builder

WORKDIR /app

# Enable pnpm
RUN corepack enable

# Fix pnpm CI behaviour
ENV CI=true

# Install build deps
RUN apt-get update && apt-get install -y python3 make g++ \
    && rm -rf /var/lib/apt/lists/*

# Copy dependency files
COPY package.json pnpm-lock.yaml ./

# Install dependencies
#RUN pnpm install --frozen-lockfile
RUN pnpm install

# Copy project
COPY . .

# Build Next.js
RUN pnpm build

# Remove dev dependencies
RUN pnpm prune --prod --ignore-scripts


# ----------- RUNTIME STAGE -----------
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production

RUN corepack enable

COPY --from=builder /app/.next/standalone /app
COPY --from=builder /app/.next/static /app/.next/static
COPY --from=builder /app/public /app/public

EXPOSE 3000

CMD ["node", "server.js"]
