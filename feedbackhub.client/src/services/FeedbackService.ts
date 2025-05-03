import { FeedbackBasicDetailDto } from '../types/feedback/FeedbackBasicDetailDto';
import { FeedbackFilterDto } from '../types/feedback/FeedbackFilterDto';
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
      const response = await api.post('/feedbacks/open', dto);

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
