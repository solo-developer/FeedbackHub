import { ServiceResponseType } from "../types/ServiceResponseType";
import api from "../utils/HttpMiddleware";
import { isSuccess, parseMessage, parseResponseType } from "../utils/HttpResponseParser";



export const downloadAttachment = async (identifier : string, displayName : string): Promise<any> => {
    try {
        const response = await api.get(`/attachments/${identifier}/download`);

        if (true) {         

              const url = window.URL.createObjectURL(new Blob([response]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', displayName);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);

        }
        else {
            return { Success: false, ResponseType: parseResponseType(response), Message: parseMessage(response) } ;
        }
    } catch (err) {
        return { Success: false, Message: 'Failed to download attachments', ResponseType: 'error' };
    }
};


export const deleteAttachmentAsync = async (identifier: string): Promise<ServiceResponseType<any>> => {
    try {
        const response = await api.delete(`/attachments/${identifier}/remove`);

        if (isSuccess(response)) {
            return { Success: true } as ServiceResponseType<any>;
        }
        else {
            return { Success: false, ResponseType: parseResponseType(response), Message: parseMessage(response) } as ServiceResponseType<any>;
        }
    } catch (err) {
        return { Success: false, Message: 'Failed to remove attachment', ResponseType: 'error' };
    }
};
