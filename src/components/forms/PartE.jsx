import React, { useState } from 'react';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import { useForm } from '../../contexts/FormContext';
import axios from 'axios';

const PartE = ({ onSubmit, editingForm, isAdmin = false }) => {
  const { formData, updateFormData, prevStep, validateCurrentStep } = useForm();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    updateFormData('partE', { [field]: value });
  };

  const handleNestedChange = (section, field, value) => {
    // Only allow numbers for numeric fields
    if (field === 'count') {
      const stringValue = String(value || '');
      const numericValue = stringValue.replace(/[^0-9]/g, '');
      const numValue = numericValue === '' ? null : parseInt(numericValue) || 0;
      updateFormData('partE', {
        [section]: {
          ...formData.partE[section],
          [field]: numValue
        }
      });
    } else {
      updateFormData('partE', {
        [section]: {
          ...formData.partE[section],
          [field]: value
        }
      });
    }
  };

  const handleComponentsChange = (orgKey, value) => {
    // Only allow numbers
    const stringValue = String(value || '');
    const numericValue = stringValue.replace(/[^0-9]/g, '');
    const numValue = numericValue === '' ? null : parseInt(numericValue) || 0;
    updateFormData('partE', {
      componentsToFormIn6Months: {
        ...formData.partE.componentsToFormIn6Months,
        [orgKey]: numValue
      }
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError('');

    try {
      const token = isAdmin ? localStorage.getItem('adminToken') : localStorage.getItem('userToken');
      const endpoint = isAdmin ? '/api/admin/forms' : '/api/user/forms';
      
      let response;
      if (editingForm && editingForm._id) {
        // Update existing form
        response = await axios.put(`${import.meta.env.VITE_API_URL}${endpoint}/${editingForm._id}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      } else {
        // Create new form (admin shouldn't create forms, but handle it gracefully)
        response = await axios.post(`${import.meta.env.VITE_API_URL}${endpoint}`, formData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
      }

      onSubmit(response.data);
    } catch (error) {
      console.error('Form submission error:', error);
      setError(error.response?.data?.message || 'Form submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          PART-E (അധിക വിവരങ്ങൾ)
        </h2>
        <p className="text-gray-600">
          അധിക വിവരങ്ങളും ഭാവി പദ്ധതികളും നൽകുക
        </p>
      </div>

      {/* Question 1 */}
      <div className="mb-8">
        <label className="block text-lg font-medium text-gray-900 mb-3">
          1. നമ്മുടെ സാന്നിദ്ധ്യമില്ലാത്ത മുസ്‌ലിം ഭൂരിപക്ഷ പ്രദേശങ്ങൾ:
        </label>
        <div className="space-y-4">
          <textarea
            value={formData.partE.areasWithoutPresence.description}
            onChange={(e) => handleNestedChange('areasWithoutPresence', 'description', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="3"
            placeholder="പ്രദേശങ്ങളുടെ വിവരങ്ങൾ നൽകുക..."
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">തരം:</label>
            <select
              value={formData.partE.areasWithoutPresence.type}
              onChange={(e) => handleNestedChange('areasWithoutPresence', 'type', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="urban">അർബൻ</option>
              <option value="rural">റൂറൽ</option>
              <option value="hilly">മലയോരം</option>
              <option value="coastal">തീരദേശം</option>
            </select>
          </div>
        </div>
      </div>

      {/* Question 2 */}
      <div className="mb-8">
        <label className="block text-lg font-medium text-gray-900 mb-3">
          2. നമ്മുടെ സാന്നിദ്ധ്യമില്ലാത്ത പഞ്ചായത്തുകൾ/ മുനിസിപ്പാലിറ്റികൾ:
        </label>
        <textarea
          value={formData.partE.panchayatsWithoutPresence}
          onChange={(e) => handleChange('panchayatsWithoutPresence', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows="3"
          placeholder="പഞ്ചായത്തുകൾ/ മുനിസിപ്പാലിറ്റികളുടെ പേരുകൾ നൽകുക..."
        />
      </div>

      {/* Question 3 */}
      <div className="mb-8">
        <label className="block text-lg font-medium text-gray-900 mb-3">
          3. കഴിഞ്ഞ 5 വർഷത്തിനിടയിൽ പുതുതായി ഉണ്ടായ ഘടകങ്ങളുടെ എണ്ണം (പോഷക സംഘടനകൾ ഉൾപ്പെടെ ഇനം തിരിച്ചെഴുതുക):
        </label>
        <div className="space-y-4">
          <input
            type="number"
            value={formData.partE.newComponentsLast5Years.count !== null && formData.partE.newComponentsLast5Years.count !== undefined ? formData.partE.newComponentsLast5Years.count : ''}
            onChange={(e) => handleNestedChange('newComponentsLast5Years', 'count', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="എണ്ണം"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">തരം:</label>
            <select
              value={formData.partE.newComponentsLast5Years.type}
              onChange={(e) => handleNestedChange('newComponentsLast5Years', 'type', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="urban">അർബൻ</option>
              <option value="rural">റൂറൽ</option>
              <option value="hilly">മലയോരം</option>
              <option value="coastal">തീരദേശം</option>
            </select>
          </div>
          <textarea
            value={formData.partE.newComponentsLast5Years.details}
            onChange={(e) => handleNestedChange('newComponentsLast5Years', 'details', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows="3"
            placeholder="വിശദ വിവരങ്ങൾ..."
          />
        </div>
      </div>

      {/* Question 4 */}
      <div className="mb-8">
        <label className="block text-lg font-medium text-gray-900 mb-3">
          4. കഴിഞ്ഞ 5 വർഷത്തിനിടയിൽ പ്രവർത്തകരുടെ വർധനവ്:
        </label>
        <div className="space-y-4">
          <input
            type="number"
            value={formData.partE.workersGrowthInLast5Years.count !== null && formData.partE.workersGrowthInLast5Years.count !== undefined ? formData.partE.workersGrowthInLast5Years.count : ''}
            onChange={(e) => handleNestedChange('workersGrowthInLast5Years', 'count', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="വർധനവ് എണ്ണം"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">വർധനവിന്റെ തരം:</label>
            <select
              value={formData.partE.workersGrowthInLast5Years.type}
              onChange={(e) => handleNestedChange('workersGrowthInLast5Years', 'type', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="personalConnections">വ്യക്തിബന്ധം</option>
              <option value="traditional">പരമ്പരാഗതം</option>
              <option value="institutionalStudents">സ്ഥാപനത്തിൽ പഠിച്ചവർ</option>
              <option value="lectureAttendees">പ്രഭാഷണം കേട്ടവർ</option>
              <option value="classes">ക്ലാസുകൾ</option>
              <option value="khutbas">ഖുതുബകൾ</option>
              <option value="gulfConnections">ഗൾഫ് ബന്ധം</option>
              <option value="selfReading">സ്വന്തം വായന</option>
              <option value="other">മറ്റ്</option>
            </select>
          </div>
        </div>
      </div>

      {/* Question 5 */}
      <div className="mb-8">
        <label className="block text-lg font-medium text-gray-900 mb-3">
          5. 6 മാസത്തിനുള്ളിൽ (2026 മാർച്ച്) രൂപീകരിക്കാൻ സാധിക്കുന്ന ഘടകങ്ങൾ:
        </label>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-3 text-center font-medium">JIH</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-medium">വനിത</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-medium">Solidarity</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-medium">SIO</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-medium">GIO</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-medium">ടീൻ ഇന്ത്യ</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-medium">മലർവാടി</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 px-4 py-3">
                  <input
                    type="number"
                    value={formData.partE.componentsToFormIn6Months.jih}
                    onChange={(e) => handleComponentsChange('jih', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-center"
                    placeholder="0"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  <input
                    type="number"
                    value={formData.partE.componentsToFormIn6Months.vanitha}
                    onChange={(e) => handleComponentsChange('vanitha', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-center"
                    placeholder="0"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  <input
                    type="number"
                    value={formData.partE.componentsToFormIn6Months.solidarity}
                    onChange={(e) => handleComponentsChange('solidarity', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-center"
                    placeholder="0"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  <input
                    type="number"
                    value={formData.partE.componentsToFormIn6Months.sio}
                    onChange={(e) => handleComponentsChange('sio', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-center"
                    placeholder="0"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  <input
                    type="number"
                    value={formData.partE.componentsToFormIn6Months.gio}
                    onChange={(e) => handleComponentsChange('gio', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-center"
                    placeholder="0"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  <input
                    type="number"
                    value={formData.partE.componentsToFormIn6Months.teenIndia}
                    onChange={(e) => handleComponentsChange('teenIndia', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-center"
                    placeholder="0"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  <input
                    type="number"
                    value={formData.partE.componentsToFormIn6Months.malarvadi}
                    onChange={(e) => handleComponentsChange('malarvadi', e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded text-center"
                    placeholder="0"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600">{error}</p>
          </div>
        </div>
      )}

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
          disabled={isSubmitting || !validateCurrentStep()}
          className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>സമർപ്പിക്കുന്നു...</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              <span>{editingForm && editingForm._id ? 'ഫോം അപ്ഡേറ്റ് ചെയ്യുക' : 'ഫോം സമർപ്പിക്കുക'}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PartE;
