# Use the official Node.js 20.9.0 image as the base image
FROM node:20.9.0

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and package-lock.json (if available) to the working directory
COPY package*.json ./

# Install the dependencies
RUN npm install --legacy-peer-deps

# Copy the rest of the application code to the working directory
COPY . .

# Build the NestJS application
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Start the NestJS application
CMD ["npm", "run", "start:dev"]
