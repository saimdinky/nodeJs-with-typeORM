# Docker Setup Guide

This guide will help you run the Node.js Express TypeORM application using Docker and Docker Compose.

## Prerequisites

- Docker
- Docker Compose

## Quick Start

1. **Create environment file** (create `app/.env`):

```bash
# Database Configuration
DB_TYPE=mysql
DB_HOST=mysql
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=rootpassword
DB_DATABASE=nodeapp

# Application Configuration
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here_make_it_strong_and_long_123456789
PORT=3000
```

2. **Start the application**:

```bash
docker-compose up -d
```

3. **Access the application**:
   - **API**: http://localhost:3000
   - **Health Check**: http://localhost:3000/health
   - **phpMyAdmin**: http://localhost:8080 (root / rootpassword)

## Services

### Application (app)

- **Port**: 3000
- **Environment**: Development with hot reload
- **Health Check**: `/health` endpoint

### MySQL Database (mysql)

- **Port**: 3306
- **Database**: nodeapp
- **Root Password**: rootpassword
- **Persistent Storage**: Docker volume `mysql_data`

### phpMyAdmin (phpmyadmin)

- **Port**: 8080
- **Username**: root
- **Password**: rootpassword

## Docker Commands

### Development

```bash
# Start all services
docker-compose up

# Start in detached mode
docker-compose up -d

# View logs
docker-compose logs -f

# View logs for specific service
docker-compose logs -f app

# Stop all services
docker-compose down

# Restart a service
docker-compose restart app

# Rebuild and start
docker-compose up --build
```

### Production

```bash
# Start with production overrides
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d

# Build for production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml build
```

### Database Management

```bash
# Access MySQL container
docker-compose exec mysql mysql -uroot -prootpassword nodeapp

# Backup database
docker-compose exec mysql mysqldump -uroot -prootpassword nodeapp > backup.sql

# Restore database
docker-compose exec -T mysql mysql -uroot -prootpassword nodeapp < backup.sql

# Reset database (WARNING: This will delete all data)
docker-compose down -v
docker-compose up -d
```

### Application Management

```bash
# Access app container shell
docker-compose exec app sh

# Install new npm packages
docker-compose exec app npm install package-name

# Run database migrations (if you have them)
docker-compose exec app npm run migration:run

# View application logs
docker-compose logs -f app
```

## Troubleshooting

### Database Connection Issues

1. Ensure MySQL is healthy:

```bash
docker-compose ps
```

2. Check MySQL logs:

```bash
docker-compose logs mysql
```

3. Verify environment variables:

```bash
docker-compose exec app env | grep DB_
```

### Application Won't Start

1. Check app logs:

```bash
docker-compose logs app
```

2. Verify health check:

```bash
curl http://localhost:3000/health
```

3. Rebuild the container:

```bash
docker-compose build app
docker-compose up -d app
```

### Port Conflicts

If ports are already in use, modify the port mappings in `docker-compose.yml`:

```yaml
services:
  app:
    ports:
      - '3001:3000' # Use port 3001 instead of 3000
  mysql:
    ports:
      - '3307:3306' # Use port 3307 instead of 3306
  phpmyadmin:
    ports:
      - '8081:80' # Use port 8081 instead of 8080
```

## API Usage Examples

### Test Endpoints

```bash
# Health check
curl http://localhost:3000/health

# Test endpoint
curl http://localhost:3000/test

# Get all roles (with pagination)
curl "http://localhost:3000/api/roles?page=1&limit=10"

# Get all permissions (with pagination)
curl "http://localhost:3000/api/permissions?page=1&limit=5"

# Get active roles only
curl http://localhost:3000/api/roles/active

# Get active permissions only
curl http://localhost:3000/api/permissions/active
```

## Environment Variables

### Required Variables

```bash
DB_TYPE=mysql
DB_HOST=mysql           # Use 'mysql' for Docker, 'localhost' for local development
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=rootpassword
DB_DATABASE=nodeapp
JWT_SECRET=your_secure_jwt_secret_here
NODE_ENV=development    # or 'production'
PORT=3000
```

### Optional Variables

```bash
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=nodeapp
MYSQL_USER=appuser
MYSQL_PASSWORD=apppassword
```

## Production Deployment

For production deployment:

1. Create a production `.env` file with secure passwords
2. Use the production docker-compose override:

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

3. phpMyAdmin will be disabled in production mode
4. Source code hot-reload will be disabled

## Security Notes

- Change default passwords in production
- Use environment variables for sensitive data
- Consider using Docker secrets for production
- phpMyAdmin is only enabled in development mode
- The application runs as a non-root user inside the container

## File Structure

```
.
├── Dockerfile                 # App container definition
├── docker-compose.yml         # Development configuration
├── docker-compose.prod.yml    # Production overrides
├── .dockerignore             # Files to exclude from build
├── healthcheck.js            # Health check script
└── app/
    ├── .env                  # Environment variables (create this)
    └── ...                   # Application code
```
