import { FeedbackTypeDto } from "../feedbacktype/FeedbackTypeDto";
import { TicketStatus } from "./TicketStatus";

export interface BoardFeedbackDto {
  Client: string;
  Application: string;
  Feedbacks: BoardFeedbackDetailDto[];
}

export interface BoardFeedbackDetailDto{
  Id :number;
  TicketId :number;
  Title :string;
  Status : TicketStatus;
  RaisedBy :string;
  RaisedDate : Date;
  FeedbackType : FeedbackTypeDto
}