# Build-time args
ARG NODE_REQUIRED_MAJOR=20
ARG PORT=3000

# Start from official Node.js 20 image
FROM node:${NODE_REQUIRED_MAJOR}

# Set working directory
WORKDIR /app

# Copy package manifests
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your project
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Ensure the app listens on port 3000
EXPOSE ${PORT}

# Run the development server
CMD ["npm", "run", "dev"]
