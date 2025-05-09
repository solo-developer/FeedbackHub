using Microsoft.AspNetCore.Http;

namespace FeedbackHub.Domain.Entities
{
    public class Attachment : BaseEntity
    {
        private IFormFile _file;
        public Attachment() { }

        public Attachment(int feedbackId, int createdBy,IFormFile file)
        {
            this.FeedbackId = feedbackId;
            this._file = file;
            ComputeAttachmentIdentifier();
            this.CreatedBy = createdBy;
            this.CreatedDate = DateTime.Now;
        }
        public int FeedbackId { get; private set; }
        public string DisplayName { get; private set; }
        public string AttachmentIdentifier { get; private set; }
        public DateTime CreatedDate { get; set; } = DateTime.Now;
        public int CreatedBy { get; set; }
        public virtual Feedback Feedback { get;private set; }

        public virtual UserDetail User { get;private set; }

        private void ComputeAttachmentIdentifier()
        {
            this.DisplayName = this._file.FileName;
            this.AttachmentIdentifier = $"{Guid.NewGuid().ToString()}{Path.GetExtension(this._file.FileName)?.ToLower()}";
        }
    }
}
