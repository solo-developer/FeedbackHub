namespace FeedbackHub.Domain.Dto.Feedback
{
    public class FeedbackRevisionDto
    {
        public int Id { get; set; }
        public int FeedbackId { get; set; }
        public string ChangedBy { get; set; }
        public DateTime ChangedAt { get; set; }
        public List<FeedbackChangedFieldDto> ChangedFields { get; set; } = new();
    }

    public class FeedbackChangedFieldDto
    {
        public string FieldName { get; set; }
        public string OldValue { get; set; }
        public string NewValue { get; set; }
        public string DisplayName { get; set; }
    }

}
