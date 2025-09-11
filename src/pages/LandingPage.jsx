import React, { useState, useEffect } from 'react';
import { ArrowRight, Shield, FileText, Users, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import jihLogo from '../assets/jih-logo2.png';
import bismillah from '../assets/bismillah.png';

// Helper function to generate password hints
const getPasswordHint = (mode, selectedDistrict, selectedArea, selectedUnit, districts, areas, units) => {
  if (!selectedDistrict) return '';
  
  // Find the district object and get the actual name
  const districtObj = districts.find(d => d.id === selectedDistrict);
  const districtName = districtObj?.name || districtObj?.title || selectedDistrict;
  const districtCode = districtName.replace(/[^a-zA-Z0-9]/g, '').substring(0, 4);
  
  if (mode === 'district') {
    return `${districtCode.toLowerCase()}643259`;
  }
  
  if (mode === 'area' && selectedArea) {
    const areaData = areas.find(a => (a.id || a._id || a.code) === selectedArea);
    const areaName = areaData?.name || areaData?.title || selectedArea;
    const areaCode = areaName.replace(/[^a-zA-Z0-9]/g, '').substring(0, 4);
    return `${districtCode}_${areaCode}`;
  }
  
  if (mode === 'unit' && selectedArea && selectedUnit) {
    const areaData = areas.find(a => (a.id || a._id || a.code) === selectedArea);
    const unitData = units.find(u => (u.id || u._id || u.code) === selectedUnit);
    const areaName = areaData?.name || areaData?.title || selectedArea;
    const unitName = unitData?.name || unitData?.title || selectedUnit;
    const areaCode = areaName.replace(/[^a-zA-Z0-9]/g, '').substring(0, 4);
    const unitCode = unitName.replace(/[^a-zA-Z0-9]/g, '').substring(0, 5);
    return `${districtCode}_${areaCode}_${unitCode}`;
  }
  
  return '';
};

const LandingPage = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState('district'); // 'district' | 'area' | 'unit'
  const [districts, setDistricts] = useState([]);
  const [areas, setAreas] = useState([]);
  const [units, setUnits] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedUnit, setSelectedUnit] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(false);

  // Load districts on component mount
  useEffect(() => {
    loadDistricts();
    // Also set some test data immediately
    setDistricts([
      { id: 'Malappuram', name: 'Malappuram' },
      { id: 'Ernakulam', name: 'Ernakulam' },
      { id: 'Thiruvananthapuram', name: 'Thiruvananthapuram' },
      { id: 'Kozhikode', name: 'Kozhikode' }
    ]);
  }, []);

  const loadDistricts = async () => {
    try {
      console.log('Loading districts...');
      
      // Try new hierarchy endpoint first
      try {
        const resp = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/hierarchy/districts`);
        console.log('Hierarchy districts response:', resp.data.data.map(item => item.title));
        if (resp.data?.success && resp.data.data?.length > 0) {
           // Format data consistently
           const formattedDistricts = resp.data.data.map(item => ({
            id: item._id || item.id || item.title,
            name: item.title || item.name
          }));
          setDistricts(formattedDistricts);
          return;
        }
      } catch (hierarchyError) {
        console.log('Hierarchy endpoint failed, trying legacy:', hierarchyError.message);
      }
      
      // fallback to legacy endpoint
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/districts`);
      console.log('Legacy districts response:', response.data);
      const districtList = (response.data.districts || []).map(d => ({ id: d.name, name: d.name }));
      setDistricts(districtList);
      
    } catch (error) {
      console.error('Error loading districts:', error);
      // Set some default districts for testing
      setDistricts([
        { id: 'Malappuram', name: 'Malappuram' },
        { id: 'Ernakulam', name: 'Ernakulam' },
        { id: 'Thiruvananthapuram', name: 'Thiruvananthapuram' },
        { id: 'Kozhikode', name: 'Kozhikode' }
      ]);
    }
  };

  const loadAreas = async (districtId) => {
    try {
      if (!districtId) return setAreas([]);
      console.log('Loading areas for district:', districtId);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/hierarchy/areas/${encodeURIComponent(districtId)}`);
      console.log('Areas response:', response.data);
      if (response.data?.success) {
        setAreas(response.data.data || []);
      } else {
        // Set some default areas for testing
        setAreas([
          { id: 'Perinthalmanna', name: 'Perinthalmanna' },
          { id: 'Manjeri', name: 'Manjeri' },
          { id: 'Kondotty', name: 'Kondotty' }
        ]);
      }
    } catch (e) {
      console.error('Error loading areas:', e);
      // Set some default areas for testing
      setAreas([
        { id: 'Perinthalmanna', name: 'Perinthalmanna' },
        { id: 'Manjeri', name: 'Manjeri' },
        { id: 'Kondotty', name: 'Kondotty' }
      ]);
    }
  };

  const loadUnits = async (areaId) => {
    try {
      if (!areaId) return setUnits([]);
      console.log('Loading units for area:', areaId);
      const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user/hierarchy/units/${encodeURIComponent(areaId)}`);
      console.log('Units response:', response.data);
      if (response.data?.success) {
        setUnits(response.data.data || []);
      } else {
        // Set some default units for testing
        setUnits([
          { id: 'Kunnamkulam', name: 'Kunnamkulam' },
          { id: 'Wandoor', name: 'Wandoor' },
          { id: 'Edavanna', name: 'Edavanna' }
        ]);
      }
    } catch (e) {
      console.error('Error loading units:', e);
      // Set some default units for testing
      setUnits([
        { id: 'Kunnamkulam', name: 'Kunnamkulam' },
        { id: 'Wandoor', name: 'Wandoor' },
        { id: 'Edavanna', name: 'Edavanna' }
      ]);
    }
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (mode === 'district') {
        console.log(selectedDistrict);
        // Find the district name from the selected ID
      const selectedDistrictObj = districts.find(d => d.id === selectedDistrict);
      const districtName = selectedDistrictObj ? selectedDistrictObj.name : selectedDistrict;
        console.log(districtName)
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/login`, {
          district:districtName,
          accessCode: accessCode
        });
        localStorage.setItem('userToken', response.data.token);
        localStorage.setItem('userData', JSON.stringify({ ...response.data.user, role: 'district', districtId: selectedDistrict }));
        onLoginSuccess?.(); // Call before navigation
        navigate(`/district-dashboard/${encodeURIComponent(selectedDistrict)}`);
      } else if (mode === 'area') {
        console.log(selectedDistrict, selectedArea, accessCode);
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/login/area`, {
          districtId: selectedDistrict,
          areaId: selectedArea,
          accessCode
        });
        localStorage.setItem('userToken', response.data.token);
        localStorage.setItem('userData', JSON.stringify({ role: 'area', districtId: selectedDistrict, areaId: selectedArea }));
        onLoginSuccess?.(); // Call before navigation
        navigate(`/area-dashboard/${encodeURIComponent(selectedArea)}`);
      } else if (mode === 'unit') {
        const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/login/unit`, {
          districtId: selectedDistrict,
          areaId: selectedArea,
          unitId: selectedUnit,
          accessCode
        });
        localStorage.setItem('userToken', response.data.token);
        localStorage.setItem('userData', JSON.stringify({ role: 'unit', districtId: selectedDistrict, areaId: selectedArea, unitId: selectedUnit }));
        onLoginSuccess?.(); // Call before navigation
        navigate(`/unit-dashboard/${encodeURIComponent(selectedUnit)}`);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-center py-4 sm:py-6 gap-4">
            <div className="flex items-center space-x-2 sm:space-x-4">
              <img src={jihLogo} alt="JIH Logo" className="h-8 sm:h-12 w-auto" />
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 text-center sm:text-left">JIH Organisation Expansion</h1>
            </div>
            <button
              onClick={() => navigate('/admin-login')}
              className="bg-gray-800 hover:bg-gray-900 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors flex items-center space-x-2 text-sm sm:text-base"
            >
              <span>Admin Login</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Bismillah */}
        <div className="text-center mb-2">
          <img src={bismillah} alt="Bismillah" className="h-64 w-auto mx-auto mb-1" />
        </div>
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to the Organization Expansion Portal
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Access the secure form submission system to manage and submit organizational data. 
            Enter your access code to get started.
          </p>
        </div>

        {/* Access Section */}
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-6">
              <div className="flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mx-auto mb-4">
                <Shield className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Secure Access</h2>
              <p className="text-gray-600">Enter your access code to continue</p>
            </div>

            {!showLoginForm ? (
              <button
                onClick={() => setShowLoginForm(true)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
              >
                <span>Enter Code to Submit Forms</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            ) : (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                
                
                {/* Mode Selector */}
                <div className="grid grid-cols-3 gap-2">
                  {['district','area','unit'].map(m => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => {
                        setMode(m);
                        setSelectedArea('');
                        setSelectedUnit('');
                        setAccessCode('');
                        if (m !== 'district') {
                          // ensure we have districts
                          loadDistricts();
                        }
                      }}
                      className={`py-2 rounded-lg border ${mode===m?'bg-blue-600 text-white border-blue-600':'bg-gray-100 text-gray-800 border-gray-300'}`}
                    >
                      {m.charAt(0).toUpperCase()+m.slice(1)} Login
                    </button>
                  ))}
                </div>
                
                <div>
                  <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-2">
                    Select District
                  </label>
                  <select
                    id="district"
                    value={selectedDistrict}
                    onChange={async (e) => {
                      const val = e.target.value;
                      setSelectedDistrict(val);
                      setSelectedArea('');
                      setSelectedUnit('');
                      if (mode !== 'district') await loadAreas(val);
                    }}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-mono"
                    disabled={isLoading}
                  >
                    <option value="">Select a district</option>
     
                    {districts && districts.length > 0 ? (
                      districts.map((d, index) => {
                        const districtId = d.id || d.name || `district-${index}`;
                        const districtName = d.name || d.id || `District ${index + 1}`;
                        return (
                          <option key={districtId} value={districtId}>
                            {districtName}
                          </option>
                        );
                      })
                    ) : (
                      <option value="" disabled>No districts available</option>
                    )}
                  </select>
                </div>

                {mode !== 'district' && (
                  <div>
                    <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-2">
                      Select Area
                    </label>
                    <select
                      id="area"
                      value={selectedArea}
                      onChange={async (e) => {
                        const val = e.target.value;
                        setSelectedArea(val);
                        setSelectedUnit('');
                        if (mode === 'unit') await loadUnits(val);
                      }}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-mono"
                      disabled={isLoading || !selectedDistrict}
                    >
                      <option value="">Select an area</option>
                      {areas.map((a, index) => (
                        <option key={a.id || a._id || a.code || index} value={a.id || a._id || a.code}>{a.name || a.title || a.code}</option>
                      ))}
                    </select>
                  </div>
                )}

                {mode === 'unit' && (
                  <div>
                    <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-2">
                      Select Unit
                    </label>
                    <select
                      id="unit"
                      value={selectedUnit}
                      onChange={(e) => setSelectedUnit(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-mono"
                      disabled={isLoading || !selectedArea}
                    >
                      <option value="">Select a unit</option>
                      {units.map((u, index) => (
                        <option key={u.id || u._id || u.code || index} value={u.id || u._id || u.code}>{u.name || u.title || u.code}</option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label htmlFor="accessCode" className="block text-sm font-medium text-gray-700 mb-2">
                    Access Code
                    {/* Show password pattern explanation */}
                    {selectedDistrict && (
                      <span className="block text-xs text-blue-600 mt-1 font-normal">
                        {mode === 'district' && 'Pattern: first4letters643259'}
                        {mode === 'area' && 'Pattern: District_Area (first 4 letters each)'}
                        {mode === 'unit' && 'Pattern: District_Area_Unit (4+4+5 letters)'}
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    id="accessCode"
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    placeholder={
                      mode === 'district' 
                        ? 'Enter district access code' 
                        : mode === 'area' 
                          ? 'District_Area format'
                          : 'District_Area_Unit format'
                    }
                    maxLength={25}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg font-mono"
                    disabled={isLoading}
                  />
                  
                  {/* Show generated password hint */}
                  {getPasswordHint(mode, selectedDistrict, selectedArea, selectedUnit, districts, areas, units) && (
                    <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                      <div className="text-xs text-blue-700 mb-1">
                        Expected password format:
                      </div>
                      <div className="text-sm font-mono text-blue-800 bg-blue-100 px-2 py-1 rounded">
                        {getPasswordHint(mode, selectedDistrict, selectedArea, selectedUnit, districts, areas, units)}
                      </div>
                      <div className="text-xs text-blue-600 mt-1">
                        {mode === 'district' && 'First 4 letters of district + "643259"'}
                        {mode === 'area' && 'First 4 letters of district + "_" + First 4 letters of area'}
                        {mode === 'unit' && 'First 4 letters of district + "_" + First 4 letters of area + "_" + First 5 letters of unit'}
                      </div>
                    </div>
                  )}
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-600 text-sm font-medium">{error}</p>
                    {mode !== 'district' && (
                      <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-700">
                        <p className="font-medium text-gray-800 mb-1">Password Pattern Help:</p>
                        {mode === 'area' && (
                          <div>
                            <p>• Take first 4 letters of district name</p>
                            <p>• Add underscore "_"</p>
                            <p>• Add first 4 letters of area name</p>
                            <p className="text-blue-600 mt-1">Example: Malappuram + Perinthalmanna = Mala_Peri</p>
                          </div>
                        )}
                        {mode === 'unit' && (
                          <div>
                            <p>• Take first 4 letters of district name</p>
                            <p>• Add underscore "_"</p>
                            <p>• Add first 4 letters of area name</p>
                            <p>• Add underscore "_"</p>
                            <p>• Add first 5 letters of unit name</p>
                            <p className="text-blue-600 mt-1">Example: Malappuram + Perinthalmanna + Kunnamkulam = Mala_Peri_Kunna</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowLoginForm(false);
                      setSelectedDistrict('');
                      setSelectedArea('');
                      setSelectedUnit('');
                      setAccessCode('');
                      setError('');
                      setMode('district');
                    }}
                    className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 px-6 rounded-lg transition-colors"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={
                      isLoading ||
                      !selectedDistrict ||
                      !accessCode ||
                      (mode!=='district' && !selectedArea) ||
                      (mode==='unit' && !selectedUnit)
                    }
                    className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <span>Submit</span>
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-12">
          <p className="text-sm text-gray-500">
            Need help? Contact your system administrator for access codes
          </p>
        </div>
      </main>
    </div>
  );
};

export default LandingPage;