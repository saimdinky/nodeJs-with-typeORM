# Use Node.js 20 LTS as base image with latest security patches
FROM node:20-alpine

# Update Alpine packages for security patches
RUN apk update && apk upgrade

# Set working directory inside container
WORKDIR /app

# Copy package.json and package-lock.json first (for better caching)
COPY package*.json ./

# Install all dependencies (including dev dependencies for Babel)
RUN npm ci

# Copy application code
COPY . .

# Create a non-root user for security
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership of the app directory to nodejs user
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"] 