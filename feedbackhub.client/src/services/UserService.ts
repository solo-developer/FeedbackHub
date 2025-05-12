import { ChangePasswordDto } from '../types/account/ChangePasswordDto';
import { CreateAdminUserDto } from '../types/account/CreateAdminUserDto';
import { ClientUserDetailDto, UserDetailDto } from '../types/account/UserDetailDto';
import { UserFilterDto } from '../types/account/UserFilterDto';
import { PaginatedDataResponseDto } from '../types/PaginatedDataResponseDto';
import { ServiceResponseType } from '../types/ServiceResponseType';
import api from '../utils/HttpMiddleware';
import { isSuccess, parseMessage, parseData, parseResponseType } from '../utils/HttpResponseParser';


export const getUsersAsync = async (dto: UserFilterDto): Promise<ServiceResponseType<PaginatedDataResponseDto<ClientUserDetailDto>>> => {
  try {
      const response = await api.post('/users', dto);

      if (isSuccess(response)) {
          return { Success: true, Data: parseData<PaginatedDataResponseDto<ClientUserDetailDto>>(response) } as ServiceResponseType<PaginatedDataResponseDto<ClientUserDetailDto>>;
      }
      else {
          return { Success: false, ResponseType: parseResponseType(response), Message: parseMessage(response) } as ServiceResponseType<PaginatedDataResponseDto<ClientUserDetailDto>>;
      }
  } catch (err) {
      return { Success: false, Message: 'Failed to get users', ResponseType: 'error' };
  }
};

export const deleteUserAsync = async (userId: number): Promise<ServiceResponseType<any>> => {
    try {
        const response = await api.delete(`/users/${userId}`);
  
        if (isSuccess(response)) {
            return { Success: true, Data: parseData<any>(response) } as ServiceResponseType<any>;
        }
        else {
            return { Success: false, ResponseType: parseResponseType(response), Message: parseMessage(response) } as ServiceResponseType<any>;
        }
    } catch (err) {
        return { Success: false, Message: 'Failed to delete user', ResponseType: 'error' };
    }
  };

  
export const undoDeleteUserAsync = async (userId: number): Promise<ServiceResponseType<any>> => {
    try {
        const response = await api.patch(`/users/${userId}/restore`);
  
        if (isSuccess(response)) {
            return { Success: true, Data: parseData<any>(response) } as ServiceResponseType<any>;
        }
        else {
            return { Success: false, ResponseType: parseResponseType(response), Message: parseMessage(response) } as ServiceResponseType<any>;
        }
    } catch (err) {
        return { Success: false, Message: 'Failed to restore user', ResponseType: 'error' };
    }
  };

  
  export const resetPasswordAsync = async (userId: number): Promise<ServiceResponseType<any>> => {
    try {
        const response = await api.patch(`/users/${userId}/reset-password`);
  
        if (isSuccess(response)) {
            return { Success: true, Data: parseData<any>(response) } as ServiceResponseType<any>;
        }
        else {
            return { Success: false, ResponseType: parseResponseType(response), Message: parseMessage(response) } as ServiceResponseType<any>;
        }
    } catch (err) {
        return { Success: false, Message: 'Failed to reset password', ResponseType: 'error' };
    }
  };


  export const createAdminUserAsync = async (dto: CreateAdminUserDto): Promise<ServiceResponseType<any>> => {
    try {
        const response = await api.post('/admin/user', dto);
  
        if (isSuccess(response)) {
            return { Success: true, Data: parseData<any>(response) } as ServiceResponseType<any>;
        }
        else {
            return { Success: false, ResponseType: parseResponseType(response), Message: parseMessage(response) } as ServiceResponseType<any>;
        }
    } catch (err) {
        return { Success: false, Message: 'Failed to create user', ResponseType: 'error' };
    }
  };

  
  export const changePasswordAsync = async (dto: ChangePasswordDto): Promise<ServiceResponseType<any>> => {
    try {
        const response = await api.post('/account/change-password', dto);
  
        if (isSuccess(response)) {
            return { Success: true, Data: parseData<any>(response) } as ServiceResponseType<any>;
        }
        else {
            return { Success: false, ResponseType: parseResponseType(response), Message: parseMessage(response) } as ServiceResponseType<any>;
        }
    } catch (err) {
        return { Success: false, Message: 'Failed to change password', ResponseType: 'error' };
    }
  };