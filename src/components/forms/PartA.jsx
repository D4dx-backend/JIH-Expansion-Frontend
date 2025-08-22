import React from 'react';
import { ArrowRight } from 'lucide-react';
import { useForm } from '../../contexts/FormContext';

const PartA = () => {
  const { formData, updateFormData, nextStep, validateCurrentStep } = useForm();
  


  const handleInputChange = (field, value) => {
    // Only allow numbers for numeric fields
    if (field === 'totalPopulation' || field === 'muslimPercentage' || 
        field === 'hinduPercentage' || field === 'christianPercentage' || 
        field === 'othersPercentage' || field === 'movementPercentage') {
      // Ensure value is a string before using replace
      const stringValue = String(value || '');
      const numericValue = stringValue.replace(/[^0-9.]/g, '');
      // Convert to number if it's not empty, otherwise keep as empty string
      const finalValue = numericValue === '' ? '' : numericValue;
      updateFormData('partA', { [field]: finalValue });
    } else {
      updateFormData('partA', { [field]: value });
    }
  };

  const handleDistrictChange = (value) => {
    updateFormData('district', value);
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      nextStep();
    } else {
      alert('Please fill in all required fields before proceeding.');
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          PART-A (പൊതു വിവരങ്ങൾ)
        </h2>
        <p className="text-gray-600">
          ജില്ലാ തലത്തിൽ പൊതു വിവരങ്ങൾ നൽകുക
        </p>
      </div>

      {/* District Selection */}
      <div className="mb-8">
        <label className="block text-lg font-medium text-gray-900 mb-3">
          ജില്ല:
        </label>
        <select
          value={formData.district}
          onChange={(e) => handleDistrictChange(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
        >
          <option value="">ജില്ല തിരഞ്ഞെടുക്കുക</option>
          <option value="Thiruvananthapuram">തിരുവനന്തപുരം</option>
          <option value="Kollam">കൊല്ലം</option>
          <option value="Pathanamthitta">പത്തനംതിട്ട</option>
          <option value="Alappuzha">ആലപ്പുഴ</option>
          <option value="Kottayam">കോട്ടയം</option>
          <option value="Idukki">ഇടുക്കി</option>
          <option value="Ernakulam">എറണാകുളം</option>
          <option value="Thrissur">തൃശ്ശൂർ</option>
          <option value="Palakkad">പാലക്കാട്</option>
          <option value="Malappuram">മലപ്പുറം</option>
          <option value="Kozhikode">കോഴിക്കോട്</option>
          <option value="Wayanad">വയനാട്</option>
          <option value="Kannur">കണ്ണൂർ</option>
          <option value="Kasaragod">കാസർഗോഡ്</option>
        </select>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-900 mb-2">
              1. ജനസംഖ്യ (ആകെ)
            </label>
                                     <input
              type="number"
              value={formData.partA.totalPopulation !== null && formData.partA.totalPopulation !== undefined ? formData.partA.totalPopulation : ''}
              onChange={(e) => handleInputChange('totalPopulation', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              placeholder="ജനസംഖ്യ നൽകുക"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-900 mb-2">
              2. മുസ്‌ലിം %
            </label>
                                     <input
              type="number"
              value={formData.partA.muslimPercentage !== null && formData.partA.muslimPercentage !== undefined ? formData.partA.muslimPercentage : ''}
              onChange={(e) => handleInputChange('muslimPercentage', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              placeholder="ശതമാനം നൽകുക"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-900 mb-2">
              3. ഹിന്ദു %
            </label>
                                     <input
              type="number"
              value={formData.partA.hinduPercentage !== null && formData.partA.hinduPercentage !== undefined ? formData.partA.hinduPercentage : ''}
              onChange={(e) => handleInputChange('hinduPercentage', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              placeholder="ശതമാനം നൽകുക"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-900 mb-2">
              4. ക്രിസ്ത്യൻ %
            </label>
                                     <input
              type="number"
              value={formData.partA.christianPercentage !== null && formData.partA.christianPercentage !== undefined ? formData.partA.christianPercentage : ''}
              onChange={(e) => handleInputChange('christianPercentage', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              placeholder="ശതമാനം നൽകുക"
              step="0.01"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-900 mb-2">
              5. മറ്റുള്ളവർ %
            </label>
                                     <input
              type="number"
              value={formData.partA.othersPercentage !== null && formData.partA.othersPercentage !== undefined ? formData.partA.othersPercentage : ''}
              onChange={(e) => handleInputChange('othersPercentage', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              placeholder="ശതമാനം നൽകുക"
              step="0.01"
            />
          </div>

          <div className="bg-gray-100 p-4 rounded-lg">
            <label className="block text-lg font-medium text-gray-700 mb-2">
              6. പ്രസ്ഥാനം %
            </label>
                                     <input
              type="number"
              value={formData.partA.movementPercentage !== null && formData.partA.movementPercentage !== undefined ? formData.partA.movementPercentage : ''}
              onChange={(e) => handleInputChange('movementPercentage', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg bg-white"
              placeholder="ശതമാനം നൽകുക"
              step="0.01"
            />
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div>
            <label className="block text-lg font-medium text-gray-900 mb-2">
              7. മതസംഘടനകളിൽ ഭൂരിപക്ഷം
            </label>
            <input
              type="text"
              value={formData.partA.majorityInReligiousOrganizations}
              onChange={(e) => handleInputChange('majorityInReligiousOrganizations', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              placeholder="വിവരങ്ങൾ നൽകുക"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-900 mb-2">
              8. രണ്ടാം സ്ഥാനം
            </label>
            <input
              type="text"
              value={formData.partA.secondPosition}
              onChange={(e) => handleInputChange('secondPosition', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              placeholder="വിവരങ്ങൾ നൽകുക"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-900 mb-2">
              9. മൂന്നാം സ്ഥാനം
            </label>
            <input
              type="text"
              value={formData.partA.thirdPosition}
              onChange={(e) => handleInputChange('thirdPosition', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              placeholder="വിവരങ്ങൾ നൽകുക"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-900 mb-2">
              10. നമ്മുടെ സ്ഥാനം
            </label>
            <input
              type="text"
              value={formData.partA.ourPosition}
              onChange={(e) => handleInputChange('ourPosition', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              placeholder="വിവരങ്ങൾ നൽകുക"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-900 mb-2">
              11. കൂടുതൽ രാഷ്ട്രീയ സ്വാധീനം
            </label>
            <input
              type="text"
              value={formData.partA.morePoliticalInfluence}
              onChange={(e) => handleInputChange('morePoliticalInfluence', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              placeholder="വിവരങ്ങൾ നൽകുക"
            />
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-12 flex justify-end">
                         <button
          onClick={handleNext}
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

export default PartA;
