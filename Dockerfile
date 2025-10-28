# ----------------------------
# 1️⃣ Backend build
# ----------------------------
FROM node:20-alpine AS backend
WORKDIR /app/backend

# Copy package files first for better caching
COPY backend/package*.json ./
RUN npm ci --omit=dev --silent

# Copy backend source code
COPY backend/ .

# ----------------------------
# 2️⃣ Frontend (static files)
# ----------------------------
FROM node:20-alpine AS frontend
WORKDIR /app/frontend
COPY frontend/ .

# ----------------------------
# 3️⃣ Final production image
# ----------------------------
FROM node:20-alpine

# Install dumb-init for proper signal handling
RUN apk add --no-cache dumb-init

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

WORKDIR /app

# Copy built applications
COPY --from=backend --chown=nodejs:nodejs /app/backend ./backend
COPY --from=frontend --chown=nodejs:nodejs /app/frontend ./frontend

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node backend/healthcheck.js || exit 1

# Switch to non-root user
USER nodejs

# Expose port
EXPOSE 3000

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]

# Start the application
WORKDIR /app/backend
CMD ["node", "server.js"]
