# Frontend - Car Rental UI

React + Vite frontend for the car rental management system.

## Features

- Modern React 18 with hooks
- Vite for fast development and building
- Tailwind CSS for styling
- React Router for navigation
- Axios for API calls with interceptors
- Leaflet for interactive maps
- Chart.js for data visualization
- React Hot Toast for notifications

## Scripts

```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run preview # Preview production build
```

## Environment Variables

Create a `.env` file:

```env
VITE_API_URL=http://localhost:5000/api
```

## Project Structure

```
src/
├── api/
│   ├── axios.js          # Axios instance with interceptors
│   ├── auth.api.js       # Authentication API
│   ├── car.api.js        # Car API
│   ├── rental.api.js     # Rental API
│   └── dashboard.api.js  # Dashboard API
├── components/
│   ├── ProtectedRoute.jsx  # Route protection
│   ├── Loader.jsx          # Loading spinner
│   └── Modal.jsx           # Modal dialog
├── context/
│   └── AuthContext.jsx   # Authentication context
├── layouts/
│   └── MainLayout.jsx    # Main app layout
├── pages/
│   ├── Login.jsx         # Login page
│   ├── Register.jsx      # Registration page
│   ├── Cars.jsx          # Car listing
│   ├── CarMap.jsx        # Interactive map
│   ├── Rentals.jsx       # Rental history
│   ├── Dashboard.jsx     # Admin dashboard
│   └── Profile.jsx       # User profile
├── App.jsx               # Main app component
├── main.jsx              # Entry point
└── index.css             # Global styles
```

## Styling

The application uses Tailwind CSS with a custom configuration:

- **Primary Color**: Blue (#3b82f6)
- **Font**: Inter (Google Fonts)
- **Responsive**: Mobile-first approach
- **Animations**: Smooth transitions and hover effects

### Custom CSS Features

- Custom scrollbar styling
- Glassmorphism effects
- Card hover animations
- Gradient text
- Fade-in animations

## Components

### ProtectedRoute
Wrapper component for protected routes with role-based access control.

```jsx
<ProtectedRoute requireRole={['ADMIN']}>
  <Dashboard />
</ProtectedRoute>
```

### AuthContext
Global authentication state management with hooks:

```jsx
const { user, login, logout, isAdmin, canManageCars } = useAuth();
```

### Modal
Reusable modal component with backdrop and animations:

```jsx
<Modal isOpen={isOpen} onClose={handleClose} title="Title">
  {/* Content */}
</Modal>
```

## Pages

### Login & Register
- Form validation
- Error handling
- Demo credentials display

### Cars
- Grid layout with car cards
- Rental booking modal
- Status badges
- Unsplash images

### Map
- Leaflet integration
- GPS markers
- Car info popups
- Auto-refresh (30s)

### Rentals
- Table view
- Invoice download
- Status filtering
- Date formatting

### Dashboard (Admin)
- Statistics cards
- Chart.js charts
- Recent activity
- Revenue tracking

### Profile
- Editable profile info
- Password change
- Role display

## Development

The frontend uses Vite's HMR (Hot Module Replacement) for instant updates:

```bash
npm run dev
```

Visit http://localhost:5173 to see the application.

## Building for Production

```bash
npm run build
```

This will create an optimized production build in the `dist/` directory.

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
