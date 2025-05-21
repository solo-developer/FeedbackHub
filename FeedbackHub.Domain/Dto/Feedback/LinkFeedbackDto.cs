using FeedbackHub.Domain.Enums;

namespace FeedbackHub.Domain.Dto.Feedback
{
    public class LinkFeedbackDto
    {
        public int FeedbackId { get; set; }
        public int SourceId { get; set; }
        public int TargetId { get; set; }
        public FeedbackLinkType LinkType { get; set; }
    }
}
