import React from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { useDistrictForm } from '../../contexts/DistrictFormContext';

const DistrictPageB = () => {
  const { formData, updateFormData, prevStep, submitForm, validateCurrentStep } = useDistrictForm();

  const handleInputChange = (field, value, wing = null) => {
    if (wing) {
      // For wing growth fields
      updateFormData('partE', {
        wingGrowth: {
          ...formData.partE.wingGrowth,
          [wing]: {
            ...formData.partE.wingGrowth[wing],
            [field]: value === '' ? null : parseInt(value) || 0
          }
        }
      });
    } else if (field === 'male' || field === 'female') {
      // For invitation counts
      updateFormData('partD', {
        invitations: {
          ...formData.partD.invitations,
          [field]: value === '' ? null : parseInt(value) || 0
        }
      });
    }
  };

  const handleCheckboxChange = (field, checked) => {
    updateFormData('partD', {
      categories: {
        ...formData.partD.categories,
        [field]: checked
      }
    });
  };

  const handleSubmit = async () => {
    try {
      // Validate required fields before submitting
      if (!formData.district) {
        alert('District is required. Please go back and fill in the district field.');
        return;
      }
      
      if (!formData.month) {
        alert('Month is required. Please go back and select a month.');
        return;
      }

      console.log('Submitting district survey with data:', formData);
      
      const token = localStorage.getItem('userToken');
      if (!token) {
        alert('No authentication token found. Please log in again.');
        return;
      }

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/district/surveys`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('Response result:', result);
      
      if (result.success) {
        alert('District survey submitted successfully!');
        // Reset form or redirect back to the dashboard
        const userData = JSON.parse(localStorage.getItem('userData') || '{}');
        if (userData.districtId) {
          window.location.href = `/district-dashboard/${userData.districtId}`;
        } else {
          window.location.href = '/dashboard';
        }
      } else {
        alert('Error submitting survey: ' + result.message);
      }
    } catch (error) {
      console.error('Error submitting survey:', error);
      alert('Error submitting survey. Please try again. Error: ' + error.message);
    }
  };

  const wings = [
    { key: 'jih', label: 'JIH' },
    { key: 'vanitha', label: 'വനിത' },
    { key: 'solidarity', label: 'സോളിഡാരിറ്റി' },
    { key: 'sio', label: 'SIO' },
    { key: 'gio', label: 'GIO' },
    { key: 'teenIndia', label: 'ടീൻ ഇന്ത്യ' },
    { key: 'malarvadi', label: 'മലർവാടി' }
  ];

  const categories = [
    { key: 'personalConnection', label: 'വ്യക്തിബന്ധം' },
    { key: 'literaryConnection', label: 'സാഹിത്യബന്ധം' },
    { key: 'qscStudent', label: 'QSC പഠിതാവ്' },
    { key: 'regularKhutbaListener', label: 'സ്ഥിരമായി ഖുതുബ കേൾക്കുന്നയാള്‍' },
    { key: 'prabodhanamReader', label: 'പ്രബോധനം വായനക്കാരന്‍' },
    { key: 'pfBeneficiary', label: 'PF ഗുണഭോക്താവ്' },
    { key: 'bzBeneficiary', label: 'BZ ഗുണഭോക്താവ്' },
    { key: 'localReliefBeneficiary', label: 'പ്രാദേശിക റിലീഫ് ഗുണഭോക്താവ്' },
    { key: 'aaramamReader', label: 'ആരാമം വായനക്കാരി' },
    { key: 'thawheedulMaraStudent', label: 'തംഹീദുല്‍ മർഅ പഠിതാവ്' },
    { key: 'madrasaAlumni', label: 'മദ്‌റസ പൂര്‍വ്വ വിദ്യാര്‍ത്ഥി' },
    { key: 'islamicCollegeAlumni', label: 'ഇസ്്‌ലാമിയ കോളജ് പൂര്‍വ്വ വിദ്യാര്‍ത്ഥി' },
    { key: 'neighborhoodMember', label: 'അയൽകൂട്ടം അംഗം' },
    { key: 'palliativeConnection', label: 'പാലിയേറ്റീവ് ബന്ധം' },
    { key: 'friendsClubMember', label: 'Friends Club അംഗം' },
    { key: 'mediaReader', label: 'മാധ്യമം വായനക്കാരന്‍' },
    { key: 'ayahDarsQuranStudent', label: 'ആയാത് ദർസെ ഖുര്‍ആന്‍ പഠിതാവ്' },
    { key: 'heavenGuardian', label: 'ഹെവൻസിലെ രക്ഷിതാവ്' },
    { key: 'schoolGuardian', label: 'സ്‌കൂളിലെ രക്ഷിതാവ്' },
    { key: 'arabicCollegeGuardian', label: 'അറബികോളജ് രക്ഷിതാവ്' },
    { key: 'arabicCollegeStudent', label: 'അറബിക് കോളജ് വിദ്യാര്‍ത്ഥി' },
    { key: 'artsCollegeStudent', label: 'ആർട്‌സ് കോളജ് വിദ്യാര്‍ത്ഥി' },
    { key: 'artsCollegeGuardian', label: 'ആർട്‌സ് കോളജ് രക്ഷിതാവ്' },
    { key: 'publicCampusStudent', label: 'പൊതു കാമ്പസിലെ വിദ്യാര്‍ത്ഥി' },
    { key: 'otherNGOs', label: 'മറ്റു NGO കള്‍' },
    { key: 'mahallConnection', label: 'മഹല്ല് മുഖേനയുള്ള ബന്ധം' },
    { key: 'fulltimeWorkerConnection', label: 'ഫുള്‍െൈടം പ്രവർത്തകനുമായുള്ള ബന്ധം' }
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          ജില്ലാ തലം റിപ്പോർട്ട് - PART B
        </h2>
        <p className="text-gray-600">
          പുതിയ വ്യക്തികളെ സംഘടനയിലേക്ക് ക്ഷണിക്കൽ & വർദ്ധനവ്
        </p>
      </div>

      {/* Part D - New Person Invitations */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          D. പുതിയ വ്യക്തികളെ സംഘടനയിലേക്ക് ക്ഷണിച്ചത്
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-lg font-medium text-gray-900 mb-2">
              ആണ്‍
            </label>
            <input
              type="number"
              value={formData.partD.invitations.male || ''}
              onChange={(e) => handleInputChange('male', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              placeholder="എണ്ണം നൽകുക"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-900 mb-2">
              പെണ്‍
            </label>
            <input
              type="number"
              value={formData.partD.invitations.female || ''}
              onChange={(e) => handleInputChange('female', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              placeholder="എണ്ണം നൽകുക"
            />
          </div>
        </div>

        <div className="mb-6">
          <h4 className="text-lg font-medium text-gray-900 mb-4">
            ഏത്കാറ്റഗറിയില്‍ പെട്ടവരോടാണ് സംസാരിച്ചത് (√മാര്‍ക്ക് ചെയ്യുക)
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categories.map((category) => (
              <label key={category.key} className="flex items-start space-x-3 cursor-pointer p-3 border border-gray-200 rounded-lg hover:bg-gray-50">
                <input
                  type="checkbox"
                  checked={formData.partD.categories[category.key]}
                  onChange={(e) => handleCheckboxChange(category.key, e.target.checked)}
                  className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-gray-700 leading-relaxed text-sm">{category.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Part E - Growth in Report Period */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          E. റിപ്പോർട്ട് കാലയളവിലെ വർദ്ധനവ് (ജില്ലാ സബ്കമ്മിറ്റിയുടെത് മാത്രം ചേർക്കുക)
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">വിംഗ്</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-semibold">പുതിയ ഘടകങ്ങൾ എണ്ണം</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-semibold">പുതുതായി വന്നവർ</th>
              </tr>
            </thead>
            <tbody>
              {wings.map((wing) => (
                <tr key={wing.key}>
                  <td className="border border-gray-300 px-4 py-3 font-medium">{wing.label}</td>
                  <td className="border border-gray-300 px-4 py-3">
                    <input
                      type="number"
                      value={formData.partE.wingGrowth[wing.key].newComponents || ''}
                      onChange={(e) => handleInputChange('newComponents', e.target.value, wing.key)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-center"
                      placeholder="0"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    <input
                      type="number"
                      value={formData.partE.wingGrowth[wing.key].newMembers || ''}
                      onChange={(e) => handleInputChange('newMembers', e.target.value, wing.key)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-center"
                      placeholder="0"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-12 flex justify-between">
        <button
          onClick={prevStep}
          className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>മുമ്പത്തേത്</span>
        </button>
        
        <button
          onClick={handleSubmit}
          disabled={!formData.district || !formData.month}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
        >
          <Check className="w-5 h-5" />
          <span>സബ്മിറ്റ് ചെയ്യുക</span>
        </button>
      </div>
    </div>
  );
};

export default DistrictPageB;
