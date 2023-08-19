# Use an official Node.js runtime as a parent image
FROM node:12

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install npm dependencies
RUN npm install

RUN npm install -g nodemon

# Copy the entire project directory into the container
COPY . .

# Assuming your index1.html is inside the "public" subdirectory
# You might need to adjust the path depending on your project structure
CMD ["npm", "start"]
