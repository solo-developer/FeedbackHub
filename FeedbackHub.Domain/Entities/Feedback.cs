using FeedbackHub.Domain.Enums;

namespace FeedbackHub.Domain.Entities
{
    public class Feedback : BaseEntity
    {
        protected Feedback() { }

        public Feedback(int userId, int feedbackTypeId, int applicationId, int priority, string title, string description, bool regenerateTicketId= true)
        {
            this.Priority = priority;
            this.FeedbackTypeId = feedbackTypeId;
            this.ApplicationId = applicationId;
            this.Title = title;
            this.Description = description;
            this.UserId = userId;
            this.CreatedDate = DateTime.Now;
            if (regenerateTicketId)
            {

            }            
        }

        public void UpdateFeedback(int feedbackTypeId, int applicationId, int priority, string title, string description)
        {
            var feedback = new Feedback(this.UserId, feedbackTypeId, applicationId, priority, title, description, false);
            feedback.ParentFeedbackId = this.Id;
            feedback.TicketId = this.TicketId;
            this.ChildFeedbacks.Add(feedback);
        }

        public int UserId { get; private set; }
        public int FeedbackTypeId { get; private set; }
        public int ApplicationId { get; private set; }
        public int Priority { get; private set; }
        public TicketStatus Status { get; private set; } = TicketStatus.Open;
        public string Title { get; private set; }
        public string Description { get; private set; }
        public int TicketId { get; private set; }
        public int? ParentFeedbackId { get; private set; }
        public DateTime CreatedDate { get; private set; }
        public bool IsDeleted { get; private set; }
        public virtual UserDetail User { get; set; }
        public virtual FeedbackType FeedbackType { get; set; }
        public virtual List<Attachment> Attachments { get; set; } = new();
        public virtual Application Application { get; set; }

        public virtual Feedback ParentFeedback { get;private set; }

        public virtual List<Feedback> ChildFeedbacks { get;private set; }=new();

        public void MarkDeleted()
        {
            this.IsDeleted = true;
        }
    }
}
