# Use Node.js LTS
FROM node:20-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies (including dev dependencies for build)
COPY package*.json ./
RUN npm ci

# Copy app source
COPY . .

# Build TypeScript
RUN npm run build

# Remove dev dependencies after build
RUN npm prune --production

# Expose port
EXPOSE 8001

# Start the application
CMD ["node", "dist/index.js"]
