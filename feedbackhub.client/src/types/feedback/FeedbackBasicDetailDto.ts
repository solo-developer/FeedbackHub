import { TicketStatus } from "./TicketStatus";

export interface FeedbackBasicDetailDto {
    Id : number;
    TicketId: number;
    Title: string;
    CreatedBy: string;
    CreatedDate: string; // ISO string for DateTime
    FeedbackType: string;
    Application: string;
    Priority: number;
    Status: TicketStatus; // You should define this enum in TS as well
  }
  