# Backend Dockerfile (Node.js/Express)

# Stage 1: Build Stage
FROM node:18 AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
# Add a build step here if using TypeScript, e.g., RUN npm run build

# Stage 2: Production Stage
FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
# Install ONLY production dependencies
RUN npm install --omit=dev
# Copy application from the build stage
COPY --from=build /usr/src/app .

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001
USER nodejs

EXPOSE 5000
CMD [ "node", "server.js" ]
