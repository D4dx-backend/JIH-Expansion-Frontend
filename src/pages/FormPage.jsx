import React from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import { useForm } from '../contexts/FormContext';
import PartA from '../components/forms/PartA';
import PartB from '../components/forms/PartB';
import PartC from '../components/forms/PartC';
import PartD from '../components/forms/PartD';
import PartE from '../components/forms/PartE';

const FormPage = ({ onBack, onSubmit, editingForm, isAdmin = false }) => {
  const { currentStep, nextStep, prevStep, formData, setFormData } = useForm();

  // Load editing form data if provided
  React.useEffect(() => {
    if (editingForm) {
      // Ensure all required fields are present
      const normalizedFormData = {
        district: editingForm.district || '',
        partA: {
          totalPopulation: editingForm.partA?.totalPopulation || null,
          muslimPercentage: editingForm.partA?.muslimPercentage || null,
          hinduPercentage: editingForm.partA?.hinduPercentage || null,
          christianPercentage: editingForm.partA?.christianPercentage || null,
          othersPercentage: editingForm.partA?.othersPercentage || null,
          movementPercentage: editingForm.partA?.movementPercentage || null,
          majorityInReligiousOrganizations: editingForm.partA?.majorityInReligiousOrganizations || '',
          secondPosition: editingForm.partA?.secondPosition || '',
          thirdPosition: editingForm.partA?.thirdPosition || '',
          ourPosition: editingForm.partA?.ourPosition || '',
          morePoliticalInfluence: editingForm.partA?.morePoliticalInfluence || ''
        },
        partB: editingForm.partB || {},
        partC: editingForm.partC || {},
        partD: editingForm.partD || {},
        partE: editingForm.partE || {}
      };
      setFormData(normalizedFormData);
    }
  }, [editingForm]); // Remove setFormData from dependencies

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <PartA />;
      case 2:
        return <PartB />;
      case 3:
        return <PartC />;
      case 4:
        return <PartD />;
      case 5:
        return <PartE onSubmit={onSubmit} editingForm={editingForm} isAdmin={isAdmin} />;
      default:
        return <PartA />;
    }
  };

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return 'PART-A (പൊതു വിവരങ്ങൾ)';
      case 2:
        return 'PART-B (സംഘടനാ സംവിധാനങ്ങൾ)';
      case 3:
        return 'PART-C (പൊതുവേദികൾ)';
      case 4:
        return 'PART-D (പൊതുസംവിധാനങ്ങൾ)';
      case 5:
        return 'PART-E (കൂടുതൽ വിവരങ്ങൾ)';
      default:
        return 'Form';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-4 gap-4">
            <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
              <button
                onClick={onBack}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex-1 sm:flex-none">
                <h1 className="text-lg sm:text-xl font-semibold text-gray-900">
                  {editingForm && editingForm._id ? 'ഫോം എഡിറ്റ് ചെയ്യുക' : 'ഓർഗനൈസേഷൻ എക്സ്പാൻഷൻ ഫോം'}
                </h1>
                <p className="text-xs sm:text-sm text-gray-500">
                  {getStepTitle()}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="text-xs sm:text-sm text-gray-500">
                Step {currentStep} of 5
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-center space-x-2 sm:space-x-4">
              {[1, 2, 3, 4, 5].map((step) => (
                <div key={step} className="flex items-center">
                  <div
                    className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs sm:text-sm font-medium ${
                      step <= currentStep
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step}
                  </div>
                  {step < 5 && (
                    <div
                      className={`w-4 sm:w-8 h-1 mx-1 sm:mx-2 ${
                        step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          {renderCurrentStep()}
        </div>
      </main>
    </div>
  );
};

export default FormPage;
