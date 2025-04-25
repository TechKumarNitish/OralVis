# OralVis - Dental Care Management System

OralVis is a comprehensive dental care management system that connects patients with dentists, enabling seamless appointment scheduling and health tracking.

## Table of Contents
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Setup Instructions](#setup-instructions)
- [Project Structure](#project-structure)
- [Component Architecture](#component-architecture)
- [Control Flow](#control-flow)
- [Authentication Flow](#authentication-flow)
- [Screenshots](#screenshots)

## Features

- **User Authentication**
  - Secure login and registration
  - Role-based access (Patient/Dentist)
  - Password visibility toggle
  - Form validation

- **Patient Features**
  - Register/Login as a user
  - View list of available dentists
  - Select dentist and request checkups
  - View checkup results with images and notes
  - Export checkup details to PDF

- **Dentist Features**
  - Register/Login as a dentist
  - View list of patient checkup requests
  - Upload multiple checkup photos
  - Add detailed notes for each photo
  - Save data to MongoDB

## Tech Stack

- **Frontend**
  - React.js
  - Tailwind CSS
  - React Router
  - React Icons
  - Context API for state management
  - jsPDF for PDF generation
  - html2canvas for capturing components as images
  - Custom NavLink for active navigation highlighting

- **Backend**
  - Node.js
  - Express.js
  - MongoDB
  - JWT Authentication
  - Multer for file uploads
  - bcrypt for password hashing

## Setup Instructions

1. **Access the Deployed Project**
   - Visit the live application here: **[OralVis Live Demo](https://oralvis.netlify.app/)**

2. **Clone the Repository**
   ```bash
   git clone https://github.com/TechKumarNitish/OralVis.git
   cd OralVis
   ```

3. **Install Dependencies**
   ```bash
   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

4. **Environment Setup**
   - Create `.env` file in the backend directory:
     ```
     MONGODB_URI=your_mongodb_uri
     JWT_SECRET=your_jwt_secret
     PORT=5000
     ```

   - Create `.env` file in the frontend directory:
     ```
     REACT_APP_API_URL=http://localhost:5000
     ```

5. **Start the Application**
   ```bash
   # Start backend server
   cd backend
   npm start

   # Start frontend development server
   cd frontend
   npm start
   ```

## Project Structure

```
OralVis/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/
│   │   │   │   ├── Login.js
│   │   │   │   ├── Register.js
│   │   │   │   └── ProtectedComponent.js
│   │   │   ├── patient/
│   │   │   │   ├── Dashboard.js
│   │   │   │   ├── CheckupRequest.js
│   │   │   │   ├── DentistList.js
│   │   │   │   └── ExportPdf.js
│   │   │   ├── dentist/
│   │   │   │   ├── Dashboard.js
│   │   │   │   ├── PatientRequest.js
│   │   │   │   └── CheckupUpdate.js
│   │   │   ├── layout/
│   │   │   │   ├── Header.js
│   │   │   │   └── Footer.js
│   │   │   ├── Home.js
│   │   │   ├── NotFound.js
│   │   │   ├── CheckupHistory.js
│   │   │   └── CheckupDetails.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── App.js
│   │   ├── index.js
│   │   └── index.css
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
└── backend/
    ├── routes/
    │   ├── auth.js
    │   ├── patient.js
    │   └── dentist.js
    ├── models/
    │   ├── User.js
    │   ├── Checkup.js
    │   └── Image.js
    ├── middleware/
    │   └── auth.js
    ├── uploads/
    ├── server.js
    └── package.json
```

## Component Architecture

### Core Components
- `Home.js`: Landing page with application overview and features
- `NotFound.js`: 404 error page with navigation options
- `CheckupHistory.js`: Shared component for viewing checkup history with filtering options
- `CheckupDetails.js`: Shared component for displaying detailed checkup information

### Authentication Components
- `Login.js`: User authentication form with email/password validation
- `Register.js`: User registration form with role selection and form validation
- `ProtectedComponent.js`: HOC for protecting routes based on authentication status

### Patient Components
- `Dashboard.js`: 
  - Overview of recent checkups
  - Quick access to dentist list
  - Pending requests status
- `DentistList.js`:
  - List of available dentists
  - Filtering and search functionality
  - Dentist profile preview
- `CheckupRequest.js`:
  - Form to request new checkups
  - Date and time selection
  - Reason for visit input
- `ExportPdf.js`:
  - PDF generation component
  - Customizable layout
  - Image and text formatting

### Dentist Components
- `Dashboard.js`:
  - Overview of pending requests
  - Recent checkups
  - Quick statistics
- `PatientRequests.js`:
  - List of patient checkup requests
  - Request details
  - Status management
- `CheckupUpdate.js`:
  - Image upload interface
  - Multiple image support
  - Notes and description input
  - Progress tracking

### Layout Components
- `Header.js`:
  - Navigation menu with active state highlighting
  - User profile dropdown
  - Role-based menu items
- `NavLink.js`:
  - Custom navigation link component
  - Active state management
  - Nested route support
  - Consistent styling across desktop and mobile
- `Footer.js`:
  - Copyright information
  - Quick links
  - Contact information

## Control Flow

1. **User Authentication**
   - User enters credentials
   - Form validation occurs
   - API call to backend
   - JWT token generation
   - Redirection based on role

2. **Patient Checkup Flow**
   - Patient views available dentists
   - Selects dentist and requests checkup
   - Receives confirmation
   - Views checkup results with images
   - Can export results to PDF

3. **Dentist Checkup Flow**
   - Views pending checkup requests
   - Uploads checkup photos
   - Adds detailed notes
   - Saves data to database
   - Updates patient records

## Authentication Flow

1. **Registration**
   ```
   User Input → Form Validation → API Call → User Creation → JWT Generation → Login Redirect
   ```

2. **Login**
   ```
   User Input → Form Validation → API Call → Token Verification → Dashboard Redirect
   ```

3. **Protected Routes**
   ```
   Route Access → Token Check → Role Verification → Component Render
   ```

#
