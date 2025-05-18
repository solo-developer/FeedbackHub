using FeedbackHub.Domain.Enums;

namespace FeedbackHub.Domain.Entities
{
    public class Feedback : BaseEntity
    {
        protected Feedback() { }

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

        public void UpdateFeedback(int userId, int feedbackTypeId, int priority, string title, string description, TicketStatus status)
        {

            var revision = new FeedbackRevision(this.Id, this.UserId);

            TrackChangeIfDifferent(revision, TrackedField.FeedbackTypeId, this.FeedbackTypeId.ToString(), feedbackTypeId.ToString());
            TrackChangeIfDifferent(revision, TrackedField.Priority, this.Priority.ToString(), priority.ToString());
            TrackChangeIfDifferent(revision, TrackedField.Title, this.Title, title);
            TrackChangeIfDifferent(revision, TrackedField.Description, this.Description, description);
            TrackChangeIfDifferent(revision, TrackedField.Status, this.Status.ToString(), status.ToString());

            if (revision.ChangedFields.Count > 0)
            {
                this.Revisions.Add(revision);
            }

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
        public virtual List<FeedbackRevision> Revisions { get; set; } = new();

        public virtual Application Application { get; set; }

        public void MarkDeleted()
        {
            this.IsDeleted = true;
        }

        public void AddComment(string comment, int userId)
        {
            this.Histories.Add(new FeedbackHistory(this.Id, userId, comment, DateTime.Now));
        }

        private void TrackChangeIfDifferent(FeedbackRevision revision,TrackedField field,string oldValue,string newValue)
        {
            if (!oldValue.Equals(newValue))
            {
                revision.ChangedFields.Add(new FeedbackChangedField(
                    field.ToString(),
                    oldValue,
                    newValue
                ));
            }
        }
    }
}
