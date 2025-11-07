# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install all dependencies (including dev dependencies for building)
RUN npm ci && npm cache clean --force

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build TypeScript
RUN npm run build || npm run build:prod

# Production stage
FROM node:18-alpine

WORKDIR /app

# Install runtime dependencies
RUN apk add --no-cache \
    curl \
    bash \
    openssl \
    && rm -rf /var/cache/apk/*

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm ci --omit=dev && npm cache clean --force

# Copy built files from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy admin creation script and entrypoint
COPY create-admin.js ./
COPY docker-entrypoint.sh ./

# Generate Prisma Client in production stage
RUN npx prisma generate

# Create necessary directories
RUN mkdir -p /app/logs /tmp/online-compiler

# Set proper permissions
RUN chmod +x docker-entrypoint.sh

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001

# Change ownership of app directory
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 8000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

# Use entrypoint script
ENTRYPOINT ["./docker-entrypoint.sh"]
