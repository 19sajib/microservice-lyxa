# Microservices Project - Auth & Product Services

Two NestJS microservices communicating via RabbitMQ for authentication and product management.

## 📁 Project Structure

```
microservices-project/
├── auth-service/
│   ├── src/
│   ├── package.json
│   └── Dockerfile
│   └── docker-compose.yml
├── product-service/
│   ├── src/
│   ├── package.json
│   └── Dockerfile
│   └── docker-compose.yml
└── README.md
```

## 🐳 Docker Setup (Recommended)

### Prerequisites
- Docker and Docker Compose installed

### Run with Docker
```bash
# Clone the repo from github
git clone https://github.com/19sajib/microservice-lyxa.git

# Navigate to project folder (where docker-compose.yml is located)
cd microservice-lyxa
# then
cd auth-service or cd product-service

# Start the services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Services will be available at:
- **Auth Service**: http://localhost:3003
- **Auth Service Swagger Docs**: http://localhost:3003/api/docs
- **Product Service**: http://localhost:3001
- **Product Service Swagger Docs**: http://localhost:3001/api/docs
- **RabbitMQ Management**: http://localhost:15672 (user/password)
- **MongoDB**: mongodb://localhost:27017

## 💻 Local Development Setup

### 1. Start Infrastructure (MongoDB + RabbitMQ)
```bash
# In project root
docker-compose up -d mongodb rabbitmq
```

### 2. Run Auth Service Locally
```bash
cd auth-service

# Install dependencies
pnpm install

# Set environment variables using env.example file

# Start service
pnpm run start:dev
```

### 3. Run Product Service Locally (New Terminal)
```bash
cd product-service

# Install dependencies
pnpm install

# Set environment variables using env.example file

# Start service
pnpm run start:dev
```