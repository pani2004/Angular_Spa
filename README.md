# SPA Authentication Application

Full-stack Single Page Application with Angular frontend, Node.js/Express backend, DynamoDB database, and JWT authentication.

## Project Structure

```
SPA/
├── backend/               # Node.js/Express API
│   ├── src/
│   │   ├── config/       # Configuration files
│   │   ├── controllers/  # Request handlers with business logic
│   │   ├── middleware/   # Auth, role, delay, validation middleware
│   │   ├── repositories/ # DynamoDB data access layer
│   │   ├── routes/       # API route definitions
│   │   ├── scripts/      # Database setup scripts
│   │   ├── services/     # JWT token service
│   │   └── utils/        # Helper functions
│   └── SPA-API.postman_collection.json
├── client/               # Angular 13 SPA
│   └── src/
│       └── app/
│           ├── components/     # UI components
│           ├── guards/         # Route guards
│           ├── interceptors/   # HTTP interceptors
│           ├── models/         # TypeScript interfaces
│           └── services/       # API services
└── docker-compose.yml    # DynamoDB Local setup
```

## Features

### Backend
- **ES6 Modules** - Modern JavaScript with import/export
- **JWT Authentication** - HTTP-only cookies for security
- **Role-Based Access Control** - Admin and User roles
- **DynamoDB Integration** - NoSQL database with AWS SDK v3
- **Async Processing Demo** - Configurable artificial delays
- **Security Middleware** - Helmet, CORS, rate limiting
- **Input Validation** - Joi schema validation

### Frontend
- **Angular 13+** - Modern reactive SPA
- **Angular Material** - Professional UI components
- **Reactive Forms** - Form validation and management
- **HTTP Interceptor** - Automatic token refresh
- **Route Guards** - Protected routes with role checks
- **Loading States** - Async data loading demonstrations

## Getting Started

### Prerequisites
- Node.js 16+ and npm
- Docker and Docker Compose
- Angular CLI 13+

### Backend Setup

1. **Start DynamoDB Local:**
```bash
docker-compose up -d
```

2. **Install dependencies:**
```bash
cd backend
npm install
```

3. **Create tables:**
```bash
npm run create-tables
```

4. **Seed test users:**
```bash
npm run seed
```

5. **Start backend server:**
```bash
npm run dev
```

Backend runs on http://localhost:3000

### Frontend Setup

1. **Install dependencies:**
```bash
cd client
npm install
```

2. **Start dev server:**
```bash
ng serve
```

Frontend runs on http://localhost:4200

## Test Credentials

### Admin User
- **Email:** admin@test.com
- **Password:** Password123!
- **Role:** ADMIN
- **Access:** All features + user management

### Regular User
- **Email:** user@test.com
- **Password:** Password123!
- **Role:** USER
- **Access:** Dashboard with limited records

## API Testing

Import the Postman collection from `backend/SPA-API.postman_collection.json` to test all endpoints:

- Health check
- Authentication (register, login, logout, refresh)
- User profile and records (with delay options)
- Admin user management (CRUD operations)

## Architecture

### Backend Flow
```
Request → Routes → Middleware (auth/role/validation) → Controller → Repository → DynamoDB
```

### Frontend Flow
```
Component → Service → HTTP Interceptor → Backend API
```

### Authentication Flow
1. User logs in with credentials + role
2. Backend validates and generates JWT tokens
3. Access token (15 min) + Refresh token (7 days) stored in HTTP-only cookies
4. Frontend interceptor handles token refresh automatically
5. Protected routes use AuthGuard to check authentication

## Key Features Demo

### Async Processing
The dashboard allows you to select artificial delays (0ms - 5s) to demonstrate:
- Loading spinners
- Async data fetching
- User experience during network latency

### Role-Based Data
- **Admin:** Sees 20 records + user management access
- **User:** Sees 5 records + dashboard only

### Security
- HTTP-only cookies (XSS protection)
- CORS with credentials
- Helmet security headers
- Rate limiting on login (5 attempts per 15 min)
- Password hashing with bcrypt (10 salt rounds)

## Tech Stack

### Backend
- Node.js with Express 4.18
- AWS SDK v3 for DynamoDB
- JWT for authentication
- Bcrypt for password hashing
- Joi for validation
- Helmet, CORS for security

### Frontend
- Angular 13
- Angular Material
- RxJS for reactive programming
- TypeScript

### Database
- DynamoDB Local (development)
- Tables: SPA-Users, SPA-RefreshTokens

## Development

### Backend Scripts
- `npm run dev` - Start with nodemon
- `npm run create-tables` - Create DynamoDB tables
- `npm run seed` - Seed test users

### Frontend Scripts
- `ng serve` - Development server
- `ng build` - Production build
- `ng test` - Run tests


