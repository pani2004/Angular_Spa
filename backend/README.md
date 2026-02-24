# SPA Backend - Node.js + Express + DynamoDB + JWT

A robust Node.js/Express backend with JWT authentication using httpOnly cookies, AWS DynamoDB for data storage, and role-based access control.

## Architecture

### Modular Structure
```
backend/
├── src/
│   ├── config/          # Configuration files (DynamoDB, JWT, environment)
│   ├── middleware/      # Express middleware (auth, role, delay, validation, error)
│   ├── repositories/    # Data access layer (DynamoDB operations)
│   ├── services/        # Business logic layer
│   ├── controllers/     # HTTP request handlers
│   ├── routes/          # API route definitions
│   ├── utils/           # Utility functions (password, validators, response)
│   ├── scripts/         # Database initialization and seeding
│   └── app.js           # Express application setup
├── server.js            # Entry point
├── package.json
└── .env
```

### Technology Stack
- **Runtime**: Node.js 14+
- **Framework**: Express.js 4.18+
- **Database**: AWS DynamoDB (Local for development)
- **Authentication**: JWT with httpOnly cookies
- **Password Hashing**: bcrypt
- **Validation**: Joi
- **Security**: Helmet, CORS, express-rate-limit

## Prerequisites

1. **Node.js** (v14 or higher)
2. **Docker** (for DynamoDB Local)
3. **npm** or **yarn**

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Start DynamoDB Local

From the project root directory:

```bash
docker-compose up -d
```

This starts DynamoDB Local on `http://localhost:8000`

Verify it's running:
```bash
docker ps
```

### 3. Create Database Tables

```bash
npm run create-tables
```

This creates:
- `SPA-Users` table (with email GSI)
- `SPA-RefreshTokens` table (with TTL)

### 4. Seed Initial Data

```bash
npm run seed
```

This creates two test users:

**Admin User:**
- Email: `admin@test.com`
- Password: `Password123!`
- Role: `ADMIN`

**Regular User:**
- Email: `user@test.com`
- Password: `Password123!`
- Role: `USER`

### 5. Start Development Server

```bash
npm run dev
```

Server will start on `http://localhost:3000`

## API Endpoints

### Authentication Routes (`/api/auth`)

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "newuser@test.com",
  "password": "Password123!",
  "firstName": "John",
  "lastName": "Doe",
  "role": "USER"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "admin@test.com",
  "password": "Password123!",
  "role": "ADMIN"
}
```

**Response**: Sets httpOnly cookies (`accessToken`, `refreshToken`)

#### Get Current User
```http
GET /api/auth/me
Cookie: accessToken=<jwt>
```

#### Refresh Token
```http
POST /api/auth/refresh
Cookie: refreshToken=<jwt>
```

#### Logout
```http
POST /api/auth/logout
Cookie: accessToken=<jwt>; refreshToken=<jwt>
```

### User Routes (`/api/users`)

#### Get User Profile
```http
GET /api/users/profile
Cookie: accessToken=<jwt>
```

#### Get User Records (with delay demo)
```http
GET /api/users/records?delay=2000
Cookie: accessToken=<jwt>
```

Query Parameters:
- `delay` (optional): Milliseconds to delay response (0-5000)

### Admin Routes (`/api/users/admin`)

#### Get All Users (Admin Only)
```http
GET /api/users/admin/users
Cookie: accessToken=<jwt>
```

#### Update User (Admin Only)
```http
PUT /api/users/admin/users/:userId
Content-Type: application/json
Cookie: accessToken=<jwt>

{
  "firstName": "Updated",
  "role": "ADMIN",
  "isActive": false
}
```

#### Delete User (Admin Only)
```http
DELETE /api/users/admin/users/:userId
Cookie: accessToken=<jwt>
```

### Health Check
```http
GET /api/health
```

## Environment Variables

Copy `.env.example` to `.env` and configure:

```env
NODE_ENV=development
PORT=3000

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_ACCESS_EXPIRATION=15m
JWT_REFRESH_EXPIRATION=7d

# AWS DynamoDB
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=local
AWS_SECRET_ACCESS_KEY=local
DYNAMODB_ENDPOINT=http://localhost:8000

# Tables
USERS_TABLE=SPA-Users
REFRESH_TOKENS_TABLE=SPA-RefreshTokens

# CORS
FRONTEND_URL=http://localhost:4200

# Cookies
COOKIE_SECRET=your-cookie-secret
```

## Features Demonstrated

### 1. Modular Architecture
- **Controllers**: Handle HTTP requests/responses
- **Services**: Contain business logic
- **Repositories**: Abstract database operations
- **Middleware**: Reusable request processing

### 2. JWT Authentication with httpOnly Cookies
- Access tokens (15 min expiration)
- Refresh tokens (7 days expiration)
- Secure cookie storage (prevents XSS attacks)
- Automatic token refresh flow

### 3. Role-Based Access Control (RBAC)
- Two roles: `ADMIN` and `USER`
- Middleware-based role checking
- Route-level protection
- Different data access based on role

### 4. Async Processing Demo
- `delay` middleware accepts query parameter
- Demonstrates async behavior with artificial delays
- Useful for testing loading states in frontend

### 5. Security Best Practices
- Password hashing with bcrypt (10 rounds)
- httpOnly cookies (XSS protection)
- CSRF protection ready
- Helmet.js security headers
- Rate limiting on login endpoint (5 attempts per 15 min)
- Input validation with Joi
- CORS configured for specific origin

### 6. Error Handling
- Centralized error middleware
- Standardized error responses
- Specific handling for JWT, validation, DynamoDB errors

### 7. DynamoDB Integration
- AWS SDK v3 (modular imports)
- Document Client for simplified operations
- GSI for email lookups
- TTL for automatic token cleanup
- Local development setup

## Testing with Postman/Insomnia

1. **Import the collection** (create one with above endpoints)
2. **Login** with test credentials
3. **Cookies will be set automatically**
4. **Make authenticated requests** (cookies sent automatically)
5. **Test delay** with `?delay=2000` query param

## Migration to AWS DynamoDB

To use real AWS DynamoDB instead of local:

1. Update `.env`:
```env
DYNAMODB_ENDPOINT=  # Remove or leave empty
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=<your-access-key>
AWS_SECRET_ACCESS_KEY=<your-secret-key>
```

2. Or use IAM roles (recommended for EC2/Lambda)

3. Run table creation script:
```bash
npm run create-tables
```

4. Update table names in `.env` if needed

## Troubleshooting

### DynamoDB Local not connecting
```bash
# Check if container is running
docker ps

# Restart container
docker-compose restart

# View logs
docker-compose logs
```

### Tables already exist error
```bash
# List tables (requires AWS CLI)
aws dynamodb list-tables --endpoint-url http://localhost:8000

# Delete and recreate if needed
```

### Port 3000 already in use
```bash
# Change PORT in .env file
PORT=3001
```

### CORS errors
Ensure `FRONTEND_URL` in `.env` matches your Angular dev server URL

## NPM Scripts

```bash
npm start          
npm run dev       
npm run create-tables  # Create DynamoDB tables
npm run seed       # Seed initial users
```

## Project Highlights

✅ **Clean Architecture**: Separation of concerns (routes → controllers → services → repositories)  
✅ **Security First**: JWT in httpOnly cookies, bcrypt, rate limiting, Helmet  
✅ **Async Demo**: Configurable API delays for testing  
✅ **Role-Based Access**: Admin vs User permissions at multiple layers  
✅ **Production Ready**: Error handling, validation, logging  
✅ **Local Development**: DynamoDB Local with Docker  
✅ **Cloud Ready**: Easy migration to AWS DynamoDB  

## License

ISC
