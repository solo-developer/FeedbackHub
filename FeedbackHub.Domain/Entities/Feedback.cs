using FeedbackHub.Domain.Enums;
using FeedbackHub.Domain.Exceptions;

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

        public void UpdateStatus(int userId, TicketStatus status)
        {
            var revision = new FeedbackRevision(this.Id, this.UserId);
            TrackChangeIfDifferent(revision, TrackedField.Status, this.Status.ToString(), status.ToString());
            if (revision.ChangedFields.Count > 0)
            {
                this.Revisions.Add(revision);
            }
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
        public virtual List<FeedbacksLink> SourceLinks { get; set; } = new();
        public virtual List<FeedbacksLink> TargetLinks { get; set; } = new();

        public virtual Application Application { get; set; }

        public void MarkDeleted()
        {
            this.IsDeleted = true;
        }

        public void AddComment(string comment, int userId)
        {
            this.Histories.Add(new FeedbackHistory(this.Id, userId, comment, DateTime.Now));
        }

        public void LinkFeedback(Feedback targetFeedback, int userId, FeedbackLinkType linkType)
        {
            var targetFeedbackId = targetFeedback.Id;
            if (this.TargetLinks.Any(a => a.SourceFeedbackId == this.Id && a.TargetFeedbackId == targetFeedbackId))
                throw new DuplicateItemException("The feedbacks are already linked.");
            if (this.SourceLinks.Any(a => a.SourceFeedbackId == targetFeedbackId && a.TargetFeedbackId == this.Id))
                throw new DuplicateItemException("The feedbacks are already linked.");
            this.TargetLinks.Add(new FeedbacksLink(this.Id, targetFeedbackId, userId, linkType));

            var revision = new FeedbackRevision(this.Id, this.UserId);
            TrackChangeIfDifferent(revision, TrackedField.LinkedTicket, null, $"#{targetFeedback.TicketId} ({linkType.ToString()})");

            if (revision.ChangedFields.Count > 0)
            {
                this.Revisions.Add(revision);
            }
        }

        public void UnlinkFeedback(Feedback otherFeedback)
        {
            var otherFeedbackId = otherFeedback.Id;
            var revision = new FeedbackRevision(this.Id, this.UserId);

            FeedbacksLink linkToRemove = this.TargetLinks
                .FirstOrDefault(l => l.TargetFeedbackId == otherFeedbackId);

            bool isOutgoing = true;

            if (linkToRemove == null)
            {
                linkToRemove = this.SourceLinks
                    .FirstOrDefault(l => l.SourceFeedbackId == otherFeedbackId);
                isOutgoing = false;
            }

            if (linkToRemove == null)
            {
                throw new ItemNotFoundException("Link does not exist");
            }

            var linkType = linkToRemove.LinkType;

            if (isOutgoing)
                this.TargetLinks.Remove(linkToRemove);
            else
                this.SourceLinks.Remove(linkToRemove);

            TrackChangeIfDifferent(
                revision,
                TrackedField.LinkedTicket,
                $"#{otherFeedback.TicketId} ({linkType.ToString()})",
                null
            );

            if (revision.ChangedFields.Count > 0)
            {
                this.Revisions.Add(revision);
            }
        }


        private void TrackChangeIfDifferent(FeedbackRevision revision, TrackedField field, string? oldValue, string newValue)
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
