using FeedbackHub.Domain.Enums;

namespace FeedbackHub.Domain.Entities
{
    public class Feedback : BaseEntity
    {
        public Feedback() { }

        public Feedback(int userId, int feedbackTypeId, int applicationId, int priority, string title, string description)
        {
            this.Priority = priority;
            this.FeedbackTypeId = feedbackTypeId;
            this.ApplicationId = applicationId;
            this.Title = title;
            this.Description = description;
            this.UserId = userId;
            this.CreatedDate = DateTime.Now;
            this.ModifiedDate = DateTime.Now;
        }

        public void UpdateFeedback(int feedbackTypeId,  int priority, string title, string description, TicketStatus status)
        {
            this.Priority = priority;
            this.FeedbackTypeId = feedbackTypeId;
            this.Title = title;
            this.Description = description;
            this.Status = status;
            this.ModifiedDate = DateTime.Now;
        }

        public int UserId { get; private set; }
        public int FeedbackTypeId { get; private set; }
        public int ApplicationId { get; private set; }
        public int Priority { get; private set; }
        public TicketStatus Status { get; private set; } = TicketStatus.Open;
        public string Title { get; private set; }
        public string Description { get; private set; }
        public int TicketId { get; set; }
        public DateTime CreatedDate { get; private set; }
        public bool IsDeleted { get; private set; }

        public DateTime ModifiedDate { get; private set; }
        public virtual UserDetail User { get; set; }
        public virtual FeedbackType FeedbackType { get; set; }
        public virtual List<Attachment> Attachments { get; set; } = new();
        public virtual List<FeedbackHistory> Histories { get; set; } = new();
        public virtual Application Application { get; set; }

        public void MarkDeleted()
        {
            this.IsDeleted = true;
        }
    }
}
