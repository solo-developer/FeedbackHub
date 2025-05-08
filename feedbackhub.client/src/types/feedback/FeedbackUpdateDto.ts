import { TicketStatus } from "./TicketStatus";

export interface FeedbackUpdateDto {
    Id: Number;
    FeedbackTypeId :number;    
    Title: string;
    Status: TicketStatus;
    Priority: number;
    Description : string;
  }
  