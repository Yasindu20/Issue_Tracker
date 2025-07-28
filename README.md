# 🐛 Issue Tracker

A modern, full-stack issue tracking application built with React and Node.js. This application provides comprehensive CRUD operations for managing software issues, bugs, and feature requests with a beautiful, responsive user interface.

## ✨ Features

### Core Functionality
- **📝 Issue Management**: Create, read, update, and delete issues
- **🔐 User Authentication**: Secure JWT-based authentication system
- **👥 User Authorization**: Role-based access control (User/Admin)
- **🎯 Advanced Filtering**: Search by title, description, status, and priority
- **📊 Dashboard Analytics**: Visual statistics and recent issues overview
- **📱 Responsive Design**: Mobile-first, modern glassmorphism UI

### Advanced Features
- **🏷️ Tagging System**: Organize issues with custom tags
- **📅 Due Dates**: Set and track issue deadlines with overdue indicators
- **👤 Assignment System**: Assign issues to team members
- **🔄 Status Workflow**: 5-stage status progression (Open → In Progress → Testing → Resolved → Closed)
- **⚡ Priority Levels**: 4 priority levels (Low, Medium, High, Critical)
- **🔍 Real-time Search**: Instant search with live filtering
- **📄 Pagination**: Efficient handling of large datasets
- **🎨 Modern UI/UX**: Smooth animations, hover effects, and toast notifications

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and context
- **React Router v6** - Client-side routing
- **Axios** - HTTP client for API calls
- **CSS3** - Custom styling with modern features (backdrop-filter, gradients)

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Development Tools
- **Nodemon** - Development server auto-restart
- **Create React App** - React application setup
- **ESLint** - Code linting

## 📁 Repository Structure

```
issue-tracker/
├── README.md
├── .gitignore
├── backend/
│   ├── config/
│   │   └── database.js          # MongoDB connection configuration
│   ├── middleware/
│   │   └── auth.js              # JWT authentication middleware
│   ├── models/
│   │   ├── User.js              # User model with authentication
│   │   └── Issue.js             # Issue model with validation
│   ├── routes/
│   │   ├── auth.js              # Authentication routes (login/register)
│   │   └── issues.js            # Issue CRUD routes
│   ├── package.json             # Backend dependencies
│   ├── server.js                # Express server entry point
│   └── .env                     # Environment variables (not in repo)
├── frontend/
│   ├── public/
│   │   ├── index.html           # Enhanced HTML with loading screen
│   │   ├── manifest.json        # PWA manifest
│   │   └── robots.txt           # SEO robots file
│   ├── src/
│   │   ├── components/
│   │   │   ├── CustomDropdown.js    # Reusable dropdown component
│   │   │   ├── CustomDropdown.css   # Dropdown styling
│   │   │   ├── Navbar.js            # Navigation component
│   │   │   ├── ProtectedRoute.js    # Route protection HOC
│   │   │   └── Toast.js             # Toast notification component
│   │   ├── contexts/
│   │   │   ├── AuthContext.js       # Authentication state management
│   │   │   └── ToastContext.js      # Toast notification state
│   │   ├── pages/
│   │   │   ├── Dashboard.js         # Main dashboard with statistics
│   │   │   ├── IssueList.js         # Issue listing with filters
│   │   │   ├── IssueDetail.js       # Individual issue view/edit
│   │   │   ├── CreateIssue.js       # Issue creation form
│   │   │   ├── Login.js             # User login form
│   │   │   └── Register.js          # User registration form
│   │   ├── services/
│   │   │   └── api.js               # Axios configuration and interceptors
│   │   ├── App.js                   # Main React component with routing
│   │   ├── App.css                  # Global styles and design system
│   │   ├── index.js                 # React app entry point
│   │   └── index.css                # Base CSS styles
│   └── package.json                 # Frontend dependencies
└── docs/
    ├── API.md                       # API documentation
    ├── DEPLOYMENT.md                # Deployment guide
    └── CONTRIBUTING.md              # Contribution guidelines
```

📦 Dependencies
Backend Dependencies
{
  "dependencies": {
    "bcryptjs": "^3.0.2",           // Password hashing
    "cors": "^2.8.5",               // Cross-origin resource sharing
    "dotenv": "^17.2.0",            // Environment variable management
    "express": "^4.18.2",           // Web framework
    "jsonwebtoken": "^9.0.2",       // JWT token generation
    "mongoose": "^8.16.4"           // MongoDB object modeling
  },
  "devDependencies": {
    "nodemon": "^3.1.10"           // Development server auto-restart
  }
}

Frontend Dependencies
{
  "dependencies": {
    "@testing-library/dom": "^10.4.0",
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.3.0",
    "@testing-library/user-event": "^13.5.0",
    "axios": "^1.11.0",             // HTTP client for API calls
    "react": "^19.1.0",             // UI library
    "react-dom": "^19.1.0",         // React DOM rendering
    "react-router-dom": "^7.7.0",   // Client-side routing
    "react-scripts": "5.0.1",       // Build tools and configuration
    "web-vitals": "^2.1.4"          // Performance metrics
  }
}

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v14 or higher)
- **MongoDB** (local installation or MongoDB Atlas)
- **npm** or **yarn** package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Yasindu20/Issue_Tracker.git
   cd issue-tracker
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   
   # Create environment file
   cp .env.example .env
   # Edit .env with your MongoDB URI and JWT secret
   ```

3. **Setup Frontend**
   ```bash
   cd ../frontend
   npm install
   ```


### Running the Application

1. **Start Backend Server**
   ```bash
   cd backend
   npm run dev
   # Server runs on http://localhost:5000
   ```

2. **Start Frontend Development Server**
   ```bash
   cd frontend
   npm start
   # Application opens at http://localhost:3000
   ```

### Production Build

```bash
# Backend
cd backend
npm start

# Frontend
cd frontend
npm run build
# Creates optimized build in 'build' folder
```

## 📖 Usage Guide

### Getting Started
1. **Register** a new account or **login** with existing credentials
2. **Dashboard** provides an overview of all issues and statistics
3. **Create Issues** using the "New Issue" button or navigate to `/issues/new`
4. **Browse Issues** in the Issues page with advanced filtering options
5. **Manage Issues** by clicking on any issue to view, edit, or delete

### User Roles
- **Regular User**: Can create, view, and edit their own issues
- **Admin**: Full access to all issues and user management

### Issue Workflow
```
Open → In Progress → Testing → Resolved → Closed
```

### Filtering & Search
- **Text Search**: Search across titles and descriptions
- **Status Filter**: Filter by issue status with live counts
- **Priority Filter**: Filter by priority levels
- **Sorting**: Multiple sort options (date, title, priority)


## 🔌 API Documentation

### Authentication Endpoints
```http
POST /api/auth/register    # User registration
POST /api/auth/login       # User login
GET  /api/auth/me          # Get current user
```

## 🚀 Deployment

### Frontend Deployment (Vercel)

### Backend Deployment (Railway)

```


## 🎯 Performance Features

- **Lazy Loading**: Components loaded on demand
- **Pagination**: Efficient data loading
- **Debounced Search**: Optimized search performance
- **Caching**: API response caching with axios
- **Bundle Optimization**: Code splitting and tree shaking

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Input Validation**: Server-side validation for all inputs
- **CORS Protection**: Configured for production security
- **XSS Prevention**: Sanitized inputs and outputs

## 🎨 Design System

The application uses a modern design system with:
- **CSS Custom Properties**: Consistent color palette and spacing
- **Glassmorphism**: Modern blur effects and transparency
- **Responsive Design**: Mobile-first approach
- **Accessibility**: WCAG compliant with proper focus management

## 🚦 Status

- ✅ **Core Features**: Complete
- ✅ **Authentication**: Complete  
- ✅ **CRUD Operations**: Complete
- ✅ **Search & Filter**: Complete
- ✅ **Responsive UI**: Complete

## 📞 Support

For support, email yasindudemel@gmail.com or create an issue in the repository.

## 🙏 Acknowledgments

- Design inspiration from modern issue tracking tools
- Icons from various emoji libraries
- CSS techniques from modern web development practices

---

**Built with ❤️ by Yasindu Dasanga De Mel**
