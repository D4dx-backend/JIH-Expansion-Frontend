import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import axios from 'axios';
import { AreaFormProvider, useAreaForm } from '../contexts/AreaFormContext';
import AreaPageA from '../components/forms/AreaPageA';
import AreaPageB from '../components/forms/AreaPageB';
import AreaPageC from '../components/forms/AreaPageC';
import AreaPageD from '../components/forms/AreaPageD';
import AreaPageE from '../components/forms/AreaPageE';
import AreaPageF from '../components/forms/AreaPageF';
import jihLogo from '../assets/jih-logo2.png';

const AreaSurveyEditContent = ({ survey, onSave, isSaving, onBack }) => {
  const { currentStep } = useAreaForm();

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <AreaPageA />;
      case 2:
        return <AreaPageB />;
      case 3:
        return <AreaPageC />;
      case 4:
        return <AreaPageD />;
      case 5:
        return <AreaPageE />;
      case 6:
        return <AreaPageF onSave={onSave} isSaving={isSaving} isEditing={true} />;
      default:
        return <AreaPageA />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                title="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <img src={jihLogo} alt="JIH Logo" className="h-12 w-auto" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Edit Area Survey</h1>
                <p className="text-sm text-gray-600">Survey for {survey.month}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">
                Step {currentStep} of 6
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">Progress</span>
              <span className="text-sm text-gray-500">{Math.round((currentStep / 6) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / 6) * 100}%` }}
              ></div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-500">
              <span>ഘടകങ്ങൾ</span>
              <span>പ്രവർത്തനങ്ങൾ</span>
              <span>ഫോകസ്</span>
              <span>ടീം പ്രവർത്തനങ്ങൾ</span>
              <span>വ്യക്തികൾ</span>
              <span>വർദ്ധനവ്</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {renderCurrentStep()}
      </main>
    </div>
  );
};

const AreaSurveyEditPage = ({ surveyId: propSurveyId, onBack, onSubmit }) => {
  const { surveyId: paramSurveyId } = useParams();
  const navigate = useNavigate();
  
  // Use prop surveyId if provided, otherwise use param surveyId
  const surveyId = propSurveyId || paramSurveyId;
  const [survey, setSurvey] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (surveyId) {
      loadSurvey();
    }
  }, [surveyId]);

  const loadSurvey = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('userToken');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/area/surveys/${surveyId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setSurvey(response.data.data);
      } else {
        setError('Failed to load survey');
      }
    } catch (error) {
      console.error('Error loading survey:', error);
      setError('Failed to load survey');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (formData) => {
    try {
      setIsSaving(true);
      const token = localStorage.getItem('userToken');
      
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/area/surveys/${surveyId}`, formData, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data.success) {
        if (onSubmit) {
          onSubmit(response.data.data);
        } else {
          navigate(`/area-survey-detail/${surveyId}`);
        }
      } else {
        setError('Failed to update survey');
      }
    } catch (error) {
      console.error('Error updating survey:', error);
      setError('Failed to update survey');
    } finally {
      setIsSaving(false);
    }
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading survey for editing...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={handleBack}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Survey not found</p>
          <button
            onClick={handleBack}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <AreaFormProvider initialData={survey}>
      <AreaSurveyEditContent 
        survey={survey} 
        onSave={handleSave} 
        isSaving={isSaving} 
        onBack={handleBack} 
      />
      
      {/* Error Display */}
      {error && (
        <div className="fixed bottom-4 right-4 bg-red-50 border border-red-200 rounded-lg p-4 max-w-md">
          <div className="flex items-center space-x-2">
            <X className="w-5 h-5 text-red-600" />
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        </div>
      )}
    </AreaFormProvider>
  );
};

export default AreaSurveyEditPage;
