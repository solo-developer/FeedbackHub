import { SaveFeedbackDto } from '../../types/feedback/SaveFeedbackDto';
import { ServiceResponseType } from '../../types/ServiceResponseType';
import api from '../../utils/HttpMiddleware';
import { isSuccess, parseMessage, parseData, parseResponseType } from '../../utils/HttpResponseParser';

export const saveNewFeedbackAsync = async (dto: FormData): Promise<ServiceResponseType<any>> => {
    try {
        const response = await api.post('/feedback/new', dto);

        if (isSuccess(response)) {
            return { Success: true } as ServiceResponseType<any>;
        }
        else {
            return { Success: false, ResponseType: parseResponseType(response), Message: parseMessage(response) } as ServiceResponseType<any>;
        }
    } catch (err) {
        return { Success: false, Message: 'Failed to save feedback', ResponseType: 'error' };
    }
};
