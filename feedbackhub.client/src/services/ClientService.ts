import { ClientDto } from '../types/client/ClientDto';
import { ServiceResponseType } from '../types/ServiceResponseType';
import api  from '../utils/HttpMiddleware';
import { isSuccess, parseMessage, parseData, parseResponseType } from '../utils/HttpResponseParser';

export const fetchClients = async (): Promise<ServiceResponseType<ClientDto[]>> => {
    try {
      const response = await api.get('/client');
  
      if (isSuccess(response)) {
        return  {Success:true, Data: parseData<ClientDto[]>(response) } as ServiceResponseType<ClientDto[]>;
      } 
      else {
        return { Success: false,  ResponseType : parseResponseType(response), Message : parseMessage(response)} as ServiceResponseType<ClientDto[]>;
      }
    } catch (err) {
      return { Success: false, Message: 'Failed to load client organizations', ResponseType:'error' };
    }
  };

  export const deleteClientAsync = async (clientId : number): Promise<ServiceResponseType<any>> => {
    try {
      const response = await api.delete(`/client/${clientId}`);
  
      if (isSuccess(response)) {
        return  {Success:true, Data: parseData<any>(response) } as ServiceResponseType<any>;
      } 
      else {
        return { Success: false,  ResponseType : parseResponseType(response), Message : parseMessage(response)} as ServiceResponseType<any>;
      }
    } catch (err) {
      return { Success: false, Message: 'Failed to delete client', ResponseType:'error' };
    }
  };