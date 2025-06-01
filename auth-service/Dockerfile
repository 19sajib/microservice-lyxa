FROM node:20-alpine AS development

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (or yarn.lock)
# to leverage Docker's layer caching for dependencies
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code
COPY . .

# Build the NestJS application
RUN npm run build

# --- Production Stage ---
FROM node:20-alpine AS production

WORKDIR /usr/src/app

# Copy only production dependencies from the development stage
COPY --from=development /usr/src/app/node_modules ./node_modules
# Copy the built application code from the development stage
COPY --from=development /usr/src/app/dist ./dist
# Copy package.json to run the start script
COPY --from=development /usr/src/app/package.json ./package.json

# Expose the port the NestJS application listens on
EXPOSE 3000

# Set the command to run the application
CMD ["node", "dist/main"]