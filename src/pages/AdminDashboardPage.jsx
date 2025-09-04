import React, { useState, useEffect } from 'react';
import { LogOut, FileText, Search, Filter, Edit, Trash2, Download } from 'lucide-react';
import axios from 'axios';
import FormDetailPage from './FormDetailPage';
import FormPage from './FormPage';
import { FormProvider } from '../contexts/FormContext';
import ConfirmationModal from '../components/ConfirmationModal';
import MainAdminDashboard from '../components/dashboards/MainAdminDashboard';
import jihLogo from '../assets/jih-logo2.png';
import { downloadAllFormsPDF } from '../utils/pdfGenerator.jsx';

const AdminDashboardPage = ({ onLogout }) => {
  const [adminData, setAdminData] = useState(null);
  const [forms, setForms] = useState([]);
  const [monthlySurveys, setMonthlySurveys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingForm, setEditingForm] = useState(null);
  const [editingSurvey, setEditingSurvey] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [formToDelete, setFormToDelete] = useState(null);
  const [surveyToDelete, setSurveyToDelete] = useState(null);
  const [showDetailView, setShowDetailView] = useState(false);
  const [showFormEdit, setShowFormEdit] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [activeTab, setActiveTab] = useState('yearly'); // 'yearly', 'monthly', 'stats'
  
  // Filtering and pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalForms, setTotalForms] = useState(0);
  const [totalSurveys, setTotalSurveys] = useState(0);

  useEffect(() => {
    // Get admin data from localStorage
    const storedAdminData = localStorage.getItem('adminData');
    if (storedAdminData) {
      setAdminData(JSON.parse(storedAdminData));
    }
    
    // Load data based on active tab
    if (activeTab === 'yearly') {
      loadAllForms();
    } else if (activeTab === 'monthly') {
      loadAllMonthlySurveys();
    }
  }, [currentPage, districtFilter, userFilter, monthFilter, activeTab]);

  const loadAllForms = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10
      });
      
      if (districtFilter) params.append('district', districtFilter);
      if (userFilter) params.append('submittedBy', userFilter);

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/forms?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setForms(response.data.forms);
      setTotalPages(response.data.totalPages);
      setTotalForms(response.data.totalForms);
    } catch (error) {
      console.error('Error loading forms:', error);
      setError('Failed to load forms');
    } finally {
      setIsLoading(false);
    }
  };

  const loadAllMonthlySurveys = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10
      });
      
      if (districtFilter) params.append('district', districtFilter);
      if (userFilter) params.append('submittedBy', userFilter);
      if (monthFilter) params.append('month', monthFilter);

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/monthly-surveys?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setMonthlySurveys(response.data.surveys);
      setTotalPages(response.data.totalPages);
      setTotalSurveys(response.data.totalSurveys);
    } catch (error) {
      console.error('Error loading monthly surveys:', error);
      setError('Failed to load monthly surveys');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    onLogout();
  };

  const handleViewForm = (form) => {
    setSelectedFormId(form._id);
    setShowDetailView(true);
  };

  const handleEditForm = (form) => {
    setEditingForm(form);
    setShowFormEdit(true);
  };

  const handleDetailBack = () => {
    setShowDetailView(false);
    setSelectedFormId(null);
    setEditingForm(null);
  };

  const handleFormEditBack = () => {
    setShowFormEdit(false);
    setEditingForm(null);
  };

  const handleFormEditSubmit = (formData) => {
    setShowFormEdit(false);
    setEditingForm(null);
    loadAllForms();
  };

  const handleDetailEdit = (form) => {
    setShowDetailView(false);
    setSelectedFormId(null);
    setEditingForm(form);
    setShowFormEdit(true);
  };

  const handleDetailDelete = () => {
    setShowDetailView(false);
    setSelectedFormId(null);
    setEditingForm(null);
    loadAllForms();
  };

  const handleDeleteForm = (form) => {
    setFormToDelete(form);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      
      if (formToDelete) {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/forms/${formToDelete._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setFormToDelete(null);
        loadAllForms();
      } else if (surveyToDelete) {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/monthly-surveys/${surveyToDelete._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSurveyToDelete(null);
        loadAllMonthlySurveys();
      }
      
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting:', error);
      setError('Failed to delete item');
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    if (activeTab === 'yearly') {
      loadAllForms();
    } else if (activeTab === 'monthly') {
      loadAllMonthlySurveys();
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setDistrictFilter('');
    setUserFilter('');
    setMonthFilter('');
    setCurrentPage(1);
  };

  const handleDownloadAllForms = async () => {
    try {
      setIsDownloading(true);
      // Get all forms without pagination for PDF generation
      const token = localStorage.getItem('adminToken');
      const params = new URLSearchParams({
        limit: 1000 // Get all forms
      });
      
      if (districtFilter) params.append('district', districtFilter);
      if (userFilter) params.append('submittedBy', userFilter);

      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/forms?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      await downloadAllFormsPDF(response.data.forms);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      setError('Failed to download PDF');
    } finally {
      setIsDownloading(false);
    }
  };

  const filteredForms = forms.filter(form => 
    form.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form.submittedBy?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    form._id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (showDetailView) {
    return (
      <FormDetailPage
        formId={selectedFormId}
        formData={editingForm}
        onBack={handleDetailBack}
        onEdit={handleDetailEdit}
        onDelete={handleDetailDelete}
        isAdmin={true}
      />
    );
  }

  if (showFormEdit) {
    return (
      <FormProvider>
        <FormPage
          onBack={handleFormEditBack}
          onSubmit={handleFormEditSubmit}
          editingForm={editingForm}
          isAdmin={true}
        />
      </FormProvider>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-4 sm:py-6 gap-4">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <img src={jihLogo} alt="JIH Logo" className="h-8 sm:h-12 w-auto" />
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 text-center sm:text-left">Admin Dashboard</h1>
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <span className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                Welcome, {adminData?.email}
              </span>
              <button
                onClick={handleLogout}
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
              onClick={() => setActiveTab('yearly')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'yearly'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              വാർഷിക സർവേകൾ ({totalForms})
            </button>
            <button
              onClick={() => setActiveTab('monthly')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'monthly'
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              മാസിക സർവേകൾ ({totalSurveys})
            </button>
            <button
              onClick={() => setActiveTab('stats')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'stats'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              സ്ഥിതിവിവരക്കണക്കുകൾ
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters and Search */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className={`grid grid-cols-1 gap-4 ${activeTab === 'monthly' ? 'md:grid-cols-5' : 'md:grid-cols-4'}`}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by district, user, or ID..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">District</label>
              <input
                type="text"
                value={districtFilter}
                onChange={(e) => setDistrictFilter(e.target.value)}
                placeholder="Filter by district..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">User</label>
              <input
                type="text"
                value={userFilter}
                onChange={(e) => setUserFilter(e.target.value)}
                placeholder="Filter by user..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            {activeTab === 'monthly' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
                <select
                  value={monthFilter}
                  onChange={(e) => setMonthFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">All Months</option>
                  {['January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'].map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>
            )}
            <div className="flex items-end space-x-2">
              <button
                onClick={handleSearch}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <Filter className="w-4 h-4" />
                <span>Filter</span>
              </button>
              <button
                onClick={clearFilters}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {/* Content based on active tab */}
        {activeTab === 'yearly' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">വാർഷിക സർവേകൾ</h2>
              <p className="text-sm text-gray-600">Showing {forms.length} of {totalForms} forms</p>
            </div>
            <button
              onClick={handleDownloadAllForms}
              disabled={isDownloading || forms.length === 0}
              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>{isDownloading ? 'Generating...' : 'Download All PDF'}</span>
            </button>
          </div>

          {isLoading ? (
            <div className="p-6 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading forms...</p>
            </div>
          ) : error ? (
            <div className="p-6 text-center">
              <p className="text-red-600">{error}</p>
            </div>
          ) : filteredForms.length === 0 ? (
            <div className="p-6 text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No forms found</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        District
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted By
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Submitted At
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredForms.map((form) => (
                      <tr 
                        key={form._id} 
                        className="hover:bg-gray-50 cursor-pointer"
                        onClick={() => handleViewForm(form)}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {form.district}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {form.submittedBy}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(form.submittedAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2" onClick={(e) => e.stopPropagation()}>
                            <button
                              onClick={() => handleEditForm(form)}
                              className="text-green-600 hover:text-green-900"
                              title="Edit"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteForm(form)}
                              className="text-red-600 hover:text-red-900"
                              title="Delete"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Page {currentPage} of {totalPages}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Previous
                      </button>
                      <button
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
          </div>
        )}

        {/* Monthly Surveys Tab */}
        {activeTab === 'monthly' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">മാസിക സർവേകൾ</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Total: {totalSurveys} monthly surveys
                </p>
              </div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                <span className="ml-2 text-gray-600">Loading monthly surveys...</span>
              </div>
            ) : monthlySurveys.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No monthly surveys found</h3>
                <p className="text-gray-600">No monthly surveys match your current filters.</p>
              </div>
            ) : (
              <>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          District
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Month
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Submitted By
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Population
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Submitted At
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {monthlySurveys.map((survey) => (
                        <tr key={survey._id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {survey.district}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {survey.month}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {survey.submittedBy}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {survey.partA?.totalPopulation || 'N/A'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(survey.submittedAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedFormId(survey._id);
                                  setShowDetailView(true);
                                }}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                View
                              </button>
                              <button
                                onClick={() => {
                                  setEditingSurvey(survey);
                                  setShowFormEdit(true);
                                }}
                                className="text-green-600 hover:text-green-900"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => {
                                  setSurveyToDelete(survey);
                                  setShowDeleteModal(true);
                                }}
                                className="text-red-600 hover:text-red-900"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="px-6 py-4 border-t border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-700">
                        Page {currentPage} of {totalPages}
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                          disabled={currentPage === 1}
                          className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                          disabled={currentPage === totalPages}
                          className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        >
                          Next
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'stats' && (
          <MainAdminDashboard />
        )}
      </main>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setFormToDelete(null);
          setSurveyToDelete(null);
        }}
        onConfirm={confirmDelete}
        title={formToDelete ? "Delete Yearly Survey" : "Delete Monthly Survey"}
        message={`Are you sure you want to delete the ${formToDelete ? 'yearly survey' : 'monthly survey'} from ${(formToDelete || surveyToDelete)?.district}? This action cannot be undone.`}
        confirmText="Delete"
        confirmColor="red"
      />

      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
        title="Logout"
        message="Are you sure you want to logout from the admin dashboard?"
        confirmText="Logout"
        confirmColor="red"
      />
    </div>
  );
};

export default AdminDashboardPage;
