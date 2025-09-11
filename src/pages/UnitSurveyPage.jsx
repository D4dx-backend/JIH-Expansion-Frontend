import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Check } from 'lucide-react';
import UnitPageA from '../components/forms/UnitPageA';
import UnitPageB from '../components/forms/UnitPageB';
import axios from 'axios';
import jihLogo from '../assets/jih-logo2.png';

const UnitSurveyPage = ({ onBack, editingSurvey = null }) => {
  const { unitId } = useParams();
  const navigate = useNavigate();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    district: '',
    area: '',
    component: '',
    workers: {
      rukkun: '',
      karkun: '',
      activeAssociate: ''
    },
    partA: {
      codes: '',
      spokenPersons: {
        male: '',
        female: ''
      },
      authorityPersons: {
        qscStudent: false,
        regularKhutbaListener: false,
        prabodhanamReader: false,
        pfBeneficiary: false,
        bzBeneficiary: false,
        regionalReliefBeneficiary: false,
        interestFreeJusticeBeneficiary: false,
        sahitiyabandham: false,
        aaramamReader: false,
        tamheedulManhabStudent: false,
        institutionAlumni: false,
        neighborhoodGroupMember: false,
        friendshipForumMember: false,
        palliativeConnection: false,
        neighborhoodGroupMember2: false,
        friendsClubMember: false,
        mediaReader: false,
        ayathulDursalQuranStudent: false,
        heavensGuardian: false,
        schoolGuardian: false,
        arabicCollegeGuardian: false,
        arabicCollegeStudent: false,
        artsCollegeStudent: false,
        artsCollegeGuardian: false,
        publicCampusStudent: false,
        otherNGOs: false,
        mahalluConnection: false,
        fullTimeWorkerConnection: false
      }
    },
    partB: {
      newJIHMembers: {
        male: '',
        female: ''
      },
      memberCategories: {
        qscStudent: false,
        regularKhutbaListener: false,
        prabodhanamReader: false,
        pfBeneficiary: false,
        bzBeneficiary: false,
        regionalReliefBeneficiary: false,
        interestFreeJusticeBeneficiary: false,
        sahitiyabandham: false,
        aaramamReader: false,
        tamheedulManhabStudent: false,
        institutionAlumni: false,
        neighborhoodGroupMember: false,
        friendshipForumMember: false,
        palliativeConnection: false,
        neighborhoodGroupMember2: false,
        friendsClubMember: false,
        mediaReader: false,
        ayathulDursalQuranStudent: false,
        heavensGuardian: false,
        schoolGuardian: false,
        arabicCollegeGuardian: false,
        arabicCollegeStudent: false,
        artsCollegeStudent: false,
        artsCollegeGuardian: false,
        publicCampusStudent: false,
        otherNGOs: false,
        mahalluConnection: false,
        fullTimeWorkerConnection: false
      }
    },
    partC: {
      growthAcceleration: {
        rukkun: '',
        karkun: '',
        solidarity: '',
        sio: '',
        gio: '',
        teenIndia: '',
        malarvadi: ''
      }
    },
    month: '',
    year: new Date().getFullYear()
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Auto-fill month
    const currentDate = new Date();
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'];
    
    setFormData(prev => ({
      ...prev,
      month: monthNames[currentDate.getMonth()]
    }));

    // Load editing survey data if provided
    if (editingSurvey) {
      setFormData(prev => ({
        ...prev,
        ...editingSurvey
      }));
    }
  }, [editingSurvey]);

  const handleNext = (data) => {
    setFormData(prev => ({
      ...prev,
      ...data,
      // Ensure nested objects are properly merged
      workers: { ...prev.workers, ...data.workers },
      partA: {
        ...prev.partA,
        ...data.partA,
        spokenPersons: { ...prev.partA?.spokenPersons, ...data.partA?.spokenPersons },
        authorityPersons: { ...prev.partA?.authorityPersons, ...data.partA?.authorityPersons }
      },
      partB: {
        ...prev.partB,
        ...data.partB,
        newJIHMembers: { ...prev.partB?.newJIHMembers, ...data.partB?.newJIHMembers },
        memberCategories: { ...prev.partB?.memberCategories, ...data.partB?.memberCategories }
      },
      partC: {
        ...prev.partC,
        ...data.partC,
        growthAcceleration: { ...prev.partC?.growthAcceleration, ...data.partC?.growthAcceleration }
      }
    }));
    setCurrentStep(2);
  };

  const handlePrevious = (data) => {
    setFormData(prev => ({
      ...prev,
      ...data,
      // Ensure nested objects are properly merged
      workers: { ...prev.workers, ...data.workers },
      partA: {
        ...prev.partA,
        ...data.partA,
        spokenPersons: { ...prev.partA?.spokenPersons, ...data.partA?.spokenPersons },
        authorityPersons: { ...prev.partA?.authorityPersons, ...data.partA?.authorityPersons }
      },
      partB: {
        ...prev.partB,
        ...data.partB,
        newJIHMembers: { ...prev.partB?.newJIHMembers, ...data.partB?.newJIHMembers },
        memberCategories: { ...prev.partB?.memberCategories, ...data.partB?.memberCategories }
      },
      partC: {
        ...prev.partC,
        ...data.partC,
        growthAcceleration: { ...prev.partC?.growthAcceleration, ...data.partC?.growthAcceleration }
      }
    }));
    setCurrentStep(1);
  };

  const handleSubmit = async () => {
    try {
      setIsLoading(true);
      setError('');
      setSuccess('');

      const token = localStorage.getItem('userToken');
      const headers = { Authorization: `Bearer ${token}` };

      // Ensure proper data structure before submission
      const submitData = {
        ...formData,
        month: formData.month,
        year: formData.year,
        // Ensure partA has proper structure
        partA: {
          codes: formData.partA?.codes || '',
          spokenPersons: {
            male: formData.partA?.spokenPersons?.male || 0,
            female: formData.partA?.spokenPersons?.female || 0
          },
          authorityPersons: formData.partA?.authorityPersons || {}
        },
        // Ensure partB has proper structure
        partB: {
          newJIHMembers: {
            male: formData.partB?.newJIHMembers?.male || 0,
            female: formData.partB?.newJIHMembers?.female || 0
          },
          memberCategories: formData.partB?.memberCategories || {}
        },
        // Ensure partC has proper structure
        partC: {
          growthAcceleration: {
            rukkun: formData.partC?.growthAcceleration?.rukkun || 0,
            karkun: formData.partC?.growthAcceleration?.karkun || 0,
            solidarity: formData.partC?.growthAcceleration?.solidarity || 0,
            sio: formData.partC?.growthAcceleration?.sio || 0,
            gio: formData.partC?.growthAcceleration?.gio || 0,
            teenIndia: formData.partC?.growthAcceleration?.teenIndia || 0,
            malarvadi: formData.partC?.growthAcceleration?.malarvadi || 0
          }
        }
      };

      // Debug: Log the data being submitted
      console.log('=== SUBMISSION DEBUG ===');
      console.log('Full formData:', formData);
      console.log('Full submitData:', submitData);
      console.log('partA:', submitData.partA);
      console.log('partA.spokenPersons:', submitData.partA?.spokenPersons);
      console.log('partA.spokenPersons type:', typeof submitData.partA?.spokenPersons);
      console.log('partB:', submitData.partB);
      console.log('partC:', submitData.partC);
      console.log('partC.growthAcceleration:', submitData.partC?.growthAcceleration);
      console.log('partC.growthAcceleration type:', typeof submitData.partC?.growthAcceleration);
      console.log('=== END DEBUG ===');

      let response;
      if (editingSurvey) {
        // Update existing survey
        response = await axios.put(
          `${import.meta.env.VITE_API_URL}/api/unit-admin/unit-survey/${editingSurvey._id}`,
          submitData,
          { headers }
        );
      } else {
        // Create new survey
        response = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/unit-admin/unit-survey`,
          submitData,
          { headers }
        );
      }

      setSuccess(editingSurvey ? 'Unit survey updated successfully!' : 'Unit survey submitted successfully!');
      
      // Redirect after a short delay
      setTimeout(() => {
        if (onBack) {
          onBack();
        } else {
          navigate(`/unit/${unitId}`);
        }
      }, 2000);

    } catch (error) {
      console.error('Survey submission error:', error);
      setError(error.response?.data?.message || 'Failed to submit survey. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <UnitPageA
            onNext={handleNext}
            formData={formData}
            setFormData={setFormData}
          />
        );
      case 2:
        return (
          <UnitPageB
            onNext={handleSubmit}
            onPrevious={handlePrevious}
            formData={formData}
            setFormData={setFormData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-4 sm:py-6 gap-4">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <img src={jihLogo} alt="JIH Logo" className="h-8 sm:h-12 w-auto" />
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900">
                  {editingSurvey ? 'Edit Unit Survey' : 'Unit Survey'}
                </h1>
                <p className="text-sm text-gray-600">
                  {editingSurvey ? 'Update your unit survey data' : 'Submit monthly unit survey data'}
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <button
                onClick={() => {
                  if (onBack) {
                    onBack();
                  } else {
                    navigate(`/unit/${unitId}`);
                  }
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 text-sm sm:text-base"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Progress Indicator */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center py-4">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  1
                </div>
                <span className="text-sm font-medium">Unit Page A</span>
              </div>
              
              <div className={`w-8 h-0.5 ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}></div>
              
              <div className={`flex items-center space-x-2 ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  2
                </div>
                <span className="text-sm font-medium">Unit Page B</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Survey Info */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
              <select
                value={formData.month}
                onChange={(e) => setFormData(prev => ({ ...prev, month: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Select Month</option>
                {['January', 'February', 'March', 'April', 'May', 'June', 
                  'July', 'August', 'September', 'October', 'November', 'December'].map(month => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
              <input
                type="number"
                value={formData.year}
                onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="2020"
                max="2030"
              />
            </div>
            
            <div className="flex items-end">
              <div className="text-sm text-gray-600">
                {editingSurvey ? 'Editing existing survey' : 'Creating new survey'}
              </div>
            </div>
          </div>
        </div>

        {/* Form Content */}
        <div className="bg-white rounded-lg shadow">
          {renderCurrentStep()}
        </div>

        {/* Messages */}
        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {success && (
          <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center space-x-2">
              <Check className="w-5 h-5 text-green-600" />
              <p className="text-green-600 text-sm">{success}</p>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex items-center space-x-3">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="text-gray-700">
                {editingSurvey ? 'Updating survey...' : 'Submitting survey...'}
              </span>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default UnitSurveyPage;
