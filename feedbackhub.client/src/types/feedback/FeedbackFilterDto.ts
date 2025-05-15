import { TicketStatus } from "./TicketStatus";

export interface FeedbackFilterDto{
    FromDate? : Date;
    ToDate? : Date;
    Skip: Number;
    Take: number;
    Status? : TicketStatus;
}

export interface AdminFeedbackFilterDto extends FeedbackFilterDto{
    Search: string;
    UserId? : Number;
    ClientId? : Number;
    ApplicationId? : Number;
    FeedbackTypeId? : Number;
}