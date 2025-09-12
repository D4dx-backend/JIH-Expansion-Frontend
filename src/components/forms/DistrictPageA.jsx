import React, { useEffect } from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';
import { useDistrictForm } from '../../contexts/DistrictFormContext';

const DistrictPageA = () => {
  const { formData, updateFormData, nextStep, validateCurrentStep } = useDistrictForm();

  // Auto-fill district from logged-in user data
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      console.log('User data for auto-fill:', user);
      console.log('Current form data:', formData);
      
      // Get district name - try to get actual name, not ID
      let districtName = user.district || user.districtName || '';
      
      // If we already have the district name, set it immediately
      if (districtName && !formData.district) {
        console.log('Setting district name from user data:', districtName);
        updateFormData('district', districtName);
      } else if (user.districtId && !formData.district) {
        // Fallback: show district ID if name is not available
        console.log('Using district ID as fallback:', user.districtId);
        updateFormData('district', user.districtId);
      }
      
      // If we have IDs but not names, try to fetch the names
      const fetchNames = async () => {
        try {
          const token = localStorage.getItem('userToken');
          const headers = token ? { Authorization: `Bearer ${token}` } : {};
          
          // Fetch district name if we only have ID
          if (user.districtId && !districtName) {
            try {
              console.log('Fetching district name for ID:', user.districtId);
              const districtsResp = await fetch(`${import.meta.env.VITE_API_URL}/api/user/hierarchy/districts`, { headers });
              const districtsData = await districtsResp.json();
              console.log('Districts response:', districtsData);
              if (districtsData.success && districtsData.data) {
                const district = districtsData.data.find(d => (d.id || d._id) === user.districtId);
                if (district) {
                  districtName = district.title || district.name || districtName;
                  console.log('Found district name:', districtName);
                  
                  // Update form data with the fetched name
                  if (districtName && !formData.district) {
                    console.log('Setting district name from API:', districtName);
                    updateFormData('district', districtName);
                  }
                }
              }
            } catch (e) {
              console.log('Could not fetch district name:', e);
            }
          }
        } catch (error) {
          console.error('Error fetching names:', error);
        }
      };
      
      // Always try to fetch names if we have IDs but no names
      if (user.districtId && !districtName) {
        fetchNames();
      }
    }
  }, [updateFormData]);

  const handleInputChange = (field, value, wing = null) => {
    if (wing) {
      // For attendance fields
      updateFormData('partA', {
        attendance: {
          ...formData.partA.attendance,
          [wing]: {
            ...formData.partA.attendance[wing],
            [field]: value === '' ? null : parseInt(value) || 0
          }
        }
      });
    } else if (field === 'componentVisits' || field === 'areaVisits' || field === 'newComponentFormationAttempts' || field === 'newPersonConnections') {
      // For part C activities
      const wing = Object.keys(formData.partC.activities).find(w => 
        formData.partC.activities[w].hasOwnProperty(field)
      );
      if (wing) {
        updateFormData('partC', {
          activities: {
            ...formData.partC.activities,
            [wing]: {
              ...formData.partC.activities[wing],
              [field]: value === '' ? null : parseInt(value) || 0
            }
          }
        });
      }
    }
  };

  const handleCheckboxChange = (field, checked) => {
    updateFormData('partB', {
      focusAreas: {
        ...formData.partB.focusAreas,
        [field]: checked
      }
    });
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      nextStep();
    } else {
      alert('Please fill in all required fields before proceeding.');
    }
  };

  const handleBack = () => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (userData.districtId) {
      window.location.href = `/district-dashboard/${userData.districtId}`;
    } else {
      window.location.href = '/dashboard';
    }
  };

  const wings = [
    { key: 'jih', label: 'JIH' },
    { key: 'vanitha', label: 'വനിത' },
    { key: 'solidarity', label: 'സോളിഡാരിറ്റി' },
    { key: 'sio', label: 'SIO' },
    { key: 'gio', label: 'GIO' }
  ];

  const focusAreas = [
    { key: 'newAreaExpansionWorkshop', label: 'പുതിയ പ്രദേശങ്ങളിൽ പ്രസ്ഥാന വ്യാപനം ലക്ഷ്യംവെച്ച് വർക്‌ഷോപ്പ്' },
    { key: 'workerTraining', label: 'പ്രവർത്തകര്‍ക്ക് പരിശീലനം' },
    { key: 'newAreaAgendaPreparation', label: 'പുതിയ പ്രദേശത്തേക്കുള്ള അജണ്ട തയ്യാറാക്കല്‍' },
    { key: 'fulltimeRecruitment', label: 'ഫുള്‍ടൈമറുടെ നിയമനം' },
    { key: 'schoolGuardianClusterFormation', label: 'സ്‌കൂള്‍ രക്ഷിതാക്കളുടെ ക്ലസ്റ്റര്‍ രൂപീകരണം' },
    { key: 'reliefBeneficiaryDataCollection', label: 'റിലീഫ് ഗുണഭോക്താക്കളുടെ ഡാറ്റാ ശേഖരണം' },
    { key: 'workerDeploymentToNewAreas', label: 'പുതിയ പ്രദേശത്തേക്ക് പ്രവർത്തകരെ വിന്യസിക്കല്‍' },
    { key: 'weeklyMeetingEffectiveness', label: 'വാരാന്തയോഗങ്ങളുടെ ഫലപ്രാപ്തി ഉറപ്പാക്കല്‍' },
    { key: 'khatibUtilization', label: 'ഖത്തീബുമാരെ ഉപയോഗപെടുത്തല്‍' },
    { key: 'madrasaMovementGrowthCalculation', label: 'മദ്‌റസയിലൂടെയുള്ള പ്രസ്ഥാന വളര്‍ച്ചയുടെ കണക്കെടുപ്പ്' },
    { key: 'schoolCenteredWork', label: 'സ്‌കൂളുകള്‍ കേന്ദ്രീകരിച്ചുള്ള പ്രവർത്തനം' },
    { key: 'staffHalkaFormation', label: 'സ്റ്റാഫ് ഹല്‍ഖാ രൂപീകരണം' },
    { key: 'islamicCollegeAlumniDiscovery', label: 'ഇസ്്‌ലാമിയ കോളേജുകളിലെ പൂര്‍വ്വ വിദ്യാര്‍ത്ഥികളെ കണ്ടെത്തല്‍' },
    { key: 'quranStudyCenterWork', label: 'ഖുര്‍ആന്‍ സ്റ്റഡി സെന്റര്‍ കേന്ദ്രീകരിച്ചുള്ള പ്രവർത്തനങ്ങള്‍' },
    { key: 'artsScienceCampusLeadership', label: 'ഏരിയയിലെ Arts & Science കോളജ് കാമ്പസില്‍ ഫ്രറ്റേണിറ്റി, SIO, GIO, മേധാവിത്തം ഉറപ്പാക്കല്‍' },
    { key: 'hajjUmrahGroupDiscovery', label: 'ഹജ്ജ്/ ഉംറ ഗ്രൂപ്പില്‍ പോയവരെ കണ്ടെത്തല്‍' },
    { key: 'majorMuslimCenterStructure', label: 'പ്രാധാന മുസ്്‌ലിം കേന്ദ്രങ്ങളില്‍ പ്രസ്ഥാന ഘടന ഉറപ്പുവരുത്തല്‍' },
    { key: 'weakAreaFinancialSupport', label: 'ദുര്‍ബല ഏരിയകള്‍ക്ക് സാമ്പത്തിക സഹായം' },
    { key: 'qscTeacherOrientation', label: 'QSC അധ്യപകര്‍ക്ക് ഓറിയന്റേഷന്‍' },
    { key: 'khatibOrientation', label: 'ഖത്തീബുമാര്‍ക്ക് ഓറിയന്റേഷന്‍' },
    { key: 'institutionBearingOrientation', label: 'സ്ഥാപന ഭാരവാഹികള്‍ക്ക് ഓറിയന്റേഷന്‍' },
    { key: 'selectedWorkerTraining', label: 'തെരെഞ്ഞെടുക്കപെട്ട പ്രവർത്തകര്‍ക്ക് പരിശീലനം' }
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          ജില്ലാ തലം റിപ്പോർട്ട് - PART A
        </h2>
        <p className="text-gray-600">
          ജില്ലാ തലത്തിൽ പൊതു വിവരങ്ങൾ നൽകുക
        </p>
      </div>

      {/* District Display (Auto-filled and disabled) */}
      <div className="mb-8">
        <div>
          <label className="block text-lg font-medium text-gray-900 mb-3">
            ജില്ല:
          </label>
          <input
            type="text"
            value={formData.district}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-lg cursor-not-allowed"
            disabled
            readOnly
          />
        </div>
      </div>

      {/* Report Period */}
      <div className="mb-8">
        <label className="block text-lg font-medium text-gray-900 mb-3">
          റിപ്പോർട്ട് കാലയളവ്:
        </label>
        <select
          value={formData.month}
          onChange={(e) => updateFormData('month', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
        >
          <option value="">തിരഞ്ഞെടുക്കുക</option>
          <option value="January">ജനുവരി</option>
          <option value="February">ഫെബ്രുവരി</option>
          <option value="March">മാർച്ച്</option>
          <option value="April">ഏപ്രിൽ</option>
          <option value="May">മേയ്</option>
          <option value="June">ജൂൺ</option>
          <option value="July">ജൂലൈ</option>
          <option value="August">ഓഗസ്റ്റ്</option>
          <option value="September">സെപ്റ്റംബർ</option>
          <option value="October">ഒക്ടോബർ</option>
          <option value="November">നവംബർ</option>
          <option value="December">ഡിസംബർ</option>
        </select>
      </div>

      {/* Part A - District Subcommittee Attendance */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          A. ജില്ലാ സബ്കമ്മിറ്റി ചേർന്നത്
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-3 text-left font-semibold">വിംഗ്</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-semibold">ഹാജർ</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-semibold">ലീവ്</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-semibold">ആബ്‌സന്റ്</th>
              </tr>
            </thead>
            <tbody>
              {wings.map((wing) => (
                <tr key={wing.key}>
                  <td className="border border-gray-300 px-4 py-3 font-medium">{wing.label}</td>
                  <td className="border border-gray-300 px-4 py-3">
                    <input
                      type="number"
                      value={formData.partA.attendance[wing.key].present || ''}
                      onChange={(e) => handleInputChange('present', e.target.value, wing.key)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-center"
                      placeholder="0"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    <input
                      type="number"
                      value={formData.partA.attendance[wing.key].leave || ''}
                      onChange={(e) => handleInputChange('leave', e.target.value, wing.key)}
                      className="w-full px-2 py-1 border border-gray-300 rounded text-center"
                      placeholder="0"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    <input
                      type="number"
                      value={formData.partA.attendance[wing.key].absent || ''}
                      onChange={(e) => handleInputChange('absent', e.target.value, wing.key)}
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

      {/* Part B - Focus Areas */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          B. താഴെപറയുന്നവയിൽ ഫോകസ് ചെയ്ത മേഖലകൾ
        </h3>
        
        <div className="space-y-4">
          {focusAreas.map((area) => (
            <label key={area.key} className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.partB.focusAreas[area.key]}
                onChange={(e) => handleCheckboxChange(area.key, e.target.checked)}
                className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="text-gray-700 leading-relaxed">{area.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Part C - District Subcommittee Activities */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          C. ജില്ലാ സബ്കമ്മിറ്റി നടത്തിയ പ്രവർത്തനങ്ങൾ
        </h3>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-lg font-medium text-gray-900 mb-2">
                JIH - ഘടക സന്ദർശനങ്ങൾ (എണ്ണം)
              </label>
              <input
                type="number"
                value={formData.partC.activities.jih.componentVisits || ''}
                onChange={(e) => handleInputChange('componentVisits', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                placeholder="എണ്ണം നൽകുക"
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-900 mb-2">
                വനിത - ഏരിയ സന്ദർശനങ്ങൾ (എണ്ണം)
              </label>
              <input
                type="number"
                value={formData.partC.activities.vanitha.areaVisits || ''}
                onChange={(e) => handleInputChange('areaVisits', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                placeholder="എണ്ണം നൽകുക"
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-900 mb-2">
                സോളിഡാരിറ്റി - പുതിയ ഘടക രൂപീകരണശ്രമങ്ങൾ (എണ്ണം)
              </label>
              <input
                type="number"
                value={formData.partC.activities.solidarity.newComponentFormationAttempts || ''}
                onChange={(e) => handleInputChange('newComponentFormationAttempts', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                placeholder="എണ്ണം നൽകുക"
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-900 mb-2">
                SIO - പുതിയ വ്യക്തികളെ ബന്ധപ്പെടല്‍ (എണ്ണം)
              </label>
              <input
                type="number"
                value={formData.partC.activities.sio.newPersonConnections || ''}
                onChange={(e) => handleInputChange('newPersonConnections', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                placeholder="എണ്ണം നൽകുക"
              />
            </div>

            <div>
              <label className="block text-lg font-medium text-gray-900 mb-2">
                GIO - പുതിയ വ്യക്തികളെ ബന്ധപ്പെടല്‍ (എണ്ണം)
              </label>
              <input
                type="number"
                value={formData.partC.activities.gio.newPersonConnections || ''}
                onChange={(e) => handleInputChange('newPersonConnections', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                placeholder="എണ്ണം നൽകുക"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-12 flex justify-between">
        <button
          onClick={handleBack}
          className="bg-gray-500 hover:bg-gray-600 text-white px-8 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>തിരികെ</span>
        </button>
        
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

export default DistrictPageA;
