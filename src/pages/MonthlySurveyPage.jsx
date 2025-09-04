import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useForm } from '../contexts/FormContext';
import PartA from '../components/forms/PartA';
import PartB from '../components/forms/PartB';
import PartC from '../components/forms/PartC';
import PartD from '../components/forms/PartD';
import MonthlySurveyPartE from '../components/forms/MonthlySurveyPartE';

const MonthlySurveyPage = ({ onBack, onSubmit, editingSurvey, isAdmin = false }) => {
  const { currentStep, formData, setFormData } = useForm();

  // Load editing survey data if provided
  React.useEffect(() => {
    if (editingSurvey) {
      const normalizedFormData = {
        district: editingSurvey.district || '',
        month: editingSurvey.month || '',
        partA: {
          totalPopulation: editingSurvey.partA?.totalPopulation || null,
          muslimPercentage: editingSurvey.partA?.muslimPercentage || null,
          hinduPercentage: editingSurvey.partA?.hinduPercentage || null,
          christianPercentage: editingSurvey.partA?.christianPercentage || null,
          othersPercentage: editingSurvey.partA?.othersPercentage || null,
          movementPercentage: editingSurvey.partA?.movementPercentage || null,
          majorityInReligiousOrganizations: editingSurvey.partA?.majorityInReligiousOrganizations || '',
          secondPosition: editingSurvey.partA?.secondPosition || '',
          thirdPosition: editingSurvey.partA?.thirdPosition || '',
          ourPosition: editingSurvey.partA?.ourPosition || '',
          morePoliticalInfluence: editingSurvey.partA?.morePoliticalInfluence || ''
        },
        partB: editingSurvey.partB || {},
        partC: editingSurvey.partC || {},
        partD: editingSurvey.partD || {},
        partE: {
          areasWithoutPresence: editingSurvey.partE?.areasWithoutPresence || { description: '', type: 'urban' },
          panchayatsWithoutPresence: editingSurvey.partE?.panchayatsWithoutPresence || '',
          newComponentsLast5Years: editingSurvey.partE?.newComponentsLast5Years || { count: null, type: 'urban', details: '' },
          workersGrowthInLast5Years: editingSurvey.partE?.workersGrowthInLast5Years || { count: null, type: 'personalConnections' },
          componentsToFormIn6Months: editingSurvey.partE?.componentsToFormIn6Months || {
            jih: null, vanitha: null, solidarity: null, sio: null, gio: null, teenIndia: null, malarvadi: null
          }
        }
      };
      setFormData(normalizedFormData);
    }
  }, [editingSurvey]);

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1: return <PartA />;
      case 2: return <PartB />;
      case 3: return <PartC />;
      case 4: return <PartD />;
      case 5: return <MonthlySurveyPartE onSubmit={onSubmit} editingSurvey={editingSurvey} isAdmin={isAdmin} />;
      default: return <PartA />;
    }
  };  const getStepTitle = () => {
    switch (currentStep) {
      case 1: return 'PART-A (പൊതു വിവരങ്ങൾ)';
      case 2: return 'PART-B (സംഘടനാ സംവിധാനങ്ങൾ)';
      case 3: return 'PART-C (പൊതുവേദികൾ)';
      case 4: return 'PART-D (പൊതുസംവിധാനങ്ങൾ)';
      case 5: return 'PART-E (കൂടുതൽ വിവരങ്ങൾ)';
      default: return 'Monthly Survey';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>തിരികെ പോകുക</span>
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {editingSurvey && editingSurvey._id ? 'മാസിക സർവേ എഡിറ്റ് ചെയ്യുക' : 'പുതിയ മാസിക സർവേ'}
                </h1>
                <p className="text-sm text-gray-600">{getStepTitle()}</p>
              </div>
            </div>
            
            {/* Progress Steps */}
            <div className="hidden md:flex items-center space-x-2">
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                      step === currentStep
                        ? 'bg-green-600 text-white'
                        : step < currentStep
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}
                  >
                    {step < currentStep ? '✓' : step}
                  </div>
                  {step < 5 && (
                    <div
                      className={`w-8 h-1 mx-2 ${
                        step < currentStep ? 'bg-green-500' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto">
        {renderCurrentStep()}
      </main>
    </div>
  );
};

export default MonthlySurveyPage;