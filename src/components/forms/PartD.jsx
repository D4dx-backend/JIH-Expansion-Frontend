import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useForm } from '../../contexts/FormContext';

// CSS to remove number input spinners
const numberInputStyles = {
  WebkitAppearance: 'none',
  MozAppearance: 'textfield',
  appearance: 'none'
};

const PartD = () => {
  const { formData, updateFormData, nextStep, prevStep, validateCurrentStep } = useForm();

  const handleChange = (field, value) => {
    // Only allow numbers
    const stringValue = String(value || '');
    const numericValue = stringValue.replace(/[^0-9]/g, '');
    const numValue = numericValue === '' ? null : parseInt(numericValue) || 0;
    updateFormData('partD', { [field]: numValue });
  };

  const handleAreasChange = (field, value) => {
    // Only allow numbers
    const stringValue = String(value || '');
    const numericValue = stringValue.replace(/[^0-9]/g, '');
    const numValue = numericValue === '' ? null : parseInt(numericValue) || 0;
    updateFormData('partD', {
      areas: {
        ...formData.partD.areas,
        [field]: numValue
      }
    });
  };

  const handleSystemChange = (systemKey, field, value) => {
    // Only allow numbers
    const stringValue = String(value || '');
    const numericValue = stringValue.replace(/[^0-9]/g, '');
    const numValue = numericValue === '' ? null : parseInt(numericValue) || 0;
    updateFormData('partD', {
      [systemKey]: {
        ...formData.partD[systemKey],
        [field]: numValue
      }
    });
  };

  const handlePartCChange = (section, field, value) => {
    if (field === 'count' || field === 'cooperatingOthers') {
      // Only allow numbers for count and cooperatingOthers
      const stringValue = String(value || '');
      const numericValue = stringValue.replace(/[^0-9]/g, '');
      const numValue = numericValue === '' ? null : parseInt(numericValue) || 0;
      updateFormData('partC', {
        [section]: {
          ...formData.partC[section],
          [field]: numValue
        }
      });
    } else {
      // Allow text for remarks
      updateFormData('partC', {
        [section]: {
          ...formData.partC[section],
          [field]: value
        }
      });
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          PART-D (പൊതുസംവിധാനങ്ങൾ)
        </h2>
        <p className="text-gray-600">
          പൊതുസംവിധാനങ്ങളുടെ വിവരങ്ങൾ നൽകുക
        </p>
      </div>

      {/* Part C - Friendship Platforms and Activities */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">സൗഹൃദ പ്ലാറ്റ്ഫോമുകൾ</h3>
        
        {/* Friendship Platforms */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">എണ്ണം</label>
            <input
              type="number"
              value={formData.partC.friendshipPlatforms.count !== null && formData.partC.friendshipPlatforms.count !== undefined ? formData.partC.friendshipPlatforms.count : ''}
              onChange={(e) => handlePartCChange('friendshipPlatforms', 'count', e.target.value)}
              className="w-full px-6 py-4 border border-gray-300 rounded-lg text-lg min-w-[150px]"
              style={numberInputStyles}
              placeholder="എണ്ണം"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">സഹകരിക്കുന്ന മറ്റുള്ളവർ</label>
            <input
              type="number"
              value={formData.partC.friendshipPlatforms.cooperatingOthers !== null && formData.partC.friendshipPlatforms.cooperatingOthers !== undefined ? formData.partC.friendshipPlatforms.cooperatingOthers : ''}
              onChange={(e) => handlePartCChange('friendshipPlatforms', 'cooperatingOthers', e.target.value)}
              className="w-full px-6 py-4 border border-gray-300 rounded-lg text-lg min-w-[150px]"
              style={numberInputStyles}
              placeholder="എണ്ണം"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">അഭിപ്രായങ്ങൾ</label>
            <input
              type="text"
              value={formData.partC.friendshipPlatforms.remarks || ''}
              onChange={(e) => handlePartCChange('friendshipPlatforms', 'remarks', e.target.value)}
              className="w-full px-6 py-4 border border-gray-300 rounded-lg text-lg min-w-[150px]"
              placeholder="അഭിപ്രായങ്ങൾ"
            />
          </div>
        </div>

        {/* Friday Club */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">എണ്ണം</label>
            <input
              type="number"
              value={formData.partC.fridayClub.count !== null && formData.partC.fridayClub.count !== undefined ? formData.partC.fridayClub.count : ''}
              onChange={(e) => handlePartCChange('fridayClub', 'count', e.target.value)}
              className="w-full px-6 py-4 border border-gray-300 rounded-lg text-lg min-w-[150px]"
              style={numberInputStyles}
              placeholder="എണ്ണം"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">സഹകരിക്കുന്ന മറ്റുള്ളവർ</label>
            <input
              type="number"
              value={formData.partC.fridayClub.cooperatingOthers !== null && formData.partC.fridayClub.cooperatingOthers !== undefined ? formData.partC.fridayClub.cooperatingOthers : ''}
              onChange={(e) => handlePartCChange('fridayClub', 'cooperatingOthers', e.target.value)}
              className="w-full px-6 py-4 border border-gray-300 rounded-lg text-lg min-w-[150px]"
              style={numberInputStyles}
              placeholder="എണ്ണം"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">അഭിപ്രായങ്ങൾ</label>
            <input
              type="text"
              value={formData.partC.fridayClub.remarks || ''}
              onChange={(e) => handlePartCChange('fridayClub', 'remarks', e.target.value)}
              className="w-full px-6 py-4 border border-gray-300 rounded-lg text-lg min-w-[150px]"
              placeholder="അഭിപ്രായങ്ങൾ"
            />
          </div>
        </div>

        {/* Wings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">എണ്ണം</label>
            <input
              type="number"
              value={formData.partC.wings.count !== null && formData.partC.wings.count !== undefined ? formData.partC.wings.count : ''}
              onChange={(e) => handlePartCChange('wings', 'count', e.target.value)}
              className="w-full px-6 py-4 border border-gray-300 rounded-lg text-lg min-w-[150px]"
              style={numberInputStyles}
              placeholder="എണ്ണം"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">സഹകരിക്കുന്ന മറ്റുള്ളവർ</label>
            <input
              type="number"
              value={formData.partC.wings.cooperatingOthers !== null && formData.partC.wings.cooperatingOthers !== undefined ? formData.partC.wings.cooperatingOthers : ''}
              onChange={(e) => handlePartCChange('wings', 'cooperatingOthers', e.target.value)}
              className="w-full px-6 py-4 border border-gray-300 rounded-lg text-lg min-w-[150px]"
              style={numberInputStyles}
              placeholder="എണ്ണം"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">അഭിപ്രായങ്ങൾ</label>
            <input
              type="text"
              value={formData.partC.wings.remarks || ''}
              onChange={(e) => handlePartCChange('wings', 'remarks', e.target.value)}
              className="w-full px-6 py-4 border border-gray-300 rounded-lg text-lg min-w-[150px]"
              placeholder="അഭിപ്രായങ്ങൾ"
            />
          </div>
        </div>

        {/* Neighborhood Groups */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">എണ്ണം</label>
            <input
              type="number"
              value={formData.partC.neighborhoodGroups.count !== null && formData.partC.neighborhoodGroups.count !== undefined ? formData.partC.neighborhoodGroups.count : ''}
              onChange={(e) => handlePartCChange('neighborhoodGroups', 'count', e.target.value)}
              className="w-full px-6 py-4 border border-gray-300 rounded-lg text-lg min-w-[150px]"
              style={numberInputStyles}
              placeholder="എണ്ണം"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">സഹകരിക്കുന്ന മറ്റുള്ളവർ</label>
            <input
              type="number"
              value={formData.partC.neighborhoodGroups.cooperatingOthers !== null && formData.partC.neighborhoodGroups.cooperatingOthers !== undefined ? formData.partC.neighborhoodGroups.cooperatingOthers : ''}
              onChange={(e) => handlePartCChange('neighborhoodGroups', 'cooperatingOthers', e.target.value)}
              className="w-full px-6 py-4 border border-gray-300 rounded-lg text-lg min-w-[150px]"
              style={numberInputStyles}
              placeholder="എണ്ണം"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">അഭിപ്രായങ്ങൾ</label>
            <input
              type="text"
              value={formData.partC.neighborhoodGroups.remarks || ''}
              onChange={(e) => handlePartCChange('neighborhoodGroups', 'remarks', e.target.value)}
              className="w-full px-6 py-4 border border-gray-300 rounded-lg text-lg min-w-[150px]"
              placeholder="അഭിപ്രായങ്ങൾ"
            />
          </div>
        </div>

        {/* Other NGOs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">എണ്ണം</label>
            <input
              type="number"
              value={formData.partC.otherNGOs.count !== null && formData.partC.otherNGOs.count !== undefined ? formData.partC.otherNGOs.count : ''}
              onChange={(e) => handlePartCChange('otherNGOs', 'count', e.target.value)}
              className="w-full px-6 py-4 border border-gray-300 rounded-lg text-lg min-w-[150px]"
              style={numberInputStyles}
              placeholder="എണ്ണം"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">സഹകരിക്കുന്ന മറ്റുള്ളവർ</label>
            <input
              type="number"
              value={formData.partC.otherNGOs.cooperatingOthers !== null && formData.partC.otherNGOs.cooperatingOthers !== undefined ? formData.partC.otherNGOs.cooperatingOthers : ''}
              onChange={(e) => handlePartCChange('otherNGOs', 'cooperatingOthers', e.target.value)}
              className="w-full px-6 py-4 border border-gray-300 rounded-lg text-lg min-w-[150px]"
              style={numberInputStyles}
              placeholder="എണ്ണം"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">അഭിപ്രായങ്ങൾ</label>
            <input
              type="text"
              value={formData.partC.otherNGOs.remarks || ''}
              onChange={(e) => handlePartCChange('otherNGOs', 'remarks', e.target.value)}
              className="w-full px-6 py-4 border border-gray-300 rounded-lg text-lg min-w-[150px]"
              placeholder="അഭിപ്രായങ്ങൾ"
            />
          </div>
        </div>

        {/* Palliative */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">എണ്ണം</label>
            <input
              type="number"
              value={formData.partC.palliative.count !== null && formData.partC.palliative.count !== undefined ? formData.partC.palliative.count : ''}
              onChange={(e) => handlePartCChange('palliative', 'count', e.target.value)}
              className="w-full px-6 py-4 border border-gray-300 rounded-lg text-lg min-w-[150px]"
              style={numberInputStyles}
              placeholder="എണ്ണം"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">സഹകരിക്കുന്ന മറ്റുള്ളവർ</label>
            <input
              type="number"
              value={formData.partC.palliative.cooperatingOthers !== null && formData.partC.palliative.cooperatingOthers !== undefined ? formData.partC.palliative.cooperatingOthers : ''}
              onChange={(e) => handlePartCChange('palliative', 'cooperatingOthers', e.target.value)}
              className="w-full px-6 py-4 border border-gray-300 rounded-lg text-lg min-w-[150px]"
              style={numberInputStyles}
              placeholder="എണ്ണം"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">അഭിപ്രായങ്ങൾ</label>
            <input
              type="text"
              value={formData.partC.palliative.remarks || ''}
              onChange={(e) => handlePartCChange('palliative', 'remarks', e.target.value)}
              className="w-full px-6 py-4 border border-gray-300 rounded-lg text-lg min-w-[150px]"
              placeholder="അഭിപ്രായങ്ങൾ"
            />
          </div>
        </div>

        {/* Other Activities */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">എണ്ണം</label>
            <input
              type="number"
              value={formData.partC.otherActivities.count !== null && formData.partC.otherActivities.count !== undefined ? formData.partC.otherActivities.count : ''}
              onChange={(e) => handlePartCChange('otherActivities', 'count', e.target.value)}
              className="w-full px-6 py-4 border border-gray-300 rounded-lg text-lg min-w-[150px]"
              style={numberInputStyles}
              placeholder="എണ്ണം"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">സഹകരിക്കുന്ന മറ്റുള്ളവർ</label>
            <input
              type="number"
              value={formData.partC.otherActivities.cooperatingOthers !== null && formData.partC.otherActivities.cooperatingOthers !== undefined ? formData.partC.otherActivities.cooperatingOthers : ''}
              onChange={(e) => handlePartCChange('otherActivities', 'cooperatingOthers', e.target.value)}
              className="w-full px-6 py-4 border border-gray-300 rounded-lg text-lg min-w-[150px]"
              style={numberInputStyles}
              placeholder="എണ്ണം"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">അഭിപ്രായങ്ങൾ</label>
            <input
              type="text"
              value={formData.partC.otherActivities.remarks || ''}
              onChange={(e) => handlePartCChange('otherActivities', 'remarks', e.target.value)}
              className="w-full px-6 py-4 border border-gray-300 rounded-lg text-lg min-w-[150px]"
              placeholder="അഭിപ്രായങ്ങൾ"
            />
          </div>
        </div>
      </div>

      {/* Part D - Public Systems Table */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">ഭാഗം-ഡി (പൊതുസംവിധാനങ്ങൾ)</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-3 text-left font-medium">വിവരങ്ങൾ</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-medium">എണ്ണം</th>
              </tr>
            </thead>
            <tbody>
              {/* Interest Free Systems */}
              <tr>
                <td className="border border-gray-300 px-4 py-3 font-medium">1. പലിശരഹിത സംവിധാനം (എണ്ണം)</td>
                <td className="border border-gray-300 px-4 py-3">
                  <input
                    type="number"
                    value={formData.partD.interestFreeSystems.count !== null && formData.partD.interestFreeSystems.count !== undefined ? formData.partD.interestFreeSystems.count : ''}
                    onChange={(e) => handleSystemChange('interestFreeSystems', 'count', e.target.value)}
                    className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px]"
                    style={numberInputStyles}
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-3 font-medium">കഴിഞ്ഞ മൂന്ന് വർഷത്തിനിടയിൽ സഹായം സ്വീകരിച്ച മറ്റുള്ളവരുടെ എണ്ണം</td>
                <td className="border border-gray-300 px-4 py-3">
                  <input
                    type="number"
                    value={formData.partD.interestFreeSystems.beneficiariesLast3Years !== null && formData.partD.interestFreeSystems.beneficiariesLast3Years !== undefined ? formData.partD.interestFreeSystems.beneficiariesLast3Years : ''}
                    onChange={(e) => handleSystemChange('interestFreeSystems', 'beneficiariesLast3Years', e.target.value)}
                    className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px]"
                    style={numberInputStyles}
                  />
                </td>
              </tr>

              {/* Zakat Committee */}
              <tr>
                <td className="border border-gray-300 px-4 py-3 font-medium">2. സകാത്ത് കമ്മറ്റി (എണ്ണം)</td>
                <td className="border border-gray-300 px-4 py-3">
                  <input
                    type="number"
                    value={formData.partD.zakatCommittee.count || ''}
                    onChange={(e) => handleSystemChange('zakatCommittee', 'count', e.target.value)}
                    className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px]"
                    style={numberInputStyles}
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-3 font-medium">കഴിഞ്ഞ മൂന്ന് വർഷത്തിനിടയിൽ സഹായം സ്വീകരിച്ച മറ്റുള്ളവരുടെ എണ്ണം</td>
                <td className="border border-gray-300 px-4 py-3">
                  <input
                    type="number"
                    value={formData.partD.zakatCommittee.beneficiariesLast3Years || ''}
                    onChange={(e) => handleSystemChange('zakatCommittee', 'beneficiariesLast3Years', e.target.value)}
                    className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px]"
                    style={numberInputStyles}
                  />
                </td>
              </tr>

              {/* Peoples Foundation Beneficiaries */}
              <tr>
                <td className="border border-gray-300 px-4 py-3 font-medium">3. പീപ്പിൾസ് ഫൗണ്ടേഷനിൽ നിന്നും കഴിഞ്ഞ 3 വർഷത്തിനിടെ വ്യക്തിപരമായി സഹായം സ്വീകരിച്ച മറ്റുള്ളവർ</td>
                <td className="border border-gray-300 px-4 py-3">
                  <input
                    type="number"
                    value={formData.partD.peoplesFoundationBeneficiaries || ''}
                    onChange={(e) => handleChange('peoplesFoundationBeneficiaries', e.target.value)}
                    className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px]"
                    style={numberInputStyles}
                  />
                </td>
              </tr>

              {/* Housing Project Beneficiaries */}
              <tr>
                <td className="border border-gray-300 px-4 py-3 font-medium">4. ഹൗസിംഗ് പ്രൊജക്‌ടുകൾ, കുടിവെള്ളപദ്ധതികൾ തുടങ്ങിയ നമ്മുടെ സേവന പ്രൊജക്ടുകളുടെ (പ്രാദേശികവും അല്ലാത്തതുമായ) കഴിഞ്ഞ 3 വർഷത്തിനിടെ ഗുണഭോക്താക്കളായ മറ്റുള്ളവർ</td>
                <td className="border border-gray-300 px-4 py-3">
                  <input
                    type="number"
                    value={formData.partD.housingProjectBeneficiaries || ''}
                    onChange={(e) => handleChange('housingProjectBeneficiaries', e.target.value)}
                    className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px]"
                    style={numberInputStyles}
                  />
                </td>
              </tr>

              {/* Baytul Zakat Beneficiaries */}
              <tr>
                <td className="border border-gray-300 px-4 py-3 font-medium">5. ബൈത്തുസ്സകാത്തിൽ നിന്നും കഴിഞ്ഞ 3 വർഷത്തിനിടെ വ്യക്തിപരമായി സഹായം സ്വീകരിച്ച മറ്റുള്ളവർ</td>
                <td className="border border-gray-300 px-4 py-3">
                  <input
                    type="number"
                    value={formData.partD.baytulZakatBeneficiaries || ''}
                    onChange={(e) => handleChange('baytulZakatBeneficiaries', e.target.value)}
                    className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px]"
                    style={numberInputStyles}
                  />
                </td>
              </tr>

              {/* Non Workers in Madhyamam Readers */}
              <tr>
                <td className="border border-gray-300 px-4 py-3 font-medium">6. മാധ്യമം വായനക്കാരിൽ പ്രവർത്തകരല്ലാത്തവർ (ഏകദേശം)*</td>
                <td className="border border-gray-300 px-4 py-3">
                  <input
                    type="number"
                    value={formData.partD.nonWorkersinMadhyamamReaders || ''}
                    onChange={(e) => handleChange('nonWorkersinMadhyamamReaders', e.target.value)}
                    className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px]"
                    style={numberInputStyles}
                  />
                </td>
              </tr>

              {/* Non Workers in Prabodhanam Readers */}
              <tr>
                <td className="border border-gray-300 px-4 py-3 font-medium">7. പ്രബോധനം വായനക്കാരിൽ പ്രവർത്തകരല്ലാത്തവർ *</td>
                <td className="border border-gray-300 px-4 py-3">
                  <input
                    type="number"
                    value={formData.partD.nonWorkersinPrabodhanamReaders || ''}
                    onChange={(e) => handleChange('nonWorkersinPrabodhanamReaders', e.target.value)}
                    className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px]"
                    style={numberInputStyles}
                  />
                </td>
              </tr>

              {/* Non Workers in Aaramam Readers */}
              <tr>
                <td className="border border-gray-300 px-4 py-3 font-medium">8. ആരാമം വായനക്കാരിൽ പ്രവർത്തകരല്ലാത്തവർ *</td>
                <td className="border border-gray-300 px-4 py-3">
                  <input
                    type="number"
                    value={formData.partD.nonWorkersinAaramamReaders || ''}
                    onChange={(e) => handleChange('nonWorkersinAaramamReaders', e.target.value)}
                    className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px]"
                    style={numberInputStyles}
                  />
                </td>
              </tr>

              {/* Non Workers in Ayah Users */}
              <tr>
                <td className="border border-gray-300 px-4 py-3 font-medium">9. ആയാത്ത് ദർസെ ഖുർആൻ സ്ഥിരമായി ഉപയോഗപ്പെടുത്തുന്ന പ്രവർത്തകരല്ലാത്തവർ*</td>
                <td className="border border-gray-300 px-4 py-3">
                  <input
                    type="number"
                    value={formData.partD.nonWorkersinAyahUsers || ''}
                    onChange={(e) => handleChange('nonWorkersinAyahUsers', e.target.value)}
                    className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px]"
                    style={numberInputStyles}
                  />
                </td>
              </tr>

              {/* Areas */}
              <tr>
                <td className="border border-gray-300 px-4 py-3 font-medium">10. നമ്മുടെ മഹല്ലുകൾ (പൂർണം/ഭാഗികം)</td>
                <td className="border border-gray-300 px-4 py-3">
                  <input
                    type="number"
                    value={formData.partD.areas.ourAreas || ''}
                    onChange={(e) => handleAreasChange('ourAreas', e.target.value)}
                    className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px]"
                    style={numberInputStyles}
                  />
                </td>
              </tr>
              <tr>
                <td className="border border-gray-300 px-4 py-3 font-medium">ഇതിൽ രജിസ്റ്റർ ചെയ്‌ത നമ്മുടെതല്ലാത്ത കുടുംബങ്ങൾ</td>
                <td className="border border-gray-300 px-4 py-3">
                  <input
                    type="number"
                    value={formData.partD.areas.registeredNonOurFamilies || ''}
                    onChange={(e) => handleAreasChange('registeredNonOurFamilies', e.target.value)}
                    className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px]"
                    style={numberInputStyles}
                  />
                </td>
              </tr>

              {/* Influential Mahalls */}
              <tr>
                <td className="border border-gray-300 px-4 py-3 font-medium">11. നമുക്ക് സ്വാധീനമുള്ള (കമ്മറ്റി പ്രാതിനിധ്യം) മറ്റു പൊതു മഹല്ലുകൾ</td>
                <td className="border border-gray-300 px-4 py-3">
                  <input
                    type="number"
                    value={formData.partD.influentialMahalls || ''}
                    onChange={(e) => handleChange('influentialMahalls', e.target.value)}
                    className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px]"
                    style={numberInputStyles}
                  />
                </td>
              </tr>

              {/* Khutba Listeners from Organized Areas */}
              <tr>
                <td className="border border-gray-300 px-4 py-3 font-medium">12. നമ്മുടെ ഖുതുബ ശ്രവിക്കാൻ വരുന്ന മറ്റുള്ളവരിൽ പ്രസ്ഥാനഘടനയിൽ ഉള്ള സ്ഥലത്തുനിന്നും വരുന്നവർ (എണ്ണം)</td>
                <td className="border border-gray-300 px-4 py-3">
                  <input
                    type="number"
                    value={formData.partD.khutbaListenersfromOrganizedAreas || ''}
                    onChange={(e) => handleChange('khutbaListenersfromOrganizedAreas', e.target.value)}
                    className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px]"
                    style={numberInputStyles}
                  />
                </td>
              </tr>

              {/* Khutba Listeners from Non-Organized Areas */}
              <tr>
                <td className="border border-gray-300 px-4 py-3 font-medium">13. നമ്മുടെ ഖുതുബ ശ്രവിക്കാൻ വരുന്ന മറ്റുള്ളവരിൽ പ്രസ്ഥാന ഘടന ഇല്ലാത്ത സ്ഥലത്തുനിന്നും വരുന്നവർ (എണ്ണം)</td>
                <td className="border border-gray-300 px-4 py-3">
                  <input
                    type="number"
                    value={formData.partD.khutbaListenersfromNonOrganizedAreas || ''}
                    onChange={(e) => handleChange('khutbaListenersfromNonOrganizedAreas', e.target.value)}
                    className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px]"
                    style={numberInputStyles}
                  />
                </td>
              </tr>

              {/* Full Time Workers */}
              <tr>
                <td className="border border-gray-300 px-4 py-3 font-medium">14. ഫുൾടൈം പ്രവർത്തകരുണ്ടെങ്കിൽ (എണ്ണം)</td>
                <td className="border border-gray-300 px-4 py-3">
                  <input
                    type="number"
                    value={formData.partD.FullTimeWorkers || ''}
                    onChange={(e) => handleChange('FullTimeWorkers', e.target.value)}
                    className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px]"
                    style={numberInputStyles}
                  />
                </td>
              </tr>

              {/* Part Time Workers */}
              <tr>
                <td className="border border-gray-300 px-4 py-3 font-medium">15. പാർട് ടൈം പ്രവർത്തകരുണ്ടെങ്കിൽ (എണ്ണം)</td>
                <td className="border border-gray-300 px-4 py-3">
                  <input
                    type="number"
                    value={formData.partD.PartTimeWorkers || ''}
                    onChange={(e) => handleChange('PartTimeWorkers', e.target.value)}
                    className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px]"
                    style={numberInputStyles}
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>



      {/* Additional Information */}
      <div className="mt-8">
        <div className="bg-yellow-50 p-4 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>കുറിപ്പ്:</strong> * ചിഹ്നമുള്ള വിവരങ്ങൾ ഏകദേശമായി നൽകുക. 
            ഇത് പൊതുസംവിധാനങ്ങളുടെ പ്രവർത്തനങ്ങൾ വിലയിരുത്താൻ സഹായിക്കും.
          </p>
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

export default PartD;
