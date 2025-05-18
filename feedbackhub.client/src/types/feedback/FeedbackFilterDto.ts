import { TicketStatus } from "./TicketStatus";

export interface FeedbackFilterDto {
    FromDate?: Date;
    ToDate?: Date;
    Skip: Number;
    Take: number;
    Status?: TicketStatus;
    FeedbackTypeId?: Number;
    Search?: string;
}

export interface AdminFeedbackFilterDto extends FeedbackFilterDto {
    UserId?: Number;
    ClientId?: Number;
    ApplicationId?: Number;

}