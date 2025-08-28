import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import FormSubmissionPage from '../pages/FormSubmissionPage';
import FormPage from '../pages/FormPage';
import { FormProvider } from '../contexts/FormContext';
import { validateUserToken } from '../utils/auth';

const UserDashboardWrapper = ({ onLogout }) => {
  const [hasForms, setHasForms] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  useEffect(() => {
    checkUserForms();
  }, []);

  const checkUserForms = async () => {
    try {
      // First validate the token
      const tokenValid = await validateUserToken();
      if (!tokenValid) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      const token = localStorage.getItem('userToken');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/forms`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      // If user has forms, show dashboard
      if (response.data.forms && response.data.forms.length > 0) {
        setHasForms(true);
      } else {
        // If user has no forms, redirect to form creation
        setHasForms(false);
      }
    } catch (error) {
      console.error('Error checking user forms:', error);
      
      // Handle authentication errors (401, 403)
      if (error.response?.status === 401 || error.response?.status === 403) {
        // Clear invalid token and redirect to landing page
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        setIsAuthenticated(false);
        setError('Session expired. Please login again.');
      } else {
        setError('Failed to check user forms. Please try again.');
        // On other errors, assume user has no forms and redirect to form creation
        setHasForms(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = () => {
    // After form submission, redirect to dashboard
    setHasForms(true);
  };

  // If not authenticated, redirect to landing page
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <p className="text-red-600 mb-4">{error}</p>
            <div className="flex space-x-3">
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Try Again
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('userToken');
                  localStorage.removeItem('userData');
                  window.location.href = '/';
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
              >
                Go to Login
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // If user has no forms, redirect to form creation
  if (!hasForms) {
    return (
      <FormProvider>
        <FormPage onBack={onLogout} onSubmit={handleFormSubmit} />
      </FormProvider>
    );
  }

  // If user has forms, show dashboard
  return <FormSubmissionPage onLogout={onLogout} />;
};

export default UserDashboardWrapper;
