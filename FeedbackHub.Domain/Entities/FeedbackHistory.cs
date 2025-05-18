namespace FeedbackHub.Domain.Entities
{
    public class FeedbackHistory : BaseEntity
    {
        protected FeedbackHistory()
        {
            
        }
        public FeedbackHistory(int feedbackId,int userId, string comment, DateTime createdDate)
        {
            FeedbackId = feedbackId;
            UserId = userId;
            Comment = comment;
            CreatedDate = createdDate;
        }
        public int FeedbackId { get;private set; }
        public int UserId { get;private set; }

        public string Comment { get;private set; }
        public DateTime CreatedDate { get; private set; } = DateTime.Now;

        public virtual UserDetail User { get;private set; }

        public virtual Feedback Feedback { get; private set; }
    }
}
