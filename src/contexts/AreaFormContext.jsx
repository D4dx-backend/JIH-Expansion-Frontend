import React, { createContext, useContext, useState, useCallback } from 'react';

const AreaFormContext = createContext();

export const useAreaForm = () => {
  const context = useContext(AreaFormContext);
  if (!context) {
    throw new Error('useAreaForm must be used within an AreaFormProvider');
  }
  return context;
};

export const AreaFormProvider = ({ children, initialData }) => {
  const [formData, setFormData] = useState(initialData || {
    district: '',
    area: '',
    month: '',
    partA: {
      pj: null,
      kh: null,
      vkh: null
    },
    partB: {
      monthlyMeeting: '',
      wingAttendance: {
        jih: { present: null, leave: null, absent: null },
        vanitha: { present: null, leave: null, absent: null },
        solidarity: { present: null, leave: null, absent: null },
        sio: { present: null, leave: null, absent: null },
        gio: { present: null, leave: null, absent: null }
      },
      mainDecisions: []
    },
    partC: {
      expansionActivities: {
        newAreaWorkshop: false,
        workerTraining: false,
        newAreaAgenda: false,
        fulltimeRecruitment: false,
        schoolGuardianCluster: false,
        reliefDataCollection: false,
        workerDeployment: false,
        weeklyMeetingEffectiveness: false,
        hajjUmrahGroup: false,
        artsScienceCampus: false,
        madrasaGrowthCalculation: false,
        schoolCenteredWork: false,
        staffHalkaFormation: false,
        islamicCollegeAlumni: false,
        quranStudyCenterWork: false
      }
    },
    partD: {
      activities: []
    },
    partE: {
      male: null,
      female: null,
      categories: {
        personalConnection: false,
        literaryConnection: false,
        qscStudent: false,
        regularKhutbaListener: false,
        prabodhanamReader: false,
        jaBeneficiary: false,
        adaBeneficiary: false,
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
    partF: {
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
      // If the part is a top-level property (like 'district', 'area', 'month'), update it directly
      if (part === 'district' || part === 'area' || part === 'month') {
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

  const validateCurrentStep = useCallback(() => {
    switch (currentStep) {
      case 1: // Part A
        // Check if district, area, and month are selected
        if (!formData.district || !formData.area || !formData.month) return false;
        
        // Check all numeric fields (including 0 as valid value)
        const numericFields = ['pj', 'kh', 'vkh'];
        
        for (const field of numericFields) {
          if (formData.partA[field] === null || formData.partA[field] === undefined || formData.partA[field] === '') {
            return false;
          }
        }
        
        return true;

      case 2: // Part B
        // Check monthly meeting
        if (!formData.partB.monthlyMeeting) return false;
        
        // Check wing attendance (at least one field should be filled for each wing)
        const wings = ['jih', 'vanitha', 'solidarity', 'sio', 'gio'];
        for (const wing of wings) {
          const attendance = formData.partB.wingAttendance[wing];
          if (!attendance || 
              (attendance.present === null && attendance.leave === null && attendance.absent === null)) {
            return false;
          }
        }
        
        return true;

      case 3: // Part C - Focus Areas (expansion activities)
        // Check if at least one expansion activity is selected
        const expansionActivities = formData.partC.expansionActivities;
        const hasSelectedActivity = Object.values(expansionActivities).some(activity => activity === true);
        if (!hasSelectedActivity) return false;
        
        return true;

      case 4: // Part D - Area Team Activities
        // Check if at least one activity is added
        if (!formData.partD.activities || formData.partD.activities.length === 0) return false;
        
        return true;

      case 5: // Part E - New Person Discovery
        // Check if male and female counts are provided
        if (formData.partE.male === null || formData.partE.male === undefined || formData.partE.male === '') {
          return false;
        }
        if (formData.partE.female === null || formData.partE.female === undefined || formData.partE.female === '') {
          return false;
        }
        
        return true;

      case 6: // Part F - Growth Data
        // Check wing growth (at least one field should be filled for each wing)
        const wingKeys = ['jih', 'vanitha', 'solidarity', 'sio', 'gio', 'teenIndia', 'malarvadi'];
        for (const wing of wingKeys) {
          const growth = formData.partF.wingGrowth[wing];
          if (!growth || 
              (growth.newComponents === null && growth.newMembers === null)) {
            return false;
          }
        }
        
        return true;

      default:
        return false;
    }
  }, [currentStep, formData]);

  const nextStep = useCallback(() => {
    setCurrentStep(prev => Math.min(prev + 1, 6));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  }, []);

  const resetForm = useCallback(() => {
    setFormData({
      district: '',
      area: '',
      month: '',
      partA: {
        pj: null,
        kh: null,
        vkh: null
      },
      partB: {
        monthlyMeeting: '',
        wingAttendance: {
          jih: { present: null, leave: null, absent: null },
          vanitha: { present: null, leave: null, absent: null },
          solidarity: { present: null, leave: null, absent: null },
          sio: { present: null, leave: null, absent: null },
          gio: { present: null, leave: null, absent: null }
        },
        mainDecisions: []
      },
      partC: {
        expansionActivities: {
          newAreaWorkshop: false,
          workerTraining: false,
          newAreaAgenda: false,
          fulltimeRecruitment: false,
          schoolGuardianCluster: false,
          reliefDataCollection: false,
          workerDeployment: false,
          weeklyMeetingEffectiveness: false,
          hajjUmrahGroup: false,
          artsScienceCampus: false,
          madrasaGrowthCalculation: false,
          schoolCenteredWork: false,
          staffHalkaFormation: false,
          islamicCollegeAlumni: false,
          quranStudyCenterWork: false
        }
      },
      partD: {
        activities: []
      },
      partE: {
        male: null,
        female: null,
        categories: {
          personalConnection: false,
          literaryConnection: false,
          qscStudent: false,
          regularKhutbaListener: false,
          prabodhanamReader: false,
          jaBeneficiary: false,
          adaBeneficiary: false,
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
      partF: {
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
    <AreaFormContext.Provider value={value}>
      {children}
    </AreaFormContext.Provider>
  );
};
