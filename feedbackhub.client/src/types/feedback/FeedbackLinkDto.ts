export interface FeedbackLinkDto {
    LinkId: number;
    SourceFeedbackId: number;
    TargetFeedbackId: number;
    RelatedTicketId: number;
    RelatedFeedbackTitle: string;
    LinkType: string;
    LinkedDate: Date;
    LinkedBy: string;
}