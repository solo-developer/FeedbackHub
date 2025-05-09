namespace FeedbackHub.Domain.Dto.Feedback
{
    public class FeedbackCommentDto
    {
        public string Comment { get; set; }
        public string EnteredBy { get; set; }
        public DateTime EnteredDate { get; set; }
    }
}
