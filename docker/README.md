# Docker Configuration

This directory contains all Docker-related configuration files for the Todo Backend application.

## Files

- **Dockerfile** - Multi-stage Docker build for production
- **docker-compose.yaml** - Docker Compose configuration for local development
- **docker-compose.test.yaml** - Docker Compose for test database
- **docker-compose.observability.yml** - Docker Compose for Prometheus and Grafana

## Usage

### Build Docker Image

```bash
# From project root
docker build -f docker/Dockerfile -t todo-backend:latest .
```

### Run with Docker Compose

```bash
# From project root
docker-compose -f docker/docker-compose.yaml up -d

# View logs
docker-compose -f docker/docker-compose.yaml logs -f backend

# Stop services
docker-compose -f docker/docker-compose.yaml down
```

### Run Test Database

```bash
docker-compose -f docker/docker-compose.test.yaml up -d
```

### Run Observability Stack

```bash
docker-compose -f docker/docker-compose.observability.yml up -d
```

Access:

- Prometheus: http://localhost:9090
- Grafana: http://localhost:3001 (default credentials: admin/admin)

## Dockerfile Details

The Dockerfile uses a multi-stage build:

1. **Base** - Node.js 20 Alpine base image
2. **Deps** - Install dependencies and generate Prisma client
3. **Build** - Compile TypeScript to JavaScript
4. **Runner** - Production image with only necessary files

## Notes

- All docker-compose files use relative paths from the project root
- Environment variables should be set in `.env` file in the project root
- The observability stack uses port 3001 for Grafana to avoid conflict with the backend (port 3000)
