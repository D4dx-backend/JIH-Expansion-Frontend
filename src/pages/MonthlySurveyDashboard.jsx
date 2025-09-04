import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Edit, Trash2, Calendar } from 'lucide-react';
import axios from 'axios';
import jihLogo from '../assets/jih-logo2.png'; // ✅ adjust path as per your project

const MonthlySurveyDashboard = ({ onBack, onCreateNew, onEdit, userData }) => {
  const [surveys, setSurveys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSurveys();
  }, []);

  const fetchSurveys = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/monthly-survey`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSurveys(response.data.surveys || []);
    } catch (error) {
      console.error('Error fetching monthly surveys:', error);
      setError('Failed to load monthly surveys');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (surveyId) => {
    if (!window.confirm('ഈ മാസിക സർവേ ഡിലീറ്റ് ചെയ്യാൻ ആഗ്രഹിക്കുന്നുണ്ടോ?')) {
      return;
    }

    try {
      const token = localStorage.getItem('userToken');
      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/user/monthly-survey/${surveyId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setSurveys(surveys.filter((survey) => survey._id !== surveyId));
    } catch (error) {
      console.error('Error deleting survey:', error);
      alert('സർവേ ഡിലീറ്റ് ചെയ്യുന്നതിൽ പരാജയപ്പെട്ടു');
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center bg-white/70 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-white/20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading monthly surveys...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left Section (Back + Logo + Title) */}
            <div className="flex items-center space-x-4">
              {/* Back Button */}
              <button
                onClick={onBack}
                className="bg-gradient-to-r from-slate-500 to-slate-600 hover:from-slate-600 hover:to-slate-700 text-white px-4 py-2 rounded-xl font-medium flex items-center space-x-2 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="leading-tight text-center">
                  Back
                </span>
              </button>

              {/* Logo + Title */}
              <div className="flex items-center space-x-3">
                <img src={jihLogo} alt="JIH Logo" className="h-8 sm:h-12 w-auto" />
                <div>
                  <h1 className="text-xl font-semibold text-slate-800">മാസിക സർവേകൾ</h1>
                  <p className="text-sm text-slate-600">District: {userData?.district}</p>
                </div>
              </div>
            </div>

            {/* Right Section (Create Button) */}
            <button
              onClick={onCreateNew}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-4 py-2 rounded-xl font-medium flex items-center space-x-2 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              <span>New Monthly Survey</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-4 shadow-sm">
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        {surveys.length === 0 ? (
          <div className="text-center py-12">
            <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-12 max-w-md mx-auto shadow-lg border border-white/20">
              <div className="flex items-center justify-center w-20 h-20 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl mx-auto mb-6">
                <Calendar className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-4">
                മാസിക സർവേകൾ ഇല്ല
              </h3>
              <p className="text-slate-600 mb-8 leading-relaxed">
                നിങ്ങൾ ഇതുവരെ മാസിക സർവേകൾ സമർപ്പിച്ചിട്ടില്ല
              </p>
              <button
                onClick={onCreateNew}
                className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl font-medium flex items-center space-x-2 mx-auto transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <Plus className="w-5 h-5" />
                <span>ആദ്യത്തെ മാസിക സർവേ സൃഷ്ടിക്കുക</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {surveys.map((survey) => (
              <div
                key={survey._id}
                className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-xl hover:scale-105 transition-all duration-300"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-3">
                      <div className="p-2 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl">
                        <Calendar className="w-5 h-5 text-emerald-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-slate-800">
                        {survey.month}
                      </h3>
                    </div>
                    <span className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded-lg font-medium">
                      {formatDate(survey.submittedAt)}
                    </span>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                      <span className="text-sm text-slate-600 font-medium">District:</span>
                      <span className="text-sm text-slate-800 font-semibold">{survey.district}</span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-slate-100">
                      <span className="text-sm text-slate-600 font-medium">Population:</span>
                      <span className="text-sm text-slate-800 font-semibold">
                        {survey.partA?.totalPopulation || 'N/A'}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-sm text-slate-600 font-medium">Last Updated:</span>
                      <span className="text-xs text-slate-600">{formatDate(survey.updatedAt)}</span>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={() => onEdit(survey)}
                      className="flex-1 bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white px-3 py-2 rounded-xl text-sm font-medium flex items-center justify-center space-x-2 transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(survey._id)}
                      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-3 py-2 rounded-xl text-sm font-medium flex items-center justify-center transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MonthlySurveyDashboard;