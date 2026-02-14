FROM node:18

# Create app directory
WORKDIR /app

# Copy package.json first (for caching)
COPY backend/package.json ./package.json

# Install dependencies
RUN npm install

# Copy backend code
COPY backend/ .

# Copy frontend (HTML + images)
COPY frontend/ ./frontend

# Expose port for Cloud Run
EXPOSE 8080

# Start server
CMD ["node", "server.js"]
