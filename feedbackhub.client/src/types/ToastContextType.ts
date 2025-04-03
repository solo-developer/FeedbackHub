import { ToastOptions } from 'react-toastify';

export interface ToastContextType 
{
    showToast: (message: string, type: "success" | "error" | "info" | "warning", options?: ToastOptions) => void;
}