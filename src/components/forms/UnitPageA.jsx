import React, { useState, useEffect, useCallback } from 'react';
import { ArrowRight } from 'lucide-react';

const UnitPageA = ({ onNext, formData, setFormData }) => {
  const [localData, setLocalData] = useState({
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
    }
  });

  useEffect(() => {
    // Auto-fill district and area from logged-in user data
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      console.log('User data for auto-fill:', user);
      
      // Get district name - try to get actual name, not ID
      let districtName = user.district || user.districtName || user.districtId || '';
      
      // Get area name - try to get actual name, not ID
      let areaName = user.area || user.areaName || user.areaId || '';
      
      // Get unit/component name - try to get actual name, not ID
      let componentName = user.unit || user.unitName || user.unitId || '';
      
      // If we have IDs but not names, try to fetch the names
      const fetchNames = async () => {
        try {
          const token = localStorage.getItem('userToken');
          const headers = token ? { Authorization: `Bearer ${token}` } : {};
          
          // Fetch district name if we only have ID
          if (user.districtId && !user.district && !user.districtName) {
            try {
              const districtsResp = await fetch(`${import.meta.env.VITE_API_URL}/api/user/hierarchy/districts`, { headers });
              const districtsData = await districtsResp.json();
              if (districtsData.success && districtsData.data) {
                const district = districtsData.data.find(d => (d.id || d._id) === user.districtId);
                if (district) {
                  districtName = district.title || district.name || districtName;
                }
              }
            } catch (e) {
              console.log('Could not fetch district name:', e);
            }
          }
          
          // Fetch area name if we only have ID
          if (user.areaId && !user.area && !user.areaName && user.districtId) {
            try {
              const areasResp = await fetch(`${import.meta.env.VITE_API_URL}/api/user/hierarchy/areas/${encodeURIComponent(user.districtId)}`, { headers });
              const areasData = await areasResp.json();
              if (areasData.success && areasData.data) {
                const area = areasData.data.find(a => (a.id || a._id) === user.areaId);
                if (area) {
                  areaName = area.title || area.name || areaName;
                }
              }
            } catch (e) {
              console.log('Could not fetch area name:', e);
            }
          }
          
          // Fetch unit name if we only have ID
          if (user.unitId && !user.unit && !user.unitName && user.areaId) {
            try {
              const unitsResp = await fetch(`${import.meta.env.VITE_API_URL}/api/user/hierarchy/units/${encodeURIComponent(user.areaId)}`, { headers });
              const unitsData = await unitsResp.json();
              if (unitsData.success && unitsData.data) {
                const unit = unitsData.data.find(u => (u.id || u._id) === user.unitId);
                if (unit) {
                  componentName = unit.title || unit.name || componentName;
                }
              }
            } catch (e) {
              console.log('Could not fetch unit name:', e);
            }
          }
          
          // Update the form data with the fetched names
          setLocalData(prev => ({
            ...prev,
            district: districtName,
            area: areaName,
            component: componentName
          }));
          
          // Also update the parent form data
          if (setFormData) {
            setFormData(prev => ({
              ...prev,
              district: districtName,
              area: areaName,
              component: componentName
            }));
          }
          
        } catch (error) {
          console.error('Error fetching names:', error);
          // Fallback to IDs if fetching fails
          setLocalData(prev => ({
            ...prev,
            district: districtName,
            area: areaName,
            component: componentName
          }));
        }
      };
      
      fetchNames();
    }
  }, [setFormData]);

  useEffect(() => {
    if (formData && Object.keys(formData).length > 0) {
      // Only update if formData has meaningful content and is different from current localData
      setLocalData(prev => {
        // Check if the formData is actually different to avoid unnecessary updates
        const hasChanges = JSON.stringify(prev) !== JSON.stringify(formData);
        if (hasChanges) {
          console.log('Updating localData from formData:', formData);
          return { ...prev, ...formData };
        }
        return prev;
      });
    }
  }, [formData]);

  // Add a separate effect to handle checkbox state independently
  useEffect(() => {
    // Initialize checkbox states if they don't exist
    setLocalData(prev => {
      const newData = { ...prev };
      if (!newData.partA || !newData.partA.authorityPersons) {
        newData.partA = {
          ...newData.partA,
          authorityPersons: {}
        };
      }
      return newData;
    });
  }, []);

  const handleInputChange = useCallback((field, value) => {
    setLocalData(prevData => {
      const newData = { 
        ...prevData,
        workers: { ...prevData.workers },
        partA: {
          ...prevData.partA,
          spokenPersons: { ...prevData.partA.spokenPersons },
          authorityPersons: { ...prevData.partA.authorityPersons }
        }
      };
      
      if (field.includes('.')) {
        const [parent, child] = field.split('.');
        if (parent === 'workers') {
          newData.workers[child] = value;
        } else if (parent === 'partA') {
          if (child.includes('.')) {
            const [subParent, subChild] = child.split('.');
            if (subParent === 'spokenPersons') {
              newData.partA.spokenPersons[subChild] = value;
            } else if (subParent === 'authorityPersons') {
              newData.partA.authorityPersons[subChild] = value;
            }
          } else {
            newData.partA[child] = value;
          }
        }
      } else {
        newData[field] = value;
      }
      
      // Update parent form data if callback exists
      if (setFormData) {
        setFormData(newData);
      }
      
      return newData;
    });
  }, [setFormData]);

  // Special handler for checkboxes to ensure they work properly
  const handleCheckboxChange = useCallback((optionKey, checked) => {
    console.log(`Checkbox ${optionKey} changed to:`, checked);
    setLocalData(prevData => {
      const newData = {
        ...prevData,
        partA: {
          ...prevData.partA,
          authorityPersons: {
            ...prevData.partA.authorityPersons,
            [optionKey]: checked
          }
        }
      };
      
      // Update parent form data if callback exists
      if (setFormData) {
        setFormData(newData);
      }
      
      return newData;
    });
  }, [setFormData]);

  const handleNext = () => {
    if (onNext) {
      onNext(localData);
    }
  };

  const authorityPersonsOptions = [
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
          UNIT PAGE A
        </h2>
        <p className="text-gray-600">
          യൂണിറ്റ് തലത്തിൽ പ്രവർത്തകർ വിവരങ്ങൾ
        </p>
      </div>

      {/* District and Area Information */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div>
          <label className="block text-lg font-medium text-gray-900 mb-2">
            ജില്ലാ:
          </label>
          <input
            type="text"
            value={localData.district}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-lg cursor-not-allowed"
            placeholder="ജില്ലാ നൽകുക"
            readOnly
            disabled
          />
        </div>
        
        <div>
          <label className="block text-lg font-medium text-gray-900 mb-2">
            ഏരിയ:
          </label>
          <input
            type="text"
            value={localData.area}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-lg cursor-not-allowed"
            placeholder="ഏരിയ നൽകുക"
            readOnly
            disabled
          />
        </div>
        
        <div>
          <label className="block text-lg font-medium text-gray-900 mb-2">
            ഘടകം:
          </label>
          <input
            type="text"
            value={localData.component}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-100 text-lg cursor-not-allowed"
            placeholder="ഘടകം നൽകുക"
            readOnly
            disabled
          />
        </div>
      </div>

      {/* Workers Information */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          പ്രവർത്തകൻ(എണ്ണം):-
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-lg font-medium text-gray-900 mb-2">
              റൂക്കുൻ:
            </label>
            <input
              type="number"
              value={localData.workers.rukkun}
              onChange={(e) => handleInputChange('workers.rukkun', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              placeholder="എണ്ണം നൽകുക"
            />
          </div>
          
          <div>
            <label className="block text-lg font-medium text-gray-900 mb-2">
              കാർക്കൂൺ:
            </label>
            <input
              type="number"
              value={localData.workers.karkun}
              onChange={(e) => handleInputChange('workers.karkun', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              placeholder="എണ്ണം നൽകുക"
            />
          </div>
          
          <div>
            <label className="block text-lg font-medium text-gray-900 mb-2">
              ആക്ടീവ് അസോസിയേറ്റ്:
            </label>
            <input
              type="number"
              value={localData.workers.activeAssociate}
              onChange={(e) => handleInputChange('workers.activeAssociate', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              placeholder="എണ്ണം നൽകുക"
            />
          </div>
        </div>
      </div>

      {/* PART A */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          PART A
        </h3>
        
        {/* Codes */}
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-900 mb-2">
            സ്കോഡുകൾ:
          </label>
          <input
            type="text"
            value={localData.partA.codes}
            onChange={(e) => handleInputChange('partA.codes', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            placeholder="സ്കോഡുകൾ നൽകുക"
          />
        </div>

        {/* Spoken Persons */}
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-900 mb-2">
            സംസാരിച്ച വ്യക്തികൾ:
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ആൺ
              </label>
              <input
                type="number"
                value={localData.partA.spokenPersons.male}
                onChange={(e) => handleInputChange('partA.spokenPersons.male', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                placeholder="എണ്ണം നൽകുക"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                പെണ്ണ്
              </label>
              <input
                type="number"
                value={localData.partA.spokenPersons.female}
                onChange={(e) => handleInputChange('partA.spokenPersons.female', e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                placeholder="എണ്ണം നൽകുക"
              />
            </div>
          </div>
        </div>

        {/* Authority Persons */}
        <div className="mb-6">
          <label className="block text-lg font-medium text-gray-900 mb-2">
            അധികാരത്തിൽ പെട്ടവരോട് സംസാരിച്ചവർ (✓ മാർക്ക് ചെയ്യുക):-
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {authorityPersonsOptions.map((option) => {
              const isChecked = localData.partA?.authorityPersons?.[option.key] || false;
              return (
                <div key={option.key} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={option.key}
                    checked={isChecked}
                    onChange={(e) => handleCheckboxChange(option.key, e.target.checked)}
                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <label htmlFor={option.key} className="text-sm font-medium text-gray-700">
                    {option.label}
                  </label>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-12 flex justify-end">
        <button
          onClick={handleNext}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
        >
          <span>അടുത്തത്</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};

export default UnitPageA;
