using FeedbackHub.Domain.Enums;

namespace FeedbackHub.Domain.Dto.Feedback
{
    public class FeedbackCountResponseDto
    {
        public TicketStatus Status { get; set; }
        public int Count { get; set; }
    }
}
