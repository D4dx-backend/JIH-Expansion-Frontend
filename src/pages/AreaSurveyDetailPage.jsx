import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Calendar, User, MapPin, CheckCircle, Users, TrendingUp, Activity } from 'lucide-react';
import axios from 'axios';
import ConfirmationModal from '../components/ConfirmationModal';
import jihLogo from '../assets/jih-logo2.png';

const AreaSurveyDetailPage = ({ surveyId: propSurveyId, onBack, onEdit, onDelete }) => {
  const { surveyId: paramSurveyId } = useParams();
  const navigate = useNavigate();
  
  // Use prop surveyId if provided, otherwise use param surveyId
  const surveyId = propSurveyId || paramSurveyId;
  const [survey, setSurvey] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (surveyId) {
      loadSurvey();
    }
  }, [surveyId]);

  const loadSurvey = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('userToken');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/area/surveys/${surveyId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setSurvey(response.data.data);
      } else {
        setError('Failed to load survey');
      }
    } catch (error) {
      console.error('Error loading survey:', error);
      setError('Failed to load survey');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
    if (onEdit) {
      onEdit(survey);
    } else {
      navigate(`/area-survey-edit/${surveyId}`);
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const token = localStorage.getItem('userToken');
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/area/surveys/${surveyId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (onDelete) {
        onDelete();
      } else {
        navigate('/area-dashboard');
      }
    } catch (error) {
      console.error('Error deleting survey:', error);
      setError('Failed to delete survey');
    }
    setShowDeleteModal(false);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const renderPartA = (partA) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Total Components</h3>
      
      <div className="grid grid-cols-3 gap-8">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900 mb-2">{partA.pj || 0}</div>
          <div className="text-sm text-gray-600 font-medium">PJ</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900 mb-2">{partA.kh || 0}</div>
          <div className="text-sm text-gray-600 font-medium">KH</div>
        </div>
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-900 mb-2">{partA.vkh || 0}</div>
          <div className="text-sm text-gray-600 font-medium">VKH</div>
        </div>
      </div>
    </div>
  );

  const renderPartB = (partB) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Expansion Activities</h3>
      
      <div className="space-y-6">
        {/* Monthly Meeting Status */}
        <div className="flex items-center justify-between py-3 border-b border-gray-100">
          <span className="text-sm font-medium text-gray-700">Monthly Meeting</span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
            partB.monthlyMeeting === 'Yes' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {partB.monthlyMeeting || 'No'}
          </span>
        </div>

        {/* Wing Attendance */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-4">Wing Attendance</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Object.entries(partB.wingAttendance || {}).map(([wing, attendance]) => (
              <div key={wing} className="border border-gray-200 rounded-lg p-4">
                <h5 className="text-sm font-medium text-gray-900 mb-3 capitalize">{wing}</h5>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Present</span>
                    <span className="font-medium text-gray-900">{attendance.present || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Leave</span>
                    <span className="font-medium text-gray-900">{attendance.leave || 0}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Absent</span>
                    <span className="font-medium text-gray-900">{attendance.absent || 0}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Decisions */}
        {partB.mainDecisions && partB.mainDecisions.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-4">Main Decisions</h4>
            <div className="space-y-3">
              {partB.mainDecisions.map((decision, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <span className="text-sm font-medium text-gray-500 mt-0.5">{index + 1}.</span>
                  <p className="text-sm text-gray-900">{decision}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderPartC = (partC) => {
    const activityLabels = {
      newAreaWorkshop: 'New Area Workshop',
      workerTraining: 'Worker Training',
      newAreaAgenda: 'New Area Agenda Preparation',
      fulltimeRecruitment: 'Full-time Recruitment',
      schoolGuardianCluster: 'School Guardian Cluster Formation',
      reliefDataCollection: 'Relief Beneficiary Data Collection',
      workerDeployment: 'Worker Deployment to New Areas',
      weeklyMeetingEffectiveness: 'Weekly Meeting Effectiveness',
      hajjUmrahGroup: 'Hajj/Umrah Group Members',
      artsScienceCampus: 'Arts & Science Campus Activities',
      madrasaGrowthCalculation: 'Madrasa Growth Calculation',
      schoolCenteredWork: 'School-centered Work',
      staffHalkaFormation: 'Staff Halka Formation',
      islamicCollegeAlumni: 'Islamic College Alumni',
      quranStudyCenterWork: 'Quran Study Center Work'
    };

    const selectedActivities = Object.entries(partC.expansionActivities || {})
      .filter(([key, value]) => value)
      .map(([key]) => ({ key, label: activityLabels[key] || key }));

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Focus Areas</h3>
        
        {selectedActivities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {selectedActivities.map(({ key, label }) => (
              <div key={key} className="flex items-center space-x-3 py-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-900">{label}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500">No focus areas selected</p>
        )}
      </div>
    );
  };

  const renderPartD = (partD) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Team Activities</h3>
      
      {partD.activities && partD.activities.length > 0 ? (
        <div className="space-y-3">
          {partD.activities.map((activity, index) => (
            <div key={index} className="flex items-start space-x-3 py-2">
              <span className="text-sm font-medium text-gray-500 mt-0.5">{index + 1}.</span>
              <p className="text-sm text-gray-900">{activity}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500">No team activities recorded</p>
      )}
    </div>
  );

  const renderPartE = (partE) => {
    const categoryLabels = {
      personalConnection: 'Personal Connection',
      literaryConnection: 'Literary Connection',
      qscStudent: 'QSC Student',
      regularKhutbaListener: 'Regular Khutba Listener',
      prabodhanamReader: 'Prabodhanam Reader',
      jaBeneficiary: 'JA Beneficiary',
      adaBeneficiary: 'ADA Beneficiary',
      localReliefBeneficiary: 'Local Relief Beneficiary',
      aaramamReader: 'Aaramam Reader',
      thawheedulMaraStudent: 'Thawheedul Mara Student',
      madrasaAlumni: 'Madrasa Alumni',
      islamicCollegeAlumni: 'Islamic College Alumni',
      neighborhoodMember: 'Neighborhood Member',
      palliativeConnection: 'Palliative Connection',
      friendsClubMember: 'Friends Club Member',
      mediaReader: 'Media Reader',
      ayahDarsQuranStudent: 'Ayah Dars Quran Student',
      heavenGuardian: 'Heaven Guardian',
      schoolGuardian: 'School Guardian',
      arabicCollegeGuardian: 'Arabic College Guardian',
      arabicCollegeStudent: 'Arabic College Student',
      artsCollegeStudent: 'Arts College Student',
      artsCollegeGuardian: 'Arts College Guardian',
      publicCampusStudent: 'Public Campus Student',
      otherNGOs: 'Other NGOs',
      mahallConnection: 'Mahall Connection',
      fulltimeWorkerConnection: 'Full-time Worker Connection'
    };

    const selectedCategories = Object.entries(partE.categories || {})
      .filter(([key, value]) => value)
      .map(([key]) => ({ key, label: categoryLabels[key] || key }));

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">New Person Discovery</h3>
        
        <div className="space-y-6">
          {/* Gender Count */}
          <div className="grid grid-cols-2 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">{partE.male || 0}</div>
              <div className="text-sm text-gray-600 font-medium">Male</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-900 mb-2">{partE.female || 0}</div>
              <div className="text-sm text-gray-600 font-medium">Female</div>
            </div>
          </div>

          {/* Categories */}
          {selectedCategories.length > 0 && (
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-4">Contact Categories</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {selectedCategories.map(({ key, label }) => (
                  <div key={key} className="flex items-center space-x-3 py-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-sm text-gray-900">{label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderPartF = (partF) => {
    const wingLabels = {
      jih: 'JIH',
      vanitha: 'Vanitha',
      solidarity: 'Solidarity',
      sio: 'SIO',
      gio: 'GIO',
      teenIndia: 'Teen India',
      malarvadi: 'Malarvadi'
    };

    const totalComponents = Object.values(partF.wingGrowth || {}).reduce((sum, data) => sum + (data.newComponents || 0), 0);
    const totalMembers = Object.values(partF.wingGrowth || {}).reduce((sum, data) => sum + (data.newMembers || 0), 0);

    return (
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Growth Report</h3>
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{totalComponents}</div>
              <div className="text-xs text-gray-600">Total Components</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{totalMembers}</div>
              <div className="text-xs text-gray-600">Total Members</div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(partF.wingGrowth || {}).map(([wing, data]) => (
            <div key={wing} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
              <div className="flex items-center justify-between mb-4">
                <h5 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                  {wingLabels[wing] || wing}
                </h5>
                <div className="text-xs text-gray-500">
                  {((data.newComponents || 0) + (data.newMembers || 0))} Total
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-xl font-bold text-green-700 mb-1">{data.newComponents || 0}</div>
                  <div className="text-xs text-green-600 font-medium">Components</div>
                </div>
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-xl font-bold text-blue-700 mb-1">{data.newMembers || 0}</div>
                  <div className="text-xs text-blue-600 font-medium">Members</div>
                </div>
              </div>
              
              {/* Progress bar for visual representation */}
              <div className="mt-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Growth</span>
                  <span>{((data.newComponents || 0) + (data.newMembers || 0))} new</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-gradient-to-r from-green-500 to-blue-500 h-1.5 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.min(100, ((data.newComponents || 0) + (data.newMembers || 0)) * 10)}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading survey details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={handleBack}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!survey) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Survey not found</p>
          <button
            onClick={handleBack}
            className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBack}
                className="flex items-center justify-center w-8 h-8 hover:bg-gray-100 rounded-lg transition-colors"
                title="Go back"
              >
                <ArrowLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">Area Survey Report</h1>
                <p className="text-sm text-gray-600">{survey.month} • {survey.district} • {survey.area}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleEdit}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 text-sm"
              >
                <Edit className="w-4 h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition-colors flex items-center space-x-2 text-sm"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Survey Info Card */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <p className="text-sm text-gray-500 mb-1">District</p>
              <p className="text-sm font-medium text-gray-900">{survey.district || 'Unknown'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Area</p>
              <p className="text-sm font-medium text-gray-900">{survey.area || 'Unknown'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Month</p>
              <p className="text-sm font-medium text-gray-900">{survey.month || 'Unknown'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500 mb-1">Submitted</p>
              <p className="text-sm font-medium text-gray-900">{formatDate(survey.submittedAt)}</p>
            </div>
          </div>
        </div>

        {/* Survey Parts */}
        <div className="space-y-6">
          {survey.partA && renderPartA(survey.partA)}
          {survey.partB && renderPartB(survey.partB)}
          {survey.partC && renderPartC(survey.partC)}
          {survey.partD && renderPartD(survey.partD)}
          {survey.partE && renderPartE(survey.partE)}
          {survey.partF && renderPartF(survey.partF)}
        </div>
      </main>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Area Survey"
        message={`Are you sure you want to delete this area survey for ${survey.month}? This action cannot be undone.`}
        confirmText="Delete"
        confirmColor="red"
      />
    </div>
  );
};

export default AreaSurveyDetailPage;
