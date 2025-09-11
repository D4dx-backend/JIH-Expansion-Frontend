import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Building, BookOpen, TrendingUp, ArrowLeft, BarChart3, MapPin } from 'lucide-react';
import SurveyBarChart from '../charts/SurveyBarChart';
import SurveyPieChart from '../charts/SurveyPieChart';
import StatisticsCard from '../charts/StatisticsCard';
import jihLogo from '../../assets/jih-logo2.png';

const DistrictAdminDashboard = ({ adminId, onBack }) => {
  const [stats, setStats] = useState(null);
  const [areaCount, setAreaCount] = useState(0);
  const [unitCount, setUnitCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState('');

  useEffect(() => {
    loadDistrictStats();
    loadHierarchyCounts();
  }, [adminId]);

  const loadDistrictStats = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/user/stats`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setStats(response.data.stats);
      console.log(response.data.stats);
      setSummary(response.data.summary || '');
      console.log(response.data.summary);
    } catch (error) {
      console.error('Error loading district stats:', error);
      setError('Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  const loadHierarchyCounts = async () => {
    try {
      const user = JSON.parse(localStorage.getItem('userData') || '{}');
      const token = localStorage.getItem('userToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const distId = user?.district || user?.districtId || stats?.yearly?.district;
      if (!distId) return;
      const areasResp = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/hierarchy/areas/${encodeURIComponent(distId)}`, { headers });
      const areas = areasResp.data?.data || [];
      setAreaCount(areas.length);
      let unitsTotal = 0;
      for (const a of areas) {
        try {
          const unitsResp = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/hierarchy/units/${encodeURIComponent(a.id || a._id || a.code)}`, { headers });
          unitsTotal += (unitsResp.data?.data || []).length;
        } catch {}
      }
      setUnitCount(unitsTotal);
    } catch (e) {
      console.error('Hierarchy count error', e);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
  const yearlyVsMonthlyData = [
    {
      name: 'Yearly Survey',
      workers: stats.yearly?.totalWorkers || 0,
      components: stats.yearly?.totalComponents || 0,
      institutions: stats.yearly?.totalInstitutions || 0
    },
    {
      name: 'Monthly Average',
      workers: stats.monthly?.averages?.avgWorkers || 0,
      components: stats.monthly?.averages?.avgComponents || 0,
      institutions: stats.monthly?.averages?.avgInstitutions || 0
    }
  ];

  const monthlyTrendData = stats.monthly?.surveys?.map(survey => ({
    name: survey.month,
    workers: survey.totalWorkers,
    components: survey.totalComponents,
    institutions: survey.totalInstitutions
  })) || [];

  const organizationData = stats.yearly ? [
    { name: 'JIH', value: stats.yearly.totalWorkers * 0.3 },
    { name: 'Vanitha', value: stats.yearly.totalWorkers * 0.2 },
    { name: 'Solidarity', value: stats.yearly.totalWorkers * 0.15 },
    { name: 'SIO', value: stats.yearly.totalWorkers * 0.15 },
    { name: 'GIO', value: stats.yearly.totalWorkers * 0.1 },
    { name: 'Others', value: stats.yearly.totalWorkers * 0.1 }
  ] : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Left section: Back + Logo + Title */}
            <div className="flex items-center space-x-4">
              <button
                onClick={onBack}
                className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded-lg text-sm font-medium flex items-center text-center"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                <span className="text-sm leading-tight">Back</span>
              </button>

              <div className="flex items-center space-x-2">
                <img src={jihLogo} alt="JIH Logo" className="h-8 sm:h-12 w-auto" />
                <div>
                  <h1 className="text-xl font-semibold text-gray-900">സ്ഥിതിവിവരക്കണക്കുകൾ</h1>
                  <p className="text-sm text-gray-600">District Admin Dashboard</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 text-blue-900">
          <p className="text-sm">
            This page shows your district's progress in simple numbers and charts. You can see totals from your last yearly survey and how this year's months are going.
          </p>
        </div>
        {/* AI Summary */}
        {summary && (
          <div className="bg-white p-4 rounded-lg shadow border">
            <div className="text-sm text-gray-800">{summary}</div>
          </div>
        )}

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatisticsCard
            title="Total Workers"
            value={(stats.yearly?.totalWorkers || 0).toLocaleString()}
            subtitle="From last yearly survey"
            icon={Users}
            color="blue"
          />
          <StatisticsCard
            title="Total Units (Components)"
            value={(stats.yearly?.totalComponents || 0).toLocaleString()}
            subtitle="Active units in your district"
            icon={Building}
            color="green"
          />
          <StatisticsCard
            title="Total Institutions"
            value={(stats.yearly?.totalInstitutions || 0).toLocaleString()}
            subtitle="Schools, madrasas, colleges"
            icon={BookOpen}
            color="purple"
          />
          <StatisticsCard
            title="Monthly Surveys This Year"
            value={(stats.monthly?.count || 0).toLocaleString()}
            subtitle="How many months reported"
            icon={TrendingUp}
            color="yellow"
          />
          <StatisticsCard
            title="Total Areas"
            value={areaCount}
            subtitle="Under this district"
            icon={MapPin}
            color="blue"
          />
          <StatisticsCard
            title="Total Units"
            value={unitCount}
            subtitle="Across all areas"
            icon={MapPin}
            color="green"
          />
        </div>

        {/* Growth Comparison */}
        {stats.comparison && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Growth Analysis</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="text-center">
                <div className={`text-2xl font-bold ${stats.comparison.workersGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.comparison.workersGrowth >= 0 ? '+' : ''}{stats.comparison.workersGrowth.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Workers Growth</div>
              </div>
              <div className="text-center">
                <div className={`text-2xl font-bold ${stats.comparison.componentsGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {stats.comparison.componentsGrowth >= 0 ? '+' : ''}{stats.comparison.componentsGrowth.toFixed(1)}%
                </div>
                <div className="text-sm text-gray-600">Components Growth</div>
              </div>
            </div>
          </div>
        )}

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SurveyBarChart
            data={yearlyVsMonthlyData}
            title="This Year (Average) vs Last Year"
            dataKey1="workers"
            dataKey2="components"
            label1="Workers"
            label2="Units"
          />
          
          <SurveyPieChart
            data={organizationData}
            title="Workers by Group (approx.)"
          />
        </div>
        <p className="text-xs text-gray-500">Tip: The bar chart compares last year's totals with this year's monthly average. The pie shows an approximate split of workers by group.</p>

        {/* Monthly Trend */}
        {monthlyTrendData.length > 0 && (
          <SurveyBarChart
            data={monthlyTrendData}
            title="Month-by-Month Progress"
            dataKey1="workers"
            dataKey2="components"
            label1="Workers"
            label2="Units"
          />
        )}

        {/* District Information */}
        {stats.yearly && (
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">District Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">District</p>
                <p className="text-lg font-medium">{stats.yearly.district}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Population</p>
                <p className="text-lg font-medium">{stats.yearly.totalPopulation ? stats.yearly.totalPopulation.toLocaleString() : 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Yearly Survey</p>
                <p className="text-lg font-medium">{new Date(stats.yearly.submittedAt).toLocaleDateString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Monthly Surveys This Year</p>
                <p className="text-lg font-medium">{(stats.monthly.count).toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default DistrictAdminDashboard;
