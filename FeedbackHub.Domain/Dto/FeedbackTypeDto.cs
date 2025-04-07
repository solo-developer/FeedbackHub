namespace FeedbackHub.Domain.Dto
{
    public class FeedbackTypeDto
    {
        public int Id { get; set; }
        public required string @Type { get; set; }
        public string Color { get; set; } = string.Empty;
    }
}
