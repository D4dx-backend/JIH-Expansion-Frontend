import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LogOut, FileText, Search, Filter, Edit, Trash2, Users, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import FormDetailPage from './FormDetailPage';
import FormPage from './FormPage';
import { FormProvider } from '../contexts/FormContext';
import ConfirmationModal from '../components/ConfirmationModal';
import StatisticsCard from '../components/charts/StatisticsCard';
import SurveyBarChart from '../components/charts/SurveyBarChart';
import jihLogo from '../assets/jih-logo2.png';

const AreaDashboardPage = ({ onLogout }) => {
  const { areaId } = useParams();
  const navigate = useNavigate();
  
  // Area and user data
  const [userData, setUserData] = useState(null);
  const [area, setArea] = useState(null);
  const [units, setUnits] = useState([]);
  
  // Surveys and data
  const [monthlySurveys, setMonthlySurveys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  
  // UI state
  const [activeTab, setActiveTab] = useState('monthly'); // 'monthly', 'units', 'stats'
  const [editingSurvey, setEditingSurvey] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [surveyToDelete, setSurveyToDelete] = useState(null);
  const [showDetailView, setShowDetailView] = useState(false);
  const [showFormEdit, setShowFormEdit] = useState(false);
  const [showCreateSurvey, setShowCreateSurvey] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState(null);
  const [selectedUnitSurveys, setSelectedUnitSurveys] = useState([]);
  
  // Filtering
  const [searchTerm, setSearchTerm] = useState('');
  const [unitFilter, setUnitFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [unitSearchTerm, setUnitSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSurveys, setTotalSurveys] = useState(0);

  useEffect(() => {
    // Get user data from localStorage
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
    
    loadAreaData();
    if (activeTab === 'monthly') {
      loadMonthlySurveys();
    } else if (activeTab === 'units') {
      loadUnits();
      // Also load monthly surveys for unit filtering
      loadMonthlySurveys();
    }
  }, [areaId, currentPage, unitFilter, monthFilter, activeTab]);

  // Handle back navigation to login page
  const handleBackNavigation = () => {
    navigate('/');
  };

  const loadAreaData = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      const token = localStorage.getItem('userToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      // Load area information
      if (userData?.districtId) {
        const areasResp = await axios.get(
          `${import.meta.env.VITE_API_URL}/api/user/hierarchy/areas/${encodeURIComponent(userData.districtId)}`, 
          { headers }
        );
        const areas = areasResp.data?.data || [];
        const found = areas.find(a => (a.id || a._id || a.code) == areaId);
        if (found) {
          setArea({
            id: found.id || found._id || found.code,
            name: found.title || found.name || areaId
          });
        } else {
          setArea({ id: areaId, name: areaId });
        }
      } else {
        setArea({ id: areaId, name: areaId });
      }
    } catch (error) {
      console.error('Error loading area data:', error);
      setError('Failed to load area information');
      // Set fallback data
      setArea({ id: areaId, name: areaId });
    }
  };

  const loadUnits = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/hierarchy/units/${encodeURIComponent(areaId)}`, 
        { headers }
      );
      setUnits(response.data?.data || []);
    } catch (error) {
      console.error('Error loading units:', error);
      setError('Failed to load units');
    } finally {
      setIsLoading(false);
    }
  };

  const loadMonthlySurveys = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('userToken');
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        areaId: areaId // Filter by current area
      });
      
      if (unitFilter) params.append('unitId', unitFilter);
      if (monthFilter) params.append('month', monthFilter);

      // This endpoint would need to be created in backend to filter by area
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/monthly-surveys/area?${params}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      
      setMonthlySurveys(response.data.surveys || []);
      setTotalPages(response.data.totalPages || 1);
      setTotalSurveys(response.data.totalSurveys || 0);
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
    localStorage.removeItem('userToken');
    localStorage.removeItem('userData');
    if (onLogout) {
      onLogout();
    } else {
      navigate('/');
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    if (activeTab === 'monthly') {
      loadMonthlySurveys();
    }
  };

  const clearFilters = () => {
    setSearchTerm('');
    setUnitFilter('');
    setMonthFilter('');
    setCurrentPage(1);
  };

  const handleViewSurvey = (survey) => {
    setSelectedFormId(survey._id);
    setShowDetailView(true);
  };

  const handleEditSurvey = (survey) => {
    setEditingSurvey(survey);
    setShowFormEdit(true);
  };

  const handleDeleteSurvey = (survey) => {
    setSurveyToDelete(survey);
    setShowDeleteModal(true);
  };

  const handleCreateSurvey = () => {
    setEditingSurvey(null);
    setShowCreateSurvey(true);
  };

  const handleUnitClick = (unit) => {
    setSelectedUnit(unit);
    
    // Get unit identifier (try different possible field names)
    const unitIdentifier = unit.id || unit._id || unit.code;
    
    // Filter surveys for this specific unit (try different possible field names in surveys)
    const unitSurveys = monthlySurveys.filter(s => {
      const surveyUnitId = s.unitId || s.unit || s.component || s.unitId;
      return surveyUnitId === unitIdentifier;
    });
    
    setSelectedUnitSurveys(unitSurveys);
  };

  const handleBackToUnits = () => {
    setSelectedUnit(null);
    setSelectedUnitSurveys([]);
  };

  // Filter units based on search term
  const filteredUnits = units.filter(unit => {
    if (!unitSearchTerm) return true;
    const unitName = (unit.name || unit.title || 'Unnamed Unit').toLowerCase();
    const unitId = (unit.id || unit._id || unit.code || '').toLowerCase();
    const searchLower = unitSearchTerm.toLowerCase();
    return unitName.includes(searchLower) || unitId.includes(searchLower);
  });

  // Highlight search term in text
  const highlightSearchTerm = (text, searchTerm) => {
    if (!searchTerm) return text;
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200 px-1 rounded">$1</mark>');
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('userToken');
      
      if (surveyToDelete) {
        await axios.delete(`${import.meta.env.VITE_API_URL}/api/user/monthly-survey/${surveyToDelete._id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setSurveyToDelete(null);
        loadMonthlySurveys();
      }
      
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting survey:', error);
      setError('Failed to delete survey');
    }
  };

  // Calculate statistics
  const areaStats = {
    totalUnits: units.length,
    totalMonthlySurveys: totalSurveys,
    surveysThisMonth: monthlySurveys.filter(s => {
      const surveyDate = new Date(s.submittedAt);
      const currentDate = new Date();
      return surveyDate.getMonth() === currentDate.getMonth() && 
             surveyDate.getFullYear() === currentDate.getFullYear();
    }).length,
    activeUnits: new Set(monthlySurveys.map(s => s.unitId)).size
  };

  const unitsBarData = units.map(u => ({
    name: u.name || u.title || u.code || 'Unit',
    surveys: monthlySurveys.filter(s => s.unitId === (u.id || u._id || u.code)).length
  }));

  const filteredSurveys = monthlySurveys.filter(survey => 
    survey.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    survey.submittedBy?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    survey._id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (showDetailView) {
    return (
      <FormDetailPage
        formId={selectedFormId}
        formData={editingSurvey}
        onBack={() => {
          setShowDetailView(false);
          setSelectedFormId(null);
          setEditingSurvey(null);
        }}
        onEdit={(form) => {
          setShowDetailView(false);
          setSelectedFormId(null);
          setEditingSurvey(form);
          setShowFormEdit(true);
        }}
        onDelete={() => {
          setShowDetailView(false);
          setSelectedFormId(null);
          setEditingSurvey(null);
          loadMonthlySurveys();
        }}
        isAdmin={false}
      />
    );
  }

  if (showFormEdit || showCreateSurvey) {
    return (
      <FormProvider>
        <FormPage
          onBack={() => {
            if (showCreateSurvey) {
              setShowCreateSurvey(false);
            } else {
              setShowFormEdit(false);
              setEditingSurvey(null);
            }
          }}
          onSubmit={() => {
            if (showCreateSurvey) {
              setShowCreateSurvey(false);
            } else {
              setShowFormEdit(false);
              setEditingSurvey(null);
            }
            loadMonthlySurveys();
          }}
          editingForm={editingSurvey}
          isAdmin={false}
          formType="monthly"
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
              <button
                onClick={handleBackNavigation}
                className="flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                title="Go back"
              >
                <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
              </button>
              <img src={jihLogo} alt="JIH Logo" className="h-8 sm:h-12 w-auto" />
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900">Area Dashboard</h1>
                <p className="text-sm text-gray-600">{area?.name || 'Loading...'}</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-4">
              <span className="text-xs sm:text-sm text-gray-600 text-center sm:text-left">
                Welcome, {userData?.role} user
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
              onClick={() => setActiveTab('units')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'units'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              യൂണിറ്റുകൾ ({units.length})
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
        {/* Monthly Surveys Tab */}
        {activeTab === 'monthly' && (
          <>
            {/* Filters */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search surveys..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    />
                    <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unit</label>
                  <select
                    value={unitFilter}
                    onChange={(e) => setUnitFilter(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">All Units</option>
                    {units.map(unit => (
                      <option key={unit.id || unit._id || unit.code} value={unit.id || unit._id || unit.code}>
                        {unit.name || unit.title || unit.code}
                      </option>
                    ))}
                  </select>
                </div>
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
                <div className="flex items-end space-x-2 md:col-span-2">
                  <button
                    onClick={handleSearch}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2"
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

            {/* Surveys Table */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">മാസിക സർവേകൾ</h2>
                  <p className="text-sm text-gray-600 mt-1">
                    Total: {totalSurveys} monthly surveys from units in this area
                  </p>
                </div>
                <button
                  onClick={handleCreateSurvey}
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
                >
                  <FileText className="w-4 h-4" />
                  <span>Create Monthly Survey</span>
                </button>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                  <span className="ml-2 text-gray-600">Loading monthly surveys...</span>
                </div>
              ) : filteredSurveys.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No monthly surveys found</h3>
                  <p className="text-gray-600">No monthly surveys found for this area.</p>
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Unit
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Month
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
                        {filteredSurveys.map((survey) => (
                          <tr key={survey._id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {survey.unitName || survey.unitId || 'Unknown Unit'}
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
                              {new Date(survey.submittedAt).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleViewSurvey(survey)}
                                  className="text-blue-600 hover:text-blue-900"
                                >
                                  View
                                </button>
                                <button
                                  onClick={() => handleEditSurvey(survey)}
                                  className="text-green-600 hover:text-green-900"
                                >
                                  <Edit className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteSurvey(survey)}
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
          </>
        )}

        {/* Units Tab */}
        {activeTab === 'units' && (
          <div className="space-y-6">
            {/* Selected Unit Details - Show above units list */}
            {selectedUnit && (
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={handleBackToUnits}
                        className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm">Clear Selection</span>
                      </button>
                      <div className="h-6 w-px bg-gray-300"></div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {selectedUnit.name || selectedUnit.title || 'Unnamed Unit'}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Unit ID: {selectedUnit.id || selectedUnit._id || selectedUnit.code}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Total Surveys</p>
                      <p className="text-2xl font-bold text-blue-600">{selectedUnitSurveys.length}</p>
                    </div>
                  </div>
                </div>

                {/* Unit Surveys Table */}
                <div className="px-6 py-4">
                  {selectedUnitSurveys.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="w-8 h-8 text-gray-400 mx-auto mb-3" />
                      <h4 className="text-sm font-medium text-gray-900 mb-1">No surveys found</h4>
                      <p className="text-xs text-gray-600">This unit hasn't submitted any monthly surveys yet.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Month
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Year
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Submitted At
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {selectedUnitSurveys.map((survey) => (
                            <tr key={survey._id} className="hover:bg-gray-50">
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                  {survey.month}
                                </span>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {survey.year}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                                {new Date(survey.submittedAt).toLocaleDateString()}
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                                <div className="flex space-x-2">
                                  <button
                                    onClick={() => handleViewSurvey(survey)}
                                    className="text-blue-600 hover:text-blue-900 text-xs"
                                  >
                                    View
                                  </button>
                                  <button
                                    onClick={() => handleEditSurvey(survey)}
                                    className="text-green-600 hover:text-green-900 text-xs"
                                  >
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => handleDeleteSurvey(survey)}
                                    className="text-red-600 hover:text-red-900 text-xs"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Units List */}
            <div className="bg-white rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">യൂണിറ്റുകൾ</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      Total: {units.length} units in this area
                      {unitSearchTerm && (
                        <span className="ml-2 text-blue-600">
                          (Showing {filteredUnits.length} filtered)
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="relative">
                      <input
                        type="text"
                        value={unitSearchTerm}
                        onChange={(e) => setUnitSearchTerm(e.target.value)}
                        placeholder="Search units..."
                        className="w-64 pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                      />
                      <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    </div>
                    {unitSearchTerm && (
                      <button
                        onClick={() => setUnitSearchTerm('')}
                        className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Clear
                      </button>
                    )}
                  </div>
                </div>
                <p className="text-xs text-blue-600">
                  💡 Click on any unit row to view its monthly surveys above
                </p>
              </div>

              {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <span className="ml-2 text-gray-600">Loading units...</span>
              </div>
            ) : filteredUnits.length === 0 ? (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {unitSearchTerm ? 'No units found matching your search' : 'No units found'}
                </h3>
                <p className="text-gray-600">
                  {unitSearchTerm 
                    ? `No units match "${unitSearchTerm}". Try a different search term.`
                    : 'No units found for this area.'
                  }
                </p>
                {unitSearchTerm && (
                  <button
                    onClick={() => setUnitSearchTerm('')}
                    className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                  >
                    Clear Search
                  </button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Unit Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Monthly Surveys
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Activity
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUnits.map((unit) => {
                      const unitSurveys = monthlySurveys.filter(s => s.unitId === (unit.id || unit._id || unit.code));
                      const lastSurvey = unitSurveys.sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))[0];
                      
                      return (
                        <tr 
                          key={unit.id || unit._id || unit.code} 
                          className="hover:bg-blue-50 cursor-pointer transition-colors border-l-4 border-transparent hover:border-blue-500"
                          onClick={() => handleUnitClick(unit)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            <span 
                              dangerouslySetInnerHTML={{
                                __html: highlightSearchTerm(
                                  unit.name || unit.title || 'Unnamed Unit', 
                                  unitSearchTerm
                                )
                              }}
                            />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              {unitSurveys.length} surveys
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {lastSurvey ? new Date(lastSurvey.submittedAt).toLocaleDateString() : 'No activity'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
            </div>
          </div>
        )}

        {/* Statistics Tab */}
        {activeTab === 'stats' && (
          <div className="space-y-6">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <StatisticsCard 
                title="Total Units" 
                value={areaStats.totalUnits} 
                subtitle="Units in this area" 
              />
              <StatisticsCard 
                title="Monthly Surveys" 
                value={areaStats.totalMonthlySurveys} 
                subtitle="Total surveys submitted" 
              />
              <StatisticsCard 
                title="This Month" 
                value={areaStats.surveysThisMonth} 
                subtitle="Surveys this month" 
              />
              <StatisticsCard 
                title="Active Units" 
                value={areaStats.activeUnits} 
                subtitle="Units with submissions" 
              />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg shadow">
                <SurveyBarChart
                  data={unitsBarData}
                  title="Monthly Surveys by Unit"
                  dataKey1="surveys"
                  label1="Surveys"
                />
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Area Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Area Name:</span>
                    <span className="text-sm font-medium text-gray-900">{area?.name || areaId}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Units:</span>
                    <span className="text-sm font-medium text-gray-900">{areaStats.totalUnits}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Total Surveys:</span>
                    <span className="text-sm font-medium text-gray-900">{areaStats.totalMonthlySurveys}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Active Units:</span>
                    <span className="text-sm font-medium text-gray-900">
                      {areaStats.activeUnits} / {areaStats.totalUnits} 
                      ({areaStats.totalUnits > 0 ? Math.round((areaStats.activeUnits / areaStats.totalUnits) * 100) : 0}%)
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
      </main>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => {
          setShowDeleteModal(false);
          setSurveyToDelete(null);
        }}
        onConfirm={confirmDelete}
        title="Delete Monthly Survey"
        message={`Are you sure you want to delete the monthly survey for ${surveyToDelete?.month}? This action cannot be undone.`}
        confirmText="Delete"
        confirmColor="red"
      />

      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
        title="Logout"
        message="Are you sure you want to logout?"
        confirmText="Logout"
        confirmColor="red"
      />
    </div>
  );
};

export default AreaDashboardPage;