import React, { createContext, useContext, useState, useCallback } from 'react';

const DistrictFormContext = createContext();

export const useDistrictForm = () => {
  const context = useContext(DistrictFormContext);
  if (!context) {
    throw new Error('useDistrictForm must be used within a DistrictFormProvider');
  }
  return context;
};

export const DistrictFormProvider = ({ children, initialData }) => {
  const [formData, setFormData] = useState(initialData || {
    district: '',
    month: '',
    partA: {
      attendance: {
        jih: { present: null, leave: null, absent: null },
        vanitha: { present: null, leave: null, absent: null },
        solidarity: { present: null, leave: null, absent: null },
        sio: { present: null, leave: null, absent: null },
        gio: { present: null, leave: null, absent: null }
      }
    },
    partB: {
      focusAreas: {
        newAreaExpansionWorkshop: false,
        workerTraining: false,
        newAreaAgendaPreparation: false,
        fulltimeRecruitment: false,
        schoolGuardianClusterFormation: false,
        reliefBeneficiaryDataCollection: false,
        workerDeploymentToNewAreas: false,
        weeklyMeetingEffectiveness: false,
        khatibUtilization: false,
        madrasaMovementGrowthCalculation: false,
        schoolCenteredWork: false,
        staffHalkaFormation: false,
        islamicCollegeAlumniDiscovery: false,
        quranStudyCenterWork: false,
        artsScienceCampusLeadership: false,
        hajjUmrahGroupDiscovery: false,
        majorMuslimCenterStructure: false,
        weakAreaFinancialSupport: false,
        qscTeacherOrientation: false,
        khatibOrientation: false,
        institutionBearingOrientation: false,
        selectedWorkerTraining: false
      }
    },
    partC: {
      activities: {
        jih: { componentVisits: null },
        vanitha: { areaVisits: null },
        solidarity: { newComponentFormationAttempts: null },
        sio: { newPersonConnections: null },
        gio: { newPersonConnections: null }
      }
    },
    partD: {
      invitations: {
        male: null,
        female: null
      },
      categories: {
        personalConnection: false,
        literaryConnection: false,
        qscStudent: false,
        regularKhutbaListener: false,
        prabodhanamReader: false,
        pfBeneficiary: false,
        bzBeneficiary: false,
        localReliefBeneficiary: false,
        aaramamReader: false,
        thawheedulMaraStudent: false,
        madrasaAlumni: false,
        islamicCollegeAlumni: false,
        neighborhoodMember: false,
        palliativeConnection: false,
        friendsClubMember: false,
        mediaReader: false,
        ayahDarsQuranStudent: false,
        heavenGuardian: false,
        schoolGuardian: false,
        arabicCollegeGuardian: false,
        arabicCollegeStudent: false,
        artsCollegeStudent: false,
        artsCollegeGuardian: false,
        publicCampusStudent: false,
        otherNGOs: false,
        mahallConnection: false,
        fulltimeWorkerConnection: false
      }
    },
    partE: {
      wingGrowth: {
        jih: { newComponents: null, newMembers: null },
        vanitha: { newComponents: null, newMembers: null },
        solidarity: { newComponents: null, newMembers: null },
        sio: { newComponents: null, newMembers: null },
        gio: { newComponents: null, newMembers: null },
        teenIndia: { newComponents: null, newMembers: null },
        malarvadi: { newComponents: null, newMembers: null }
      }
    }
  });

  const [currentStep, setCurrentStep] = useState(1);

  const updateFormData = useCallback((part, data) => {
    setFormData(prev => {
      // If the part is a top-level property (like 'district', 'month'), update it directly
      if (part === 'district' || part === 'month') {
        return {
          ...prev,
          [part]: data
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

  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, 2)); // District form has 2 pages
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      district: '',
      month: '',
      partA: {
        attendance: {
          jih: { present: null, leave: null, absent: null },
          vanitha: { present: null, leave: null, absent: null },
          solidarity: { present: null, leave: null, absent: null },
          sio: { present: null, leave: null, absent: null },
          gio: { present: null, leave: null, absent: null }
        }
      },
      partB: {
        focusAreas: {
          newAreaExpansionWorkshop: false,
          workerTraining: false,
          newAreaAgendaPreparation: false,
          fulltimeRecruitment: false,
          schoolGuardianClusterFormation: false,
          reliefBeneficiaryDataCollection: false,
          workerDeploymentToNewAreas: false,
          weeklyMeetingEffectiveness: false,
          khatibUtilization: false,
          madrasaMovementGrowthCalculation: false,
          schoolCenteredWork: false,
          staffHalkaFormation: false,
          islamicCollegeAlumniDiscovery: false,
          quranStudyCenterWork: false,
          artsScienceCampusLeadership: false,
          hajjUmrahGroupDiscovery: false,
          majorMuslimCenterStructure: false,
          weakAreaFinancialSupport: false,
          qscTeacherOrientation: false,
          khatibOrientation: false,
          institutionBearingOrientation: false,
          selectedWorkerTraining: false
        }
      },
      partC: {
        activities: {
          jih: { componentVisits: null },
          vanitha: { areaVisits: null },
          solidarity: { newComponentFormationAttempts: null },
          sio: { newPersonConnections: null },
          gio: { newPersonConnections: null }
        }
      },
      partD: {
        invitations: {
          male: null,
          female: null
        },
        categories: {
          personalConnection: false,
          literaryConnection: false,
          qscStudent: false,
          regularKhutbaListener: false,
          prabodhanamReader: false,
          pfBeneficiary: false,
          bzBeneficiary: false,
          localReliefBeneficiary: false,
          aaramamReader: false,
          thawheedulMaraStudent: false,
          madrasaAlumni: false,
          islamicCollegeAlumni: false,
          neighborhoodMember: false,
          palliativeConnection: false,
          friendsClubMember: false,
          mediaReader: false,
          ayahDarsQuranStudent: false,
          heavenGuardian: false,
          schoolGuardian: false,
          arabicCollegeGuardian: false,
          arabicCollegeStudent: false,
          artsCollegeStudent: false,
          artsCollegeGuardian: false,
          publicCampusStudent: false,
          otherNGOs: false,
          mahallConnection: false,
          fulltimeWorkerConnection: false
        }
      },
      partE: {
        wingGrowth: {
          jih: { newComponents: null, newMembers: null },
          vanitha: { newComponents: null, newMembers: null },
          solidarity: { newComponents: null, newMembers: null },
          sio: { newComponents: null, newMembers: null },
          gio: { newComponents: null, newMembers: null },
          teenIndia: { newComponents: null, newMembers: null },
          malarvadi: { newComponents: null, newMembers: null }
        }
      }
    });
    setCurrentStep(1);
  }, []);

  const validateCurrentStep = useCallback(() => {
    switch (currentStep) {
      case 1:
        // Validate Part A, B, C
        return formData.district && formData.month;
      case 2:
        // Validate Part D, E
        return true; // Part D and E are optional
      default:
        return true;
    }
  }, [currentStep, formData]);

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
    <DistrictFormContext.Provider value={value}>
      {children}
    </DistrictFormContext.Provider>
  );
};
