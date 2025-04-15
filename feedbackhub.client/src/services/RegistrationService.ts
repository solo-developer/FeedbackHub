import { RegistrationRequestDto } from '../types/account/RegistrationRequestDto';
import { RegistrationRequestFilterDto } from '../types/account/RegistrationRequestFilterDto';
import { RegistrationSaveRequestDto } from '../types/account/RegistrationSaveRequestDto';
import { UserConversionDto } from '../types/account/UserConversionDto';
import { ClientDto } from '../types/client/ClientDto';
import { PaginatedDataResponseDto } from '../types/PaginatedDataResponseDto';
import { ServiceResponseType } from '../types/ServiceResponseType';
import api from '../utils/HttpMiddleware';
import { isSuccess, parseMessage, parseData, parseResponseType } from '../utils/HttpResponseParser';

export const requestRegistration = async (dto: RegistrationSaveRequestDto): Promise<ServiceResponseType<any>> => {
    try {
        const response = await api.post('/registration-request', dto);

        if (isSuccess(response)) {
            return { Success: true } as ServiceResponseType<ClientDto[]>;
        }
        else {
            return { Success: false, ResponseType: parseResponseType(response), Message: parseMessage(response) } as ServiceResponseType<ClientDto[]>;
        }
    } catch (err) {
        return { Success: false, Message: 'Failed to request registration', ResponseType: 'error' };
    }
};

export const convertToUser = async (dto: UserConversionDto): Promise<ServiceResponseType<any>> => {
    try {
        const response = await api.post('/registration-request/convert-to-user', dto);

        if (isSuccess(response)) {
            return { Success: true } as ServiceResponseType<any>;
        }
        else {
            return { Success: false, ResponseType: parseResponseType(response), Message: parseMessage(response) } as ServiceResponseType<any>;
        }
    } catch (err) {
        return { Success: false, Message: 'Failed to convert to user', ResponseType: 'error' };
    }
};

export const getAllAsync = async (dto: RegistrationRequestFilterDto): Promise<ServiceResponseType<PaginatedDataResponseDto<RegistrationRequestDto>>> => {
  try {
      const response = await api.post('/registration-requests', dto);

      if (isSuccess(response)) {
          return { Success: true, Data: parseData<PaginatedDataResponseDto<RegistrationRequestDto>>(response) } as ServiceResponseType<PaginatedDataResponseDto<RegistrationRequestDto>>;
      }
      else {
          return { Success: false, ResponseType: parseResponseType(response), Message: parseMessage(response) } as ServiceResponseType<PaginatedDataResponseDto<RegistrationRequestDto>>;
      }
  } catch (err) {
      return { Success: false, Message: 'Failed to get registration requests', ResponseType: 'error' };
  }
};