import { TicketStatus } from "./TicketStatus";

export interface FeedbackBasicDetailDto {
    Id : number;
    TicketId: number;
    Title: string;
    CreatedBy: string;
    CreatedDate: Date; 
    FeedbackType: string; 
    Client : string;  
    Application: string;
    Priority: number;
    Status: TicketStatus; 
  }

  export interface FeedbackDto extends FeedbackBasicDetailDto{
    Description : string;
    FeedbackTypeId : number;
  }
  