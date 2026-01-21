# 🚗 Car Rental Management System

A complete, production-ready car rental management application built with modern web technologies. Features include JWT authentication, role-based access control, interactive GPS maps, PDF invoice generation, and a comprehensive admin dashboard.

## ✨ Features

### 🔐 Authentication & Security
- JWT-based authentication with access and refresh tokens
- Password hashing with bcrypt
- Role-based access control (ADMIN, AGENT, CLIENT)
- Protected routes and API endpoints

### 🚘 Car Management
- Full CRUD operations for vehicles
- Advanced search and filtering (brand, price, status, availability)
- Real-time availability checking
- GPS location tracking with interactive maps
- Unsplash image integration

### 📍 Interactive Map
- Leaflet-powered interactive map
- Real-time GPS tracking of fleet
- Car markers with detailed popups
- Auto-refresh every 30 seconds

### 📅 Rental System
- Complete booking workflow
- Automatic price calculation
- Availability validation
- Rental history tracking
- Status management (Active, Completed, Cancelled)

### 🧾 Invoice Generation
- Professional PDF invoices with PDFKit
- Company branding and logo
- Detailed pricing breakdown with VAT (20%)
- Download and print functionality

### 📊 Admin Dashboard
- Real-time statistics and analytics
- Revenue tracking
- Car status distribution charts (Chart.js)
- Recent activity feed
- Fleet management overview

### 🎨 Modern UI/UX
- Responsive design (desktop, tablet, mobile)
- Tailwind CSS with custom theme
- Smooth animations and transitions
- Professional color palette (blue/gray/white)
- Custom scrollbar and hover effects

## 🛠️ Tech Stack

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MySQL** - Database
- **JWT** - Authentication
- **bcrypt** - Password hashing
- **PDFKit** - PDF generation
- **express-validator** - Input validation

### Frontend
- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **React Router** - Navigation
- **Axios** - HTTP client
- **Leaflet** - Interactive maps
- **Chart.js** - Data visualization
- **React Hot Toast** - Notifications
- **date-fns** - Date formatting

## 📋 Prerequisites

- **Node.js** 18+ and npm
- **MySQL** 8.0+
- Modern web browser

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd test4
```

### 2. Database Setup

```bash
# Login to MySQL
mysql -u root -p

# Create database
CREATE DATABASE car_rental_db;

# Import schema
mysql -u root -p car_rental_db < database/schema.sql

# Import seed data
mysql -u root -p car_rental_db < database/seed.sql
```

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
# Edit .env file with your MySQL credentials
# Default password is empty for root user

# Start backend server
npm run dev
```

Backend will run on **http://localhost:5000**

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies (already done if you used Vite's auto-install)
npm install

# Start development server
npm run dev
```

Frontend will run on **http://localhost:5173**

## 🔑 Default Credentials

| Role | Email | Password |
|------|-------|----------|
| **Admin** | admin@carrental.com | password123 |
| **Agent** | agent@carrental.com | password123 |
| **Client** | client@carrental.com | password123 |

## 🌍 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=car_rental_db

JWT_SECRET=your_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
JWT_EXPIRE=24h
JWT_REFRESH_EXPIRE=7d

FRONTEND_URL=http://localhost:5173
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:5000/api
```

## 📁 Project Structure

```
test4/
├── backend/
│   ├── src/
│   │   ├── config/         # Database & JWT configuration
│   │   ├── controllers/    # Request handlers
│   │   ├── middlewares/    # Auth, validation, error handling
│   │   ├── models/         # Database models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── utils/          # Helper functions
│   │   ├── app.js          # Express app setup
│   │   └── server.js       # Server entry point
│   ├── .env                # Environment variables
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── api/            # API integration
│   │   ├── components/     # Reusable components
│   │   ├── context/        # React context (Auth)
│   │   ├── layouts/        # Layout components
│   │   ├── pages/          # Page components
│   │   ├── App.jsx         # Main app component
│   │   ├── main.jsx        # Entry point
│   │   └── index.css       # Global styles
│   ├── .env                # Environment variables
│   └── package.json
└── database/
    ├── schema.sql          # Database schema
    └── seed.sql            # Mock data
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile
- `PUT /api/auth/password` - Change password

### Cars
- `GET /api/cars` - Get all cars (with filters)
- `GET /api/cars/:id` - Get car by ID
- `POST /api/cars` - Create car (ADMIN/AGENT)
- `PUT /api/cars/:id` - Update car (ADMIN/AGENT)
- `DELETE /api/cars/:id` - Delete car (ADMIN)
- `GET /api/cars/map/locations` - Get car GPS locations
- `POST /api/cars/:id/check-availability` - Check availability

### Rentals
- `POST /api/rentals` - Create rental
- `GET /api/rentals` - Get rentals
- `GET /api/rentals/:id` - Get rental by ID
- `PUT /api/rentals/:id/status` - Update rental status
- `GET /api/rentals/my/history` - Get user's rentals

### Invoices
- `GET /api/invoices/:rentalId` - Download PDF invoice

### Dashboard
- `GET /api/dashboard/stats` - Get statistics (ADMIN)

## 🎯 Usage

1. **Login** with one of the default accounts
2. **Browse Cars** on the Cars page
3. **View Map** to see car locations
4. **Rent a Car** by selecting dates
5. **View Rentals** and download invoices
6. **Admin Dashboard** (admin only) for statistics

## 🔒 Security Features

- JWT token-based authentication
- Automatic token refresh
- Password hashing with bcrypt (10 rounds)
- Input validation on all endpoints
- SQL injection protection
- CORS configuration
- Role-based access control

## 🎨 Design Features

- Modern gradient backgrounds
- Smooth hover animations
- Card-based layouts
- Responsive sidebar navigation
- Custom scrollbar styling
- Loading states and spinners
- Toast notifications
- Modal dialogs

## 📝 License

This project is for educational and demonstration purposes.

## 👥 Support

For issues or questions, please refer to the documentation or create an issue in the repository.

---

**Built with ❤️ using React, Node.js, and MySQL**
