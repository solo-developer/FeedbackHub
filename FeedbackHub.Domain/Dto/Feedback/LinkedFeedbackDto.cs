namespace FeedbackHub.Domain.Dto.Feedback
{
    public class LinkedFeedbackDto
    {
        public int LinkId { get; set; }
        public int SourceFeedbackId { get; set; }
        public int TargetFeedbackId { get; set; }
        public int RelatedTicketId { get; set; }
        public string RelatedFeedbackTitle { get; set; }

        public string LinkType { get; set; }
        public DateTime LinkedDate { get; set; }
        public string LinkedBy { get; set; }
    }
}
