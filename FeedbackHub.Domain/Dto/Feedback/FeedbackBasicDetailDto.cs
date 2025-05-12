using FeedbackHub.Domain.Enums;

namespace FeedbackHub.Domain.Dto.Feedback
{
    public class FeedbackBasicDetailDto
    {
        public int Id { get; set; }
        public int TicketId { get; set; }
        public required string Title { get; set; }
        public required string CreatedBy { get; set; }
        public required DateTime CreatedDate { get; set; }
        public required string FeedbackType { get; set; }
        public required string Client { get; set; }
        public required string Application { get; set; }
        public int Priority { get; set; }
        public TicketStatus Status { get; set; }

    }

    public class FeedbackDetailDto : FeedbackBasicDetailDto
    {
        public required int FeedbackTypeId { get; set; }

        public required string Description { get; set; }
    }

    public class BoardFeedbackDetailDto
    {
        public required int Id { get; set; }
        public required int TicketId { get; set; }
        public required string Title { get; set; }
        public required string RaisedBy { get; set; }
        public required TicketStatus Status { get; set; }
        public required DateTime RaisedDate { get; set; }
        public required FeedbackTypeDto FeedbackType { get; set; }
    }

    public class BoardFeedbackDto
    {
        public required string Client { get; set; }
        public required string Application { get; set; }

        public IEnumerable<BoardFeedbackDetailDto> Feedbacks { get; set; } = new List<BoardFeedbackDetailDto>();
    }
}
