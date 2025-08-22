import React, { useState, useEffect } from 'react';
import { LogOut, FileText, Save, Plus, Trash2, Edit } from 'lucide-react';
import axios from 'axios';
import FormPage from './FormPage';
import FormDetailPage from './FormDetailPage';
import { FormProvider } from '../contexts/FormContext';
import ConfirmationModal from '../components/ConfirmationModal';
import jihLogo from '../assets/jih-logo2.png';

const FormSubmissionPage = ({ onLogout }) => {
  const [userData, setUserData] = useState(null);
  const [forms, setForms] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingForm, setEditingForm] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [formToDelete, setFormToDelete] = useState(null);

  useEffect(() => {
    // Get user data from localStorage
    const storedUserData = localStorage.getItem('userData');
    if (storedUserData) {
      setUserData(JSON.parse(storedUserData));
    }
    
    // Load user's forms
    loadUserForms();
  }, []);

  const loadUserForms = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/forms`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setForms(response.data.forms);
    } catch (error) {
      console.error('Error loading forms:', error);
      setError('Failed to load forms');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const confirmLogout = () => {
    onLogout();
  };

  const [showForm, setShowForm] = useState(false);
  const [showDetailView, setShowDetailView] = useState(false);
  const [selectedFormId, setSelectedFormId] = useState(null);

  const handleCreateForm = () => {
    setShowForm(true);
  };

  const handleFormBack = () => {
    setShowForm(false);
  };

  const handleFormSubmit = (formData) => {
    setShowForm(false);
    setEditingForm(null);
    // Reload forms after submission
    loadUserForms();
  };

  const handleViewForm = (form) => {
    setSelectedFormId(form._id);
    setShowDetailView(true);
  };

  const handleEditForm = (form) => {
    setEditingForm(form);
    setShowForm(true);
  };

  const handleDetailBack = () => {
    setShowDetailView(false);
    setSelectedFormId(null);
  };

  const handleDetailEdit = (form) => {
    setShowDetailView(false);
    setSelectedFormId(null);
    setEditingForm(form);
    setShowForm(true);
  };

  const handleDetailDelete = () => {
    setShowDetailView(false);
    setSelectedFormId(null);
    loadUserForms();
  };

  const handleDeleteForm = (form) => {
    setFormToDelete(form);
    setShowDeleteModal(true);
  };

  const confirmDeleteForm = async () => {
    try {
      const token = localStorage.getItem('userToken');
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/user/forms/${formToDelete._id}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      loadUserForms();
      setFormToDelete(null);
    } catch (error) {
      console.error('Error deleting form:', error);
      setError('Failed to delete form');
    }
  };

  if (showForm) {
    return (
      <FormProvider>
        <FormPage 
          onBack={handleFormBack} 
          onSubmit={handleFormSubmit} 
          editingForm={editingForm}
        />
      </FormProvider>
    );
  }

  if (showDetailView && selectedFormId) {
    return (
      <FormDetailPage
        formId={selectedFormId}
        onBack={handleDetailBack}
        onEdit={handleDetailEdit}
        onDelete={handleDetailDelete}
      />
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your dashboard...</p>
        </div>
      </div>
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
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 text-center sm:text-left">JIH Organisation Expansion</h1>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-3 sm:px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors text-sm sm:text-base"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome back!
              </h2>
              <p className="text-gray-600">
                Manage your organizational form submissions and create new entries.
              </p>
            </div>
            <button
              onClick={handleCreateForm}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Create New Form</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Forms</p>
                <p className="text-2xl font-bold text-gray-900">{forms.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Save className="w-8 h-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Last Submission</p>
                <p className="text-2xl font-bold text-gray-900">
                  {forms.length > 0 ? 
                    new Date(forms[0].submittedAt).toLocaleDateString() : 
                    'None'
                  }
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <span className="text-purple-600 font-bold text-sm">✓</span>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Status</p>
                <p className="text-2xl font-bold text-gray-900">Active</p>
              </div>
            </div>
          </div>
        </div>

        {/* Forms List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Your Form Submissions</h3>
              <p className="text-sm text-gray-500">Click on any form to view complete details</p>
            </div>
          </div>
          
          {error && (
            <div className="p-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-600">{error}</p>
              </div>
            </div>
          )}

          {forms.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No forms submitted yet</h3>
              <p className="text-gray-500 mb-6">
                Get started by creating your first form submission.
              </p>
              <button
                onClick={handleCreateForm}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 mx-auto transition-colors"
              >
                <Plus className="w-5 h-5" />
                <span>Create First Form</span>
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {forms.map((form, index) => (
                <div key={form._id} className="p-6 hover:bg-gray-50 transition-colors border-l-4 border-transparent hover:border-blue-500">
                  <div className="flex items-center justify-between">
                    <div className="flex-1 cursor-pointer" onClick={() => handleViewForm(form)}>
                      <div className="flex items-center space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <FileText className="w-5 h-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {form.district || 'Unnamed District'}
                          </p>
                          <p className="text-sm text-gray-500">
                            Submitted on {new Date(form.submittedAt).toLocaleDateString()} at{' '}
                            {new Date(form.submittedAt).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditForm(form);
                        }}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                        title="Edit Form"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteForm(form);
                        }}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                        title="Delete Form"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDeleteForm}
        title="Delete Form"
        message={`Are you sure you want to delete the form for ${formToDelete?.district}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />

      <ConfirmationModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={confirmLogout}
        title="Logout"
        message="Are you sure you want to logout? You will need to enter your access code again to continue."
        confirmText="Logout"
        cancelText="Cancel"
        type="warning"
      />
    </div>
  );
};

export default FormSubmissionPage;
