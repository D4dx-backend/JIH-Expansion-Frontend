import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';

const UnitPageB = ({ onNext, onPrevious, formData, setFormData }) => {
  const [localData, setLocalData] = useState({
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
    }
  });

  useEffect(() => {
    if (formData && Object.keys(formData).length > 0) {
      // Only update if formData has meaningful content and is different from current localData
      setLocalData(prev => {
        // Check if the formData is actually different to avoid unnecessary updates
        const hasChanges = JSON.stringify(prev) !== JSON.stringify(formData);
        if (hasChanges) {
          console.log('UnitPageB: Updating localData from formData:', formData);
          return { ...prev, ...formData };
        }
        return prev;
      });
    }
  }, [formData]);

  const handleInputChange = useCallback((field, value) => {
    setLocalData(prevData => {
      const newData = { 
        ...prevData,
        partB: {
          ...prevData.partB,
          newJIHMembers: { ...prevData.partB.newJIHMembers },
          memberCategories: { ...prevData.partB.memberCategories }
        },
        partC: {
          ...prevData.partC,
          growthAcceleration: { ...prevData.partC.growthAcceleration }
        }
      };
      
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        if (parent === 'partB') {
          if (child.includes('.')) {
            const [subParent, subChild] = child.split('.');
            if (subParent === 'newJIHMembers') {
              newData.partB.newJIHMembers[subChild] = value;
            } else if (subParent === 'memberCategories') {
              newData.partB.memberCategories[subChild] = value;
            }
          } else {
            newData.partB[child] = value;
          }
        } else if (parent === 'partC') {
          if (child.includes('.')) {
            const [subParent, subChild] = child.split('.');
            if (subParent === 'growthAcceleration') {
              newData.partC.growthAcceleration[subChild] = value;
            }
          } else {
            newData.partC[child] = value;
          }
        }
      } else {
        newData[field] = value;
      }
      
      // Update parent form data if callback exists
      if (setFormData) {
        setFormData(prev => ({
          ...prev,
          partB: newData.partB,
          partC: newData.partC
        }));
      }
      
      return newData;
    });
  }, [setFormData]);

  // Special handler for checkboxes to ensure they work properly
  const handleCheckboxChange = useCallback((optionKey, checked) => {
    console.log(`UnitPageB Checkbox ${optionKey} changed to:`, checked);
    setLocalData(prevData => {
      const newData = {
        ...prevData,
        partB: {
          ...prevData.partB,
          memberCategories: {
            ...prevData.partB.memberCategories,
            [optionKey]: checked
          }
        }
      };
      
      // Update parent form data if callback exists
      if (setFormData) {
        setFormData(prev => ({
          ...prev,
          partB: newData.partB,
          partC: newData.partC
        }));
      }
      
      return newData;
    });
  }, [setFormData]);

  const handleNext = () => {
    console.log('=== UnitPageB handleNext DEBUG ===');
    console.log('localData:', localData);
    console.log('localData.partB:', localData.partB);
    console.log('localData.partC:', localData.partC);
    console.log('localData.partC.growthAcceleration:', localData.partC?.growthAcceleration);
    console.log('localData.partC.growthAcceleration type:', typeof localData.partC?.growthAcceleration);
    
    // Update the parent form data with UnitPageB data before submitting
    if (setFormData) {
      setFormData(prev => {
        const newData = {
          ...prev,
          partB: localData.partB,
          partC: localData.partC
        };
        console.log('Updated formData:', newData);
        console.log('Updated partC.growthAcceleration:', newData.partC?.growthAcceleration);
        return newData;
      });
    }
    
    // Call the submit function
    if (onNext) {
      onNext();
    }
  };

  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious(localData);
    }
  };

  const memberCategoriesOptions = [
    { key: 'qscStudent', label: 'QSC പഠിത്താവ്' },
    { key: 'regularKhutbaListener', label: 'സ്ഥിരമായ കുത്തബ കേൾക്കുന്നവർ' },
    { key: 'prabodhanamReader', label: 'പ്രബോധന വായനക്കാരൻ' },
    { key: 'pfBeneficiary', label: 'PF ഗുണഭോക്താവ്' },
    { key: 'bzBeneficiary', label: 'BZ ഗുണഭോക്താവ്' },
    { key: 'regionalReliefBeneficiary', label: 'പ്രദേശിക റിലീഫ് ഗുണഭോക്താവ്' },
    { key: 'interestFreeJusticeBeneficiary', label: 'പലിശരഹിത നീതി ഗുണഭോക്താവ്' },
    { key: 'sahitiyabandham', label: 'സാഹിത്യബന്ധം' },
    { key: 'aaramamReader', label: 'ആരാമം വായനക്കാരി' },
    { key: 'tamheedulManhabStudent', label: 'തംഹീദുൽ മൻഹബ് പഠിത്താവ്' },
    { key: 'institutionAlumni', label: 'സ്ഥാപനത്തിലെ പൂർവ്വവിദ്യാർത്ഥി' },
    { key: 'neighborhoodGroupMember', label: 'അയൽക്കൂട്ടം അംഗം' },
    { key: 'friendshipForumMember', label: 'സൗഹൃദവേദി അംഗം' },
    { key: 'palliativeConnection', label: 'പാലിയേറ്റീവ് ബന്ധം' },
    { key: 'neighborhoodGroupMember2', label: 'അയൽക്കൂട്ടം അംഗം' },
    { key: 'friendsClubMember', label: 'ഫ്രണ്ട്സ് ക്ലബ് അംഗം' },
    { key: 'mediaReader', label: 'മാധ്യമം വായനക്കാരൻ' },
    { key: 'ayathulDursalQuranStudent', label: 'ആയത്തുൽ ദുർസൽ ഖുർആൻ പഠിത്താവ്' },
    { key: 'heavensGuardian', label: 'ഹെവൻസിലെ രക്ഷിതാവ്' },
    { key: 'schoolGuardian', label: 'സ്കൂളിലെ രക്ഷിതാവ്' },
    { key: 'arabicCollegeGuardian', label: 'അറബിക് കോളേജ് രക്ഷിതാവ്' },
    { key: 'arabicCollegeStudent', label: 'അറബിക് കോളേജ് വിദ്യാർത്ഥി' },
    { key: 'artsCollegeStudent', label: 'ആർട്സ് കോളേജ് വിദ്യാർത്ഥി' },
    { key: 'artsCollegeGuardian', label: 'ആർട്സ് കോളേജ് രക്ഷിതാവ്' },
    { key: 'publicCampusStudent', label: 'പൊതു ക്യാമ്പസിലെ വിദ്യാർത്ഥി' },
    { key: 'otherNGOs', label: 'മറ്റു NGOകൾ' },
    { key: 'mahalluConnection', label: 'മഹല്ലുമുഖേനയുള്ള ബന്ധം' },
    { key: 'fullTimeWorkerConnection', label: 'ഫുൾടൈം പ്രവർത്തകനുമായുള്ള ബന്ധം' }
  ];

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          UNIT PAGE B
        </h2>
        <p className="text-gray-600">
          യൂണിറ്റ് തലത്തിൽ പുതിയ അംഗങ്ങളും വർധനവും
        </p>
      </div>

      {/* PART B */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          PART B
        </h3>
        
        {/* New JIH Members */}
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-900 mb-2">
            പുതുതായി വരാന്തയോഗത്തിൽ വന്നവർ(JIH):
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                പുരുഷൻ
              </label>
              <input
                type="number"
                value={localData.partB?.newJIHMembers?.male || ''}
                onChange={(e) => handleInputChange('partB.newJIHMembers.male', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                placeholder="എണ്ണം നൽകുക"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                സ്ത്രീ
              </label>
              <input
                type="number"
                value={localData.partB?.newJIHMembers?.female || ''}
                onChange={(e) => handleInputChange('partB.newJIHMembers.female', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                placeholder="എണ്ണം നൽകുക"
              />
            </div>
          </div>
        </div>

        {/* Member Categories */}
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-900 mb-2">
            ഏത് കാറ്റഗറിയിൽ പെട്ടവരാണ് വന്നവർ(✓ മാർക്ക് ചെയ്യുക):-
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {memberCategoriesOptions.map((option) => {
              const isChecked = localData.partB?.memberCategories?.[option.key] || false;
              return (
                <div key={option.key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`partB_${option.key}`}
                    checked={isChecked}
                    onChange={(e) => handleCheckboxChange(option.key, e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <label htmlFor={`partB_${option.key}`} className="text-sm font-medium text-gray-700">
                    {option.label}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* PART C */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          PART C
        </h3>
        
        {/* Growth Acceleration */}
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-900 mb-2">
            റിപ്പോർട്ട് കാലയളവിലെ വർധനവ് വേഗപ്പെടുത്തുക:
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                രുക്കുൻ
              </label>
              <input
                type="number"
                value={localData.partC?.growthAcceleration?.rukkun || ''}
                onChange={(e) => handleInputChange('partC.growthAcceleration.rukkun', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                placeholder="എണ്ണം നൽകുക"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                കാർക്കുൻ
              </label>
              <input
                type="number"
                value={localData.partC?.growthAcceleration?.karkun || ''}
                onChange={(e) => handleInputChange('partC.growthAcceleration.karkun', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                placeholder="എണ്ണം നൽകുക"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                സോളിഡാരിറ്റി
              </label>
              <input
                type="number"
                value={localData.partC?.growthAcceleration?.solidarity || ''}
                onChange={(e) => handleInputChange('partC.growthAcceleration.solidarity', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                placeholder="എണ്ണം നൽകുക"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SIO
              </label>
              <input
                type="number"
                value={localData.partC?.growthAcceleration?.sio || ''}
                onChange={(e) => handleInputChange('partC.growthAcceleration.sio', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                placeholder="എണ്ണം നൽകുക"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                GIO
              </label>
              <input
                type="number"
                value={localData.partC?.growthAcceleration?.gio || ''}
                onChange={(e) => handleInputChange('partC.growthAcceleration.gio', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                placeholder="എണ്ണം നൽകുക"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ടീൻ ഇന്ത്യ
              </label>
              <input
                type="number"
                value={localData.partC?.growthAcceleration?.teenIndia || ''}
                onChange={(e) => handleInputChange('partC.growthAcceleration.teenIndia', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                placeholder="എണ്ണം നൽകുക"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                മലർവാടി
              </label>
              <input
                type="number"
                value={localData.partC?.growthAcceleration?.malarvadi || ''}
                onChange={(e) => handleInputChange('partC.growthAcceleration.malarvadi', e.target.value)}
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
          onClick={handlePrevious}
          className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>മുമ്പത്തെ</span>
        </button>
        
        <button
          onClick={handleNext}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
        >
          <span>സബ്മിറ്റ് ചെയ്യുക</span>
          <Check className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default UnitPageB;
