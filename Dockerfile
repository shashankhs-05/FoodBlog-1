# Use an official Node.js runtime as a parent image
FROM node:12

# Create and set the working directory
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install http-server globally
RUN npm install -g http-server

# Copy your FrontEndDev directory to the container
COPY FrontEndDev/ /app/FrontEndDev

# Expose port 8080
EXPOSE 8000

# Start http-server to serve index1.html
CMD ["http-server", "/app/FrontEndDev", "-p", "8000"]
