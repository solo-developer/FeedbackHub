using FeedbackHub.Domain.Enums;
using Microsoft.AspNetCore.Http;

namespace FeedbackHub.Domain.Dto
{
    public class SaveFeedbackDto
    {
        public int FeedbackTypeId { get; set; }
        public int Priority { get; set; }
        public string Title { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;

        // For file uploads via multipart/form-data
        public List<IFormFile> Attachments { get; set; } = new();
    }

    public class FeedbackUpdateDto
    {
        public int Id { get; set; }
        public int FeedbackTypeId { get; set; }
        public string Title { get; set; }
        public TicketStatus Status { get; set; }
        public int Priority { get; set; }
        public string Description { get; set; }
    }

}
