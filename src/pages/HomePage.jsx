import React from 'react';
import { Calendar, FileText, LogOut, User, BarChart3 } from 'lucide-react';
import jihLogo from '../assets/jih-logo2.png'; // ✅ adjust path if needed

const HomePage = ({ onLogout, onNavigateToYearly, onNavigateToMonthly, onNavigateToStats, userData }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-4 sm:py-6 gap-4">
            
            {/* Left side: Logo + Title */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              <img src={jihLogo} alt="JIH Logo" className="h-8 sm:h-12 w-auto" />
              <h1 className="text-lg sm:text-2xl font-bold text-slate-800 text-center sm:text-left">
                JIH Organisation Expansion
              </h1>
            </div>

            {/* Right side: User info + Logout */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-teal-50 rounded-full">
                  <User className="w-5 h-5 text-teal-600" />
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-800">
                    {userData?.name || 'User'}
                  </p>
                  <p className="text-xs text-slate-600">
                    District: {userData?.district || 'Unknown'}
                  </p>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="bg-slate-600 hover:bg-slate-700 text-white px-4 py-2 rounded-xl font-medium flex items-center space-x-2 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-800 mb-4">
            സർവേ സിസ്റ്റത്തിലേക്ക് സ്വാഗതം
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            വാർഷിക അല്ലെങ്കിൽ മാസിക സർവേ പൂരിപ്പിക്കാൻ താഴെയുള്ള ഓപ്ഷനുകളിൽ ഒന്ന് തിരഞ്ഞെടുക്കുക
          </p>
        </div>

        {/* Survey Options */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Yearly Survey Card */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="p-8">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-100 to-teal-200 rounded-2xl mx-auto mb-6">
                <FileText className="w-8 h-8 text-teal-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 text-center mb-4">
                വാർഷിക സർവേ
              </h3>
              <p className="text-slate-600 text-center mb-6 leading-relaxed">
                വാർഷിക വിപുലീകരണ സർവേ ഫോം പൂരിപ്പിക്കുക. ഇത് വർഷത്തിലൊരിക്കൽ മാത്രം പൂരിപ്പിക്കേണ്ടതാണ്.
              </p>
              <button
                onClick={onNavigateToYearly}
                className="w-full bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <FileText className="w-5 h-5" />
                <span>വാർഷിക സർവേ തുറക്കുക</span>
              </button>
            </div>
          </div>

          {/* Monthly Survey Card */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="p-8">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-2xl mx-auto mb-6">
                <Calendar className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 text-center mb-4">
                മാസിക സർവേ
              </h3>
              <p className="text-slate-600 text-center mb-6 leading-relaxed">
                മാസിക വിപുലീകരണ സർവേ ഫോം പൂരിപ്പിക്കുക. ഓരോ മാസവും പുതിയ ഡാറ്റ സമർപ്പിക്കാം.
              </p>
              <button
                onClick={onNavigateToMonthly}
                className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <Calendar className="w-5 h-5" />
                <span>മാസിക സർവേ തുറക്കുക</span>
              </button>
            </div>
          </div>

          {/* Statistics Dashboard Card */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 hover:shadow-xl hover:scale-105 transition-all duration-300">
            <div className="p-8">
              <div className="flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-100 to-indigo-200 rounded-2xl mx-auto mb-6">
                <BarChart3 className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800 text-center mb-2 break-words">
                സ്ഥിതിവിവരക്കണക്കുകൾ
              </h3>
              <p className="text-slate-600 text-center mb-6 leading-relaxed">
                നിങ്ങളുടെ ജില്ലയുടെ സർവേ ഡാറ്റയുടെ വിശദമായ സ്ഥിതിവിവരക്കണക്കുകളും ചാർട്ടുകളും കാണുക.
              </p>
              <button
                onClick={onNavigateToStats}
                className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-600 hover:to-indigo-700 text-white py-3 px-6 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
              >
                <BarChart3 className="w-5 h-5" />
                <span>സ്ഥിതിവിവരക്കണക്കുകൾ കാണുക</span>
              </button>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-12 bg-white/50 backdrop-blur-sm rounded-2xl p-8 max-w-4xl mx-auto border border-white/20 shadow-sm">
          <h4 className="text-lg font-semibold text-slate-800 mb-4">
            സർവേ സംബന്ധിച്ച് അറിയേണ്ട കാര്യങ്ങൾ:
          </h4>
          <ul className="space-y-3 text-slate-700">
            <li className="flex items-start space-x-3">
              <span className="w-2 h-2 bg-teal-500 rounded-full mt-2.5 flex-shrink-0"></span>
              <span>വാർഷിക സർവേ വർഷത്തിൽ ഒരിക്കൽ മാത്രം പൂരിപ്പിക്കേണ്ടതാണ്</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="w-2 h-2 bg-teal-500 rounded-full mt-2.5 flex-shrink-0"></span>
              <span>മാസിക സർവേ ഓരോ മാസവും പൂരിപ്പിക്കാം</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="w-2 h-2 bg-teal-500 rounded-full mt-2.5 flex-shrink-0"></span>
              <span>സമർപ്പിച്ച സർവേകൾ പിന്നീട് എഡിറ്റ് ചെയ്യാനും കാണാനും കഴിയും</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="w-2 h-2 bg-teal-500 rounded-full mt-2.5 flex-shrink-0"></span>
              <span>സ്ഥിതിവിവരക്കണക്കുകൾ വിഭാഗത്തിൽ നിങ്ങളുടെ ജില്ലയുടെ പുരോഗതി കാണാം</span>
            </li>
          </ul>
        </div>
      </main>
    </div>
  );
};

export default HomePage;