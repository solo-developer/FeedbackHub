using Microsoft.AspNetCore.Http;

namespace FeedbackHub.Domain.Dto.Feedback
{
    public class SaveFeedbackAttachmentDto
    {
        public int FeedbackId { get; set; }

        public List<IFormFile> Attachments { get; set; } = new();
    }
}
