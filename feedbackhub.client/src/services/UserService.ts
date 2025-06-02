import { faL } from '@fortawesome/free-solid-svg-icons';
import { ChangePasswordDto } from '../types/account/ChangePasswordDto';
import { CreateAdminUserDto } from '../types/account/CreateAdminUserDto';
import { ApplicationAccessDto, ClientUserDetailDto, UserProfileDto } from '../types/account/UserDetailDto';
import { UserFilterDto } from '../types/account/UserFilterDto';
import { GenericDropdownDto } from '../types/GenericDropdownDto';
import { PaginatedDataResponseDto } from '../types/PaginatedDataResponseDto';
import { ServiceResponseType } from '../types/ServiceResponseType';
import api from '../utils/HttpMiddleware';
import { isSuccess, parseMessage, parseData, parseResponseType } from '../utils/HttpResponseParser';


export const getUsersAsync = async (dto: UserFilterDto, isForExport: boolean = false): Promise<ServiceResponseType<PaginatedDataResponseDto<ClientUserDetailDto>>> => {
    try {
        const payload = {
            ...dto,
            isForExport, 
        };
        const response = await api.post('/users', payload);

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
            return { Success: true, ResponseType: parseResponseType(response), Data: parseData<any>(response) } as ServiceResponseType<any>;
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

export const getLoggedInUserInfoAsync = async (): Promise<ServiceResponseType<UserProfileDto>> => {
    try {
        const response = await api.get('/account/logged-in-user-info');

        if (isSuccess(response)) {
            return { Success: true, Data: parseData<UserProfileDto>(response) } as ServiceResponseType<UserProfileDto>;
        }
        else {
            return { Success: false, ResponseType: parseResponseType(response), Message: parseMessage(response) } as ServiceResponseType<UserProfileDto>;
        }
    } catch (err) {
        return { Success: false, Message: 'Failed to get user profile', ResponseType: 'error' };
    }
};

export const getUserOptions = async (includeDeleted: boolean = false): Promise<ServiceResponseType<GenericDropdownDto<number, string>[]>> => {
    try {
        const response = await api.get(`/user-options?includeDeleted=${includeDeleted}`);

        if (isSuccess(response)) {
            return { Success: true, Data: parseData<GenericDropdownDto<number, string>[]>(response) } as ServiceResponseType<GenericDropdownDto<number, string>[]>;
        }
        else {
            return { Success: false, ResponseType: parseResponseType(response), Message: parseMessage(response) } as ServiceResponseType<GenericDropdownDto<number, string>[]>;
        }
    } catch (err) {
        return { Success: false, Message: 'Failed to get user options', ResponseType: 'error' };
    }
};

export const updateAvatarAsync = async (dto: FormData): Promise<ServiceResponseType<any>> => {
    try {
        const response = await api.patch('/account/avatar', dto);

        if (isSuccess(response)) {
            return { Success: true, Data: parseData<any>(response) } as ServiceResponseType<any>;
        }
        else {
            return { Success: false, ResponseType: parseResponseType(response), Message: parseMessage(response) } as ServiceResponseType<any>;
        }
    } catch (err) {
        return { Success: false, Message: 'Failed to update avator', ResponseType: 'error' };
    }
};

export const updateApplicationAccessAsync = async (dto: ApplicationAccessDto): Promise<ServiceResponseType<any>> => {
    try {
        const response = await api.post('/user/application-access', dto);

        if (isSuccess(response)) {
            return { Success: true, Data: parseData<any>(response) } as ServiceResponseType<any>;
        }
        else {
            return { Success: false, ResponseType: parseResponseType(response), Message: parseMessage(response) } as ServiceResponseType<any>;
        }
    } catch (err) {
        return { Success: false, Message: 'Failed to update application access.', ResponseType: 'error' };
    }
};


