// export interface ServiceResponseType<T> {
//     Success: boolean;
//     ResponseType: string;
//     Data?: T;
//     Message?: string;
//   }
  
  export type ServiceSuccess<T> = {
    Success: true;
    Data: T;
    ResponseType : 'success';
  };
  
  export type ServiceError = {
    Success: false;
    Message: string;
    ResponseType : 'info' | 'error';
    Data? : any;
  };
  
  export type ServiceResponseType<T> = ServiceSuccess<T> | ServiceError;