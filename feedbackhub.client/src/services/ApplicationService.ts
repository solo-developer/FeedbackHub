import { ApplicationDto } from '../types/application/ApplicationDto';
import { ServiceResponseType } from '../types/ServiceResponseType';
import api  from '../utils/HttpMiddleware';
import { isSuccess, parseMessage, parseData, parseResponseType } from '../utils/HttpResponseParser';

export const fetchApplications = async (): Promise<ServiceResponseType<ApplicationDto[]>> => {
    try {
      const response = await api.get('/applications');
  
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

export const saveApplicationAsync = async (dto: ApplicationDto): Promise<ServiceResponseType<any>> => {
    try {
        const response = await api.post('/application', dto);

        if (isSuccess(response)) {
            return { Success: true } as ServiceResponseType<any>;
        }
        else {
            return { Success: false, ResponseType: parseResponseType(response), Message: parseMessage(response) } as ServiceResponseType<any>;
        }
    } catch (err) {
        return { Success: false, Message: 'Failed to save application', ResponseType: 'error' };
    }
}; 

export const deleteApplicationAsync = async (id: number): Promise<ServiceResponseType<any>> => {
    try {
        const response = await api.delete(`/application/${id}`);

        if (isSuccess(response)) {
            return { Success: true } as ServiceResponseType<any>;
        }
        else {
            return { Success: false, ResponseType: parseResponseType(response), Message: parseMessage(response) } as ServiceResponseType<any>;
        }
    } catch (err) {
        return { Success: false, Message: 'Failed to delete application', ResponseType: 'error' };
    }
}; 