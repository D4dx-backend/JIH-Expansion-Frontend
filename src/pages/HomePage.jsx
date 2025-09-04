import React from 'react';
import { Calendar, FileText, LogOut, User, BarChart3 } from 'lucide-react';
import jihLogo from '../assets/jih-logo2.png'; // ✅ adjust path if needed

const HomePage = ({ onLogout, onNavigateToYearly, onNavigateToMonthly, onNavigateToStats, userData }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-4 sm:py-6 gap-4">
            
            {/* Left side: Logo + Title */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <img src={jihLogo} alt="JIH Logo" className="h-8 sm:h-12 w-auto" />
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 text-center sm:text-left">
                JIH Organisation Expansion
              </h1>
            </div>

            {/* Right side: User info + Logout */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <User className="w-6 h-6 text-blue-600" />
                <div className="text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {userData?.name || 'User'}
                  </p>
                  <p className="text-xs text-gray-600">
                    District: {userData?.district || 'Unknown'}
                  </p>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>ലോഗ് ഔട്ട്</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            സർവേ സിസ്റ്റത്തിലേക്ക് സ്വാഗതം
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            വാർഷിക അല്ലെങ്കിൽ മാസിക സർവേ പൂരിപ്പിക്കാൻ താഴെയുള്ള ഓപ്ഷനുകളിൽ ഒന്ന് തിരഞ്ഞെടുക്കുക
          </p>
        </div>

        {/* Survey Options */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Yearly Survey Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <div className="p-8">
              <div className="flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mx-auto mb-6">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">
                വാർഷിക സർവേ
              </h3>
              <p className="text-gray-600 text-center mb-6">
                വാർഷിക വിപുലീകരണ സർവേ ഫോം പൂരിപ്പിക്കുക. ഇത് വർഷത്തിലൊരിക്കൽ മാത്രം പൂരിപ്പിക്കേണ്ടതാണ്.
              </p>
              <button
                onClick={onNavigateToYearly}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <FileText className="w-5 h-5" />
                <span>വാർഷിക സർവേ തുറക്കുക</span>
              </button>
            </div>
          </div>

          {/* Monthly Survey Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <div className="p-8">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-6">
                <Calendar className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-4">
                മാസിക സർവേ
              </h3>
              <p className="text-gray-600 text-center mb-6">
                മാസിക വിപുലീകരണ സർവേ ഫോം പൂരിപ്പിക്കുക. ഓരോ മാസവും പുതിയ ഡാറ്റ സമർപ്പിക്കാം.
              </p>
              <button
                onClick={onNavigateToMonthly}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <Calendar className="w-5 h-5" />
                <span>മാസിക സർവേ തുറക്കുക</span>
              </button>
            </div>
          </div>

          {/* Statistics Dashboard Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300">
            <div className="p-8">
              <div className="flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mx-auto mb-6">
                <BarChart3 className="w-8 h-8 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 text-center mb-2 break-words">
                സ്ഥിതിവിവരക്കണക്കുകൾ
              </h3>
              <p className="text-gray-600 text-center mb-6">
                നിങ്ങളുടെ ജില്ലയുടെ സർവേ ഡാറ്റയുടെ വിശദമായ സ്ഥിതിവിവരക്കണക്കുകളും ചാർട്ടുകളും കാണുക.
              </p>
              <button
                onClick={onNavigateToStats}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-6 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <BarChart3 className="w-5 h-5" />
                <span>സ്ഥിതിവിവരക്കണക്കുകൾ കാണുക</span>
              </button>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6 max-w-4xl mx-auto">
          <h4 className="text-lg font-semibold text-blue-900 mb-3">
            സർവേ സംബന്ധിച്ച് അറിയേണ്ട കാര്യങ്ങൾ:
          </h4>
          <ul className="space-y-2 text-blue-800">
            <li className="flex items-start space-x-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>വാർഷിക സർവേ വർഷത്തിൽ ഒരിക്കൽ മാത്രം പൂരിപ്പിക്കേണ്ടതാണ്</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>മാസിക സർവേ ഓരോ മാസവും പൂരിപ്പിക്കാം</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>സമർപ്പിച്ച സർവേകൾ പിന്നീട് എഡിറ്റ് ചെയ്യാനും കാണാനും കഴിയും</span>
            </li>
            <li className="flex items-start space-x-2">
              <span className="text-blue-600 mt-1">•</span>
              <span>സ്ഥിതിവിവരക്കണക്കുകൾ വിഭാഗത്തിൽ നിങ്ങളുടെ ജില്ലയുടെ പുരോഗതി കാണാം</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default HomePage;
