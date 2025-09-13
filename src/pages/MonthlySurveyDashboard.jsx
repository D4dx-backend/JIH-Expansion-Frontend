import React, { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Edit, Trash2, Calendar, Search, Filter, FileText, Users, Building } from 'lucide-react';
import axios from 'axios';
import ConfirmationModal from '../components/ConfirmationModal';
import jihLogo from '../assets/jih-logo2.png';

const MonthlySurveyDashboard = ({ onBack, onCreateNew, onEdit, userData }) => {
  const [surveys, setSurveys] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  // Remove activeTab since we're using filters instead
  
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

  // Since user is always district admin, set permissions accordingly
  const userRole = 'district'; // Always district admin
  
  // District admins can create, edit, and delete surveys
  const canCreate = levelFilter === 'district' || levelFilter === ''; // Can create district-level surveys
  const canEdit = true; // District admins can edit all surveys
  const canDelete = true; // District admins can delete all surveys
  
  // Debug logging to help identify role issues
  console.log('MonthlySurveyDashboard - userData:', userData);
  console.log('MonthlySurveyDashboard - userRole:', userRole);
  console.log('MonthlySurveyDashboard - levelFilter:', levelFilter);
  console.log('MonthlySurveyDashboard - canCreate:', canCreate);

  useEffect(() => {
    fetchSurveys();
  }, [currentPage, levelFilter, monthFilter]);

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
      
      // Always use the "all" endpoint since we're filtering by level
      endpoint = '/api/user/monthly-surveys/all';
      
      // Add level filter to params if specified
      if (levelFilter) {
        params.append('level', levelFilter);
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
      setSurveys(response.data.surveys || response.data.data || []);
      setTotalPages(response.data.totalPages || 1);
      setTotalSurveys(response.data.totalSurveys || 0);
      
      // Survey stats are calculated locally from the surveys array
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
    survey.submittedByName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    survey.areaName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    survey.unitName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    survey.month?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group surveys by submission level for stats
  const surveyStats = {
    district: surveys.filter(s => s.submissionLevel === 'district').length,
    area: surveys.filter(s => s.submissionLevel === 'area').length,
    unit: surveys.filter(s => s.submissionLevel === 'unit').length,
    total: surveys.length
  };

  // Since user is always district admin, use district-specific titles
  const getDashboardTitle = () => {
    return 'Monthly Surveys Dashboard';
  };

  const getDashboardSubtitle = () => {
    return `District: ${userData?.district || 'Unknown'}`;
  };

  // Removed getAvailableTabs function since we're not using tabs anymore

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

      {/* Removed tabs section - using filters instead */}

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
              Showing {filteredSurveys.length} of {totalSurveys} surveys from district hierarchy
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
                No surveys found. Create the first district survey to get started.
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
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getSubmissionLevelColor(survey.submissionLevel)} mr-2`}>
                              {getSubmissionLevelIcon(survey.submissionLevel)}
                              <span className="ml-1 capitalize">{survey.submissionLevel}</span>
                            </span>
                          </div>
                          <div className="text-sm text-gray-900 mt-1">
                            {survey.submissionLevel === 'district' && survey.district}
                            {survey.submissionLevel === 'area' && (
                              <div>
                                <div className="font-medium">{survey.areaName || survey.area || 'Unknown Area'}</div>
                                <div className="text-xs text-gray-500">{survey.district}</div>
                              </div>
                            )}
                            {survey.submissionLevel === 'unit' && (
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
                          {survey.submittedByName || survey.submittedBy}
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
          message={`Are you sure you want to delete the monthly survey for ${surveyToDelete?.month} submitted by ${surveyToDelete?.submittedByName || surveyToDelete?.submittedBy}? This action cannot be undone.`}
          confirmText="Delete"
          confirmColor="red"
        />
      )}
    </div>
  );
};

export default MonthlySurveyDashboard;