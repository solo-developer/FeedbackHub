import { TicketStatus } from "./TicketStatus";

export interface FeedbackStatusUpdateDto{
    FeedbackId : number;
    NewStatus : TicketStatus;
}