import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

// Define the shape of the context
interface AuthContextType {
  isAuthenticated: boolean;
  role: string | null;
  loading: boolean;
  setAuthState: (isAuthenticated: boolean, role: string | null) => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // Simulate fetching from storage or an API
    const storedRole = localStorage.getItem("role");
    const storedAuth = localStorage.getItem("isAuthenticated") === "true";

    setIsAuthenticated(storedAuth);
    setRole(storedRole);
    setLoading(false);
  }, []);

  const setAuthState = (isAuth: boolean, role: string | null) => {
    setIsAuthenticated(isAuth);
    setRole(role);
    localStorage.setItem("isAuthenticated", String(isAuth));
    localStorage.setItem("role", role ?? "");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, role, loading, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for consuming the auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
