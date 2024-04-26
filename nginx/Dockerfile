# Use the official Nginx base image
FROM nginx

# Copy your custom Nginx configuration file to the container
COPY nginx.conf /etc/nginx/nginx.conf

# Expose the default Nginx port
EXPOSE 80

# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]