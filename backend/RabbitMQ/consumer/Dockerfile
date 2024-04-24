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

# Set the command to run the consumer script
CMD ["node", "./backend/RabbitMQ/consumer/rabbitmq-consumer.js"]
