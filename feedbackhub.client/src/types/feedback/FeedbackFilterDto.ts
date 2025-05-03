import { TicketStatus } from "./TicketStatus";

export interface FeedbackFilterDto{
    FromDate? : Date;
    ToDate? : Date;
    Skip: Number;
    Take: Number;
    Status? : TicketStatus
}