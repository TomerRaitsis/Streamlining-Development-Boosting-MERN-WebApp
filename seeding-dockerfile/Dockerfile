# Use official Node.js image as base
FROM node:16.20.2-buster-slim

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Set the command to run your application
CMD [ "npm", "run", "data:import" ]