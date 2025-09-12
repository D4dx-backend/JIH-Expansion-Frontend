import React, { useEffect } from 'react';
import { ArrowRight } from 'lucide-react';
import { useAreaForm } from '../../contexts/AreaFormContext';

const AreaPageA = () => {
  const { formData, updateFormData, nextStep, validateCurrentStep } = useAreaForm();

  // Auto-fill district and area from logged-in user data
  useEffect(() => {
    const userData = localStorage.getItem('userData');
    if (userData) {
      const user = JSON.parse(userData);
      console.log('User data for auto-fill:', user);
      
      // Get district name - try to get actual name, not ID
      let districtName = user.district || user.districtName || '';
      
      // Get area name - try to get actual name, not ID
      let areaName = user.area || user.areaName || '';
      
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
                }
              }
            } catch (e) {
              console.log('Could not fetch district name:', e);
            }
          }
          
          // Fetch area name if we only have ID
          if (user.areaId && !areaName && user.districtId) {
            try {
              console.log('Fetching area name for ID:', user.areaId);
              const areasResp = await fetch(`${import.meta.env.VITE_API_URL}/api/user/hierarchy/areas/${encodeURIComponent(user.districtId)}`, { headers });
              const areasData = await areasResp.json();
              console.log('Areas response:', areasData);
              if (areasData.success && areasData.data) {
                const area = areasData.data.find(a => (a.id || a._id) === user.areaId);
                if (area) {
                  areaName = area.title || area.name || areaName;
                  console.log('Found area name:', areaName);
                }
              }
            } catch (e) {
              console.log('Could not fetch area name:', e);
            }
          }
          
          // Update form data with the names (only if we have actual names, not IDs)
          if (districtName && districtName !== user.districtId && !formData.district) {
            console.log('Setting district name:', districtName);
            updateFormData('district', districtName);
          }
          if (areaName && areaName !== user.areaId && !formData.area) {
            console.log('Setting area name:', areaName);
            updateFormData('area', areaName);
          }
        } catch (error) {
          console.error('Error fetching names:', error);
        }
      };
      
      // Always try to fetch names if we have IDs
      if (user.districtId || user.areaId) {
        fetchNames();
      }
    }
  }, [updateFormData]);

  const handleInputChange = (field, value) => {
    // Only allow numbers for numeric fields
    if (field === 'pj' || field === 'kh' || field === 'vkh') {
      // Ensure value is a string before using replace
      const stringValue = String(value || '');
      const numericValue = stringValue.replace(/[^0-9]/g, '');
      // Convert to number if it's not empty, otherwise keep as empty string
      const finalValue = numericValue === '' ? '' : numericValue;
      updateFormData('partA', { [field]: finalValue });
    } else {
      updateFormData('partA', { [field]: value });
    }
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
          ഏരിയ തലം റിപ്പോർട്ട് - PART A
        </h2>
        <p className="text-gray-600">
          ഏരിയ തലത്തിൽ പൊതു വിവരങ്ങൾ നൽകുക
        </p>
      </div>

      {/* District and Area Display (Auto-filled and disabled) */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-6">
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
        <div>
          <label className="block text-lg font-medium text-gray-900 mb-3">
            ഏരിയ:
          </label>
          <input
            type="text"
            value={formData.area}
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

      {/* Form Fields */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-900 mb-6">
          A. ആകെ ഘടകങ്ങൾ
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-lg font-medium text-gray-900 mb-2">
              PJ
            </label>
            <input
              type="number"
              value={formData.partA.pj !== null && formData.partA.pj !== undefined ? formData.partA.pj : ''}
              onChange={(e) => handleInputChange('pj', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              placeholder="എണ്ണം നൽകുക"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-900 mb-2">
              KH
            </label>
            <input
              type="number"
              value={formData.partA.kh !== null && formData.partA.kh !== undefined ? formData.partA.kh : ''}
              onChange={(e) => handleInputChange('kh', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              placeholder="എണ്ണം നൽകുക"
            />
          </div>

          <div>
            <label className="block text-lg font-medium text-gray-900 mb-2">
              VKH
            </label>
            <input
              type="number"
              value={formData.partA.vkh !== null && formData.partA.vkh !== undefined ? formData.partA.vkh : ''}
              onChange={(e) => handleInputChange('vkh', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              placeholder="എണ്ണം നൽകുക"
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

export default AreaPageA;
