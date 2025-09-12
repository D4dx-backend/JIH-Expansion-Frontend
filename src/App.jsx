import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import UserDashboardWrapper from './components/UserDashboardWrapper';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AreaDashboardPage from './pages/AreaDashboardPage';
import UnitDashboardPage from './pages/UnitDashboardPage';
import AreaSurveyPage from './pages/AreaSurveyPage';
import AreaSurveyDetailPage from './pages/AreaSurveyDetailPage';
import AreaSurveyEditPage from './pages/AreaSurveyEditPage';
import DistrictSurveyPage from './pages/DistrictSurveyPage';
import { validateUserToken, validateAdminToken } from './utils/auth';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        // Validate both user and admin tokens
        const [userValid, adminValid] = await Promise.all([
          validateUserToken(),
          validateAdminToken()
        ]);
        
        setIsAuthenticated(userValid);
        setIsAdminAuthenticated(adminValid);
      } catch (error) {
        console.error('Error checking authentication:', error);
        // On error, assume not authenticated
        setIsAuthenticated(false);
        setIsAdminAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleAdminLoginSuccess = () => {
    setIsAdminAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    setIsAuthenticated(false);
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    setIsAdminAuthenticated(false);
  };

  // Helper function to determine default dashboard based on user data
  const getDefaultDashboard = () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const role = userData.role;
      
      if (role === 'area' && userData.areaId) {
        return `/area-dashboard/${userData.areaId}`;
      } else if (role === 'unit' && userData.unitId) {
        return `/unit-dashboard/${userData.unitId}`;
      } else if (role === 'district' && userData.districtId) {
        return `/district-dashboard/${userData.districtId}`;
      }
      return '/dashboard'; // fallback to default dashboard
    } catch (error) {
      console.error('Error parsing user data:', error);
      return '/dashboard';
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading application...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/" 
          element={
            isAuthenticated || isAdminAuthenticated ? (
              <Navigate to={isAdminAuthenticated ? "/admin-dashboard" : getDefaultDashboard()} replace />
            ) : (
              <LandingPage onLoginSuccess={handleLoginSuccess} />
            )
          } 
        />
        <Route 
          path="/dashboard" 
          element={
            isAuthenticated ? (
              <UserDashboardWrapper onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        <Route 
          path="/admin-login" 
          element={
            isAdminAuthenticated ? (
              <Navigate to="/admin-dashboard" replace />
            ) : (
              <AdminLoginPage onLoginSuccess={handleAdminLoginSuccess} />
            )
          } 
        />
        <Route 
          path="/admin-dashboard" 
          element={
            isAdminAuthenticated ? (
              <AdminDashboardPage onLogout={handleAdminLogout} />
            ) : (
              <Navigate to="/admin-login" replace />
            )
          } 
        />
        <Route 
          path="/form" 
          element={
            isAuthenticated ? (
              <UserDashboardWrapper onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          } 
        />
        <Route 
          path="/district-dashboard/:districtId"
          element={
            isAuthenticated ? (
              <UserDashboardWrapper onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route 
          path="/area-dashboard/:areaId" 
          element={
            isAuthenticated ? (
              <AreaDashboardPage onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route 
          path="/unit-dashboard/:unitId" 
          element={
            isAuthenticated ? (
              <UnitDashboardPage onLogout={handleLogout} />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route 
          path="/area-survey" 
          element={
            isAuthenticated ? (
              <AreaSurveyPage />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route 
          path="/area-survey-detail/:surveyId" 
          element={
            isAuthenticated ? (
              <AreaSurveyDetailPage />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route 
          path="/area-survey-edit/:surveyId" 
          element={
            isAuthenticated ? (
              <AreaSurveyEditPage />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route 
          path="/district-survey" 
          element={
            isAuthenticated ? (
              <DistrictSurveyPage />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;