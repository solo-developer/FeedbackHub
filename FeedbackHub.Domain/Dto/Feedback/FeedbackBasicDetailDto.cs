using FeedbackHub.Domain.Enums;

namespace FeedbackHub.Domain.Dto.Feedback
{
    public class FeedbackBasicDetailDto
    {
        public int TicketId { get; set; }
        public required string Title { get; set; }
        public required string CreatedBy { get; set; }
        public required DateTime CreatedDate { get; set; }
        public required string FeedbackType { get; set; }
        public required string Application { get; set; }
        public int Priority { get; set; }
        public TicketStatus Status { get; set; }

    }
}
