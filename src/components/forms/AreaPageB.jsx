import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useAreaForm } from '../../contexts/AreaFormContext';

const AreaPageB = () => {
  const { formData, updateFormData, nextStep, prevStep, validateCurrentStep } = useAreaForm();

  const wings = [
    { key: 'jih', label: 'JIH' },
    { key: 'vanitha', label: 'വനിത' },
    { key: 'solidarity', label: 'സോളിഡാരിറ്റി' },
    { key: 'sio', label: 'SIO' },
    { key: 'gio', label: 'GIO' }
  ];

  const handleWingAttendanceChange = (wingKey, field, value) => {
    // Only allow numbers
    const stringValue = String(value || '');
    const numericValue = stringValue.replace(/[^0-9]/g, '');
    const numValue = numericValue === '' ? null : parseInt(numericValue) || 0;
    
    updateFormData('partB', {
      wingAttendance: {
        ...formData.partB.wingAttendance,
        [wingKey]: {
          ...formData.partB.wingAttendance[wingKey],
          [field]: numValue
        }
      }
    });
  };

  const handleMainDecisionChange = (index, value) => {
    const newDecisions = [...(formData.partB.mainDecisions || [])];
    newDecisions[index] = value;
    updateFormData('partB', { mainDecisions: newDecisions });
  };

  const addMainDecision = () => {
    const newDecisions = [...(formData.partB.mainDecisions || []), ''];
    updateFormData('partB', { mainDecisions: newDecisions });
  };

  const removeMainDecision = (index) => {
    const newDecisions = [...(formData.partB.mainDecisions || [])];
    newDecisions.splice(index, 1);
    updateFormData('partB', { mainDecisions: newDecisions });
  };

  const handleExpansionActivityChange = (field, value) => {
    updateFormData('partC', {
      expansionActivities: {
        ...formData.partC.expansionActivities,
        [field]: value
      }
    });
  };



  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          ഏരിയ തലം റിപ്പോർട്ട് - PART B
        </h2>
        <p className="text-gray-600">
          Expansion മായി ബന്ധപെട്ട് നടന്ന പ്രവർത്തനങ്ങൾ
        </p>
      </div>

      {/* Monthly Meeting */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          മാസാന്തയോഗം - നടന്നു / ഇല്ല
        </h3>
        <div className="flex space-x-4">
          <label className="flex items-center">
            <input
              type="radio"
              name="monthlyMeeting"
              value="Yes"
              checked={formData.partB.monthlyMeeting === 'Yes'}
              onChange={(e) => updateFormData('partB', { monthlyMeeting: e.target.value })}
              className="mr-2"
            />
            <span className="text-lg">Yes</span>
          </label>
          <label className="flex items-center">
            <input
              type="radio"
              name="monthlyMeeting"
              value="No"
              checked={formData.partB.monthlyMeeting === 'No'}
              onChange={(e) => updateFormData('partB', { monthlyMeeting: e.target.value })}
              className="mr-2"
            />
            <span className="text-lg">No</span>
          </label>
        </div>
      </div>

      {/* Wing Attendance Table */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          വിംഗ് ഹാജർ/ലീവ്/ആബ്‌സന്റ്
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-3 text-left font-medium">വിംഗ്</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-medium">ഹാജർ</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-medium">ലീവ്</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-medium">ആബ്‌സന്റ്</th>
              </tr>
            </thead>
            <tbody>
              {wings.map(wing => (
                <tr key={wing.key}>
                  <td className="border border-gray-300 px-4 py-3 font-medium">{wing.label}</td>
                  <td className="border border-gray-300 px-4 py-3">
                    <input
                      type="number"
                      value={formData.partB.wingAttendance[wing.key]?.present !== null && formData.partB.wingAttendance[wing.key]?.present !== undefined ? formData.partB.wingAttendance[wing.key].present : ''}
                      onChange={(e) => handleWingAttendanceChange(wing.key, 'present', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-center"
                      placeholder="0"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    <input
                      type="number"
                      value={formData.partB.wingAttendance[wing.key]?.leave !== null && formData.partB.wingAttendance[wing.key]?.leave !== undefined ? formData.partB.wingAttendance[wing.key].leave : ''}
                      onChange={(e) => handleWingAttendanceChange(wing.key, 'leave', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-center"
                      placeholder="0"
                    />
                  </td>
                  <td className="border border-gray-300 px-4 py-3">
                    <input
                      type="number"
                      value={formData.partB.wingAttendance[wing.key]?.absent !== null && formData.partB.wingAttendance[wing.key]?.absent !== undefined ? formData.partB.wingAttendance[wing.key].absent : ''}
                      onChange={(e) => handleWingAttendanceChange(wing.key, 'absent', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded text-center"
                      placeholder="0"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Main Decisions */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          പ്രധാന തീരുമാനങ്ങൾ
        </h3>
        <div className="space-y-3">
          {(formData.partB.mainDecisions || []).map((decision, index) => (
            <div key={index} className="flex items-center space-x-3">
              <span className="text-lg font-medium">{index + 1}.</span>
              <input
                type="text"
                value={decision}
                onChange={(e) => handleMainDecisionChange(index, e.target.value)}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                placeholder="തീരുമാനം നൽകുക"
              />
              <button
                type="button"
                onClick={() => removeMainDecision(index)}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg"
              >
                ഇല്ലാതാക്കുക
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addMainDecision}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            + തീരുമാനം ചേർക്കുക
          </button>
        </div>
      </div>

      {/* Focus Areas */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          C. താഴെ പറയുന്നവയിൽ ഏതൊക്കെ മേഖലകളിൽ ഫോകസ് ചെയ്തു
        </h3>
        
        {/* Expansion Activities - All 15 fields under one section */}
        <div className="mb-6">
          <h4 className="text-md font-medium text-gray-800 mb-3">പുതിയ പ്രദേശങ്ങളില്‍ പ്രസ്ഥാന വ്യാപനം ലക്ഷ്യംവെച്ച്:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'newAreaWorkshop', label: 'വർക്ഷോപ്പ്' },
              { key: 'workerTraining', label: 'പ്രവർത്തകര്‍ക്ക് പരിശീലനം' },
              { key: 'newAreaAgenda', label: 'പുതിയ പ്രദേശത്തേക്കുള്ള അജണ്ട തയ്യാറാക്കല്‍' },
              { key: 'fulltimeRecruitment', label: 'ഫുള്‍ടൈമറുടെ നിയമനം' },
              { key: 'schoolGuardianCluster', label: 'സ്‌കൂള്‍ രക്ഷിതാക്കളുടെ ക്ലസ്റ്റര്‍ രൂപീകരണം' },
              { key: 'reliefDataCollection', label: 'റിലീഫ് ഗുണഭോക്താക്കളുടെ ഡാറ്റാ ശേഖരണം' },
              { key: 'workerDeployment', label: 'പുതിയ പ്രദേശത്തേക്ക് പ്രവര്‍ത്തകരെ വിന്യസിക്കല്‍' },
              { key: 'weeklyMeetingEffectiveness', label: 'വാരാന്തയോഗങ്ങളുടെ ഫലപ്രാപ്തി ഉറപ്പാക്കല്‍' },
              { key: 'artsScienceCampus', label: 'ഫ്രറ്റേണിറ്റി, SIO, GIO, മേധാവിത്തം ഉറപ്പാക്കല്‍' },
              { key: 'hajjUmrahGroup', label: 'ഹജ്ജ്/ ഉംറ ഗ്രൂപ്പില്‍ പോയവരെ കണ്ടെത്തല്‍' },
              { key: 'madrasaGrowthCalculation', label: 'മദ്‌റസയിലൂടെയുള്ള പ്രസ്ഥാന വളര്‍ച്ചയുടെ കണക്കെടുപ്പ്' },
              { key: 'schoolCenteredWork', label: 'സ്‌കൂളുകള്‍ കേന്ദ്രീകരിച്ചുള്ള പ്രവര്‍ത്തനം' },
              { key: 'staffHalkaFormation', label: 'സ്റ്റാഫ് ഹല്‍ഖാ രൂപീകരണം' },
              { key: 'islamicCollegeAlumni', label: 'ഇസ്്‌ലാമിയ കോളേജുകളിലെ പൂര്‍വ്വ വിദ്യാര്‍ത്ഥികളെ കണ്ടെത്തല്‍' },
              { key: 'quranStudyCenterWork', label: 'ഖുര്‍ആന്‍ സ്റ്റഡി സെന്റര്‍ കേന്ദ്രീകരിച്ചുള്ള പ്രവര്‍ത്തനങ്ങള്‍' }
            ].map(item => (
              <label key={item.key} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.partC.expansionActivities[item.key] || false}
                  onChange={(e) => handleExpansionActivityChange(item.key, e.target.checked)}
                  className="mr-3"
                />
                <span className="text-sm">{item.label}</span>
              </label>
            ))}
          </div>
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

export default AreaPageB;
