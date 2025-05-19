namespace FeedbackHub.Domain.Entities
{
    public class FeedbackRevision :BaseEntity
    {
        protected FeedbackRevision() { }

        public FeedbackRevision(int feedbackId, int userId)
        {
            FeedbackId = feedbackId;
            ChangedBy = userId;
            ChangedAt = DateTime.UtcNow;
            ChangedFields = new List<FeedbackChangedField>();
        }
        public int FeedbackId { get;private set; }
        public int ChangedBy { get;private set; }
        public DateTime ChangedAt { get;private set; } = DateTime.Now;
        public virtual Feedback Feedback { get; set; }
        public virtual UserDetail User { get; set; }
        public virtual List<FeedbackChangedField> ChangedFields { get; set; } = new();
    }

}
