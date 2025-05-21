using FeedbackHub.Domain.Enums;

namespace FeedbackHub.Domain.Entities
{
    public class FeedbacksLink : BaseEntity
    {
        protected FeedbacksLink()
        {
        }
        public FeedbacksLink(int sourceId, int targetId,int userId, FeedbackLinkType linkType)
        {
            this.SourceFeedbackId = sourceId;
            this.TargetFeedbackId = targetId;
            this.CreatedBy = userId;
            this.LinkType = linkType;
            this.CreatedDate = DateTime.Now;
        }

        public int SourceFeedbackId { get; set; }
        public int TargetFeedbackId { get; set; }

        public FeedbackLinkType LinkType { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;

        public virtual Feedback SourceFeedback { get; set; }
        public virtual Feedback TargetFeedback { get; set; }

        public virtual UserDetail UserDetail { get; set; }
    }
}
