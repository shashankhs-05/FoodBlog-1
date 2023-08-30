# Use an official Node.js runtime as a parent image
FROM node:14
# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy all the application files to the working directory
COPY . /app

# Expose any required ports
EXPOSE 3000 
# Define the command to run your Node.js application
CMD ["node", "BMSCE_FoodBlog/src/app1.js"]
