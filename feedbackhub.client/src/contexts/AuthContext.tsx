import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { jwtDecode } from 'jwt-decode';

interface AuthContextType {
  isAuthenticated: boolean;
  role: string | null;
  loading: boolean;
  setAuthState: (isAuthenticated: boolean, role: string | null) => void;
  setLoadingState: (loading: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);  // Initial loading state set to true

  useEffect(() => {
    // Check localStorage on mount to see if the user is already authenticated
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (accessToken && refreshToken) {
      // Here, you can decode the token if needed and get the role
      try {
        const decodedToken: any = jwtDecode(accessToken); // Ensure jwtDecode is imported
        setAuthState(true, decodedToken.Role);
      } catch (error) {
        console.error("Error decoding token:", error);
        setAuthState(false, null); // If the token is invalid, reset auth state
      }
    } else {
      setAuthState(false, null); // No tokens, set as unauthenticated
    }
  }, []);

  const setAuthState = (isAuthenticated: boolean, role: string | null) => {
    setIsAuthenticated(isAuthenticated);
    setRole(role);
    setLoading(false); // After setting auth state, stop loading
  };

  const setLoadingState = (loading: boolean) => {
    setLoading(loading);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, loading, setAuthState, setLoadingState }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
