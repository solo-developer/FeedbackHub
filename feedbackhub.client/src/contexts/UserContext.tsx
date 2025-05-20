import React, { createContext, useContext, useState, useEffect } from 'react';
import { getLoggedInUserInfoAsync } from '../services/UserService';
import { UserProfileDto } from '../types/account/UserDetailDto';
import { useToast } from './ToastContext';

interface UserContextType {
  user: UserProfileDto | null;
  setUser: (user: UserProfileDto) => void;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfileDto | null>(null);
  const { showToast } = useToast();

  const fetchUser = async () => {
    try {
      const response = await getLoggedInUserInfoAsync();
      if (response.Success) {
        setUser(response.Data);
      } else {
        showToast(response.Message, response.ResponseType);
      }
    } catch {
      showToast('Failed to load user profile', 'error');
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, refreshUser: fetchUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error('useUser must be used within a UserProvider');
  return context;
};
