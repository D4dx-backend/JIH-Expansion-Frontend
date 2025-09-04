import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Building, BookOpen, MapPin, Calendar, TrendingUp, ArrowLeft } from 'lucide-react';
import SurveyBarChart from '../charts/SurveyBarChart';
import SurveyPieChart from '../charts/SurveyPieChart';
import StatisticsCard from '../charts/StatisticsCard';

const MainAdminDashboard = ({ onBack }) => { // Fixed prop destructuring
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMainStats();
  }, []);

  const loadMainStats = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/stats`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setStats(response.data.stats);
    } catch (error) {
      console.error('Error loading main stats:', error);
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
        <span className="ml-2 text-gray-600">Loading statistics...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600">No statistics available</p>
      </div>
    );
  }

  // Prepare data for charts
  const districtComparisonData = stats.overall?.districtComparison?.map(district => ({
    name: district.district,
    yearlyWorkers: district.yearlyWorkers,
    avgMonthlyWorkers: district.avgMonthlyWorkers,
    monthlyCount: district.monthlyCount
  })) || [];

  const monthlySubmissionsData = Object.entries(stats.overall?.monthlySubmissionsByMonth || {}).map(([month, count]) => ({
    name: month,
    submissions: count
  }));

  const surveyTypeData = [
    { name: 'Yearly Surveys', value: stats.overall?.totalYearlySurveys || 0 },
    { name: 'Monthly Surveys', value: stats.overall?.totalMonthlySurveys || 0 }
  ];

  const districtSubmissionData = stats.overall?.districtComparison?.map(district => ({
    name: district.district,
    yearly: district.yearlySubmitted ? 1 : 0,
    monthly: district.monthlyCount
  })) || [];

  return (
    
      <div className="space-y-6">
     
        <div className="bg-purple-50 border border-purple-100 rounded-lg p-4 text-purple-900">
          <p className="text-sm">
            This page shows overall progress across all districts. Cards show totals, and charts help compare districts and months in a simple way.
          </p>
        </div>
      {/* Overview Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6">
        <StatisticsCard
          title="Total Districts"
          value={stats.overall?.totalDistricts || 0}
          subtitle="Active districts"
          icon={MapPin}
          color="blue"
        />
        <StatisticsCard
          title="Total Workers"
          value={stats.overall?.totalWorkers || 0}
          subtitle="Across all districts"
          icon={Users}
          color="green"
        />
        <StatisticsCard
          title="Total Components"
          value={stats.overall?.totalComponents || 0}
          subtitle="Active components"
          icon={Building}
          color="purple"
        />
        <StatisticsCard
          title="Total Institutions"
          value={stats.overall?.totalInstitutions || 0}
          subtitle="Educational institutions"
          icon={BookOpen}
          color="yellow"
        />
        <StatisticsCard
          title="Yearly Surveys"
          value={stats.overall?.totalYearlySurveys || 0}
          subtitle="Submitted"
          icon={Calendar}
          color="red"
        />
        <StatisticsCard
          title="Monthly Surveys"
          value={stats.overall?.totalMonthlySurveys || 0}
          subtitle="This year"
          icon={TrendingUp}
          color="blue"
        />
      </div>

      {/* Population Overview */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Population Overview</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">
              {stats.overall?.totalPopulation?.toLocaleString() || 0}
            </div>
            <div className="text-sm text-gray-600">Total Population</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">
              {((stats.overall?.totalWorkers || 0) / (stats.overall?.totalPopulation || 1) * 100).toFixed(2)}%
            </div>
            <div className="text-sm text-gray-600">Worker Coverage</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">
              {Math.round((stats.overall?.totalPopulation || 0) / (stats.overall?.totalDistricts || 1))}
            </div>
            <div className="text-sm text-gray-600">Avg Population per District</div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SurveyBarChart
          data={districtComparisonData}
          title="Workers: Yearly vs Avg Monthly (by District)"
          dataKey1="yearlyWorkers"
          dataKey2="avgMonthlyWorkers"
          label1="Yearly"
          label2="Avg Monthly"
        />
        
        <SurveyPieChart
          data={surveyTypeData}
          title="Yearly vs Monthly Surveys"
        />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SurveyBarChart
          data={monthlySubmissionsData}
          title="Submissions per Month (All Districts)"
          dataKey1="submissions"
          label1="Submissions"
          color1="#10B981"
        />
        
        <SurveyBarChart
          data={districtSubmissionData}
          title="Submission Status by District"
          dataKey1="yearly"
          dataKey2="monthly"
          label1="Yearly Submitted"
          label2="Monthly Count"
        />
      </div>

      {/* District Details Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">District-wise Details</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  District
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Yearly Survey
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monthly Surveys
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Yearly Workers
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Monthly Workers
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {stats.overall?.districtComparison?.map((district, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {district.district}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      district.yearlySubmitted 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {district.yearlySubmitted ? 'Submitted' : 'Pending'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {district.monthlyCount}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {district.yearlyWorkers}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {district.avgMonthlyWorkers.toFixed(0)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MainAdminDashboard;