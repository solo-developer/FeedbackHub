using FeedbackHub.Domain.Enums;

namespace FeedbackHub.Domain.Dto.Feedback
{
    public class FeedbackStatusUpdateDto
    {
        public int FeedbackId { get; set; }
        public TicketStatus NewStatus { get; set; }
    }
}
