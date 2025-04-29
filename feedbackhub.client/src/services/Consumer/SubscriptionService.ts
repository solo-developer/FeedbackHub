import { ApplicationDto } from '../../types/application/ApplicationDto';
import { ServiceResponseType } from '../../types/ServiceResponseType';
import api  from '../../utils/HttpMiddleware';
import { isSuccess, parseMessage, parseData, parseResponseType } from '../../utils/HttpResponseParser';

export const fetchApplicationsAsync = async (): Promise<ServiceResponseType<ApplicationDto[]>> => {
    try {
      const response = await api.get('/consumer/applications');
  
      if (isSuccess(response)) {
        return  {Success:true, Data: parseData<ApplicationDto[]>(response) } as ServiceResponseType<ApplicationDto[]>;
      } 
      else {
        return { Success: false,  ResponseType : parseResponseType(response), Message : parseMessage(response)} as ServiceResponseType<ApplicationDto[]>;
      }
    } catch (err) {
      return { Success: false, Message: 'Failed to load applications', ResponseType:'error' };
    }
  };
