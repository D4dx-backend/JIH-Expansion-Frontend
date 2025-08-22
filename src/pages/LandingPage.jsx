import React, { useState } from 'react';
import { ArrowRight, Shield, FileText, Users, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jihLogo from '../assets/jih-logo2.png';
import bismillah from '../assets/bismillah.png';

const LandingPage = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showCodeInput, setShowCodeInput] = useState(false);

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/login`, {
        code: code
      });

      // Store token in localStorage
      localStorage.setItem('userToken', response.data.token);
      localStorage.setItem('userData', JSON.stringify(response.data.user));

      // Call the callback to handle successful login
      onLoginSuccess();
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const features = [
    {
      icon: <FileText className="w-6 h-6" />,
      title: "Form Submission",
      description: "Submit detailed organizational forms with ease"
    },
    {
      icon: <Shield className="w-6 h-6" />,
      title: "Secure Access",
      description: "Protected with 6-digit authentication code"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "User Management",
      description: "Track and manage your form submissions"
    },
    {
      icon: <CheckCircle className="w-6 h-6" />,
      title: "Data Validation",
      description: "Ensures accurate and complete information"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-4 sm:py-6 gap-4">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <img src={jihLogo} alt="JIH Logo" className="h-8 sm:h-12 w-auto" />
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 text-center sm:text-left">JIH Organisation Expansion</h1>
            </div>
            <button
              onClick={() => navigate('/admin-login')}
              className="bg-gray-800 hover:bg-gray-900 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 text-sm sm:text-base"
            >
              <span>Admin Login</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Bismillah */}
        <div className="text-center mb-2">
          <img src={bismillah} alt="Bismillah" className="h-64 w-auto mx-auto mb-1" />
        </div>
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to the Organization Expansion Portal
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access the secure form submission system to manage and submit organizational data. 
            Enter your 6-digit access code to get started.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow">
              <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
                <div className="text-blue-600">
                  {feature.icon}
                </div>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* Access Section */}
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Secure Access</h2>
              <p className="text-gray-600">Enter your 6-digit access code to continue</p>
            </div>

            {!showCodeInput ? (
              <button
                onClick={() => setShowCodeInput(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <span>Enter Code to Submit Forms</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <form onSubmit={handleCodeSubmit} className="space-y-4">
                <div>
                  <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                    Access Code
                  </label>
                  <input
                    type="text"
                    id="code"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-mono"
                    disabled={isLoading}
                  />
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-600 text-sm">{error}</p>
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCodeInput(false);
                      setCode('');
                      setError('');
                    }}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading || code.length !== 6}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-500">
            Need help? Contact your system administrator for access code
          </p>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;
