import { BoardFeedbackDto } from '../types/feedback/BoardFeedbackDto';
import { FilterOption } from '../types/feedback/DateFilterRange';
import { FeedbackAttachmentDto } from '../types/feedback/FeedbackAttachmentDto';
import { FeedbackBasicDetailDto, FeedbackDto } from '../types/feedback/FeedbackBasicDetailDto';
import { FeedbackCommentDto } from '../types/feedback/FeedbackCommentDto';
import { FeedbackCountDto } from '../types/feedback/FeedbackCount';
import { AdminFeedbackFilterDto, FeedbackFilterDto } from '../types/feedback/FeedbackFilterDto';
import { FeedbackRevisionDto } from '../types/feedback/FeedbackRevisionDto';
import { FeedbackStatusUpdateDto } from '../types/feedback/FeedbackStatusUpdateDto';
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


export const getFeedbackByIdAsync = async (id: number): Promise<ServiceResponseType<FeedbackDto>> => {
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

export const getCommentsAsync = async (feedbackId: number): Promise<ServiceResponseType<FeedbackCommentDto[]>> => {
    try {
        const response = await api.get(`/feedbacks/${feedbackId}/comments`);

        if (isSuccess(response)) {
            return { Success: true, Data: parseData<FeedbackCommentDto[]>(response) } as ServiceResponseType<FeedbackCommentDto[]>;
        }
        else {
            return { Success: false, ResponseType: parseResponseType(response), Message: parseMessage(response) } as ServiceResponseType<FeedbackCommentDto[]>;
        }
    } catch (err) {
        return { Success: false, Message: 'Failed to get comments', ResponseType: 'error' };
    }
};


export const getAttachmentsAsync = async (feedbackId: number): Promise<ServiceResponseType<FeedbackAttachmentDto[]>> => {
    try {
        const response = await api.get(`/feedbacks/${feedbackId}/attachments`);

        if (isSuccess(response)) {
            return { Success: true, Data: parseData<FeedbackAttachmentDto[]>(response) } as ServiceResponseType<FeedbackAttachmentDto[]>;
        }
        else {
            return { Success: false, ResponseType: parseResponseType(response), Message: parseMessage(response) } as ServiceResponseType<FeedbackAttachmentDto[]>;
        }
    } catch (err) {
        return { Success: false, Message: 'Failed to get attachments', ResponseType: 'error' };
    }
};


export const saveFeedbackAttachments = async (dto: FormData): Promise<ServiceResponseType<any>> => {
    try {
        const response = await api.post('/feedback/attachments', dto);

        if (isSuccess(response)) {
            return { Success: true } as ServiceResponseType<any>;
        }
        else {
            return { Success: false, ResponseType: parseResponseType(response), Message: parseMessage(response) } as ServiceResponseType<any>;
        }
    } catch (err) {
        return { Success: false, Message: 'Failed to upload attachments', ResponseType: 'error' };
    }
};

export const getFeedbacksCountAsync = async (dateRange: FilterOption): Promise<ServiceResponseType<FeedbackCountDto[]>> => {
    try {
        const response = await api.get(`/feedbacks/count?DateRange=${dateRange}`);

        if (isSuccess(response)) {
            return { Success: true, Data: parseData<FeedbackCountDto[]>(response) } as ServiceResponseType<FeedbackCountDto[]>;
        }
        else {
            return { Success: false, ResponseType: parseResponseType(response), Message: parseMessage(response) } as ServiceResponseType<FeedbackCountDto[]>;
        }
    } catch (err) {
        return { Success: false, Message: 'Failed to get feedback counts', ResponseType: 'error' };
    }
};

export const getBoardFeedbacksAsync = async (): Promise<ServiceResponseType<BoardFeedbackDto[]>> => {
    try {
        const response = await api.get(`/feedback/board`);

        if (isSuccess(response)) {
            return { Success: true, Data: parseData<BoardFeedbackDto[]>(response) } as ServiceResponseType<BoardFeedbackDto[]>;
        }
        else {
            return { Success: false, ResponseType: parseResponseType(response), Message: parseMessage(response) } as ServiceResponseType<BoardFeedbackDto[]>;
        }
    } catch (err) {
        return { Success: false, Message: 'Failed to get feedbacks', ResponseType: 'error' };
    }
};

export const getBoardBacklogsAsync = async (): Promise<ServiceResponseType<BoardFeedbackDto[]>> => {
    try {
        const response = await api.get(`/feedback/backlogs`);

        if (isSuccess(response)) {
            return { Success: true, Data: parseData<BoardFeedbackDto[]>(response) } as ServiceResponseType<BoardFeedbackDto[]>;
        }
        else {
            return { Success: false, ResponseType: parseResponseType(response), Message: parseMessage(response) } as ServiceResponseType<BoardFeedbackDto[]>;
        }
    } catch (err) {
        return { Success: false, Message: 'Failed to get feedbacks', ResponseType: 'error' };
    }
};


export const getRevisionsByFeedbackIdAsync = async (feedbackId : number): Promise<ServiceResponseType<FeedbackRevisionDto[]>> => {
    try {
        const response = await api.get(`/feedback/${feedbackId}/revisions`);

        if (isSuccess(response)) {
            return { Success: true, Data: parseData<FeedbackRevisionDto[]>(response) } as ServiceResponseType<FeedbackRevisionDto[]>;
        }
        else {
            return { Success: false, ResponseType: parseResponseType(response), Message: parseMessage(response) } as ServiceResponseType<FeedbackRevisionDto[]>;
        }
    } catch (err) {
        return { Success: false, Message: 'Failed to get revisions', ResponseType: 'error' };
    }
};


export const updateStatusAsync = async (dto: FeedbackStatusUpdateDto): Promise<ServiceResponseType<any>> => {
    try {
        const response = await api.patch('/feedback/status', dto);

        if (isSuccess(response)) {
            return { Success: true } as ServiceResponseType<any>;
        }
        else {
            return { Success: false, ResponseType: parseResponseType(response), Message: parseMessage(response) } as ServiceResponseType<any>;
        }
    } catch (err) {
        return { Success: false, Message: 'Failed to update status', ResponseType: 'error' };
    }
};
