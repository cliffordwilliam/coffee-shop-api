# Start from official Node.js 20 image
FROM node:20

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
EXPOSE 3000

# Run the development server
CMD ["npm", "run", "dev"]
