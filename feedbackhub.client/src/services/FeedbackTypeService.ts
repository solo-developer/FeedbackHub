import { FeedbackTypeDto } from '../types/feedbacktype/FeedbackTypeDto';
import { ServiceResponseType } from '../types/ServiceResponseType';
import api  from '../utils/HttpMiddleware';
import { isSuccess, parseMessage, parseData, parseResponseType } from '../utils/HttpResponseParser';

export const getAllFeedbackTypesAsync = async (): Promise<ServiceResponseType<FeedbackTypeDto[]>> => {
    try {
      const response = await api.get('/feedback-type');
  
      if (isSuccess(response)) {
        return  {Success:true, Data: parseData<FeedbackTypeDto[]>(response) } as ServiceResponseType<FeedbackTypeDto[]>;
      } 
      else {
        return { Success: false,  ResponseType : parseResponseType(response), Message : parseMessage(response)} as ServiceResponseType<FeedbackTypeDto[]>;
      }
    } catch (err) {
      return { Success: false, Message: 'Failed to load feedback types', ResponseType:'error' };
    }
  };