import React from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAreaForm } from '../../contexts/AreaFormContext';

const AreaPageF = ({ onSave, isSaving, isEditing = false }) => {
  const { formData, updateFormData, validateCurrentStep, prevStep } = useAreaForm();
  const navigate = useNavigate();

  const wings = [
    { key: 'jih', label: 'JIH' },
    { key: 'vanitha', label: 'വനിത' },
    { key: 'solidarity', label: 'സോളിഡാരിറ്റി' },
    { key: 'sio', label: 'SIO' },
    { key: 'gio', label: 'GIO' },
    { key: 'teenIndia', label: 'ടീന്‍ ഇന്ത്യ' },
    { key: 'malarvadi', label: 'മലര്‍വാടി' }
  ];

  const handleWingGrowthChange = (wingKey, field, value) => {
    // Only allow numbers
    const stringValue = String(value || '');
    const numericValue = stringValue.replace(/[^0-9]/g, '');
    const numValue = numericValue === '' ? null : parseInt(numericValue) || 0;
    
    updateFormData('partF', {
      wingGrowth: {
        ...formData.partF.wingGrowth,
        [wingKey]: {
          ...formData.partF.wingGrowth[wingKey],
          [field]: numValue
        }
      }
    });
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) {
      alert('Please fill in all required fields before submitting.');
      return;
    }

    if (isEditing && onSave) {
      // In editing mode, call the onSave function passed from parent
      onSave(formData);
      return;
    }

    // In creation mode, submit new survey
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/area/surveys`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        alert('Area survey submitted successfully!');
        // Get user data to determine the correct area dashboard URL
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        const areaId = userData.areaId || userData.area;
        navigate(`/area-dashboard/${areaId}`);
      } else {
        const errorData = await response.json();
        alert(`Error: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Submit error:', error);
      alert('Error submitting survey. Please try again.');
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          ഏരിയ തലം റിപ്പോർട്ട് - PART F
        </h2>
        <p className="text-gray-600">
          റിപ്പോർട്ട് കാലയളവിലെ വർദ്ധനവ്
        </p>
      </div>

      {/* Growth in Report Period */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          F. റിപ്പോർട്ട് കാലയളവിലെ വർദ്ധനവ്
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-3 text-left font-medium">വിംഗ്</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-medium">പുതിയ ഘടകങ്ങള്‍ എണ്ണം</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-medium">പുതുതായി വന്നവര്‍</th>
              </tr>
            </thead>
            <tbody>
              {wings.map(wing => (
                <tr key={wing.key}>
                  <td className="border border-gray-300 px-4 py-3 font-medium">{wing.label}</td>
                  <td className="border border-gray-300 px-4 py-3">
                    <input
                      type="number"
                      value={formData.partF.wingGrowth[wing.key]?.newComponents !== null && formData.partF.wingGrowth[wing.key]?.newComponents !== undefined ? formData.partF.wingGrowth[wing.key].newComponents : ''}
                      onChange={(e) => handleWingGrowthChange(wing.key, 'newComponents', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-center"
                      placeholder="0"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    <input
                      type="number"
                      value={formData.partF.wingGrowth[wing.key]?.newMembers !== null && formData.partF.wingGrowth[wing.key]?.newMembers !== undefined ? formData.partF.wingGrowth[wing.key].newMembers : ''}
                      onChange={(e) => handleWingGrowthChange(wing.key, 'newMembers', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-center"
                      placeholder="0"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary */}
      <div className="mb-8 bg-blue-50 p-6 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          സർവേ സംഗ്രഹം
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p><strong>ജില്ല:</strong> {formData.district}</p>
            <p><strong>ഏരിയ:</strong> {formData.area}</p>
            <p><strong>മാസം:</strong> {formData.month}</p>
          </div>
          <div>
            <p><strong>ആകെ ഘടകങ്ങൾ:</strong> {(formData.partA.pj || 0) + (formData.partA.kh || 0) + (formData.partA.vkh || 0)}</p>
            <p><strong>മാസാന്തയോഗം:</strong> {formData.partB.monthlyMeeting || 'തിരഞ്ഞെടുത്തിട്ടില്ല'}</p>
            <p><strong>പ്രധാന തീരുമാനങ്ങൾ:</strong> {(formData.partB.mainDecisions || []).length}</p>
          </div>
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
          onClick={handleSubmit}
          disabled={!validateCurrentStep() || isSaving}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
        >
          <CheckCircle className="w-5 h-5" />
          <span>{isEditing ? 'അപ്ഡേറ്റ് ചെയ്യുക' : 'സമർപ്പിക്കുക'}</span>
        </button>
      </div>
    </div>
  );
};

export default AreaPageF;
