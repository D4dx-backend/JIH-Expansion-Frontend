import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight, ArrowLeft, Check } from 'lucide-react';

const UnitPageB = ({ onNext, onPrevious, formData, setFormData }) => {
  // Initialize with default values and merge with formData
  const [partBData, setPartBData] = useState({
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
  });

  const [partCData, setPartCData] = useState({
      growthAcceleration: {
        rukkun: '',
        karkun: '',
        solidarity: '',
        sio: '',
        gio: '',
        teenIndia: '',
        malarvadi: ''
    }
  });

  // Initialize data from formData when component mounts or formData changes
  useEffect(() => {
    if (formData) {
      console.log('UnitPageB: Initializing with formData:', formData);
      
      // Initialize partB data
      if (formData.partB) {
        setPartBData(prev => ({
          newJIHMembers: {
            male: '',
            female: '',
            ...formData.partB.newJIHMembers
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
            fullTimeWorkerConnection: false,
            ...formData.partB.memberCategories
          }
        }));
      }

      // Initialize partC data
      if (formData.partC) {
        setPartCData(prev => ({
          growthAcceleration: {
            rukkun: '',
            karkun: '',
            solidarity: '',
            sio: '',
            gio: '',
            teenIndia: '',
            malarvadi: '',
            ...formData.partC.growthAcceleration
          }
        }));
      }
    }
  }, [formData]);

  // Handle PartB input changes
  const handlePartBInputChange = useCallback((field, value) => {
    console.log(`PartB input change: ${field} = ${value}`);
    setPartBData(prev => {
      const newData = { ...prev };
      
      if (field === 'newJIHMembers.male') {
        newData.newJIHMembers = { ...newData.newJIHMembers, male: value };
      } else if (field === 'newJIHMembers.female') {
        newData.newJIHMembers = { ...newData.newJIHMembers, female: value };
      } else if (field.startsWith('memberCategories.')) {
        const categoryKey = field.replace('memberCategories.', '');
        newData.memberCategories = { ...newData.memberCategories, [categoryKey]: value };
      }
      
      // Update parent form data
      if (setFormData) {
        setFormData(prevFormData => ({
          ...prevFormData,
          partB: newData
        }));
      }
      
      return newData;
    });
  }, [setFormData]);

  // Handle PartC input changes
  const handlePartCInputChange = useCallback((field, value) => {
    console.log(`PartC input change: ${field} = ${value}`);
    setPartCData(prev => {
      const newData = { ...prev };
      
      if (field.startsWith('growthAcceleration.')) {
        const growthKey = field.replace('growthAcceleration.', '');
        newData.growthAcceleration = { ...newData.growthAcceleration, [growthKey]: value };
      }
      
      // Update parent form data
      if (setFormData) {
        setFormData(prevFormData => ({
          ...prevFormData,
          partC: newData
        }));
      }
      
      return newData;
    });
  }, [setFormData]);

  // Special handler for checkboxes to ensure they work properly
  const handleCheckboxChange = useCallback((optionKey, checked) => {
    console.log(`Checkbox ${optionKey} changed to:`, checked);
    setPartBData(prev => {
      const newData = {
        ...prev,
          memberCategories: {
          ...prev.memberCategories,
            [optionKey]: checked
        }
      };
      
      // Update parent form data
      if (setFormData) {
        setFormData(prevFormData => ({
          ...prevFormData,
          partB: newData
        }));
      }
      
      return newData;
    });
  }, [setFormData]);

  const handleNext = () => {
    console.log('=== UnitPageB handleNext DEBUG ===');
    console.log('partBData:', partBData);
    console.log('partCData:', partCData);
    
    // Update the parent form data with UnitPageB data before submitting
    if (setFormData) {
      setFormData(prev => {
        const newData = {
          ...prev,
          partB: partBData,
          partC: partCData
        };
        console.log('Updated formData:', newData);
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
      onPrevious({ partB: partBData, partC: partCData });
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
                value={partBData.newJIHMembers.male || ''}
                onChange={(e) => {
                  console.log('Male input changed:', e.target.value);
                  handlePartBInputChange('newJIHMembers.male', e.target.value);
                }}
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
                value={partBData.newJIHMembers.female || ''}
                onChange={(e) => {
                  console.log('Female input changed:', e.target.value);
                  handlePartBInputChange('newJIHMembers.female', e.target.value);
                }}
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
              const isChecked = partBData.memberCategories[option.key] || false;
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
                value={partCData.growthAcceleration.rukkun || ''}
                onChange={(e) => handlePartCInputChange('growthAcceleration.rukkun', e.target.value)}
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
                value={partCData.growthAcceleration.karkun || ''}
                onChange={(e) => handlePartCInputChange('growthAcceleration.karkun', e.target.value)}
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
                value={partCData.growthAcceleration.solidarity || ''}
                onChange={(e) => handlePartCInputChange('growthAcceleration.solidarity', e.target.value)}
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
                value={partCData.growthAcceleration.sio || ''}
                onChange={(e) => handlePartCInputChange('growthAcceleration.sio', e.target.value)}
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
                value={partCData.growthAcceleration.gio || ''}
                onChange={(e) => handlePartCInputChange('growthAcceleration.gio', e.target.value)}
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
                value={partCData.growthAcceleration.teenIndia || ''}
                onChange={(e) => handlePartCInputChange('growthAcceleration.teenIndia', e.target.value)}
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
                value={partCData.growthAcceleration.malarvadi || ''}
                onChange={(e) => handlePartCInputChange('growthAcceleration.malarvadi', e.target.value)}
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
