import { ToastOptions } from "react-toastify";
import { ServiceResponseType } from "../types/ServiceResponseType";
import { ToastContextType } from "../types/ToastContextType";

/**
 * Handles an API response by calling the passed showToast function.
 * @param response The API response.
 * @param showToast The function from your ToastContext (obtained via useToast()).
 * @param successMessage Custom success message to show on a successful response.
 * @param onSuccess Optional callback to run on success.
 */
export function handleApiResponse(
    response: ServiceResponseType<any>,
    showToast: (message: string, type: "info" | "error" | "success" | "warning", options?: ToastOptions<unknown> | undefined) => void,
    successMessage?: string,
    onSuccess?: () => void
) {
    if (response.Success) {
        onSuccess?.();
        if (successMessage) {
            showToast(successMessage, 'success', {
                autoClose: 3000,
                draggable: true,
            });
        }
    } else {
        showToast(response.Message, response.ResponseType || 'error', {
            autoClose: 3000,
            draggable: true,
        });
    }
}
