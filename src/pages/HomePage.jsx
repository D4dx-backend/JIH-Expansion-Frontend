import React, { useState } from 'react';
import { Calendar, FileText, LogOut, User, BarChart3, Home, Info } from 'lucide-react';
import jihLogo from '../assets/jih-logo2.png';

const HomePage = ({ onLogout, onNavigateToYearly, onNavigateToMonthly, onNavigateToStats, userData }) => {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'info'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-4 sm:py-6 gap-4">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={() => window.location.href = '/'}
                className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 text-sm"
              >
                <span>← Back</span>
              </button>
              <img src={jihLogo} alt="JIH Logo" className="h-8 sm:h-12 w-auto" />
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 text-center sm:text-left">
                JIH Organisation Expansion
              </h1>
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <span className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                Welcome, {userData?.name || 'User'} • District: {userData?.district || 'Unknown'}
              </span>
              <button
                onClick={onLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 text-sm sm:text-base"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              സർവേ ഓപ്ഷനുകൾ
            </button>
            <button
              onClick={() => setActiveTab('info')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'info'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              വിവരങ്ങൾ
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <>
            {/* Welcome Section */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  സർവേ സിസ്റ്റത്തിലേക്ക് സ്വാഗതം
                </h2>
                <p className="text-gray-600 max-w-2xl mx-auto">
                  വാർഷിക അല്ലെങ്കിൽ മാസിക സർവേ പൂരിപ്പിക്കാൻ താഴെയുള്ള ഓപ്ഷനുകളിൽ ഒന്ന് തിരഞ്ഞെടുക്കുക
                </p>
              </div>
            </div>

            {/* Survey Options */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">ലഭ്യമായ സർവേകൾ</h2>
                <p className="text-sm text-gray-600 mt-1">നിങ്ങളുടെ ആവശ്യമനുസരിച്ച് സർവേ തിരഞ്ഞെടുക്കുക</p>
              </div>

              <div className="p-6">
                <div className="grid md:grid-cols-3 gap-6">
                  {/* Yearly Survey Card */}
                  <div className="border border-gray-200 rounded-lg p-6 hover:border-blue-300 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mx-auto mb-4">
                      <FileText className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 text-center mb-3">
                      വാർഷിക സർവേ
                    </h3>
                    <p className="text-sm text-gray-600 text-center mb-4">
                      വാർഷിക വിപുലീകരണ സർവേ ഫോം പൂരിപ്പിക്കുക. ഇത് വർഷത്തിലൊരിക്കൽ മാത്രം പൂരിപ്പിക്കേണ്ടതാണ്.
                    </p>
                    <div className="text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mb-3">
                        വാർഷിക
                      </span>
                    </div>
                    <button
                      onClick={onNavigateToYearly}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 text-sm"
                    >
                      <FileText className="w-4 h-4" />
                      <span>തുറക്കുക</span>
                    </button>
                  </div>

                  {/* Monthly Survey Card */}
                  <div className="border border-gray-200 rounded-lg p-6 hover:border-green-300 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mx-auto mb-4">
                      <Calendar className="w-6 h-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 text-center mb-3">
                      മാസിക സർവേ
                    </h3>
                    <p className="text-sm text-gray-600 text-center mb-4">
                      മാസിക വിപുലീകരണ സർവേ ഫോം പൂരിപ്പിക്കുക. ഓരോ മാസവും പുതിയ ഡാറ്റ സമർപ്പിക്കാം.
                    </p>
                    <div className="text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 mb-3">
                        മാസിക
                      </span>
                    </div>
                    <button
                      onClick={onNavigateToMonthly}
                      className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 text-sm"
                    >
                      <Calendar className="w-4 h-4" />
                      <span>തുറക്കുക</span>
                    </button>
                  </div>

                  {/* Statistics Card */}
                  <div className="border border-gray-200 rounded-lg p-6 hover:border-purple-300 hover:shadow-md transition-all duration-200">
                    <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg mx-auto mb-4">
                      <BarChart3 className="w-6 h-6 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 text-center mb-3">
                      സ്ഥിതിവിവരക്കണക്കുകൾ
                    </h3>
                    <p className="text-sm text-gray-600 text-center mb-4">
                      നിങ്ങളുടെ ജില്ലയുടെ സർവേ ഡാറ്റയുടെ വിശദമായ സ്ഥിതിവിവരക്കണക്കുകളും ചാർട്ടുകളും കാണുക.
                    </p>
                    <div className="text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 mb-3">
                        വിശകലനം
                      </span>
                    </div>
                    <button
                      onClick={onNavigateToStats}
                      className="w-full bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 text-sm"
                    >
                      <BarChart3 className="w-4 h-4" />
                      <span>കാണുക</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Summary */}
            <div className="mt-6 bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">സംഗ്രഹം</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">1</div>
                  <div className="text-sm text-gray-600">വാർഷിക സർവേ</div>
                  <div className="text-xs text-gray-500 mt-1">പ്രതിവർഷം</div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">12</div>
                  <div className="text-sm text-gray-600">മാസിക സർവേകൾ</div>
                  <div className="text-xs text-gray-500 mt-1">പ്രതിമാസം</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-1">∞</div>
                  <div className="text-sm text-gray-600">ഡാറ്റ ഇൻസൈറ്റ്സ്</div>
                  <div className="text-xs text-gray-500 mt-1">തത്സമയം</div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Info Tab */}
        {activeTab === 'info' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">സർവേ സംബന്ധിച്ച് അറിയേണ്ട കാര്യങ്ങൾ</h2>
              <p className="text-sm text-gray-600 mt-1">സിസ്റ്റം ഉപയോഗിക്കുന്നതിനുള്ള മാർഗ്ഗനിർദ്ദേശങ്ങൾ</p>
            </div>

            <div className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Survey Guidelines */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <FileText className="w-5 h-5 text-blue-600 mr-2" />
                    സർവേ നിർദ്ദേശങ്ങൾ
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2.5 flex-shrink-0"></span>
                      <span className="text-sm text-gray-700">വാർഷിക സർവേ വർഷത്തിൽ ഒരിക്കൽ മാത്രം പൂരിപ്പിക്കേണ്ടതാണ്</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></span>
                      <span className="text-sm text-gray-700">മാസിക സർവേ ഓരോ മാസവും പൂരിപ്പിക്കാം</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mt-2.5 flex-shrink-0"></span>
                      <span className="text-sm text-gray-700">സമർപ്പിച്ച സർവേകൾ പിന്നീട് എഡിറ്റ് ചെയ്യാനും കാണാനും കഴിയും</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="w-2 h-2 bg-indigo-500 rounded-full mt-2.5 flex-shrink-0"></span>
                      <span className="text-sm text-gray-700">എല്ലാ ഫീൽഡുകളും കൃത്യമായി പൂരിപ്പിക്കുക</span>
                    </div>
                  </div>
                </div>

                {/* System Features */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <BarChart3 className="w-5 h-5 text-purple-600 mr-2" />
                    സിസ്റ്റം സവിശേഷതകൾ
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-start space-x-3">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mt-2.5 flex-shrink-0"></span>
                      <span className="text-sm text-gray-700">സ്ഥിതിവിവരക്കണക്കുകൾ വിഭാഗത്തിൽ നിങ്ങളുടെ ജില്ലയുടെ പുരോഗതി കാണാം</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="w-2 h-2 bg-blue-500 rounded-full mt-2.5 flex-shrink-0"></span>
                      <span className="text-sm text-gray-700">സുരക്ഷിത ഡാറ്റ സംഭരണവും ബാക്കപ്പും</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="w-2 h-2 bg-green-500 rounded-full mt-2.5 flex-shrink-0"></span>
                      <span className="text-sm text-gray-700">തത്സമയ ഡാറ്റ അപ്ഡേറ്റുകളും റിപ്പോർട്ടുകളും</span>
                    </div>
                    <div className="flex items-start space-x-3">
                      <span className="w-2 h-2 bg-yellow-500 rounded-full mt-2.5 flex-shrink-0"></span>
                      <span className="text-sm text-gray-700">യൂസർ-ഫ്രണ്ട്ലി ഇന്റർഫേസ്</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="text-sm font-medium text-gray-900 mb-2">സഹായം ആവശ്യമുണ്ടോ?</h4>
                <p className="text-sm text-gray-600">
                  സിസ്റ്റം ഉപയോഗിക്കുന്നതിൽ എന്തെങ്കിലും പ്രശ്നമുണ്ടെങ്കിൽ നിങ്ങളുടെ സിസ്റ്റം അഡ്മിനിസ്ട്രേറ്ററുമായി ബന്ധപ്പെടുക
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default HomePage;