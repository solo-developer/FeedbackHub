namespace FeedbackHub.Domain.Dto.Feedback
{
    public class FeedbackAttachmentDto
    {
        public int Id { get; set; }
        public int FeedbackId { get; set; }
        public string DisplayName { get; set; }
        public string AttachmentIdentifier { get; set; }
        public string EnteredBy { get; set; }
        public DateTime EnteredDate { get; set; }
     
    }
}
