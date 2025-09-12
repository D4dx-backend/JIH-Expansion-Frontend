import React from 'react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useAreaForm } from '../../contexts/AreaFormContext';

const AreaPageE = () => {
  const { formData, updateFormData, nextStep, prevStep, validateCurrentStep } = useAreaForm();

  const handleCategoryChange = (categoryKey, checked) => {
    updateFormData('partE', {
      categories: {
        ...formData.partE.categories,
        [categoryKey]: checked
      }
    });
  };

  return (
    <div className="p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          ഏരിയ തലം റിപ്പോർട്ട് - PART E
        </h2>
        <p className="text-gray-600">
          പുതിയ വ്യക്തികളെ കണ്ടെത്തുന്നതിനായി സംസാരിച്ച വ്യക്തികൾ
        </p>
      </div>

      {/* New Person Discovery */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          E. പുതിയ വ്യക്തികളെ കണ്ടെത്തുന്നതിനായി സംസാരിച്ച വ്യക്തികൾ
        </h3>
        
        {/* Gender Count */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-lg font-medium text-gray-900 mb-2">
              ആണ്‍
            </label>
            <input
              type="number"
              value={formData.partE.male !== null && formData.partE.male !== undefined ? formData.partE.male : ''}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                updateFormData('partE', { male: value === '' ? null : parseInt(value) || 0 });
              }}
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
              value={formData.partE.female !== null && formData.partE.female !== undefined ? formData.partE.female : ''}
              onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, '');
                updateFormData('partE', { female: value === '' ? null : parseInt(value) || 0 });
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
              placeholder="എണ്ണം നൽകുക"
            />
          </div>
        </div>

        {/* Categories */}
        <div>
          <h4 className="text-md font-medium text-gray-800 mb-3">
            ഏത് കാറ്റഗറിയില്‍പെട്ടവരോടാണ് സംസാരിച്ചത് (v മാര്‍ക്ക് ചെയ്യുക)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { key: 'personalConnection', label: 'വ്യക്തിബന്ധം' },
              { key: 'literaryConnection', label: 'സാഹിത്യബന്ധം' },
              { key: 'qscStudent', label: 'QSC പഠിതാവ്' },
              { key: 'regularKhutbaListener', label: 'സ്ഥിരമായി ഖുതുബ കേള്‍ക്കുന്നയാള്‍' },
              { key: 'prabodhanamReader', label: 'പ്രബോധനം വായനക്കാരന്‍' },
              { key: 'jaBeneficiary', label: 'ജഎ ഗുണഭോക്താവ്' },
              { key: 'adaBeneficiary', label: 'ആദ ഗുണഭോക്താവ്' },
              { key: 'localReliefBeneficiary', label: 'പ്രാദേശിക റിലീഫ് ഗുണഭോക്താവ്' },
              { key: 'aaramamReader', label: 'ആരാമം വായനക്കാരി' },
              { key: 'thawheedulMaraStudent', label: 'തംഹീദുല്‍ മര്‍അ പഠിതാവ്' },
              { key: 'madrasaAlumni', label: 'മദ്‌റസ പൂര്‍വ്വ വിദ്യാര്‍ത്ഥി' },
              { key: 'islamicCollegeAlumni', label: 'ഇസ്്‌ലാമിയ കോളജ് പൂര്‍വ്വ വിദ്യാര്‍ത്ഥി' },
              { key: 'neighborhoodMember', label: 'അയല്‍കൂട്ടം അംഗം' },
              { key: 'palliativeConnection', label: 'പാലിയേറ്റീവ് ബന്ധം' },
              { key: 'friendsClubMember', label: 'Friends Club അംഗം' },
              { key: 'mediaReader', label: 'മാധ്യമം വായനക്കാരന്‍' },
              { key: 'ayahDarsQuranStudent', label: 'ആയാത് ദര്‍സെ ഖുര്‍ആന്‍ പഠിതാവ്' },
              { key: 'heavenGuardian', label: 'ഹെവന്‍സിലെ രക്ഷിതാവ്' },
              { key: 'schoolGuardian', label: 'സ്‌കൂളിലെ രക്ഷിതാവ്' },
              { key: 'arabicCollegeGuardian', label: 'അറബികോളജ് രക്ഷിതാവ്' },
              { key: 'arabicCollegeStudent', label: 'അറബിക് കോളജ് വിദ്യാര്‍ത്ഥി' },
              { key: 'artsCollegeStudent', label: 'ആര്‍ട്‌സ് കോളജ് വിദ്യാര്‍ത്ഥി' },
              { key: 'artsCollegeGuardian', label: 'ആര്‍ട്‌സ് കോളജ് രക്ഷിതാവ്' },
              { key: 'publicCampusStudent', label: 'പൊതു കാമ്പസിലെ വിദ്യാര്‍ത്ഥി' },
              { key: 'otherNGOs', label: 'മറ്റു NGO കള്‍' },
              { key: 'mahallConnection', label: 'മഹല്ല് മുഖേനയുള്ള ബന്ധം' },
              { key: 'fulltimeWorkerConnection', label: 'ഫുള്‍െൈടം പ്രവര്‍ത്തകനുമായുള്ള ബന്ധം' }
            ].map(item => (
              <label key={item.key} className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.partE.categories[item.key] || false}
                  onChange={(e) => handleCategoryChange(item.key, e.target.checked)}
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

export default AreaPageE;
