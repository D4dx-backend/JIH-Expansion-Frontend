import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useForm } from '../../contexts/FormContext';

// CSS to remove number input spinners - using inline styles that work
const numberInputStyles = {
  WebkitAppearance: 'none',
  MozAppearance: 'textfield',
  appearance: 'none'
};

const PartB = () => {
  const { formData, updateFormData, nextStep, prevStep, validateCurrentStep } = useForm();

  const organizations = [
    { key: 'jih', label: 'JIH' },
    { key: 'vanitha', label: 'വനിത' },
    { key: 'solidarity', label: 'Solidarity' },
    { key: 'sio', label: 'SIO' },
    { key: 'gio', label: 'GIO' },
    { key: 'malarvadi', label: 'Malarvadi' },
    { key: 'teenIndia', label: 'Teen India' }
  ];

  const handleOrganizationChange = (orgKey, field, value) => {
    // Only allow numbers
    const stringValue = String(value || '');
    const numericValue = stringValue.replace(/[^0-9]/g, '');
    const numValue = numericValue === '' ? null : parseInt(numericValue) || 0;
    updateFormData('partB', {
      organizations: {
        ...formData.partB.organizations,
        [orgKey]: {
          ...formData.partB.organizations[orgKey],
          [field]: numValue
        }
      }
    });
  };

  const handleInstitutionChange = (institutionKey, field, value) => {
    // Only allow numbers
    const stringValue = String(value || '');
    const numericValue = stringValue.replace(/[^0-9]/g, '');
    const numValue = numericValue === '' ? null : parseInt(numericValue) || 0;
    updateFormData('partB', {
      institutions: {
        ...formData.partB.institutions,
        [institutionKey]: {
          ...formData.partB.institutions[institutionKey],
          [field]: numValue
 }
      }
    });
  };

  const handleOtherChange = (section, field, value) => {
    // Only allow numbers
    const stringValue = String(value || '');
    const numericValue = stringValue.replace(/[^0-9]/g, '');
    const numValue = numericValue === '' ? null : parseInt(numericValue) || 0;
    updateFormData('partB', {
      [section]: {
        ...formData.partB[section],
        [field]: numValue
      }
    });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          PART-B (സംഘടനാ സംവിധാനങ്ങൾ)
        </h2>
        <p className="text-gray-600">
          സംഘടനാ വിവരങ്ങൾ നൽകുക
        </p>
      </div>

      {/* Organizations Table */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">സംഘടനകൾ</h3>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-3 text-left font-medium">വിവരങ്ങൾ</th>
                {organizations.map(org => (
                  <th key={org.key} className="border border-gray-300 px-4 py-3 text-center font-medium">
                    {org.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* Total Areas */}
              <tr>
                <td className="border border-gray-300 px-4 py-3 font-medium">ആകെ ഏരിയകൾ</td>
                {organizations.map(org => (
                  <td key={org.key} className="border border-gray-300 px-4 py-3">
                    <input
                      type="number"
                      value={formData.partB.organizations[org.key].totalAreas !== null && formData.partB.organizations[org.key].totalAreas !== undefined ? formData.partB.organizations[org.key].totalAreas : ''}
                      onChange={(e) => handleOrganizationChange(org.key, 'totalAreas', e.target.value)}
                      className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px]"
                      style={numberInputStyles}
                      disabled={org.key === 'malarvadi' || org.key === 'teenIndia'}
                    />
                  </td>
                ))}
              </tr>
              
              {/* Components */}
              <tr>
                <td className="border border-gray-300 px-4 py-3 font-medium">ഘടകങ്ങൾ</td>
                {organizations.map(org => (
                  <td key={org.key} className="border border-gray-300 px-4 py-3">
                    <input
                      type="number"
                      value={formData.partB.organizations[org.key].components !== null && formData.partB.organizations[org.key].components !== undefined ? formData.partB.organizations[org.key].components : ''}
                      onChange={(e) => handleOrganizationChange(org.key, 'components', e.target.value)}
                      className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px]"
                      style={numberInputStyles}
                      // disabled={org.key === 'malarvadi' || org.key === 'teenIndia'}
                    />
                  </td>
                ))}
              </tr>

              {/* Workers 2023 */}
              <tr>
                <td className="border border-gray-300 px-4 py-3 font-medium">പ്രവർത്തകരുടെ എണ്ണം (2023)</td>
                {organizations.map(org => (
                  <td key={org.key} className="border border-gray-300 px-4 py-3">
                    <input
                      type="number"
                      value={formData.partB.organizations[org.key].workers2023 !== null && formData.partB.organizations[org.key].workers2023 !== undefined ? formData.partB.organizations[org.key].workers2023 : ''}
                      onChange={(e) => handleOrganizationChange(org.key, 'workers2023', e.target.value)}
                      className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px]"
                      style={numberInputStyles}
                    />
                  </td>
                ))}
              </tr>

              {/* Workers 2025 */}
              <tr>
                <td className="border border-gray-300 px-4 py-3 font-medium">പ്രവർത്തകരുടെ എണ്ണം (2025)</td>
                {organizations.map(org => (
                  <td key={org.key} className="border border-gray-300 px-4 py-3">
                    <input
                      type="number"
                      value={formData.partB.organizations[org.key].workers2025 !== null && formData.partB.organizations[org.key].workers2025 !== undefined ? formData.partB.organizations[org.key].workers2025 : ''}
                      onChange={(e) => handleOrganizationChange(org.key, 'workers2025', e.target.value)}
                      className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px]"
                      style={numberInputStyles}
                    />
                  </td>
                ))}
              </tr>

              {/* Components 2023 */}
              <tr>
                <td className="border border-gray-300 px-4 py-3 font-medium">ഘടകങ്ങളുടെ എണ്ണം (2023)</td>
                {organizations.map(org => (
                  <td key={org.key} className="border border-gray-300 px-4 py-3">
                    <input
                      type="number"
                      value={formData.partB.organizations[org.key].components2023 !== null && formData.partB.organizations[org.key].components2023 !== undefined ? formData.partB.organizations[org.key].components2023 : ''}
                      onChange={(e) => handleOrganizationChange(org.key, 'components2023', e.target.value)}
                      className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px]"
                      style={numberInputStyles}
                    />
                  </td>
                ))}
              </tr>

              {/* Components 2025 */}
              <tr>
                <td className="border border-gray-300 px-4 py-3 font-medium">ഘടകങ്ങളുടെ എണ്ണം (2025)</td>
                {organizations.map(org => (
                  <td key={org.key} className="border border-gray-300 px-4 py-3">
                    <input
                      type="number"
                      value={formData.partB.organizations[org.key].components2025 !== null && formData.partB.organizations[org.key].components2025 !== undefined ? formData.partB.organizations[org.key].components2025 : ''}
                      onChange={(e) => handleOrganizationChange(org.key, 'components2025', e.target.value)}
                      className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px]"
                      style={numberInputStyles}
                    />
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Educational Programs */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">വിദ്യാഭ്യാസ പ്രോഗ്രാമുകൾ</h3>
        
        {/* Thawheed Maraa */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">തംഹീദുല്‍ മർഅഃ</label>
            <input
              type="number"
              value={formData.partB.thawheedMaraa.existing !== null && formData.partB.thawheedMaraa.existing !== undefined ? formData.partB.thawheedMaraa.existing : ''}
              onChange={(e) => handleOtherChange('thawheedMaraa', 'existing', e.target.value)}
              className="w-full px-6 py-4 border border-gray-300 rounded-lg text-lg min-w-[150px]"
              style={numberInputStyles}
              placeholder="നിലവിലുള്ളത്"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">പഠിതാക്കൾ</label>
            <input
              type="number"
              value={formData.partB.thawheedMaraa.students !== null && formData.partB.thawheedMaraa.students !== undefined ? formData.partB.thawheedMaraa.students : ''}
              onChange={(e) => handleOtherChange('thawheedMaraa', 'students', e.target.value)}
              className="w-full px-6 py-4 border border-gray-300 rounded-lg text-lg min-w-[150px]"
              style={numberInputStyles}
              placeholder="എണ്ണം"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">പ്രവർത്തകരല്ലാത്തവർ</label>
            <input
              type="number"
              value={formData.partB.thawheedMaraa.nonWorkers !== null && formData.partB.thawheedMaraa.nonWorkers !== undefined ? formData.partB.thawheedMaraa.nonWorkers : ''}
              onChange={(e) => handleOtherChange('thawheedMaraa', 'nonWorkers', e.target.value)}
              className="w-full px-6 py-4 border border-gray-300 rounded-lg text-lg min-w-[150px]"
              style={numberInputStyles}
              placeholder="എണ്ണം"
            />
          </div>
        </div>

        {/* QSC Men */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">QSC (പുരുഷന്മാർ)</label>
            <input
              type="number"
              value={formData.partB.qscMen.existing || ''}
              onChange={(e) => handleOtherChange('qscMen', 'existing', e.target.value)}
              className="w-full px-6 py-4 border border-gray-300 rounded-lg text-lg min-w-[150px]"
              style={numberInputStyles}
              placeholder="നിലവിലുള്ളത്"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">പഠിതാക്കൾ</label>
            <input
              type="number"
              value={formData.partB.qscMen.students || ''}
              onChange={(e) => handleOtherChange('qscMen', 'students', e.target.value)}
              className="w-full px-6 py-4 border border-gray-300 rounded-lg text-lg min-w-[150px]"
              style={numberInputStyles}
              placeholder="എണ്ണം"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">പ്രവർത്തകരല്ലാത്തവർ</label>
            <input
              type="number"
              value={formData.partB.qscMen.nonWorkers || ''}
              onChange={(e) => handleOtherChange('qscMen', 'nonWorkers', e.target.value)}
              className="w-full px-6 py-4 border border-gray-300 rounded-lg text-lg min-w-[150px]"
              style={numberInputStyles}
              placeholder="എണ്ണം"
            />
          </div>
        </div>

        {/* QSC Women */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">QSC (വനിത)</label>
            <input
              type="number"
              value={formData.partB.qscWomen.existing || ''}
              onChange={(e) => handleOtherChange('qscWomen', 'existing', e.target.value)}
              className="w-full px-6 py-4 border border-gray-300 rounded-lg text-lg min-w-[150px]"
              style={numberInputStyles}
              placeholder="നിലവിലുള്ളത്"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">പഠിതാക്കൾ</label>
            <input
              type="number"
              value={formData.partB.qscWomen.students || ''}
              onChange={(e) => handleOtherChange('qscWomen', 'students', e.target.value)}
              className="w-full px-6 py-4 border border-gray-300 rounded-lg text-lg min-w-[150px]"
              style={numberInputStyles}
              placeholder="എണ്ണം"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">പ്രവർത്തകരല്ലാത്തവർ</label>
            <input
              type="number"
              value={formData.partB.qscWomen.nonWorkers || ''}
              onChange={(e) => handleOtherChange('qscWomen', 'nonWorkers', e.target.value)}
              className="w-full px-6 py-4 border border-gray-300 rounded-lg text-lg min-w-[150px]"
              style={numberInputStyles}
              placeholder="എണ്ണം"
            />
          </div>
        </div>

        {/* Juma Mosques */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ജുമുഅഃ നടക്കുന്ന പള്ളികൾ</label>
            <input
              type="number"
              value={formData.partB.jumaMosques.count || ''}
              onChange={(e) => handleOtherChange('jumaMosques', 'count', e.target.value)}
              className="w-full px-6 py-4 border border-gray-300 rounded-lg text-lg min-w-[150px]"
              style={numberInputStyles}
              placeholder="എണ്ണം"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">ജുമുഅഃയിൽ പങ്കെടുക്കുന്നവർ (ശരാശരി)</label>
            <input
              type="number"
              value={formData.partB.jumaMosques.averageAttendees || ''}
              onChange={(e) => handleOtherChange('jumaMosques', 'averageAttendees', e.target.value)}
              className="w-full px-6 py-4 border border-gray-300 rounded-lg text-lg min-w-[150px]"
              style={numberInputStyles}
              placeholder="ശരാശരി"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">പ്രവർത്തകരല്ലാത്തവർ (ഏകദേശം)</label>
            <input
              type="number"
              value={formData.partB.jumaMosques.nonWorkersApprox || ''}
              onChange={(e) => handleOtherChange('jumaMosques', 'nonWorkersApprox', e.target.value)}
              className="w-full px-6 py-4 border border-gray-300 rounded-lg text-lg min-w-[150px]"
              style={numberInputStyles}
              placeholder="ഏകദേശം"
            />
          </div>
        </div>
      </div>

      {/* Educational Institutions */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">വിദ്യാഭ്യാസ സ്ഥാപനങ്ങൾ</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-3 text-left font-medium">വിവരങ്ങൾ</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-medium">എണ്ണം</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-medium">കുട്ടികളുടെ എണ്ണം</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-medium" colSpan="2">Staff</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-medium" colSpan="2">Non Teaching Staff</th>
              </tr>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-3 text-left font-medium"></th>
                <th className="border border-gray-300 px-4 py-3 text-center font-medium"></th>
                <th className="border border-gray-300 px-4 py-3 text-center font-medium"></th>
                <th className="border border-gray-300 px-4 py-3 text-center font-medium">പ്രവർത്തകർ</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-medium">മറ്റുള്ളവർ</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-medium">പ്രവർത്തകർ</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-medium">മറ്റുള്ളവർ</th>
              </tr>
            </thead>
            <tbody>
              {/* Madrasas */}
              <tr>
                <td className="border border-gray-300 px-4 py-3 font-medium">9. മദ്റസകളുടെ എണ്ണം</td>
                <td className="border border-gray-300 px-4 py-3">
                  <input
                    type="number"
                    value={formData.partB.institutions.madrasas.count !== null && formData.partB.institutions.madrasas.count !== undefined ? formData.partB.institutions.madrasas.count : ''}
                    onChange={(e) => handleInstitutionChange('madrasas', 'count', e.target.value)}
                    className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px]"
                    style={numberInputStyles}
                  />
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  <input
                    type="number"
                    value={formData.partB.institutions.madrasas.studentsCount !== null && formData.partB.institutions.madrasas.studentsCount !== undefined ? formData.partB.institutions.madrasas.studentsCount : ''}
                    onChange={(e) => handleInstitutionChange('madrasas', 'studentsCount', e.target.value)}
                    className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px]"
                    style={numberInputStyles}
                  />
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  <input
                    type="number"
                    value={formData.partB.institutions.madrasas.staffWorkers !== null && formData.partB.institutions.madrasas.staffWorkers !== undefined ? formData.partB.institutions.madrasas.staffWorkers : ''}
                    onChange={(e) => handleInstitutionChange('madrasas', 'staffWorkers', e.target.value)}
                    className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px]"
                    style={numberInputStyles}
                  />
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  <input
                    type="number"
                    value={formData.partB.institutions.madrasas.staffOthers !== null && formData.partB.institutions.madrasas.staffOthers !== undefined ? formData.partB.institutions.madrasas.staffOthers : ''}
                    onChange={(e) => handleInstitutionChange('madrasas', 'staffOthers', e.target.value)}
                    className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px]"
                    style={numberInputStyles}
                  />
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  <input
                    type="number"
                    value={formData.partB.institutions.madrasas.nonTeachingWorkers !== null && formData.partB.institutions.madrasas.nonTeachingWorkers !== undefined ? formData.partB.institutions.madrasas.nonTeachingWorkers : ''}
                    onChange={(e) => handleInstitutionChange('madrasas', 'nonTeachingWorkers', e.target.value)}
                    className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px]"
                    style={numberInputStyles}
                  />
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  <input
                    type="number"
                    value={formData.partB.institutions.madrasas.nonTeachingOthers !== null && formData.partB.institutions.madrasas.nonTeachingOthers !== undefined ? formData.partB.institutions.madrasas.nonTeachingOthers : ''}
                    onChange={(e) => handleInstitutionChange('madrasas', 'nonTeachingOthers', e.target.value)}
                    className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px]"
                    style={numberInputStyles}
                  />
                </td>
              </tr>

              {/* Schools */}
              <tr>
                <td className="border border-gray-300 px-4 py-3 font-medium">10. സ്‌കൂളുകൾ (വിദ്യാകൗൺസിൽ)</td>
                <td className="border border-gray-300 px-4 py-3">
                  <input
                    type="number"
                    value={formData.partB.institutions.schools.count || ''}
                    onChange={(e) => handleInstitutionChange('schools', 'count', e.target.value)}
                    className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px]"
                    style={numberInputStyles}
                  />
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  <input
                    type="number"
                    value={formData.partB.institutions.schools.studentsCount || ''}
                    onChange={(e) => handleInstitutionChange('schools', 'studentsCount', e.target.value)}
                    className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px]"
                    style={numberInputStyles}
                  />
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  <input
                    type="number"
                    value={formData.partB.institutions.schools.staffWorkers || ''}
                    onChange={(e) => handleInstitutionChange('schools', 'staffWorkers', e.target.value)}
                    className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px]"
                    style={numberInputStyles}
                  />
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  <input
                    type="number"
                    value={formData.partB.institutions.schools.staffOthers || ''}
                    onChange={(e) => handleInstitutionChange('schools', 'staffOthers', e.target.value)}
                    className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px]"
                    style={numberInputStyles}
                  />
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  <input
                    type="number"
                    value={formData.partB.institutions.schools.nonTeachingWorkers || ''}
                    onChange={(e) => handleInstitutionChange('schools', 'nonTeachingWorkers', e.target.value)}
                    className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px]"
                    style={numberInputStyles}
                  />
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  <input
                    type="number"
                    value={formData.partB.institutions.schools.nonTeachingOthers || ''}
                    onChange={(e) => handleInstitutionChange('schools', 'nonTeachingOthers', e.target.value)}
                    className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px]"
                    style={numberInputStyles}
                  />
                </td>
              </tr>

              {/* Heavens */}
              <tr>
                <td className="border border-gray-300 px-4 py-3 font-medium">11. ഹെവൻസ്</td>
                <td className="border border-gray-300 px-4 py-3">
                  <input
                    type="number"
                    value={formData.partB.institutions.heavens.count || ''}
                    onChange={(e) => handleInstitutionChange('heavens', 'count', e.target.value)}
                    className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px]"
                    style={numberInputStyles}
                  />
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  <input
                    type="number"
                    value={formData.partB.institutions.heavens.studentsCount || ''}
                    onChange={(e) => handleInstitutionChange('heavens', 'studentsCount', e.target.value)}
                    className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px]"
                    style={numberInputStyles}
                  />
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  <input
                    type="number"
                    value={formData.partB.institutions.heavens.staffWorkers || ''}
                    onChange={(e) => handleInstitutionChange('heavens', 'staffWorkers', e.target.value)}
                    className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px]"
                    style={numberInputStyles}
                  />
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  <input
                    type="number"
                    value={formData.partB.institutions.heavens.staffOthers || ''}
                    onChange={(e) => handleInstitutionChange('heavens', 'staffOthers', e.target.value)}
                    className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px]"
                    style={numberInputStyles}
                  />
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  <input
                    type="number"
                    value={formData.partB.institutions.heavens.nonTeachingWorkers || ''}
                    onChange={(e) => handleInstitutionChange('heavens', 'nonTeachingWorkers', e.target.value)}
                    className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px]"
                    style={numberInputStyles}
                  />
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  <input
                    type="number"
                    value={formData.partB.institutions.heavens.nonTeachingOthers || ''}
                    onChange={(e) => handleInstitutionChange('heavens', 'nonTeachingOthers', e.target.value)}
                    className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px]"
                    style={numberInputStyles}
                  />
                </td>
              </tr>

              {/* Arabic Colleges */}
              <tr>
                <td className="border border-gray-300 px-4 py-3 font-medium">12. അറബി കോളേജുകൾ</td>
                <td className="border border-gray-300 px-4 py-3">
                  <input
                    type="number"
                    value={formData.partB.institutions.arabicColleges.count || ''}
                    onChange={(e) => handleInstitutionChange('arabicColleges', 'count', e.target.value)}
                    className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px]"
                    style={numberInputStyles}
                  />
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  <input
                    type="number"
                    value={formData.partB.institutions.arabicColleges.studentsCount || ''}
                    onChange={(e) => handleInstitutionChange('arabicColleges', 'studentsCount', e.target.value)}
                    className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px]"
                    style={numberInputStyles}
                  />
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  <input
                    type="number"
                    value={formData.partB.institutions.arabicColleges.staffWorkers || ''}
                    onChange={(e) => handleInstitutionChange('arabicColleges', 'staffWorkers', e.target.value)}
                    className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px]"
                    style={numberInputStyles}
                  />
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  <input
                    type="number"
                    value={formData.partB.institutions.arabicColleges.staffOthers || ''}
                    onChange={(e) => handleInstitutionChange('arabicColleges', 'staffOthers', e.target.value)}
                    className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px]"
                    style={numberInputStyles}
                  />
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  <input
                    type="number"
                    value={formData.partB.institutions.arabicColleges.nonTeachingWorkers || ''}
                    onChange={(e) => handleInstitutionChange('arabicColleges', 'nonTeachingWorkers', e.target.value)}
                    className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px]"
                    style={numberInputStyles}
                  />
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  <input
                    type="number"
                    value={formData.partB.institutions.arabicColleges.nonTeachingOthers || ''}
                    onChange={(e) => handleInstitutionChange('arabicColleges', 'nonTeachingOthers', e.target.value)}
                    className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px]"
                    style={numberInputStyles}
                  />
                </td>
              </tr>

              {/* Arts Colleges */}
              <tr>
                <td className="border border-gray-300 px-4 py-3 font-medium">13. ആർട്സ് കോളേജുകൾ</td>
                <td className="border border-gray-300 px-4 py-3">
                  <input
                    type="number"
                    value={formData.partB.institutions.artsColleges.count || ''}
                    onChange={(e) => handleInstitutionChange('artsColleges', 'count', e.target.value)}
                    className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px]"
                    style={numberInputStyles}
                  />
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  <input
                    type="number"
                    value={formData.partB.institutions.artsColleges.studentsCount || ''}
                    onChange={(e) => handleInstitutionChange('artsColleges', 'studentsCount', e.target.value)}
                    className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px]"
                    style={numberInputStyles}
                  />
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  <input
                    type="number"
                    value={formData.partB.institutions.artsColleges.staffWorkers || ''}
                    onChange={(e) => handleInstitutionChange('artsColleges', 'staffWorkers', e.target.value)}
                    className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px]"
                    style={numberInputStyles}
                  />
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  <input
                    type="number"
                    value={formData.partB.institutions.artsColleges.staffOthers || ''}
                    onChange={(e) => handleInstitutionChange('artsColleges', 'staffOthers', e.target.value)}
                    className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px]"
                    style={numberInputStyles}
                  />
                </td>
                <td className="border border-gray-300 px-4 py-3">
                  <input
                    type="number"
                    value={formData.partB.institutions.artsColleges.nonTeachingWorkers || ''}
                    onChange={(e) => handleInstitutionChange('artsColleges', 'nonTeachingWorkers', e.target.value)}
                    className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px]"
                    style={numberInputStyles}
                  />
                </td>
                <td className="border border-gray-300 px-4 py-3">
            <input
              type="number"
                    value={formData.partB.institutions.artsColleges.nonTeachingOthers || ''}
                    onChange={(e) => handleInstitutionChange('artsColleges', 'nonTeachingOthers', e.target.value)}
                    className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px]"
                    style={numberInputStyles}
                  />
                </td>
              </tr>

              {/* Main Campuses */}
              <tr>
                <td className="border border-gray-300 px-4 py-3 font-medium">14. പ്രധാന കാമ്പസുകൾ (SIO, GIO സാന്നിധ്യമുള്ളത്)</td>
                <td className="border border-gray-300 px-4 py-3">
            <input
              type="number"
                    value={formData.partB.institutions.mainCampuses.count || ''}
                    onChange={(e) => handleInstitutionChange('mainCampuses', 'count', e.target.value)}
                    className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px]"
                    style={numberInputStyles}
                  />
                </td>
                <td className="border border-gray-300 px-4 py-3">
            <input
              type="number"
                    value={formData.partB.institutions.mainCampuses.studentsCount || ''}
                    onChange={(e) => handleInstitutionChange('mainCampuses', 'studentsCount', e.target.value)}
                    className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px]"
                    style={numberInputStyles}
                  />
                </td>
                <td className="border border-gray-300 px-4 py-3 bg-gray-100">
            <input
              type="number"
                    disabled
                    className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px] bg-gray-100"
                    style={numberInputStyles}
                  />
                </td>
                <td className="border border-gray-300 px-4 py-3 bg-gray-100">
            <input
              type="number"
                    disabled
                    className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px] bg-gray-100"
                    style={numberInputStyles}
                  />
                </td>
                <td className="border border-gray-300 px-4 py-3 bg-gray-100">
            <input
              type="number"
                    disabled
                    className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px] bg-gray-100"
                    style={numberInputStyles}
                  />
                </td>
                <td className="border border-gray-300 px-4 py-3 bg-gray-100">
            <input
              type="number"
                    disabled
                    className="w-full px-6 py-4 border border-gray-300 rounded text-center text-lg min-w-[120px] bg-gray-100"
                    style={numberInputStyles}
                  />
                </td>
              </tr>
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

export default PartB;
