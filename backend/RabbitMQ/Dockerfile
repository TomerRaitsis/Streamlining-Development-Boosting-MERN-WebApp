# Use a Node.js base image
FROM node:16.20.2-buster-slim

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

EXPOSE 3000

# Set the command to run the consumer script
# Dockerfile
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json for dependency installation
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port for Express
EXPOSE 3000

# Add a command that waits 40 seconds before starting the Node.js script
CMD ["node", "./backend/RabbitMQ/consumer_server.js"]
