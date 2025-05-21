import { BoardFeedbackDto } from '../types/feedback/BoardFeedbackDto';
import { FilterOption } from '../types/feedback/DateFilterRange';
import { FeedbackAttachmentDto } from '../types/feedback/FeedbackAttachmentDto';
import { FeedbackBasicDetailDto, FeedbackDto } from '../types/feedback/FeedbackBasicDetailDto';
import { FeedbackCommentDto } from '../types/feedback/FeedbackCommentDto';
import { FeedbackCountDto } from '../types/feedback/FeedbackCount';
import { AdminFeedbackFilterDto, FeedbackFilterDto } from '../types/feedback/FeedbackFilterDto';
import { FeedbackLinkDto } from '../types/feedback/FeedbackLinkDto';
import { FeedbackRevisionDto } from '../types/feedback/FeedbackRevisionDto';
import { FeedbackStatusUpdateDto } from '../types/feedback/FeedbackStatusUpdateDto';
import { FeedbackUpdateDto } from '../types/feedback/FeedbackUpdateDto';
import { LinkFeedbackDto, UnlinkFeedbackDto } from '../types/feedback/UnlinkFeedbackDto';
import { GenericDropdownDto } from '../types/GenericDropdownDto';
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

export const getLinkTypeOptions= async (): Promise<ServiceResponseType<GenericDropdownDto<number,string>[]>> => {
    try {
        const response = await api.get(`/feedback/link-type-options`);

        if (isSuccess(response)) {
            return { Success: true, Data: parseData<GenericDropdownDto<number,string>[]>(response) } as ServiceResponseType<GenericDropdownDto<number,string>[]>;
        }
        else {
            return { Success: false, ResponseType: parseResponseType(response), Message: parseMessage(response) } as ServiceResponseType<GenericDropdownDto<number,string>[]>;
        }
    } catch (err) {
        return { Success: false, Message: 'Failed to get link types', ResponseType: 'error' };
    }
};

export const getLinkedFeedbacksAsync = async (feedbackId:number): Promise<ServiceResponseType<FeedbackLinkDto[]>> => {
    try {
        const response = await api.get(`/feedback/${feedbackId}/linked-feedbacks`);

        if (isSuccess(response)) {
            return { Success: true, Data: parseData<FeedbackLinkDto[]>(response) } as ServiceResponseType<FeedbackLinkDto[]>;
        }
        else {
            return { Success: false, ResponseType: parseResponseType(response), Message: parseMessage(response) } as ServiceResponseType<FeedbackLinkDto[]>;
        }
    } catch (err) {
        return { Success: false, Message: 'Failed to get linked feedbacks', ResponseType: 'error' };
    }
};


export const linkFeedbackAsync = async (dto: LinkFeedbackDto): Promise<ServiceResponseType<any>> => {
    try {
        const response = await api.post('/feedback/link', dto);

        if (isSuccess(response)) {
            return { Success: true } as ServiceResponseType<any>;
        }
        else {
            return { Success: false, ResponseType: parseResponseType(response), Message: parseMessage(response) } as ServiceResponseType<any>;
        }
    } catch (err) {
        return { Success: false, Message: 'Failed to link feedback', ResponseType: 'error' };
    }
};

export const unlinkFeedbackAsync = async (linkId : number): Promise<ServiceResponseType<any>> => {
    try {
        const response = await api.delete(`/feedback/unlink?id=${linkId}`);

        if (isSuccess(response)) {
            return { Success: true } as ServiceResponseType<any>;
        }
        else {
            return { Success: false, ResponseType: parseResponseType(response), Message: parseMessage(response) } as ServiceResponseType<any>;
        }
    } catch (err) {
        return { Success: false, Message: 'Failed to unlink feedback', ResponseType: 'error' };
    }
};


export const getFeedbackByTicketIdAsync = async (ticketId:number): Promise<ServiceResponseType<FeedbackBasicDetailDto>> => {
    try {
        const response = await api.get(`/feedback/ticket-detail/${ticketId}`);

        if (isSuccess(response)) {
            return { Success: true, Data: parseData<FeedbackBasicDetailDto>(response) } as ServiceResponseType<FeedbackBasicDetailDto>;
        }
        else {
            return { Success: false, ResponseType: parseResponseType(response), Message: parseMessage(response) } as ServiceResponseType<FeedbackBasicDetailDto>;
        }
    } catch (err) {
        return { Success: false, Message: 'Failed to get ticket detail', ResponseType: 'error' };
    }
};