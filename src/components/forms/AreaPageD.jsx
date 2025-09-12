import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useAreaForm } from '../../contexts/AreaFormContext';

const AreaPageD = () => {
  const { formData, updateFormData, nextStep, prevStep, validateCurrentStep } = useAreaForm();

  const handleActivityChange = (index, value) => {
    const newActivities = [...(formData.partD.activities || [])];
    newActivities[index] = value;
    updateFormData('partD', { activities: newActivities });
  };

  const addActivity = () => {
    const newActivities = [...(formData.partD.activities || []), ''];
    updateFormData('partD', { activities: newActivities });
  };

  const removeActivity = (index) => {
    const newActivities = [...(formData.partD.activities || [])];
    newActivities.splice(index, 1);
    updateFormData('partD', { activities: newActivities });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          ഏരിയ തലം റിപ്പോർട്ട് - PART D
        </h2>
        <p className="text-gray-600">
          ഏരിയ ടീം നടത്തിയ പ്രവർത്തനങ്ങൾ
        </p>
      </div>

      {/* Area Team Activities */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          D. ഏരിയ ടീം നടത്തിയ പ്രവർത്തനങ്ങൾ
        </h3>
        <div className="space-y-3">
          {(formData.partD.activities || []).map((activity, index) => (
            <div key={index} className="flex items-center space-x-3">
              <span className="text-lg font-medium">{index + 1}.</span>
              <input
                type="text"
                value={activity}
                onChange={(e) => handleActivityChange(index, e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                placeholder="പ്രവർത്തനം നൽകുക"
              />
              <button
                type="button"
                onClick={() => removeActivity(index)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg"
              >
                ഇല്ലാതാക്കുക
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addActivity}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            + പ്രവർത്തനം ചേർക്കുക
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-12 flex justify-between">
        <button
          onClick={prevStep}
          className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>മുൻപത്തെ</span>
        </button>
        <button
          onClick={nextStep}
          disabled={!validateCurrentStep()}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
        >
          <span>അടുത്തത്</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default AreaPageD;