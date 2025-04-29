import React, { createContext, useContext, useState, useEffect } from 'react';
import { ApplicationDto } from '../types/application/ApplicationDto';
import { fetchApplicationsAsync } from '../services/Consumer/SubscriptionService';
import { useToast } from '../contexts/ToastContext';

interface AppSwitcherContextType {
  selectedApp?: ApplicationDto;
  apps: ApplicationDto[];
  setSelectedApp: (app: ApplicationDto) => void;
}

const AppSwitcherContext = createContext<AppSwitcherContextType | undefined>(undefined);

export const AppSwitcherProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedApp, setSelectedApp] = useState<ApplicationDto>();
  const [apps, setApps] = useState<ApplicationDto[]>([]);
  const { showToast } = useToast();
  const fetchApps = async () => {
    try {
      const res = await fetchApplicationsAsync();
      if (res.Success) {
        setApps(res.Data);
        setSelectedApp(res.Data[0]);
      } else {
        showToast(res.Message, res.ResponseType);
      }
    } catch {
      showToast('Failed to load applications', 'error');
    }
  };
  useEffect(() => {   

    fetchApps();
  }, []);

  return (
    <AppSwitcherContext.Provider value={{ selectedApp, setSelectedApp, apps }}>
      {children}
    </AppSwitcherContext.Provider>
  );
};

export const useAppSwitcher = () => {
  const context = useContext(AppSwitcherContext);
  if (!context) {
    throw new Error('useAppSwitcher must be used within AppSwitcherProvider');
  }
  return context;
};
