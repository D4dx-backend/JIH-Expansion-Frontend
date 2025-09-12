import React from 'react';
import { AreaFormProvider } from '../contexts/AreaFormContext';
import AreaPageA from '../components/forms/AreaPageA';
import AreaPageB from '../components/forms/AreaPageB';
import AreaPageC from '../components/forms/AreaPageC';
import AreaPageD from '../components/forms/AreaPageD';
import AreaPageE from '../components/forms/AreaPageE';
import AreaPageF from '../components/forms/AreaPageF';
import { useAreaForm } from '../contexts/AreaFormContext';

const AreaSurveyContent = () => {
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
        return <AreaPageF />;
      default:
        return <AreaPageA />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Bar */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                ഏരിയ തലം മാസിക സർവേ
              </h1>
              <div className="text-sm text-gray-500">
                Step {currentStep} of 6
              </div>
            </div>
            <div className="mt-4">
              <div className="flex space-x-2">
                {[1, 2, 3, 4, 5, 6].map((step) => (
                  <div
                    key={step}
                    className={`flex-1 h-2 rounded-full ${
                      step <= currentStep
                        ? 'bg-blue-600'
                        : 'bg-gray-200'
                    }`}
                  />
                ))}
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
      </div>

      {/* Form Content */}
      <div className="max-w-7xl mx-auto py-8">
        {renderCurrentStep()}
      </div>
    </div>
  );
};

const AreaSurveyPage = () => {
  return (
    <AreaFormProvider>
      <AreaSurveyContent />
    </AreaFormProvider>
  );
};

export default AreaSurveyPage;
