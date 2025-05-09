import { FeedbackBasicDetailDto, FeedbackDto } from '../types/feedback/FeedbackBasicDetailDto';
import { FeedbackCommentDto } from '../types/feedback/FeedbackCommentDto';
import { AdminFeedbackFilterDto, FeedbackFilterDto } from '../types/feedback/FeedbackFilterDto';
import { FeedbackUpdateDto } from '../types/feedback/FeedbackUpdateDto';
import { PaginatedDataResponseDto } from '../types/PaginatedDataResponseDto';
import { ServiceResponseType } from '../types/ServiceResponseType';
import api from '../utils/HttpMiddleware';
import { isSuccess, parseMessage, parseData, parseResponseType } from '../utils/HttpResponseParser';

export const saveNewFeedbackAsync = async (dto: FormData): Promise<ServiceResponseType<any>> => {
    try {
        const response = await api.post('/feedback/new', dto);

        if (isSuccess(response)) {
            return { Success: true } as ServiceResponseType<any>;
        }
        else {
            return { Success: false, ResponseType: parseResponseType(response), Message: parseMessage(response) } as ServiceResponseType<any>;
        }
    } catch (err) {
        return { Success: false, Message: 'Failed to save feedback', ResponseType: 'error' };
    }
};

export const getAsync = async (dto: FeedbackFilterDto): Promise<ServiceResponseType<PaginatedDataResponseDto<FeedbackBasicDetailDto>>> => {
  try {
      const response = await api.post('/feedbacks', dto);

      if (isSuccess(response)) {
          return { Success: true, Data: parseData<PaginatedDataResponseDto<FeedbackBasicDetailDto>>(response) } as ServiceResponseType<PaginatedDataResponseDto<FeedbackBasicDetailDto>>;
      }
      else {
          return { Success: false, ResponseType: parseResponseType(response), Message: parseMessage(response) } as ServiceResponseType<PaginatedDataResponseDto<FeedbackBasicDetailDto>>;
      }
  } catch (err) {
      return { Success: false, Message: 'Failed to get feedbacks', ResponseType: 'error' };
  }
};

export const getForAdminAsync = async (dto: AdminFeedbackFilterDto): Promise<ServiceResponseType<PaginatedDataResponseDto<FeedbackBasicDetailDto>>> => {
    try {
        const response = await api.post('/admin/feedbacks', dto);
  
        if (isSuccess(response)) {
            return { Success: true, Data: parseData<PaginatedDataResponseDto<FeedbackBasicDetailDto>>(response) } as ServiceResponseType<PaginatedDataResponseDto<FeedbackBasicDetailDto>>;
        }
        else {
            return { Success: false, ResponseType: parseResponseType(response), Message: parseMessage(response) } as ServiceResponseType<PaginatedDataResponseDto<FeedbackBasicDetailDto>>;
        }
    } catch (err) {
        return { Success: false, Message: 'Failed to get feedbacks', ResponseType: 'error' };
    }
  };

  
export const getFeedbackByIdAsync = async (id:number): Promise<ServiceResponseType<FeedbackDto>> => {
    try {
        const response = await api.get(`/feedback/${id}`);
  
        if (isSuccess(response)) {
            return { Success: true, Data: parseData<FeedbackDto>(response) } as ServiceResponseType<FeedbackDto>;
        }
        else {
            return { Success: false, ResponseType: parseResponseType(response), Message: parseMessage(response) } as ServiceResponseType<FeedbackDto>;
        }
    } catch (err) {
        return { Success: false, Message: 'Failed to get feedback detail', ResponseType: 'error' };
    }
  };

  
export const updateFeedbackAsync = async (dto: FeedbackUpdateDto): Promise<ServiceResponseType<any>> => {
    try {
        const response = await api.post('/feedback/update', dto);

        if (isSuccess(response)) {
            return { Success: true } as ServiceResponseType<any>;
        }
        else {
            return { Success: false, ResponseType: parseResponseType(response), Message: parseMessage(response) } as ServiceResponseType<any>;
        }
    } catch (err) {
        return { Success: false, Message: 'Failed to update feedback', ResponseType: 'error' };
    }
};

 
export const addFeedbackCommentAsync = async (dto: any): Promise<ServiceResponseType<any>> => {
    try {
        const response = await api.post('/feedback/comment', dto);

        if (isSuccess(response)) {
            return { Success: true } as ServiceResponseType<any>;
        }
        else {
            return { Success: false, ResponseType: parseResponseType(response), Message: parseMessage(response) } as ServiceResponseType<any>;
        }
    } catch (err) {
        return { Success: false, Message: 'Failed to save comment', ResponseType: 'error' };
    }
};

export const getCommentsAsync = async (feedbackId: number): Promise<ServiceResponseType<PaginatedDataResponseDto<FeedbackCommentDto>>> => {
    try {
        const response = await api.get(`/feedbacks/${feedbackId}/comments`);
  
        if (isSuccess(response)) {
            return { Success: true, Data: parseData<PaginatedDataResponseDto<FeedbackCommentDto>>(response) } as ServiceResponseType<PaginatedDataResponseDto<FeedbackCommentDto>>;
        }
        else {
            return { Success: false, ResponseType: parseResponseType(response), Message: parseMessage(response) } as ServiceResponseType<PaginatedDataResponseDto<FeedbackCommentDto>>;
        }
    } catch (err) {
        return { Success: false, Message: 'Failed to get comments', ResponseType: 'error' };
    }
  };

