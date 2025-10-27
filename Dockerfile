# ----------------------------
# 1️⃣ Backend build
# ----------------------------
FROM node:20-alpine AS backend
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --omit=dev
COPY backend/ .

# ----------------------------
# 2️⃣ Frontend (static)
# ----------------------------
FROM node:20-alpine AS frontend
WORKDIR /app/frontend
COPY frontend/ .

# ----------------------------
# 3️⃣ Final Image
# ----------------------------
FROM node:20-alpine
WORKDIR /app

# Copy backend & frontend from previous stages
COPY --from=backend /app/backend ./backend
COPY --from=frontend /app/frontend ./frontend

# Set environment
ENV NODE_ENV=production
ENV PORT=3000
EXPOSE 3000

# Run the backend server
WORKDIR /app/backend
CMD ["node", "server.js"]
