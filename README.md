# Node.js Express TypeORM API with Repository Pattern

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-lightgrey.svg)](https://expressjs.com/)
[![TypeORM](https://img.shields.io/badge/TypeORM-0.3.x-orange.svg)](https://typeorm.io/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg)](https://www.mysql.com/)
[![Docker](https://img.shields.io/badge/Docker-Compose-blue.svg)](https://www.docker.com/)

A production-ready RESTful API built with Node.js, Express, and TypeORM, featuring clean architecture with Repository Pattern, comprehensive pagination, JWT authentication, and Docker containerization.

## 🚀 Features

- **🏛️ Repository Pattern**: Clean architecture with separation of concerns
- **📄 Advanced Pagination**: Comprehensive pagination support across all endpoints
- **🔐 JWT Authentication**: Secure token-based authentication system
- **👥 Role-Based Access Control**: User roles and permissions management
- **🗄️ TypeORM Integration**: Type-safe database operations with entity relationships
- **🐳 Docker Ready**: Complete containerization with development and production configs
- **📊 Health Monitoring**: Built-in health checks and monitoring endpoints
- **🔄 Hot Reload**: Development environment with automatic code reloading
- **📚 Comprehensive API**: RESTful endpoints with proper error handling
- **🛡️ Security Best Practices**: Non-root containers, input validation, secure headers

## 📋 Table of Contents

- [Technologies](#technologies)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Docker Setup](#docker-setup)
- [API Documentation](#api-documentation)
- [Project Structure](#project-structure)
- [Repository Pattern](#repository-pattern)
- [Pagination](#pagination)
- [Authentication](#authentication)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)

## 🛠️ Technologies

- **Backend**: Node.js, Express.js
- **Database**: MySQL 8.0 with TypeORM
- **Authentication**: JWT (JSON Web Tokens)
- **Architecture**: Repository Pattern, Service Layer
- **Containerization**: Docker, Docker Compose
- **Development**: Hot reload, Health checks
- **Security**: bcrypt password hashing, CORS, input validation

## ⚡ Quick Start

### Using Docker (Recommended)

1. **Clone the repository**:

```bash
git clone <repository-url>
cd NodeExpressJsBaseSetupTypeORM
```

2. **Create environment file**:

```bash
# Create app/.env
cat > app/.env << EOF
DB_TYPE=mysql
DB_HOST=mysql
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=rootpassword
DB_DATABASE=nodeapp
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key_here_make_it_strong_and_long_123456789
PORT=3000
EOF
```

3. **Start with Docker**:

```bash
docker-compose up -d
```

4. **Access the application**:
   - **API**: http://localhost:3000
   - **Health Check**: http://localhost:3000/health
   - **Test Endpoint**: http://localhost:3000/test

## 💻 Local Installation

### Prerequisites

- Node.js (>=18.x)
- npm (>=8.x)
- MySQL (>=8.0)

### Setup Steps

1. **Clone and install dependencies**:

```bash
git clone <repository-url>
cd NodeExpressJsBaseSetupTypeORM
npm install
```

2. **Configure environment**:

```bash
# Create app/.env with your local database credentials
cp app/.env.example app/.env
# Edit app/.env with your database settings
```

3. **Setup database**:

```bash
# Create MySQL database
mysql -u root -p
CREATE DATABASE nodeapp;
```

4. **Start the application**:

```bash
npm start
```

## 🐳 Docker Setup

We provide a complete Docker setup with MySQL and development tools.

### Development Mode

```bash
# Start all services (app + MySQL)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Mode

```bash
# Start with production configuration
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

For detailed Docker instructions, see [DOCKER.md](DOCKER.md).

## 📚 API Documentation

### Base URL

```
http://localhost:3000/api
```

### Authentication Endpoints

| Method | Endpoint       | Description       | Auth Required |
| ------ | -------------- | ----------------- | ------------- |
| `POST` | `/auth/signup` | Register new user | ❌            |
| `POST` | `/auth/login`  | User login        | ❌            |

### Role Management

| Method   | Endpoint        | Description           | Pagination  |
| -------- | --------------- | --------------------- | ----------- |
| `GET`    | `/roles`        | Get all roles         | ✅ Optional |
| `GET`    | `/roles/active` | Get active roles only | ✅ Optional |
| `GET`    | `/roles/:id`    | Get role by ID        | ❌          |
| `POST`   | `/roles`        | Create new role       | ❌          |
| `PUT`    | `/roles/:id`    | Update role           | ❌          |
| `DELETE` | `/roles/:id`    | Delete role           | ❌          |

### Permission Management

| Method   | Endpoint              | Description                 | Pagination  |
| -------- | --------------------- | --------------------------- | ----------- |
| `GET`    | `/permissions`        | Get all permissions         | ✅ Optional |
| `GET`    | `/permissions/active` | Get active permissions only | ✅ Optional |
| `GET`    | `/permissions/:id`    | Get permission by ID        | ❌          |
| `POST`   | `/permissions`        | Create new permission       | ❌          |
| `PUT`    | `/permissions/:id`    | Update permission           | ❌          |
| `DELETE` | `/permissions/:id`    | Delete permission           | ❌          |

### Health & Status

| Method | Endpoint  | Description              |
| ------ | --------- | ------------------------ |
| `GET`  | `/health` | Application health check |
| `GET`  | `/test`   | Simple test endpoint     |

## 📄 Pagination

All list endpoints support optional pagination with comprehensive metadata.

### Usage

```bash
# Basic pagination
GET /api/roles?page=1&limit=10

# Without pagination (returns all)
GET /api/roles
```

### Response Format

```json
{
  "status": "success",
  "statusCode": 200,
  "message": "Roles fetched successfully",
  "data": {
    "data": [
      {
        "id": 1,
        "name": "Admin",
        "permissions": [...]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3,
      "hasNext": true,
      "hasPrev": false
    }
  }
}
```

## 🏗️ Project Structure

```
.
├── 📁 app/
│   ├── 📁 controllers/          # Route controllers
│   │   ├── auth.js
│   │   ├── role.js
│   │   └── permission.js
│   ├── 📁 repositories/         # Repository Pattern implementation
│   │   ├── base.repository.js   # Base repository with common operations
│   │   ├── user.repository.js
│   │   ├── role.repository.js
│   │   ├── permission.repository.js
│   │   └── index.js
│   ├── 📁 services/             # Business logic layer
│   │   ├── auth.js
│   │   ├── user.js
│   │   ├── role.js
│   │   └── permission.js
│   ├── 📁 models/               # TypeORM entities
│   │   ├── user.entity.js
│   │   ├── role.entity.js
│   │   ├── permission.entity.js
│   │   └── index.js
│   ├── 📁 routes/               # Express routes
│   │   ├── auth.js
│   │   ├── role.js
│   │   ├── permission.js
│   │   └── index.js
│   ├── 📁 auth/                 # Authentication middleware
│   ├── 📁 db/                   # Database configuration
│   ├── 📁 utils/                # Utility functions
│   ├── .env                     # Environment variables
│   └── app.js                   # Application entry point
├── 📄 Dockerfile               # Container definition
├── 📄 docker-compose.yml       # Development Docker setup
├── 📄 DOCKER.md               # Docker documentation
├── 📄 .dockerignore           # Docker ignore file
└── 📄 README.md               # This file
```

## 🏛️ Repository Pattern

Our application implements the Repository Pattern for clean separation of concerns:

### Base Repository

```javascript
// Common operations available to all repositories
-findById(id, relations) -
  findOne(options) -
  find(options) -
  findWithPagination(page, limit, options) -
  create(data) -
  update(id, updates) -
  delete id -
  softDelete(id);
```

### Specialized Repositories

Each entity has its own repository with domain-specific methods:

```javascript
// UserRepository
-findByEmail(email) -
  findActiveUserByEmail(email) -
  findUsersWithRoles() -
  emailExists(email) -
  // RoleRepository
  findWithPermissions(id) -
  findActiveRoles() -
  roleExists(name) -
  // PermissionRepository
  findByApi(api) -
  findActivePermissions() -
  permissionExists(name);
```

### Benefits

- **Separation of Concerns**: Data access separated from business logic
- **Testability**: Easy to mock repositories for unit testing
- **Reusability**: Common operations defined once
- **Maintainability**: Changes to data access logic in one place

## 🔐 Authentication

The API uses JWT-based authentication with role-based access control.

### User Registration

```bash
curl -X POST http://localhost:3000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "userName": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "password": "securepassword"
  }'
```

### User Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "securepassword"
  }'
```

## 🌍 Environment Variables

### Required Variables

```bash
# Database Configuration
DB_TYPE=mysql
DB_HOST=mysql                    # 'mysql' for Docker, 'localhost' for local
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=rootpassword
DB_DATABASE=nodeapp

# Application Configuration
NODE_ENV=development             # development | production
JWT_SECRET=your_secure_jwt_secret_here
PORT=3000
```

### Docker Variables

```bash
# MySQL Container Configuration
MYSQL_ROOT_PASSWORD=rootpassword
MYSQL_DATABASE=nodeapp
MYSQL_USER=appuser
MYSQL_PASSWORD=apppassword
```

## 🧪 API Testing Examples

### Test with curl

```bash
# Health check
curl http://localhost:3000/health

# Get paginated roles
curl "http://localhost:3000/api/roles?page=1&limit=5"

# Get active permissions
curl http://localhost:3000/api/permissions/active

# Create a new role (requires authentication)
curl -X POST http://localhost:3000/api/roles \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Editor",
    "permissions": [1, 2, 3]
  }'
```

### Test with Postman

1. Import the API endpoints into Postman
2. Set the base URL: `http://localhost:3000/api`
3. For protected routes, add JWT token in Authorization header

## 🤝 Contributing

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines

- Follow the Repository Pattern for data access
- Add pagination support for list endpoints
- Include proper error handling
- Write meaningful commit messages
- Update documentation for new features
- Add health checks for new services

## 📝 License

This project is licensed under the ISC License.

## 🔧 Troubleshooting

### Common Issues

1. **Database Connection Error**:

   - Check if MySQL is running
   - Verify environment variables in `app/.env`
   - For Docker: `docker-compose logs mysql`

2. **Port Already in Use**:

   - Change port in `docker-compose.yml` or `.env`
   - Kill existing process: `lsof -ti:3000 | xargs kill`

3. **Permission Denied**:
   - Check file permissions
   - Ensure Docker has proper permissions

For more troubleshooting, see [DOCKER.md](DOCKER.md).

## 📞 Support

For support, email dinkysaim2@gmail.com or create an issue in the repository.

---

**Built with ❤️ using Node.js, Express, TypeORM, and Docker**
