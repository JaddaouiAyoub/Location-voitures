# Backend - Car Rental API

Node.js/Express backend for the car rental management system.

## Features

- RESTful API architecture
- JWT authentication with refresh tokens
- MySQL database with connection pooling
- Input validation with express-validator
- Centralized error handling
- PDF invoice generation
- Role-based access control

## Scripts

```bash
npm start       # Start production server
npm run dev     # Start development server with nodemon
npm run test:db # Test database connection
```

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=
DB_NAME=car_rental_db

JWT_SECRET=car_rental_secret_key_2026_change_in_production
JWT_REFRESH_SECRET=car_rental_refresh_secret_key_2026_change_in_production
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d

FRONTEND_URL=http://localhost:5173
```

## Database Setup

```bash
# Create database
mysql -u root -p -e "CREATE DATABASE car_rental_db;"

# Import schema
mysql -u root -p car_rental_db < ../database/schema.sql

# Import seed data
mysql -u root -p car_rental_db < ../database/seed.sql
```

## API Documentation

### Response Format

**Success Response:**
```json
{
  "success": true,
  "message": "Success message",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error message",
  "errors": [ ... ]
}
```

### Authentication

All protected endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <access_token>
```

### Error Codes

- `400` - Bad Request (validation errors)
- `401` - Unauthorized (invalid/expired token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `409` - Conflict (duplicate entry)
- `500` - Internal Server Error

## Project Structure

```
src/
├── config/
│   ├── database.js      # MySQL connection pool
│   └── jwt.js           # JWT configuration
├── controllers/
│   ├── auth.controller.js
│   ├── car.controller.js
│   ├── rental.controller.js
│   ├── invoice.controller.js
│   └── dashboard.controller.js
├── middlewares/
│   ├── auth.middleware.js        # JWT verification
│   ├── error.middleware.js       # Error handling
│   └── validation.middleware.js  # Input validation
├── models/
│   ├── user.model.js
│   ├── car.model.js
│   └── rental.model.js
├── routes/
│   ├── auth.routes.js
│   ├── car.routes.js
│   ├── rental.routes.js
│   ├── invoice.routes.js
│   └── dashboard.routes.js
├── services/
│   ├── invoice.service.js    # PDF generation
│   └── dashboard.service.js  # Statistics
├── utils/
│   └── response.js          # Response helpers
├── app.js                   # Express app setup
└── server.js                # Server entry point
```

## Dependencies

- **express** - Web framework
- **mysql2** - MySQL client with promises
- **jsonwebtoken** - JWT implementation
- **bcrypt** - Password hashing
- **dotenv** - Environment variables
- **cors** - CORS middleware
- **express-validator** - Input validation
- **pdfkit** - PDF generation

## Development

The backend uses nodemon for automatic server restart during development:

```bash
npm run dev
```

Server will restart automatically when you make changes to the code.
