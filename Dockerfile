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

# Expose port (if needed)
EXPOSE 5000

# Command to run the application
CMD ["npm", "start"]
