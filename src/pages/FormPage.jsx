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
        partE: {
          areasWithoutPresence: editingForm.partE?.areasWithoutPresence || { description: '', type: 'urban' },
          panchayatsWithoutPresence: editingForm.partE?.panchayatsWithoutPresence || '',
          newComponentsLast5Years: editingForm.partE?.newComponentsLast5Years || { count: null, type: 'urban', details: '' },
          workersGrowthInLast5Years: editingForm.partE?.workersGrowthInLast5Years || { count: null, type: 'personalConnections' },
          componentsToFormIn6Months: editingForm.partE?.componentsToFormIn6Months || {
            jih: null,
            vanitha: null,
            solidarity: null,
            sio: null,
            gio: null,
            teenIndia: null,
            malarvadi: null
          }
        }
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
                  {editingForm && editingForm._id ? 'ഫോം എഡിറ്റ് ചെയ്യുക' : 'പുതിയ ഫോം'}
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
                        ? 'bg-blue-600 text-white'
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

export default FormPage;
