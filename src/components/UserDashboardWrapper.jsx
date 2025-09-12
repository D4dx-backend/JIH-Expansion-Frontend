import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import HomePage from '../pages/HomePage';
import FormSubmissionPage from '../pages/FormSubmissionPage';
import FormPage from '../pages/FormPage';
import MonthlySurveyDashboard from '../pages/MonthlySurveyDashboard';
import MonthlySurveyPage from '../pages/MonthlySurveyPage';
import DistrictAdminDashboard from './dashboards/DistrictAdminDashboard';
import { FormProvider } from '../contexts/FormContext';
import { validateUserToken } from '../utils/auth';

const UserDashboardWrapper = ({ onLogout }) => {
  const [currentView, setCurrentView] = useState('home'); // Added 'stats' to the comment for clarity
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [editingForm, setEditingForm] = useState(null);
  const [editingSurvey, setEditingSurvey] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    initializeUser();
  }, []);

  const initializeUser = async () => {
    try {
      // First validate the token
      const tokenValid = await validateUserToken();
      if (!tokenValid) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      // Get user data from localStorage
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        setUserData(JSON.parse(storedUserData));
      }

      setCurrentView('home');
    } catch (error) {
      console.error('Error initializing user:', error);
      
      // Handle authentication errors (401, 403)
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userData');
        setIsAuthenticated(false);
        setError('Session expired. Please login again.');
      } else {
        setError('Failed to initialize user. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Navigation handlers
  const handleNavigateToYearly = () => setCurrentView('yearly-dashboard');
  const handleNavigateToMonthly = () => setCurrentView('monthly-dashboard');
  const handleNavigateToStats = () => setCurrentView('stats');
  const handleBackToHome = () => {
    setCurrentView('home');
    setEditingForm(null);
    setEditingSurvey(null);
  };

  // Yearly survey handlers
  const handleCreateYearlyForm = () => {
    setEditingForm(null);
    setCurrentView('yearly-form');
  };
  
  const handleEditYearlyForm = (form) => {
    setEditingForm(form);
    setCurrentView('yearly-form');
  };

  const handleYearlyFormSubmit = () => {
    setCurrentView('yearly-dashboard');
    setEditingForm(null);
  };

  // Monthly survey handlers
  const handleCreateMonthlySurvey = () => {
    setEditingSurvey(null);
    // Check user role to determine which form to show
    if (userData?.role === 'district') {
      // For district users, navigate to the new district survey form
      window.location.href = '/district-survey';
    } else {
      // For other users, use the existing monthly form
      setCurrentView('monthly-form');
    }
  };
  
  const handleEditMonthlySurvey = (survey) => {
    setEditingSurvey(survey);
    setCurrentView('monthly-form');
  };

  const handleMonthlySurveySubmit = () => {
    setCurrentView('monthly-dashboard');
    setEditingSurvey(null);
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

  // Render based on current view
  const renderCurrentView = () => {
    switch (currentView) {
      case 'home':
        return (
          <HomePage
            onLogout={onLogout}
            onNavigateToYearly={handleNavigateToYearly}
            onNavigateToMonthly={handleNavigateToMonthly}
            onNavigateToStats={handleNavigateToStats}
            userData={userData}
          />
        );
      
      case 'yearly-dashboard':
        return (
          <FormSubmissionPage
            onLogout={onLogout}
            onBack={handleBackToHome}
            onCreateNew={handleCreateYearlyForm}
            onEdit={handleEditYearlyForm}
            userData={userData}
          />
        );
      
      case 'yearly-form':
        return (
          <FormProvider>
            <FormPage
              onBack={() => setCurrentView('yearly-dashboard')}
              onSubmit={handleYearlyFormSubmit}
              editingForm={editingForm}
            />
          </FormProvider>
        );
      
      case 'monthly-dashboard':
        return (
          <MonthlySurveyDashboard
            onBack={handleBackToHome}
            onCreateNew={handleCreateMonthlySurvey}
            onEdit={handleEditMonthlySurvey}
            userData={userData}
          />
        );
      
      case 'monthly-form':
        return (
          <FormProvider>
            <MonthlySurveyPage
              onBack={() => setCurrentView('monthly-dashboard')}
              onSubmit={handleMonthlySurveySubmit}
              editingSurvey={editingSurvey}
            />
          </FormProvider>
        );
      
      case 'stats':
        return (
          <DistrictAdminDashboard
            onBack={handleBackToHome}
            userData={userData}
          />
        );
      
      default:
        return (
          <HomePage
            onLogout={onLogout}
            onNavigateToYearly={handleNavigateToYearly}
            onNavigateToMonthly={handleNavigateToMonthly}
            onNavigateToStats={handleNavigateToStats}
            userData={userData}
          />
        );
    }
  };

  return renderCurrentView();
};

export default UserDashboardWrapper;