import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Edit, Trash2, Calendar, Search, Filter, FileText, Users, Building } from 'lucide-react';
import axios from 'axios';
import ConfirmationModal from '../components/ConfirmationModal';
import jihLogo from '../assets/jih-logo2.png';

const MonthlySurveyDashboard = ({ onBack, onCreateNew, onEdit, userData }) => {
  const [surveys, setSurveys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'district', 'areas', 'units'
  
  // Filtering and search
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [monthFilter, setMonthFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalSurveys, setTotalSurveys] = useState(0);
  
  // Modal state
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [surveyToDelete, setSurveyToDelete] = useState(null);

  // Determine user role and permissions
  const userRole = userData?.role; // 'district', 'area', 'unit'
  
  // District admins can only create district-level surveys
  // Area and unit users cannot create surveys
  const canCreate = userRole === 'district' && activeTab === 'district';
  const canEdit = userRole === 'district'; // Only district admins can edit
  const canDelete = userRole === 'district'; // Only district admins can delete
  
  // Debug logging to help identify role issues
  console.log('MonthlySurveyDashboard - userData:', userData);
  console.log('MonthlySurveyDashboard - userRole:', userRole);
  console.log('MonthlySurveyDashboard - activeTab:', activeTab);
  console.log('MonthlySurveyDashboard - canCreate:', canCreate);

  useEffect(() => {
    fetchSurveys();
  }, [currentPage, levelFilter, monthFilter, activeTab]);

  const fetchSurveys = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('userToken');
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
      });
      
      if (monthFilter) params.append('month', monthFilter);

      let endpoint = '';
      
      // Determine which endpoint to use based on user role and active tab
      if (userRole === 'district') {
        // District users can see all surveys in their hierarchy
        if (activeTab === 'district') {
          endpoint = '/api/district/surveys';
        } else if (activeTab === 'area') {
          endpoint = '/api/area/surveys';
        } else if (activeTab === 'unit') {
          endpoint = '/api/unit/unit-surveys';
        } else {
          // For 'all' tab, show all surveys from hierarchy
          endpoint = '/api/user/monthly-surveys/district-hierarchy';
        }
      } else if (userRole === 'area') {
        // Area users see area surveys
        endpoint = '/api/area/surveys';
      } else if (userRole === 'unit') {
        // Unit users see unit surveys
        endpoint = '/api/unit/unit-surveys';
      } else {
        // Fallback to old endpoint for other cases
        endpoint = '/api/user/monthly-surveys/district-hierarchy';
        if (activeTab !== 'all') params.append('submissionLevel', activeTab);
      }

      console.log('Fetching surveys from endpoint:', endpoint);
      console.log('With params:', params.toString());
      console.log('Full URL:', `${import.meta.env.VITE_API_URL}${endpoint}?${params}`);
      
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}${endpoint}?${params}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      console.log('API Response:', response.data);
      
      // Handle different response formats
      if (response.data.success) {
        setSurveys(response.data.data || []);
        setTotalPages(response.data.totalPages || 1);
        setTotalSurveys(response.data.totalSurveys || (response.data.data ? response.data.data.length : 0));
      } else {
        setSurveys(response.data.surveys || []);
        setTotalPages(response.data.totalPages || 1);
        setTotalSurveys(response.data.totalSurveys || 0);
      }
    } catch (error) {
      console.error('Error fetching monthly surveys:', error);
      setError('Failed to load monthly surveys');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!surveyToDelete || !canDelete) return;

    try {
      const token = localStorage.getItem('userToken');
      // Use different endpoints based on user role
      let deleteEndpoint = '';
      if (userRole === 'district') {
        deleteEndpoint = `/api/district/surveys/${surveyToDelete._id}`;
      } else if (userRole === 'area') {
        deleteEndpoint = `/api/area/surveys/${surveyToDelete._id}`;
      } else if (userRole === 'unit') {
        deleteEndpoint = `/api/unit/unit-survey/${surveyToDelete._id}`;
      } else {
        deleteEndpoint = `/api/user/monthly-survey/${surveyToDelete._id}`;
      }
      
      await axios.delete(
        `${import.meta.env.VITE_API_URL}${deleteEndpoint}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      // Update local state
      setSurveys(surveys.filter((survey) => survey._id !== surveyToDelete._id));
      setTotalSurveys(prev => prev - 1);
      setShowDeleteModal(false);
      setSurveyToDelete(null);
      
      // Refresh the data
      fetchSurveys();
    } catch (error) {
      console.error('Error deleting survey:', error);
      setError('Failed to delete survey');
    }
  };

  const handleViewSurvey = (survey) => {
    // For now, we'll use the same edit function but in view-only mode
    // You can create a separate view component if needed
    onEdit(survey);
  };

  const handleEditSurvey = (survey) => {
    if (canEdit) {
      onEdit(survey);
    } else {
      // For non-district users, treat as view-only
      handleViewSurvey(survey);
    }
  };

  // Add the missing handleSearch function - triggers a manual refresh
  const handleSearch = () => {
    setCurrentPage(1); // Reset to first page when searching
    fetchSurveys();
  };

  const clearFilters = () => {
    setSearchTerm('');
    setLevelFilter('');
    setMonthFilter('');
    setCurrentPage(1);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const getSubmissionLevelIcon = (level) => {
    switch (level) {
      case 'district': return <Building className="w-4 h-4" />;
      case 'area': return <Users className="w-4 h-4" />;
      case 'unit': return <FileText className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const getSubmissionLevelColor = (level) => {
    switch (level) {
      case 'district': return 'bg-blue-100 text-blue-800';
      case 'area': return 'bg-green-100 text-green-800';
      case 'unit': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredSurveys = surveys.filter(survey => 
    survey.district?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    survey.submittedBy?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    survey.areaName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    survey.unitName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    survey.month?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group surveys by submission level for stats
  const surveyStats = {
    district: surveys.filter(s => s.submissionLevel === 'district' || (userRole === 'district' && activeTab === 'district')).length,
    area: surveys.filter(s => s.submissionLevel === 'area' || (userRole === 'district' && activeTab === 'area')).length,
    unit: surveys.filter(s => s.submissionLevel === 'unit' || (userRole === 'district' && activeTab === 'unit')).length,
    total: surveys.length
  };

  // Get display title based on user role
  const getDashboardTitle = () => {
    switch (userRole) {
      case 'area': return 'Area Monthly Surveys';
      case 'unit': return 'Unit Monthly Surveys';
      case 'district': return 'Monthly Surveys Dashboard';
      default: return 'Monthly Surveys Dashboard';
    }
  };

  // Get display subtitle based on user role
  const getDashboardSubtitle = () => {
    switch (userRole) {
      case 'area': return `Area: ${userData?.areaName || userData?.areaId} • District: ${userData?.district}`;
      case 'unit': return `Unit: ${userData?.unitName || userData?.unitId} • Area: ${userData?.areaName} • District: ${userData?.district}`;
      case 'district': return `District: ${userData?.district}`;
      default: return `District: ${userData?.district || 'Unknown'}`;
    }
  };

  // Determine which tabs to show based on user role
  const getAvailableTabs = () => {
    switch (userRole) {
      case 'unit':
        return [{ key: 'all', label: 'My Surveys', count: surveyStats.total }];
      case 'area':
        return [
          { key: 'all', label: 'All Surveys', count: surveyStats.total },
          { key: 'area', label: 'Area Level', count: surveyStats.area },
          { key: 'unit', label: 'Unit Level', count: surveyStats.unit }
        ];
      case 'district':
        return [
          { key: 'all', label: 'All Surveys', count: surveyStats.total },
          { key: 'district', label: 'District Level', count: surveyStats.district },
          { key: 'area', label: 'Area Level', count: surveyStats.area },
          { key: 'unit', label: 'Unit Level', count: surveyStats.unit }
        ];
      default: // fallback for undefined role
        return [
          { key: 'all', label: 'All Surveys', count: surveyStats.total }
        ];
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-4 sm:py-6 gap-4">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={onBack}
                className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 text-sm"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
              <img src={jihLogo} alt="JIH Logo" className="h-8 sm:h-12 w-auto" />
              <div>
                <h1 className="text-lg sm:text-2xl font-bold text-gray-900">{getDashboardTitle()}</h1>
                <p className="text-sm text-gray-600">{getDashboardSubtitle()}</p>
              </div>
            </div>
            {canCreate && (
              <button
                onClick={onCreateNew}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>New District Survey</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {getAvailableTabs().map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.key
                    ? tab.key === 'district' ? 'border-blue-500 text-blue-600'
                    : tab.key === 'area' ? 'border-green-500 text-green-600'
                    : tab.key === 'unit' ? 'border-purple-500 text-purple-600'
                    : 'border-gray-500 text-gray-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Filters and Search */}
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
            {userRole === 'district' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                <select
                  value={levelFilter}
                  onChange={(e) => setLevelFilter(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                >
                  <option value="">All Levels</option>
                  <option value="district">District</option>
                  <option value="area">Area</option>
                  <option value="unit">Unit</option>
                </select>
              </div>
            )}
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
            <div className={`flex items-end space-x-2 ${userRole === 'district' ? 'md:col-span-2' : 'md:col-span-3'}`}>
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

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}

        {/* Surveys Table */}
        <div className="bg-white rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Monthly Surveys</h2>
            <p className="text-sm text-gray-600 mt-1">
              Showing {filteredSurveys.length} of {totalSurveys} surveys
              {userRole === 'district' && ' from district hierarchy'}
              {userRole === 'area' && ' from area and units'}
              {userRole === 'unit' && ' from unit'}
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
              <span className="ml-2 text-gray-600">Loading surveys...</span>
            </div>
          ) : filteredSurveys.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No monthly surveys found</h3>
              <p className="text-gray-600 mb-4">
                {canCreate 
                  ? 'No district-level surveys found. Create the first district survey.' 
                  : 'No surveys available to view at this level.'}
              </p>
              {canCreate && (
                <button
                  onClick={onCreateNew}
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors"
                >
                  Create District Survey
                </button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Level & Location
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
                    {filteredSurveys.map((survey) => (
                      <tr key={survey._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSubmissionLevelColor(survey.submissionLevel || activeTab)} mr-2`}>
                              {getSubmissionLevelIcon(survey.submissionLevel || activeTab)}
                              <span className="ml-1 capitalize">{survey.submissionLevel || activeTab}</span>
                            </span>
                          </div>
                          <div className="text-sm text-gray-900 mt-1">
                            {(survey.submissionLevel === 'district' || activeTab === 'district') && survey.district}
                            {(survey.submissionLevel === 'area' || activeTab === 'area') && (
                              <div>
                                <div className="font-medium">{survey.areaName || survey.area || 'Unknown Area'}</div>
                                <div className="text-xs text-gray-500">{survey.district}</div>
                              </div>
                            )}
                            {(survey.submissionLevel === 'unit' || activeTab === 'unit') && (
                              <div>
                                <div className="font-medium">{survey.unitName || survey.unit || 'Unknown Unit'}</div>
                                <div className="text-xs text-gray-500">{survey.areaName || survey.area} • {survey.district}</div>
                              </div>
                            )}
                          </div>
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
                          {formatDate(survey.submittedAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEditSurvey(survey)}
                              className="text-green-600 hover:text-green-900"
                              title={canEdit ? "Edit" : "View"}
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            {canDelete && (
                              <button
                                onClick={() => {
                                  setSurveyToDelete(survey);
                                  setShowDeleteModal(true);
                                }}
                                className="text-red-600 hover:text-red-900"
                                title="Delete"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
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
      </main>

      {/* Delete Confirmation Modal - Only show for district admins */}
      {canDelete && (
        <ConfirmationModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            setSurveyToDelete(null);
          }}
          onConfirm={handleDelete}
          title="Delete Monthly Survey"
          message={`Are you sure you want to delete the monthly survey for ${surveyToDelete?.month} submitted by ${surveyToDelete?.submittedBy}? This action cannot be undone.`}
          confirmText="Delete"
          confirmColor="red"
        />
      )}
    </div>
  );
};

export default MonthlySurveyDashboard;