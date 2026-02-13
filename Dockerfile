# Use Node.js as the base image
FROM node:20-slim

# Set working directory
WORKDIR /app

# Install system dependencies for React Native / Expo
RUN apt-get update && apt-get install -y \
    python3 \
    make \
    g++ \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application
COPY . .

# Expose Metro Bundler port
EXPOSE 8081

# Command to start the app
# Use --tunnel or set EXPO_PACKAGER_PROXY_URL if needed for mobile connection
CMD ["npx", "expo", "start", "--dev-client"]
