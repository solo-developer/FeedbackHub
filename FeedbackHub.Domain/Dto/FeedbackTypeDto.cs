namespace FeedbackHub.Domain.Dto
{
    public class FeedbackTypeDto
    {
        public required string @Type { get; set; }
        public string Color { get; set; } = string.Empty;
    }
}
