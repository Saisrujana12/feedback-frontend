# Feedback System - Full Stack Application

A complete full-stack feedback management system built with Node.js/Express backend and React/Vite frontend. Features user authentication, Google OAuth integration, and role-based access control.

## Features

- **User Authentication**: Login/Signup with email/password or Google OAuth
- **Role-Based Access**: User and Admin roles with different permissions
- **Submit Feedback**: Authenticated users can submit feedback with ratings and categories
- **View Feedback**: Browse all submitted feedbacks with detailed information
- **Admin Dashboard**: Manage all feedback with statistics, category breakdown, and bulk actions
- **Modern UI**: Clean, responsive design with purple and dark blue color theme
- **REST API**: Complete REST API for all feedback and authentication operations
- **Form Validation**: Client-side and server-side validation
- **Status Tracking**: Mark feedback as pending or reviewed

## Tech Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - Database (MongoDB Atlas)
- **Mongoose** - ODM for MongoDB
- **Passport.js** - Authentication middleware
- **JWT** - JSON Web Tokens for session management
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management
- **Nodemon** - Development server with auto-reload

### Frontend
- **React** - UI library
- **React Router** - Client-side routing
- **Vite** - Build tool and dev server
- **Axios** - HTTP client
- **Pure CSS** - No external UI library

## Project Structure

```
feedback-system/
├── backend/
│   ├── models/
│   │   ├── Feedback.js          # Mongoose feedback model
│   │   └── User.js              # Mongoose user model
│   ├── routes/
│   │   ├── feedback.js          # Feedback API routes
│   │   └── auth.js              # Authentication routes
│   ├── .env                     # Environment variables
│   ├── server.js                # Express server setup
│   └── package.json             # Backend dependencies
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── FeedbackForm.jsx      # Submit feedback component
│   │   │   ├── FeedbackList.jsx      # View feedback component
│   │   │   ├── AdminDashboard.jsx    # Admin management component
│   │   │   ├── Login.jsx             # Login component
│   │   │   ├── Signup.jsx            # Signup component
│   │   │   └── AuthCallback.jsx      # Google OAuth callback
│   │   ├── App.jsx              # Main application component
│   │   ├── App.css              # Global styles
│   │   └── main.jsx             # React entry point
│   ├── index.html               # HTML template
│   └── package.json             # Frontend dependencies
│
└── README.md                    # This file
```

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager
- MongoDB Atlas account (for cloud database)
- Google Cloud Console account (for Google OAuth)

### Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set authorized redirect URIs:
   - `http://localhost:5000/api/auth/google/callback` (for development)
   - Your production URL + `/api/auth/google/callback`
6. Copy the Client ID and Client Secret

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd feedback-system/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Edit `.env` file and add your credentials:
   ```
   MONGO_URI=mongodb+srv://feedbackuser:feedback123@feedback-cluster.cwyuqh2.mongodb.net/feedbackdb?retryWrites=true&w=majority&appName=feedback-cluster
   PORT=5000
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   FRONTEND_URL=http://localhost:5173
   BACKEND_URL=http://localhost:5000
   ```

4. **Start the backend server**
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory** (in a new terminal)
   ```bash
   cd feedback-system/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173` (or the port shown in terminal)

4. **Build for production** (optional)
   ```bash
   npm run build
   ```

## Authentication

### User Roles
- **User**: Can submit and view feedback
- **Admin**: Can manage all feedback (view, update status, delete)

### Default Admin User
After setup, you can manually create an admin user in MongoDB or modify the User model to set the first registered user as admin.

### Google OAuth Flow
1. User clicks "Continue with Google"
2. Redirected to Google OAuth consent screen
3. After authorization, redirected back to `/auth/callback`
4. JWT token generated and user logged in

## API Endpoints

### Authentication Endpoints

#### POST /api/auth/register
Register a new user

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

#### POST /api/auth/login
Login user

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### GET /api/auth/google
Initiate Google OAuth login

#### GET /api/auth/google/callback
Google OAuth callback (handled by Passport)

#### GET /api/auth/profile
Get current user profile (requires authentication)

**Headers:**
```
Authorization: Bearer <jwt-token>
```

### Feedback Endpoints

#### GET /api/feedback
Get all feedback entries (public)

#### GET /api/feedback/:id
Get a single feedback by ID (public)

#### POST /api/feedback
Submit new feedback (requires authentication)

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "This is a great product!",
  "rating": 5,
  "category": "Compliment"
}
```

#### PUT /api/feedback/:id
Update feedback status (admin only)

**Headers:**
```
Authorization: Bearer <jwt-token>
```

**Request Body:**
```json
{
  "status": "reviewed"
}
```

#### DELETE /api/feedback/:id
Delete feedback (admin only)

**Headers:**
```
Authorization: Bearer <jwt-token>
```

## Usage

### Registration & Login

1. **Register**: Go to `/signup` and create an account
2. **Login**: Go to `/login` and sign in with email/password
3. **Google Login**: Click "Continue with Google" on login or signup pages

### Submitting Feedback

1. After logging in, click on "Submit Feedback" tab
2. Fill in the form:
   - **Name**: Your name
   - **Email**: Your email address
   - **Category**: Select from General, Suggestion, Bug Report, or Compliment
   - **Message**: Detailed feedback (minimum 10 characters)
   - **Rating**: Click stars to select 1-5 rating
3. Click "Submit Feedback" button
4. Success message will appear

### Viewing Feedback

1. Click on "View Feedback" tab
2. Browse all submitted feedbacks
3. Each card shows:
   - Submitter name and email
   - Category badge
   - Star rating
   - Status (Pending/Reviewed)
   - Submission date and time

### Admin Dashboard

1. Click on "Admin Dashboard" tab (admin users only)
2. View statistics:
   - Total feedback count
   - Average rating
   - Feedback breakdown by category
3. Manage feedback:
   - Mark as reviewed (✓ button)
   - Delete feedback (🗑️ button)
   - View full feedback details

## Environment Variables

### Backend `.env`
```
MONGO_URI=<your-mongodb-connection-string>
PORT=5000
JWT_SECRET=<your-secret-key>
GOOGLE_CLIENT_ID=<your-google-client-id>
GOOGLE_CLIENT_SECRET=<your-google-client-secret>
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:5000
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcryptjs for secure password storage
- **Role-Based Access Control**: Different permissions for users and admins
- **Input Validation**: Both client-side and server-side validation
- **CORS Protection**: Configured for specific frontend origin
- **OAuth Integration**: Secure Google OAuth 2.0 implementation

## Troubleshooting

### Backend won't start
- Check if MongoDB is connected
- Verify `.env` file has correct values
- Ensure port 5000 is available
- Check for syntax errors in server files

### Frontend won't connect to backend
- Ensure backend is running on `http://localhost:5000`
- Check CORS settings in `server.js`
- Verify API URL in axios calls

### Google OAuth not working
- Check Google Cloud Console credentials
- Verify redirect URIs match exactly
- Ensure OAuth consent screen is configured
- Check browser console for errors

### Authentication issues
- Verify JWT_SECRET is set
- Check token expiration (7 days)
- Ensure localStorage has valid token
- Check user roles for admin access

## Future Enhancements

- Email verification for new accounts
- Password reset functionality
- User profile management
- Advanced filtering and search
- Feedback analytics and charts
- Real-time notifications using WebSockets
- Pagination for large datasets
- File attachments support
- Multi-language support
- Dark mode toggle
- Social media sharing
- Feedback voting system

## License

ISC

## Support

For issues or questions:
1. Check the troubleshooting section
2. Verify all dependencies are installed
3. Ensure MongoDB connection is working
4. Check browser console and terminal for error messages
5. Verify Google OAuth credentials are correct

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager
- MongoDB Atlas account (for cloud database) or local MongoDB

### Backend Setup

1. **Navigate to backend directory**
   ```bash
   cd feedback-system/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   - Edit `.env` file and add your MongoDB connection string:
   ```
   MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/feedback_db?retryWrites=true&w=majority
   PORT=5000
   ```

4. **Start the backend server**
   ```bash
   npm run dev
   ```
   The server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory** (in a new terminal)
   ```bash
   cd feedback-system/frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   The frontend will run on `http://localhost:5173` (or the port shown in terminal)

4. **Build for production** (optional)
   ```bash
   npm run build
   ```

## MongoDB Setup

### Option 1: MongoDB Atlas (Cloud)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string with your credentials
5. Update the `.env` file in the backend with your connection string

### Option 2: Local MongoDB

1. Install MongoDB locally on your machine
2. Use this connection string in `.env`:
   ```
   MONGO_URI=mongodb://localhost:27017/feedback_db
   ```

## API Endpoints

### GET /api/feedback
Get all feedback entries

**Response:**
```json
{
  "success": true,
  "data": [...]
}
```

### GET /api/feedback/:id
Get a single feedback by ID

**Parameters:** `id` - Feedback document ID

### POST /api/feedback
Submit new feedback

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "message": "This is a great product!",
  "rating": 5,
  "category": "Compliment"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Feedback submitted successfully",
  "data": {...}
}
```

### PUT /api/feedback/:id
Update feedback status

**Request Body:**
```json
{
  "status": "reviewed"
}
```

### DELETE /api/feedback/:id
Delete feedback

**Parameters:** `id` - Feedback document ID

## Usage

### Submitting Feedback

1. Open the application in your browser
2. Click on "Submit Feedback" tab
3. Fill in the form:
   - **Name**: Your name
   - **Email**: Your email address
   - **Category**: Select from General, Suggestion, Bug Report, or Compliment
   - **Message**: Detailed feedback (minimum 10 characters)
   - **Rating**: Click stars to select 1-5 rating
4. Click "Submit Feedback" button
5. Success message will appear

### Viewing Feedback

1. Click on "View Feedback" tab
2. Browse all submitted feedbacks
3. Each card shows:
   - Submitter name and email
   - Category badge
   - Star rating
   - Status (Pending/Reviewed)
   - Submission date and time

### Admin Dashboard

1. Click on "Admin Dashboard" tab
2. View statistics:
   - Total feedback count
   - Average rating
   - Feedback breakdown by category
3. Manage feedback:
   - Mark as reviewed (✓ button)
   - Delete feedback (🗑️ button)
   - View full feedback details

## Folder Permissions

Make sure you have read/write permissions for:
- `backend/` directory
- `frontend/` directory
- `.env` files

## Troubleshooting

### Backend won't start
- Check if MongoDB is running/connected
- Verify `.env` file has correct MONGO_URI
- Ensure port 5000 is available
- Check for syntax errors in `server.js`

### Frontend won't connect to backend
- Ensure backend is running on `http://localhost:5000`
- Check CORS settings in `server.js`
- Verify API URL in axios calls

### MongoDB connection issues
- Check internet connection (if using Atlas)
- Verify connection string is correct
- Check username and password
- Ensure IP address is whitelisted in MongoDB Atlas

### Port already in use
- Change PORT in `.env` file to another port (e.g., 5001)
- Or find and kill the process using the port

## Environment Variables

### Backend `.env`
```
MONGO_URI=<your-mongodb-connection-string>
PORT=5000
```

## Dependencies

### Backend
- express: ^4.18.2
- mongoose: ^7.0.0
- cors: ^2.8.5
- dotenv: ^16.0.3
- nodemon: ^2.0.20 (dev)

### Frontend
- react: ^18.2.0
- react-dom: ^18.2.0
- axios: ^1.3.0
- vite: ^4.3.9

## Color Theme

- **Primary Color**: #7c3aed (Purple)
- **Secondary Color**: #6366f1 (Indigo)
- **Dark Color**: #1e293b (Dark Blue)
- **Light Background**: #f8fafc (Light Gray)

## License

ISC

## Support

For issues or questions:
1. Check the troubleshooting section
2. Verify all dependencies are installed
3. Ensure MongoDB connection is working
4. Check browser console and terminal for error messages

## Future Enhancements

- User authentication and authorization
- Email notifications for new feedback
- Advanced filtering and search
- Export feedback data to CSV
- Feedback analytics and charts
- Real-time notifications using WebSockets
- Pagination for large datasets
- File attachments support
