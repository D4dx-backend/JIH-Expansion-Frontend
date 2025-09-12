import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useAreaForm } from '../../contexts/AreaFormContext';

const AreaPageC = () => {
  const { formData, updateFormData, nextStep, prevStep, validateCurrentStep } = useAreaForm();

  const handleExpansionActivityChange = (activityKey, checked) => {
    updateFormData('partC', {
      expansionActivities: {
        ...formData.partC.expansionActivities,
        [activityKey]: checked
      }
    });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          ഏരിയ തലം റിപ്പോർട്ട് - PART C
        </h2>
        <p className="text-gray-600">
          താഴെ പറയുന്നവയിൽ ഏതൊക്കെ മേഖലകളിൽ ഫോകസ് ചെയ്തു
        </p>
      </div>

      {/* Focus Areas */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          C. താഴെ പറയുന്നവയിൽ ഏതൊക്കെ മേഖലകളിൽ ഫോകസ് ചെയ്തു
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { key: 'newAreaWorkshop', label: 'പുതിയ പ്രദേശങ്ങളില്‍ പ്രസ്ഥാന വ്യാപനം ലക്ഷ്യംവെച്ച് വര്‍ക്‌ഷോപ്പ്' },
            { key: 'workerTraining', label: 'പ്രവര്‍ത്തകര്‍ക്ക് പരിശീലനം' },
            { key: 'newAreaAgenda', label: 'പുതിയ പ്രദേശത്തേക്കുള്ള അജണ്ട തയ്യാറാക്കല്‍' },
            { key: 'fulltimeRecruitment', label: 'ഫുള്‍ടൈമറുടെ നിയമനം' },
            { key: 'schoolGuardianCluster', label: 'സ്‌കൂള്‍ രക്ഷിതാക്കളുടെ ക്ലസ്റ്റര്‍ രൂപീകരണം' },
            { key: 'reliefDataCollection', label: 'റിലീഫ് ഗുണഭോക്താക്കളുടെ ഡാറ്റാ ശേഖരണം' },
            { key: 'workerDeployment', label: 'പുതിയ പ്രദേശത്തേക്ക് പ്രവര്‍ത്തകരെ വിന്യസിക്കല്‍' },
            { key: 'weeklyMeetingEffectiveness', label: 'വാരാന്തയോഗങ്ങളുടെ ഫലപ്രാപ്തി ഉറപ്പാക്കല്‍' },
            { key: 'hajjUmrahGroup', label: 'ഹജ്ജ്/ ഉംറ ഗ്രൂപ്പില്‍ പോയവരെ കണ്ടെത്തല്‍' },
            { key: 'artsScienceCampus', label: 'ഏരിയയിലെ Arts & Science കോളജ് കാമ്പസില്‍ ഫ്രറ്റേണിറ്റി, SIO, GIO, മേധാവിത്തം ഉറപ്പാക്കല്‍' },
            { key: 'madrasaGrowthCalculation', label: 'മദ്‌റസയിലൂടെയുള്ള പ്രസ്ഥാന വളര്‍ച്ചയുടെ കണക്കെടുപ്പ്' },
            { key: 'schoolCenteredWork', label: 'സ്‌കൂളുകള്‍ കേന്ദ്രീകരിച്ചുള്ള പ്രവര്‍ത്തനം' },
            { key: 'staffHalkaFormation', label: 'സ്റ്റാഫ് ഹല്‍ഖാ രൂപീകരണം' },
            { key: 'islamicCollegeAlumni', label: 'ഇസ്്‌ലാമിയ കോളേജുകളിലെ പൂര്‍വ്വ വിദ്യാര്‍ത്ഥികളെ കണ്ടെത്തല്‍' },
            { key: 'quranStudyCenterWork', label: 'ഖുര്‍ആന്‍ സ്റ്റഡി സെന്റര്‍ കേന്ദ്രീകരിച്ചുള്ള പ്രവര്‍ത്തനങ്ങള്‍' }
          ].map(item => (
            <label key={item.key} className="flex items-start space-x-3 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.partC.expansionActivities[item.key] || false}
                onChange={(e) => handleExpansionActivityChange(item.key, e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
              />
              <span className="text-sm text-gray-900 leading-relaxed">{item.label}</span>
            </label>
          ))}
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

export default AreaPageC;
