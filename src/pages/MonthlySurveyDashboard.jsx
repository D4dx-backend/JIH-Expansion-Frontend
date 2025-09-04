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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading monthly surveys...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
    <div className="flex items-center justify-between h-16">
      
      {/* Left Section (Back + Logo + Title) */}
      <div className="flex items-center space-x-4">
        {/* Back Button */}
        <button
  onClick={onBack}
  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors text-center"
>
  <ArrowLeft className="w-4 h-4" />
  <span className="leading-tight">
  തിരികെ<br />പോകുക
</span>

</button>



        {/* Logo + Title */}
        <div className="flex items-center space-x-3">
        <img src={jihLogo} alt="JIH Logo" className="h-8 sm:h-12 w-auto" />
          <div>
            <h1 className="text-xl font-semibold text-gray-900">മാസിക സർവേകൾ</h1>
            <p className="text-sm text-gray-600">District: {userData?.district}</p>
          </div>
        </div>
      </div>

      {/* Right Section (Create Button) */}
      <button
        onClick={onCreateNew}
        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span>പുതിയ മാസിക സർവേ</span>
      </button>
    </div>
  </div>
</header>


      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {surveys.length === 0 ? (
          <div className="text-center py-12">
            <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              മാസിക സർവേകൾ ഇല്ല
            </h3>
            <p className="text-gray-600 mb-6">
              നിങ്ങൾ ഇതുവരെ മാസിക സർവേകൾ സമർപ്പിച്ചിട്ടില്ല
            </p>
            <button
              onClick={onCreateNew}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-medium flex items-center space-x-2 mx-auto transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>ആദ്യത്തെ മാസിക സർവേ സൃഷ്ടിക്കുക</span>
            </button>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {surveys.map((survey) => (
              <div
                key={survey._id}
                className="bg-white rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-5 h-5 text-green-600" />
                      <h3 className="text-lg font-semibold text-gray-900">
                        {survey.month}
                      </h3>
                    </div>
                    <span className="text-sm text-gray-500">
                      {formatDate(survey.submittedAt)}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">District:</span>{' '}
                      {survey.district}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Population:</span>{' '}
                      {survey.partA?.totalPopulation || 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Last Updated:</span>{' '}
                      {formatDate(survey.updatedAt)}
                    </p>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(survey)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center space-x-1 transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(survey._id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center justify-center transition-colors"
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
