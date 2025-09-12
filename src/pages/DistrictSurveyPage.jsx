import React from 'react';
import { DistrictFormProvider } from '../contexts/DistrictFormContext';
import DistrictPageA from '../components/forms/DistrictPageA';
import DistrictPageB from '../components/forms/DistrictPageB';
import { useDistrictForm } from '../contexts/DistrictFormContext';

const DistrictSurveyContent = () => {
  const { currentStep } = useDistrictForm();

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <DistrictPageA />;
      case 2:
        return <DistrictPageB />;
      default:
        return <DistrictPageA />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">
                ജില്ലാ തലം മാസിക സർവേ
              </h1>
              <div className="text-sm text-gray-500">
                Step {currentStep} of 2
              </div>
            </div>
            <div className="mt-4">
              <div className="flex space-x-2">
                {[1, 2].map((step) => (
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
                <span>ആദ്യ ഭാഗം</span>
                <span>രണ്ടാം ഭാഗം</span>
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

const DistrictSurveyPage = () => {
  return (
    <DistrictFormProvider>
      <DistrictSurveyContent />
    </DistrictFormProvider>
  );
};

export default DistrictSurveyPage;
