# Use a Node.js base image
FROM node:16.20.2-buster-slim

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application code
COPY backend/RabbitMQ/ .

EXPOSE 3000

CMD ["node", "./consumer_server.js"]
