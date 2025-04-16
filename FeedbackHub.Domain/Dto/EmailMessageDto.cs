namespace FeedbackHub.Domain.Dto
{
    public class EmailMessageDto
    {
        public List<string> To { get; set; } = new();
        public required string Subject { get; set; }
        public required string Body { get; set; }
        public bool IsHtml { get; set; } = true;
    }

}
