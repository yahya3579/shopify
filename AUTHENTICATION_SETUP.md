# Shopify Authentication System

A complete authentication system built with Next.js, MongoDB, and modern UI components.

## Features

- **User Registration**: Create new accounts with email, first name, last name, and password
- **User Login**: Secure authentication with email and password
- **Password Security**: Bcrypt hashing with salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Toast Notifications**: Real-time feedback for user actions
- **Admin Dashboard**: Protected dashboard for authenticated users
- **Responsive Design**: Beautiful UI with Framer Motion animations
- **Form Validation**: Client and server-side validation

## Setup Instructions

### 1. Install Dependencies

```bash
cd frontend
npm install mongodb bcryptjs jsonwebtoken
```

### 2. MongoDB Setup

1. Install MongoDB locally or use MongoDB Atlas
2. Create a database named `shopify-auth`
3. The system will automatically create a `users` collection

### 3. Environment Variables

Create a `.env.local` file in the frontend directory:

```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/shopify-auth

# JWT Secret (Change this in production)
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Next.js Configuration
NODE_ENV=development
```

### 4. Run the Application

```bash
cd frontend
npm run dev
```

## API Endpoints

### POST `/api/auth/signup`
Creates a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "password": "password123",
  "confirmPassword": "password123"
}
```

**Response:**
```json
{
  "message": "User created successfully",
  "user": {
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "isActive": true
  },
  "token": "jwt-token-here"
}
```

### POST `/api/auth/signin`
Authenticates a user.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "user": {
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "user"
  },
  "token": "jwt-token-here"
}
```

## Database Schema

### Users Collection

```javascript
{
  _id: ObjectId,
  email: String (unique, lowercase),
  firstName: String,
  lastName: String,
  password: String (hashed),
  role: String (enum: ['user', 'admin'], default: 'user'),
  createdAt: Date,
  updatedAt: Date,
  isActive: Boolean (default: true)
}
```

## Authentication Flow

1. **Signup**: User fills out registration form → API validates data → Password hashed → User stored in MongoDB → JWT token generated → User redirected to dashboard
2. **Signin**: User enters credentials → API validates user exists → Password verified → JWT token generated → User redirected to dashboard
3. **Dashboard Access**: Token checked → User data retrieved → Dashboard displayed
4. **Logout**: Token removed from localStorage → User redirected to login page

## Error Handling

- **404**: User not found (signin) - Shows toast: "No account found with this email. Please create an account first."
- **409**: User already exists (signup) - Shows toast: "An account with this email already exists. Please try logging in instead."
- **401**: Invalid password - Shows toast: "Invalid password. Please try again."
- **400**: Validation errors - Shows specific error messages
- **500**: Server errors - Shows generic error message

## Security Features

- Password hashing with bcrypt (12 salt rounds)
- JWT tokens with expiration (7 days)
- Input validation and sanitization
- Email format validation
- Password confirmation matching
- Secure token storage in localStorage

## Pages

- `/` - Login page
- `/signup` - Registration page
- `/adminDashboard` - Protected dashboard (requires authentication)

## Technologies Used

- **Frontend**: Next.js 16, React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Authentication**: JWT, bcryptjs
- **UI Components**: Radix UI, Lucide React icons
- **Animations**: Framer Motion
- **Notifications**: Sonner (toast notifications)
- **Form Handling**: React hooks

## Development Notes

- All API routes are in `/api/auth/` directory
- Database connection is handled in `/lib/mongodb.js`
- Authentication utilities are in `/lib/auth.js`
- Toast notifications are configured in the root layout
- Protected routes check for JWT tokens in localStorage
