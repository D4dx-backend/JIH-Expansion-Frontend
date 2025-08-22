import React, { createContext, useContext, useState, useCallback } from 'react';

const FormContext = createContext();

export const useForm = () => {
  const context = useContext(FormContext);
  if (!context) {
    throw new Error('useForm must be used within a FormProvider');
  }
  return context;
};

export const FormProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    district: '',
    partA: {
      totalPopulation: null,
      muslimPercentage: null,
      hinduPercentage: null,
      christianPercentage: null,
      othersPercentage: null,
      movementPercentage: null,
      majorityInReligiousOrganizations: '',
      secondPosition: '',
      thirdPosition: '',
      ourPosition: '',
      morePoliticalInfluence: ''
    },
    partB: {
      organizations: {
        jih: {
          totalAreas: null,
          components: null,
          workers2023: null,
          workers2025: null,
          components2023: null,
          components2025: null
        },
        vanitha: {
          totalAreas: null,
          components: null,
          workers2023: null,
          workers2025: null,
          components2023: null,
          components2025: null
        },
        solidarity: {
          totalAreas: null,
          components: null,
          workers2023: null,
          workers2025: null,
          components2023: null,
          components2025: null
        },
        sio: {
          totalAreas: null,
          components: null,
          workers2023: null,
          workers2025: null,
          components2023: null,
          components2025: null
        },
        gio: {
          totalAreas: null,
          components: null,
          workers2023: null,
          workers2025: null,
          components2023: null,
          components2025: null
        },
        malarvadi: {
          totalAreas: null,
          components: null,
          workers2023: null,
          workers2025: null,
          components2023: null,
          components2025: null
        },
        teenIndia: {
          totalAreas: null,
          components: null,
          workers2023: null,
          workers2025: null,
          components2023: null,
          components2025: null
        }
      },
      thawheedMaraa: {
        existing: null,
        students: null,
        nonWorkers: null
      },
      qscMen: {
        existing: null,
        students: null,
        nonWorkers: null
      },
      qscWomen: {
        existing: null,
        students: null,
        nonWorkers: null
      },
      jumaMosques: {
        count: null,
        averageAttendees: null,
        nonWorkersApprox: null
      },
      institutions: {
        madrasas: {
          count: null,
          studentsCount: null,
          staffWorkers: null,
          staffOthers: null,
          nonTeachingWorkers: null,
          nonTeachingOthers: null
        },
        schools: {
          count: null,
          studentsCount: null,
          staffWorkers: null,
          staffOthers: null,
          nonTeachingWorkers: null,
          nonTeachingOthers: null
        },
        heavens: {
          count: null,
          studentsCount: null,
          staffWorkers: null,
          staffOthers: null,
          nonTeachingWorkers: null,
          nonTeachingOthers: null
        },
        arabicColleges: {
          count: null,
          studentsCount: null,
          staffWorkers: null,
          staffOthers: null,
          nonTeachingWorkers: null,
          nonTeachingOthers: null
        },
        artsColleges: {
          count: null,
          studentsCount: null,
          staffWorkers: null,
          staffOthers: null,
          nonTeachingWorkers: null,
          nonTeachingOthers: null
        },
        mainCampuses: {
          count: null,
          studentsCount: null
        }
      }
    },
    partC: {
      friendshipPlatforms: {
        count: null,
        cooperatingOthers: null,
        remarks: ''
      },
      fridayClub: {
        count: null,
        cooperatingOthers: null,
        remarks: ''
      },
      wings: {
        count: null,
        cooperatingOthers: null,
        remarks: ''
      },
      neighborhoodGroups: {
        count: null,
        cooperatingOthers: null,
        remarks: ''
      },
      otherNGOs: {
        count: null,
        cooperatingOthers: null,
        remarks: ''
      },
      palliative: {
        count: null,
        cooperatingOthers: null,
        remarks: ''
      },
      otherActivities: {
        count: null,
        cooperatingOthers: null,
        remarks: ''
      }
    },
    partD: {
      interestFreeSystems: {
        count: null,
        beneficiariesLast3Years: null
      },
      zakatCommittee: {
        count: null,
        beneficiariesLast3Years: null
      },
      peoplesFoundationBeneficiaries: null,
      housingProjectBeneficiaries: null,
      baytulZakatBeneficiaries: null,
      nonWorkersinMadhyamamReaders: null,
      nonWorkersinPrabodhanamReaders: null,
      nonWorkersinAaramamReaders: null,
      nonWorkersinAyahUsers: null,
      areas: {
        ourAreas: null,
        registeredNonOurFamilies: null
      },
      influentialMahalls: null,
      khutbaListenersfromOrganizedAreas: null,
      khutbaListenersfromNonOrganizedAreas: null,
      FullTimeWorkers: null,
      PartTimeWorkers: null
    },
    partE: {
      areasWithoutPresence: {
        description: '',
        type: 'urban'
      },
      panchayatsWithoutPresence: '',
      newComponentsLast5Years: {
        count: null,
        type: 'urban',
        details: ''
      },
      workersGrowthInLast5Years: {
        count: null,
        type: 'personalConnections'
      },
      componentsToFormIn6Months: {
        jih: null,
        vanitha: null,
        solidarity: null,
        sio: null,
        gio: null,
        teenIndia: null,
        malarvadi: null
      }
    }
  });

  const [currentStep, setCurrentStep] = useState(1);

  const updateFormData = useCallback((part, data) => {
    setFormData(prev => {
      // If the part is a top-level property (like 'district'), update it directly
      if (part === 'district') {
        return {
          ...prev,
          district: data
        };
      }
      // Otherwise, treat it as a nested part
      return {
        ...prev,
        [part]: { ...prev[part], ...data }
      };
    });
  }, []);

  const setFormDataDirectly = useCallback((data) => {
    setFormData(data);
  }, []);

  const validateCurrentStep = useCallback(() => {
    switch (currentStep) {
      case 1: // Part A
        // Check if district is selected
        if (!formData.district) return false;
        
        // Check all numeric fields (including 0 as valid value)
        const numericFields = [
          'totalPopulation',
          'muslimPercentage', 
          'hinduPercentage',
          'christianPercentage',
          'othersPercentage',
          'movementPercentage'
        ];
        
        for (const field of numericFields) {
          if (formData.partA[field] === null || formData.partA[field] === undefined || formData.partA[field] === '') {
            return false;
          }
        }
        
        // Check all text fields
        const textFields = [
          'majorityInReligiousOrganizations',
          'secondPosition',
          'thirdPosition',
          'ourPosition',
          'morePoliticalInfluence'
        ];
        
        for (const field of textFields) {
          if (!formData.partA[field] || formData.partA[field].trim() === '') {
            return false;
          }
        }
        
        return true;

      case 2: // Part B
        // Check organizations table fields (excluding disabled fields)
        const organizations = ['jih', 'vanitha', 'solidarity', 'sio', 'gio', 'malarvadi', 'teenIndia'];
        const orgFields = ['totalAreas', 'components', 'workers2023', 'workers2025', 'components2023', 'components2025'];
        
        for (const org of organizations) {
          for (const field of orgFields) {
            // Skip totalAreas for malarvadi and teenIndia (disabled fields)
            if ((org === 'malarvadi' || org === 'teenIndia') && field === 'totalAreas') {
              continue;
            }
            
            if (formData.partB.organizations[org][field] === null || formData.partB.organizations[org][field] === undefined || formData.partB.organizations[org][field] === '') {
              return false;
            }
          }
        }
        
        // Check educational programs
        const eduPrograms = ['thawheedMaraa', 'qscMen', 'qscWomen'];
        const eduFields = ['existing', 'students', 'nonWorkers'];
        
        for (const program of eduPrograms) {
          for (const field of eduFields) {
            if (formData.partB[program][field] === null || formData.partB[program][field] === undefined || formData.partB[program][field] === '') {
              return false;
            }
          }
        }
        
        // Check juma mosques
        const jumaFields = ['count', 'averageAttendees', 'nonWorkersApprox'];
        for (const field of jumaFields) {
          if (formData.partB.jumaMosques[field] === null || formData.partB.jumaMosques[field] === undefined || formData.partB.jumaMosques[field] === '') {
            return false;
          }
        }
        
        // Check institutions (excluding count field and disabled fields in main campuses)
        const institutions = ['madrasas', 'schools', 'heavens', 'arabicColleges', 'artsColleges'];
        const institutionFields = ['studentsCount', 'staffWorkers', 'staffOthers', 'nonTeachingWorkers', 'nonTeachingOthers'];
        
        for (const institution of institutions) {
          for (const field of institutionFields) {
            if (formData.partB.institutions[institution][field] === null || formData.partB.institutions[institution][field] === undefined || formData.partB.institutions[institution][field] === '') {
              return false;
            }
          }
        }
        
        // Check main campuses (only studentsCount is required, other fields are disabled)
        if (formData.partB.institutions.mainCampuses.studentsCount === null || formData.partB.institutions.mainCampuses.studentsCount === undefined || formData.partB.institutions.mainCampuses.studentsCount === '') {
          return false;
        }
        
        return true;

      case 3: // Part C
        // Check all platforms
        const platforms = ['friendshipPlatforms', 'fridayClub', 'wings', 'neighborhoodGroups', 'otherNGOs', 'palliative', 'otherActivities'];
        const platformFields = ['count', 'cooperatingOthers'];
        
        for (const platform of platforms) {
          for (const field of platformFields) {
            if (formData.partC[platform][field] === null || formData.partC[platform][field] === undefined || formData.partC[platform][field] === '') {
              return false;
            }
          }
        }
        
        return true;

      case 4: // Part D
        // Check interest free systems
        if (formData.partD.interestFreeSystems.count === null || formData.partD.interestFreeSystems.count === undefined || formData.partD.interestFreeSystems.count === '') {
          return false;
        }
        if (formData.partD.interestFreeSystems.beneficiariesLast3Years === null || formData.partD.interestFreeSystems.beneficiariesLast3Years === undefined || formData.partD.interestFreeSystems.beneficiariesLast3Years === '') {
          return false;
        }
        
        // Check zakat committee
        if (formData.partD.zakatCommittee.count === null || formData.partD.zakatCommittee.count === undefined || formData.partD.zakatCommittee.count === '') {
          return false;
        }
        if (formData.partD.zakatCommittee.beneficiariesLast3Years === null || formData.partD.zakatCommittee.beneficiariesLast3Years === undefined || formData.partD.zakatCommittee.beneficiariesLast3Years === '') {
          return false;
        }
        
        // Check other numeric fields
        const partDFields = [
          'peoplesFoundationBeneficiaries',
          'housingProjectBeneficiaries',
          'baytulZakatBeneficiaries',
          'nonWorkersinMadhyamamReaders',
          'nonWorkersinPrabodhanamReaders',
          'nonWorkersinAaramamReaders',
          'nonWorkersinAyahUsers',
          'influentialMahalls',
          'khutbaListenersfromOrganizedAreas',
          'khutbaListenersfromNonOrganizedAreas',
          'FullTimeWorkers',
          'PartTimeWorkers'
        ];
        
        for (const field of partDFields) {
          if (formData.partD[field] === null || formData.partD[field] === undefined || formData.partD[field] === '') {
            return false;
          }
        }
        
        // Check areas
        if (formData.partD.areas.ourAreas === null || formData.partD.areas.ourAreas === undefined || formData.partD.areas.ourAreas === '') {
          return false;
        }
        if (formData.partD.areas.registeredNonOurFamilies === null || formData.partD.areas.registeredNonOurFamilies === undefined || formData.partD.areas.registeredNonOurFamilies === '') {
          return false;
        }
        
        return true;

      case 5: // Part E
        // Check areas without presence
        if (!formData.partE.areasWithoutPresence.description || formData.partE.areasWithoutPresence.description.trim() === '') {
          return false;
        }
        
        // Check panchayats without presence
        if (!formData.partE.panchayatsWithoutPresence || formData.partE.panchayatsWithoutPresence.trim() === '') {
          return false;
        }
        
        // Check new components last 5 years
        if (formData.partE.newComponentsLast5Years.count === null || formData.partE.newComponentsLast5Years.count === undefined || formData.partE.newComponentsLast5Years.count === '') {
          return false;
        }
        if (!formData.partE.newComponentsLast5Years.details || formData.partE.newComponentsLast5Years.details.trim() === '') {
          return false;
        }
        
        // Check workers growth in last 5 years
        if (formData.partE.workersGrowthInLast5Years.count === null || formData.partE.workersGrowthInLast5Years.count === undefined || formData.partE.workersGrowthInLast5Years.count === '') {
          return false;
        }
        
        // Check components to form in 6 months
        const componentOrgs = ['jih', 'vanitha', 'solidarity', 'sio', 'gio', 'teenIndia', 'malarvadi'];
        for (const org of componentOrgs) {
          if (formData.partE.componentsToFormIn6Months[org] === null || formData.partE.componentsToFormIn6Months[org] === undefined || formData.partE.componentsToFormIn6Months[org] === '') {
            return false;
          }
        }
        
        return true;

      default:
        return false;
    }
  }, [currentStep, formData.district, formData.partA, formData.partB, formData.partC, formData.partD, formData.partE]);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, 5));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      district: '',
      partA: {
        totalPopulation: null,
        muslimPercentage: null,
        hinduPercentage: null,
        christianPercentage: null,
        othersPercentage: null,
        movementPercentage: null,
        majorityInReligiousOrganizations: '',
        secondPosition: '',
        thirdPosition: '',
        ourPosition: '',
        morePoliticalInfluence: ''
      },
      partB: {
        organizations: {
          jih: { totalAreas: null, components: null, workers2023: null, workers2025: null, components2023: null, components2025: null },
          vanitha: { totalAreas: null, components: null, workers2023: null, workers2025: null, components2023: null, components2025: null },
          solidarity: { totalAreas: null, components: null, workers2023: null, workers2025: null, components2023: null, components2025: null },
          sio: { totalAreas: null, components: null, workers2023: null, workers2025: null, components2023: null, components2025: null },
          gio: { totalAreas: null, components: null, workers2023: null, workers2025: null, components2023: null, components2025: null },
          malarvadi: { totalAreas: null, components: null, workers2023: null, workers2025: null, components2023: null, components2025: null },
          teenIndia: { totalAreas: null, components: null, workers2023: null, workers2025: null, components2023: null, components2025: null }
        },
        thawheedMaraa: { existing: null, students: null, nonWorkers: null },
        qscMen: { existing: null, students: null, nonWorkers: null },
        qscWomen: { existing: null, students: null, nonWorkers: null },
        jumaMosques: { count: null, averageAttendees: null, nonWorkersApprox: null },
        institutions: {
          madrasas: { count: null, studentsCount: null, staffWorkers: null, staffOthers: null, nonTeachingWorkers: null, nonTeachingOthers: null },
          schools: { count: null, studentsCount: null, staffWorkers: null, staffOthers: null, nonTeachingWorkers: null, nonTeachingOthers: null },
          heavens: { count: null, studentsCount: null, staffWorkers: null, staffOthers: null, nonTeachingWorkers: null, nonTeachingOthers: null },
          arabicColleges: { count: null, studentsCount: null, staffWorkers: null, staffOthers: null, nonTeachingWorkers: null, nonTeachingOthers: null },
          artsColleges: { count: null, studentsCount: null, staffWorkers: null, staffOthers: null, nonTeachingWorkers: null, nonTeachingOthers: null },
          mainCampuses: { count: null, studentsCount: null }
        }
      },
      partC: {
        friendshipPlatforms: { count: null, cooperatingOthers: null, remarks: '' },
        fridayClub: { count: null, cooperatingOthers: null, remarks: '' },
        wings: { count: null, cooperatingOthers: null, remarks: '' },
        neighborhoodGroups: { count: null, cooperatingOthers: null, remarks: '' },
        otherNGOs: { count: null, cooperatingOthers: null, remarks: '' },
        palliative: { count: null, cooperatingOthers: null, remarks: '' },
        otherActivities: { count: null, cooperatingOthers: null, remarks: '' }
      },
      partD: {
        interestFreeSystems: { count: null, beneficiariesLast3Years: null },
        zakatCommittee: { count: null, beneficiariesLast3Years: null },
        peoplesFoundationBeneficiaries: null,
        housingProjectBeneficiaries: null,
        baytulZakatBeneficiaries: null,
        nonWorkersinMadhyamamReaders: null,
        nonWorkersinPrabodhanamReaders: null,
        nonWorkersinAaramamReaders: null,
        nonWorkersinAyahUsers: null,
        areas: { ourAreas: null, registeredNonOurFamilies: null },
        influentialMahalls: null,
        khutbaListenersfromOrganizedAreas: null,
        khutbaListenersfromNonOrganizedAreas: null,
        FullTimeWorkers: null,
        PartTimeWorkers: null
      },
      partE: {
        areasWithoutPresence: { description: '', type: 'urban' },
        panchayatsWithoutPresence: '',
        newComponentsLast5Years: { count: null, type: 'urban', details: '' },
        workersGrowthInLast5Years: { count: null, type: 'personalConnections' },
        componentsToFormIn6Months: { jih: null, vanitha: null, solidarity: null, sio: null, gio: null, teenIndia: null, malarvadi: null }
      }
    });
    setCurrentStep(1);
  }, []);

  const value = {
    formData,
    currentStep,
    updateFormData,
    setFormData: setFormDataDirectly,
    nextStep,
    prevStep,
    resetForm,
    validateCurrentStep
  };

  return (
    <FormContext.Provider value={value}>
      {children}
    </FormContext.Provider>
  );
};
