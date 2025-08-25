import React, { useState, useEffect } from 'react';
import { ArrowLeft, FileText, Calendar, User, Edit, Trash2, Download } from 'lucide-react';
import axios from 'axios';
import ConfirmationModal from '../components/ConfirmationModal';
import { downloadSingleFormPDF } from '../utils/pdfGenerator.jsx';
import jihLogo from '../assets/jih-logo2.png';

const FormDetailPage = ({ formId, formData, onBack, onEdit, onDelete, isAdmin = false }) => {
  const [form, setForm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    loadFormDetails();
  }, [formId]);

  const loadFormDetails = async () => {
    try {
      const token = isAdmin ? localStorage.getItem('adminToken') : localStorage.getItem('userToken');
      const endpoint = isAdmin ? `/api/admin/forms/${formId}` : `/api/user/forms/${formId}`;
      
      const response = await axios.get(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setForm(response.data.form);
    } catch (error) {
      console.error('Error loading form details:', error);
      setError('Failed to load form details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = () => {
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const token = isAdmin ? localStorage.getItem('adminToken') : localStorage.getItem('userToken');
      const endpoint = isAdmin ? `/api/admin/forms/${formId}` : `/api/user/forms/${formId}`;
      
      await axios.delete(`${import.meta.env.VITE_API_URL}${endpoint}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      onDelete();
    } catch (error) {
      console.error('Error deleting form:', error);
      setError('Failed to delete form');
    }
  };

  const handleDownloadPDF = async () => {
    if (!form) return;
    
    try {
      setIsDownloading(true);
      await downloadSingleFormPDF(form);
    } catch (error) {
      console.error('Error downloading PDF:', error);
      setError('Failed to download PDF');
    } finally {
      setIsDownloading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">ഫോം വിവരങ്ങൾ ലോഡ് ചെയ്യുന്നു...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={onBack}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              തിരികെ പോകുക
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-md">
            <p className="text-yellow-600 mb-4">ഫോം കണ്ടെത്തിയില്ല</p>
            <button
              onClick={onBack}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
            >
              Go Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  const renderPartA = () => (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">ഭാഗം-എ (പൊതു വിവരങ്ങൾ)</h3>
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-700 mb-3">ജനസംഖ്യാ സ്ഥിതിവിവരങ്ങൾ</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">ആകെ ജനസംഖ്യ:</span>
              <span className="font-medium">{form.partA?.totalPopulation?.toLocaleString() || 'N/A'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">മുസ്ലിം ശതമാനം:</span>
              <span className="font-medium">{form.partA?.muslimPercentage || 'N/A'}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ഹിന്ദു ശതമാനം:</span>
              <span className="font-medium">{form.partA?.hinduPercentage || 'N/A'}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ക്രിസ്ത്യൻ ശതമാനം:</span>
              <span className="font-medium">{form.partA?.christianPercentage || 'N/A'}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">മറ്റുള്ളവർ ശതമാനം:</span>
              <span className="font-medium">{form.partA?.othersPercentage || 'N/A'}%</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">പ്രസ്ഥാന ശതമാനം:</span>
              <span className="font-medium">{form.partA?.movementPercentage || 'N/A'}%</span>
            </div>
          </div>
        </div>
        <div>
          <h4 className="font-medium text-gray-700 mb-3">സംഘടനാ സ്ഥാനങ്ങൾ</h4>
          <div className="space-y-2">
            <div>
              <span className="text-gray-600">മത സംഘടനകളിൽ ഭൂരിപക്ഷം:</span>
              <p className="font-medium">{form.partA?.majorityInReligiousOrganizations || 'N/A'}</p>
            </div>
            <div>
              <span className="text-gray-600">രണ്ടാം സ്ഥാനം:</span>
              <p className="font-medium">{form.partA?.secondPosition || 'N/A'}</p>
            </div>
            <div>
              <span className="text-gray-600">മൂന്നാം സ്ഥാനം:</span>
              <p className="font-medium">{form.partA?.thirdPosition || 'N/A'}</p>
            </div>
            <div>
              <span className="text-gray-600">നമ്മുടെ സ്ഥാനം:</span>
              <p className="font-medium">{form.partA?.ourPosition || 'N/A'}</p>
            </div>
            <div>
              <span className="text-gray-600">കൂടുതൽ രാഷ്ട്രീയ സ്വാധീനം:</span>
              <p className="font-medium">{form.partA?.morePoliticalInfluence || 'N/A'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPartB = () => (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">ഭാഗം-ബി (സംഘടനാ സംവിധാനങ്ങൾ)</h3>
      
      {/* Organizations */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-3">സംഘടനകൾ</h4>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(form.partB?.organizations || {}).map(([orgName, orgData]) => (
            <div key={orgName} className="border border-gray-200 rounded-lg p-4">
              <h5 className="font-medium text-gray-800 mb-2 capitalize">{orgName}</h5>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">ആകെ മേഖലകൾ:</span>
                  <span>{orgData.totalAreas || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">ഘടകങ്ങൾ:</span>
                  <span>{orgData.components || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">പ്രവർത്തകർ 2023:</span>
                  <span>{orgData.workers2023 || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">പ്രവർത്തകർ 2025:</span>
                  <span>{orgData.workers2025 || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Educational Institutions */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-700 mb-3">വിദ്യാഭ്യാസ സ്ഥാപനങ്ങൾ</h4>
        <div className="overflow-x-auto">
          <table className="w-full border border-gray-300 min-w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-3 text-left font-medium">വിവരങ്ങൾ</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-medium">എണ്ണം</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-medium">കുട്ടികളുടെ എണ്ണം</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-medium" colSpan="2">Staff</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-medium" colSpan="2">Non Teaching Staff</th>
              </tr>
              <tr className="bg-gray-50">
                <th className="border border-gray-300 px-4 py-3 text-left font-medium"></th>
                <th className="border border-gray-300 px-4 py-3 text-center font-medium"></th>
                <th className="border border-gray-300 px-4 py-3 text-center font-medium"></th>
                <th className="border border-gray-300 px-4 py-3 text-center font-medium">പ്രവർത്തകർ</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-medium">മറ്റുള്ളവർ</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-medium">പ്രവർത്തകർ</th>
                <th className="border border-gray-300 px-4 py-3 text-center font-medium">മറ്റുള്ളവർ</th>
              </tr>
            </thead>
            <tbody>
              {/* Madrasas */}
              <tr>
                <td className="border border-gray-300 px-4 py-3 font-medium">9. മദ്റസകളുടെ എണ്ണം</td>
                <td className="border border-gray-300 px-4 py-3 text-center">{form.partB?.institutions?.madrasas?.count || 0}</td>
                <td className="border border-gray-300 px-4 py-3 text-center">{form.partB?.institutions?.madrasas?.studentsCount || 0}</td>
                <td className="border border-gray-300 px-4 py-3 text-center">{form.partB?.institutions?.madrasas?.staffWorkers || 0}</td>
                <td className="border border-gray-300 px-4 py-3 text-center">{form.partB?.institutions?.madrasas?.staffOthers || 0}</td>
                <td className="border border-gray-300 px-4 py-3 text-center">{form.partB?.institutions?.madrasas?.nonTeachingWorkers || 0}</td>
                <td className="border border-gray-300 px-4 py-3 text-center">{form.partB?.institutions?.madrasas?.nonTeachingOthers || 0}</td>
              </tr>
              
              {/* Schools */}
              <tr>
                <td className="border border-gray-300 px-4 py-3 font-medium">10. സ്കൂളുകൾ (വിദ്യാകൗൺസിൽ)</td>
                <td className="border border-gray-300 px-4 py-3 text-center">{form.partB?.institutions?.schools?.count || 0}</td>
                <td className="border border-gray-300 px-4 py-3 text-center">{form.partB?.institutions?.schools?.studentsCount || 0}</td>
                <td className="border border-gray-300 px-4 py-3 text-center">{form.partB?.institutions?.schools?.staffWorkers || 0}</td>
                <td className="border border-gray-300 px-4 py-3 text-center">{form.partB?.institutions?.schools?.staffOthers || 0}</td>
                <td className="border border-gray-300 px-4 py-3 text-center">{form.partB?.institutions?.schools?.nonTeachingWorkers || 0}</td>
                <td className="border border-gray-300 px-4 py-3 text-center">{form.partB?.institutions?.schools?.nonTeachingOthers || 0}</td>
              </tr>
              
              {/* Heavens */}
              <tr>
                <td className="border border-gray-300 px-4 py-3 font-medium">11. ഹെവൻസ്</td>
                <td className="border border-gray-300 px-4 py-3 text-center">{form.partB?.institutions?.heavens?.count || 0}</td>
                <td className="border border-gray-300 px-4 py-3 text-center">{form.partB?.institutions?.heavens?.studentsCount || 0}</td>
                <td className="border border-gray-300 px-4 py-3 text-center">{form.partB?.institutions?.heavens?.staffWorkers || 0}</td>
                <td className="border border-gray-300 px-4 py-3 text-center">{form.partB?.institutions?.heavens?.staffOthers || 0}</td>
                <td className="border border-gray-300 px-4 py-3 text-center">{form.partB?.institutions?.heavens?.nonTeachingWorkers || 0}</td>
                <td className="border border-gray-300 px-4 py-3 text-center">{form.partB?.institutions?.heavens?.nonTeachingOthers || 0}</td>
              </tr>
              
              {/* Arabic Colleges */}
              <tr>
                <td className="border border-gray-300 px-4 py-3 font-medium">12. അറബി കോളേജുകൾ</td>
                <td className="border border-gray-300 px-4 py-3 text-center">{form.partB?.institutions?.arabicColleges?.count || 0}</td>
                <td className="border border-gray-300 px-4 py-3 text-center">{form.partB?.institutions?.arabicColleges?.studentsCount || 0}</td>
                <td className="border border-gray-300 px-4 py-3 text-center">{form.partB?.institutions?.arabicColleges?.staffWorkers || 0}</td>
                <td className="border border-gray-300 px-4 py-3 text-center">{form.partB?.institutions?.arabicColleges?.staffOthers || 0}</td>
                <td className="border border-gray-300 px-4 py-3 text-center">{form.partB?.institutions?.arabicColleges?.nonTeachingWorkers || 0}</td>
                <td className="border border-gray-300 px-4 py-3 text-center">{form.partB?.institutions?.arabicColleges?.nonTeachingOthers || 0}</td>
              </tr>
              
              {/* Arts Colleges */}
              <tr>
                <td className="border border-gray-300 px-4 py-3 font-medium">13. ആർട്സ് കോളേജുകൾ</td>
                <td className="border border-gray-300 px-4 py-3 text-center">{form.partB?.institutions?.artsColleges?.count || 0}</td>
                <td className="border border-gray-300 px-4 py-3 text-center">{form.partB?.institutions?.artsColleges?.studentsCount || 0}</td>
                <td className="border border-gray-300 px-4 py-3 text-center">{form.partB?.institutions?.artsColleges?.staffWorkers || 0}</td>
                <td className="border border-gray-300 px-4 py-3 text-center">{form.partB?.institutions?.artsColleges?.staffOthers || 0}</td>
                <td className="border border-gray-300 px-4 py-3 text-center">{form.partB?.institutions?.artsColleges?.nonTeachingWorkers || 0}</td>
                <td className="border border-gray-300 px-4 py-3 text-center">{form.partB?.institutions?.artsColleges?.nonTeachingOthers || 0}</td>
              </tr>
              
              {/* Main Campuses */}
              <tr>
                <td className="border border-gray-300 px-4 py-3 font-medium">14. പ്രധാന കാമ്പസുകൾ (SIO, GIO സാന്നിധ്യമുള്ളത്)</td>
                <td className="border border-gray-300 px-4 py-3 text-center">{form.partB?.institutions?.mainCampuses?.count || 0}</td>
                <td className="border border-gray-300 px-4 py-3 text-center">{form.partB?.institutions?.mainCampuses?.studentsCount || 0}</td>
                <td className="border border-gray-300 px-4 py-3 text-center bg-gray-100">-</td>
                <td className="border border-gray-300 px-4 py-3 text-center bg-gray-100">-</td>
                <td className="border border-gray-300 px-4 py-3 text-center bg-gray-100">-</td>
                <td className="border border-gray-300 px-4 py-3 text-center bg-gray-100">-</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Other Part B Data */}
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <h4 className="font-medium text-gray-700 mb-3">തൗഹീദ് & മറാഅ്</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">നിലവിലുള്ളത്:</span>
              <span>{form.partB?.thawheedMaraa?.existing || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">വിദ്യാർത്ഥികൾ:</span>
              <span>{form.partB?.thawheedMaraa?.students || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">പ്രവർത്തകരല്ലാത്തവർ:</span>
              <span>{form.partB?.thawheedMaraa?.nonWorkers || 0}</span>
            </div>
          </div>
        </div>
        <div>
          <h4 className="font-medium text-gray-700 mb-3">ജുമാ പള്ളികൾ</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">എണ്ണം:</span>
              <span>{form.partB?.jumaMosques?.count || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ശരാശരി പങ്കെടുക്കുന്നവർ:</span>
              <span>{form.partB?.jumaMosques?.averageAttendees || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">പ്രവർത്തകരല്ലാത്തവർ (ഏകദേശം):</span>
              <span>{form.partB?.jumaMosques?.nonWorkersApprox || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPartC = () => (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">ഭാഗം-സി (പൊതുവേദികൾ)</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(form.partC || {}).map(([platformName, platformData]) => (
          <div key={platformName} className="border border-gray-200 rounded-lg p-4">
            <h5 className="font-medium text-gray-800 mb-2 capitalize">{platformName.replace(/([A-Z])/g, ' $1').trim()}</h5>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">എണ്ണം:</span>
                <span>{platformData.count || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">സഹകരിക്കുന്ന മറ്റുള്ളവർ:</span>
                <span>{platformData.cooperatingOthers || 0}</span>
              </div>
              {platformData.remarks && (
                <div>
                  <span className="text-gray-600">അഭിപ്രായങ്ങൾ:</span>
                  <p className="text-sm mt-1">{platformData.remarks}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderPartD = () => (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">ഭാഗം-ഡി (പൊതുസംവിധാനങ്ങൾ)</h3>
      <div className="space-y-4">
        {/* Interest Free Systems */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-700 mb-3">1. പലിശരഹിത സംവിധാനം</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex justify-between">
              <span className="text-gray-600">എണ്ണം:</span>
              <span className="font-medium">{form.partD?.interestFreeSystems?.count || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">കഴിഞ്ഞ മൂന്ന് വർഷത്തിനിടയിൽ സഹായം സ്വീകരിച്ച മറ്റുള്ളവരുടെ എണ്ണം:</span>
              <span className="font-medium">{form.partD?.interestFreeSystems?.beneficiariesLast3Years || 0}</span>
            </div>
          </div>
        </div>

        {/* Zakat Committee */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-700 mb-3">2. സകാത്ത് കമ്മറ്റി</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex justify-between">
              <span className="text-gray-600">എണ്ണം:</span>
              <span className="font-medium">{form.partD?.zakatCommittee?.count || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">കഴിഞ്ഞ മൂന്ന് വർഷത്തിനിടയിൽ സഹായം സ്വീകരിച്ച മറ്റുള്ളവരുടെ എണ്ണം:</span>
              <span className="font-medium">{form.partD?.zakatCommittee?.beneficiariesLast3Years || 0}</span>
            </div>
          </div>
        </div>

        {/* Peoples Foundation Beneficiaries */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-700 mb-3">3. പീപ്പിൾസ് ഫൗണ്ടേഷനിൽ നിന്നും കഴിഞ്ഞ 3 വർഷത്തിനിടെ വ്യക്തിപരമായി സഹായം സ്വീകരിച്ച മറ്റുള്ളവർ</h4>
          <div className="flex justify-between">
            <span className="text-gray-600">എണ്ണം:</span>
            <span className="font-medium">{form.partD?.peoplesFoundationBeneficiaries || 0}</span>
          </div>
        </div>

        {/* Housing Project Beneficiaries */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-700 mb-3">4. ഹൗസിംഗ് പ്രൊജക്‌ടുകൾ, കുടിവെള്ളപദ്ധതികൾ തുടങ്ങിയ നമ്മുടെ സേവന പ്രൊജക്ടുകളുടെ കഴിഞ്ഞ 3 വർഷത്തിനിടെ ഗുണഭോക്താക്കളായ മറ്റുള്ളവർ</h4>
          <div className="flex justify-between">
            <span className="text-gray-600">എണ്ണം:</span>
            <span className="font-medium">{form.partD?.housingProjectBeneficiaries || 0}</span>
          </div>
        </div>

        {/* Baytul Zakat Beneficiaries */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-700 mb-3">5. ബൈത്തുസ്സകാത്തിൽ നിന്നും കഴിഞ്ഞ 3 വർഷത്തിനിടെ വ്യക്തിപരമായി സഹായം സ്വീകരിച്ച മറ്റുള്ളവർ</h4>
          <div className="flex justify-between">
            <span className="text-gray-600">എണ്ണം:</span>
            <span className="font-medium">{form.partD?.baytulZakatBeneficiaries || 0}</span>
          </div>
        </div>

        {/* Non Workers in Various Media */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-700 mb-3">മാധ്യമ വായനക്കാരിൽ പ്രവർത്തകരല്ലാത്തവർ</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex justify-between">
              <span className="text-gray-600">മാധ്യമം വായനക്കാരിൽ:</span>
              <span className="font-medium">{form.partD?.nonWorkersinMadhyamamReaders || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">പ്രബോധനം വായനക്കാരിൽ:</span>
              <span className="font-medium">{form.partD?.nonWorkersinPrabodhanamReaders || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ആരാമം വായനക്കാരിൽ:</span>
              <span className="font-medium">{form.partD?.nonWorkersinAaramamReaders || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ആയാത്ത് ദർസെ ഖുർആൻ ഉപയോഗിക്കുന്നവർ:</span>
              <span className="font-medium">{form.partD?.nonWorkersinAyahUsers || 0}</span>
            </div>
          </div>
        </div>

        {/* Areas */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-700 mb-3">10. നമ്മുടെ മഹല്ലുകൾ</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex justify-between">
              <span className="text-gray-600">നമ്മുടെ മഹല്ലുകൾ:</span>
              <span className="font-medium">{form.partD?.areas?.ourAreas || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">രജിസ്റ്റർ ചെയ്‌ത നമ്മുടെതല്ലാത്ത കുടുംബങ്ങൾ:</span>
              <span className="font-medium">{form.partD?.areas?.registeredNonOurFamilies || 0}</span>
            </div>
          </div>
        </div>

        {/* Other Fields */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-700 mb-3">മറ്റ് വിവരങ്ങൾ</h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex justify-between">
              <span className="text-gray-600">നമുക്ക് സ്വാധീനമുള്ള മറ്റു പൊതു മഹല്ലുകൾ:</span>
              <span className="font-medium">{form.partD?.influentialMahalls || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ഖുതുബ ശ്രവിക്കാൻ വരുന്നവർ (ഘടനയിൽ):</span>
              <span className="font-medium">{form.partD?.khutbaListenersfromOrganizedAreas || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ഖുതുബ ശ്രവിക്കാൻ വരുന്നവർ (ഘടനയില്ലാത്ത):</span>
              <span className="font-medium">{form.partD?.khutbaListenersfromNonOrganizedAreas || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ഫുൾടൈം പ്രവർത്തകർ:</span>
              <span className="font-medium">{form.partD?.FullTimeWorkers || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">പാർട് ടൈം പ്രവർത്തകർ:</span>
              <span className="font-medium">{form.partD?.PartTimeWorkers || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPartE = () => (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">ഭാഗം-ഇ (അധിക വിവരങ്ങൾ)</h3>
      <div className="space-y-4">
        {/* Areas Without Presence */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-700 mb-3">1. നമ്മുടെ സാന്നിദ്ധ്യമില്ലാത്ത മുസ്‌ലിം ഭൂരിപക്ഷ പ്രദേശങ്ങൾ</h4>
          <div className="space-y-2">
            <div>
              <span className="text-gray-600">വിവരങ്ങൾ:</span>
              <p className="text-gray-900 mt-1">{form.partE?.areasWithoutPresence?.description || 'N/A'}</p>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">തരം:</span>
              <span className="font-medium">{form.partE?.areasWithoutPresence?.type || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Panchayats Without Presence */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-700 mb-3">2. നമ്മുടെ സാന്നിദ്ധ്യമില്ലാത്ത പഞ്ചായത്തുകൾ/ മുനിസിപ്പാലിറ്റികൾ</h4>
          <div>
            <span className="text-gray-600">വിവരങ്ങൾ:</span>
            <p className="text-gray-900 mt-1">{form.partE?.panchayatsWithoutPresence || 'N/A'}</p>
          </div>
        </div>

        {/* New Components Last 5 Years */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-700 mb-3">3. കഴിഞ്ഞ 5 വർഷത്തിനിടയിൽ പുതുതായി ഉണ്ടായ ഘടകങ്ങളുടെ എണ്ണം</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">എണ്ണം:</span>
              <span className="font-medium">{form.partE?.newComponentsLast5Years?.count || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">തരം:</span>
              <span className="font-medium">{form.partE?.newComponentsLast5Years?.type || 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-600">വിശദ വിവരങ്ങൾ:</span>
              <p className="text-gray-900 mt-1">{form.partE?.newComponentsLast5Years?.details || 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Workers Growth in Last 5 Years */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-700 mb-3">4. കഴിഞ്ഞ 5 വർഷത്തിനിടയിൽ പ്രവർത്തകരുടെ വർധനവ്</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">വർധനവ് എണ്ണം:</span>
              <span className="font-medium">{form.partE?.workersGrowthInLast5Years?.count || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">വർധനവിന്റെ തരം:</span>
              <span className="font-medium">{form.partE?.workersGrowthInLast5Years?.type || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Components to Form in 6 Months */}
        <div className="border border-gray-200 rounded-lg p-4">
          <h4 className="font-medium text-gray-700 mb-3">5. 6 മാസത്തിനുള്ളിൽ രൂപീകരിക്കാൻ സാധിക്കുന്ന ഘടകങ്ങൾ</h4>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="flex justify-between">
              <span className="text-gray-600">JIH:</span>
              <span className="font-medium">{form.partE?.componentsToFormIn6Months?.jih || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">വനിത:</span>
              <span className="font-medium">{form.partE?.componentsToFormIn6Months?.vanitha || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Solidarity:</span>
              <span className="font-medium">{form.partE?.componentsToFormIn6Months?.solidarity || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">SIO:</span>
              <span className="font-medium">{form.partE?.componentsToFormIn6Months?.sio || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">GIO:</span>
              <span className="font-medium">{form.partE?.componentsToFormIn6Months?.gio || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">ടീൻ ഇന്ത്യ:</span>
              <span className="font-medium">{form.partE?.componentsToFormIn6Months?.teenIndia || 0}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">മലർവാടി:</span>
              <span className="font-medium">{form.partE?.componentsToFormIn6Months?.malarvadi || 0}</span>
            </div>
            <div className="flex justify-between">
                              <span className="text-gray-600">മലർവാടി:</span>
                              <span className="font-medium">{form.partE?.componentsToFormIn6Months?.malarvadi || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between py-4 sm:h-16 gap-4">
            <div className="flex items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
              <button
                onClick={onBack}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Go Back"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="flex items-center space-x-2 sm:space-x-3 flex-1 sm:flex-none">
                <img src={jihLogo} alt="JIH Logo" className="h-6 sm:h-8 w-auto" />
                <div>
                  <h1 className="text-base sm:text-lg font-semibold text-gray-900">ഫോം വിവരങ്ങൾ</h1>
                  <p className="text-xs sm:text-sm text-gray-500">{form.district}</p>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-center sm:justify-end">
              <button
                onClick={handleDownloadPDF}
                disabled={isDownloading}
                className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors text-xs sm:text-sm"
              >
                <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>{isDownloading ? 'ഡൗൺലോഡ് ചെയ്യുന്നു...' : 'PDF ഡൗൺലോഡ്'}</span>
              </button>
              <button
                onClick={() => onEdit(form)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors text-xs sm:text-sm"
              >
                <Edit className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Edit</span>
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg font-medium flex items-center space-x-2 transition-colors text-xs sm:text-sm"
              >
                <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Form Info Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">{form.district}</h2>
                                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>സമർപ്പിച്ചത് {new Date(form.submittedAt).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <User className="w-4 h-4" />
                      <span>ആക്സസ് കോഡ്: {form.submittedBy}</span>
                    </div>
                  </div>
              </div>
            </div>
          </div>
        </div>

        {/* Form Parts */}
        {renderPartA()}
        {renderPartB()}
        {renderPartC()}
        {renderPartD()}
        {renderPartE()}
      </main>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Form"
        message={`Are you sure you want to delete the form for ${form.district}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        type="danger"
      />
    </div>
  );
  };

  export default FormDetailPage;
