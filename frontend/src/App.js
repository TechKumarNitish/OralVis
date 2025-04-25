import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
import './index.css';

// Layout Components
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Patient Components
import Dashboard from './components/patient/Dashboard';
import DentistList from './components/patient/DentistList';
import CheckupRequest from './components/patient/CheckupRequest';
import CheckupHistory from './components/CheckupHistory';
import CheckupDetails from './components/CheckupDetails';

// Dentist Components
import DentistDashboard from './components/dentist/Dashboard';
import PatientRequests from './components/dentist/PatientRequests';
import CheckupUpdate from './components/dentist/CheckupUpdate';

// Other Components
import NotFound from './components/NotFound';

// Home Component
import Home from './components/Home';

// Protected Route Component
import ProtectedRoute from './components/auth/ProtectedComponent';

// Context
import { AuthProvider } from './context/AuthContext';


function App() {
  return (
    <AuthProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Patient Routes */}
            <Route
              path="/patient/dashboard"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/dentists"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <DentistList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/checkup/request"
              element={
                <ProtectedRoute allowedRoles={['patient']}>
                  <CheckupRequest />
                </ProtectedRoute>
              }
            />
            <Route
              path="/checkup/history"
              element={
                <ProtectedRoute allowedRoles={['patient', 'dentist']}>
                  <CheckupHistory />
                </ProtectedRoute>
              }
            />
            <Route
              path="/patient/checkup/:id"
              element={
                <ProtectedRoute allowedRoles={['patient', 'dentist']}> 
                  <CheckupDetails />
                </ProtectedRoute>
              }
            />

            {/* Dentist Routes */}
            <Route
              path="/dentist/dashboard"
              element={
                <ProtectedRoute allowedRoles={['dentist']}>
                  <DentistDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dentist/requests"
              element={
                <ProtectedRoute allowedRoles={['dentist']}>
                  <PatientRequests />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dentist/checkup/:id"
              element={
                <ProtectedRoute allowedRoles={['dentist']}>
                  <CheckupUpdate />
                </ProtectedRoute>
              }
            />

            {/* 404 Route */}
            <Route path="*" element={<NotFound />} />

           
          </Routes>
        </main>
        <Footer />
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    </AuthProvider>
  );
}

export default App; 