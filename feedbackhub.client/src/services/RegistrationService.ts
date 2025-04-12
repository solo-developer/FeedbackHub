import { RegistrationRequestDto } from '../types/account/RegistrationRequestDto';
import { ClientDto } from '../types/client/ClientDto';
import { ServiceResponseType } from '../types/ServiceResponseType';
import api  from '../utils/HttpMiddleware';
import { isSuccess, parseMessage, parseData, parseResponseType } from '../utils/HttpResponseParser';

export const requestRegistration = async (dto : RegistrationRequestDto): Promise<ServiceResponseType<any>> => {
    try {
      const response = await api.post('/registration-request',dto);
  
      if (isSuccess(response)) {
        return  {Success:true } as ServiceResponseType<ClientDto[]>;
      } 
      else {
        return { Success: false,  ResponseType : parseResponseType(response), Message : parseMessage(response)} as ServiceResponseType<ClientDto[]>;
      }
    } catch (err) {
      return { Success: false, Message: 'Failed to request registration', ResponseType:'error' };
    }
  };