import { AxiosResponse } from "axios";

type AllowedResponseTypes = 'success' | 'info' | 'error';

export const isSuccess = (axiosResponse : AxiosResponse<any,any>) : boolean=> {
    return axiosResponse.data.ResponseMessageType==="Success";
}

export const isError = (axiosResponse : AxiosResponse<any,any>) : boolean => {
    return axiosResponse.data.ResponseMessageType==="Error";
}

export const isInfo = (axiosResponse : AxiosResponse<any,any>) : boolean => {
    return axiosResponse.data.ResponseMessageType==="Info";
}

export const parseData = <T>(axiosResponse: AxiosResponse<any, any>): T => {

    return axiosResponse.data.Data as T;
}

export const parseMessage= (axiosResponse : AxiosResponse<any,any>) : string => {
    return axiosResponse.data.Message as string;
}

export const parseResponseType = (axiosResponse: AxiosResponse<any, any>): AllowedResponseTypes => {

    const responseMessageType = (axiosResponse.data.ResponseMessageType as string).toLowerCase();
  
    if (responseMessageType === 'success' || responseMessageType === 'error' || responseMessageType === 'info') {
      return responseMessageType;  
    } else {
      throw new Error(`Unexpected ResponseMessageType: ${responseMessageType}`);
    }
  }