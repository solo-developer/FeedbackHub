import { useNavigate } from "react-router-dom";

export const handleLogout = (navigate: (path: string) => void) => {
    localStorage.clear();
    navigate('/login');
  };