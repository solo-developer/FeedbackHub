export interface SaveFeedbackDto{
    FeedbackTypeId: number;
    Priority: number;
    Title: string;
    Description: string;
    Attachments: File[];
}