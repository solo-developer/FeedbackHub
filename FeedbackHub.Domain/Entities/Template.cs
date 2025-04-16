using FeedbackHub.Domain.Enums;

namespace FeedbackHub.Domain.Entities
{
    public class Template : BaseEntity
    {
        public TemplateType TemplateType { get; set; }
        public required string Subject { get; set; }
        public required string EmailTemplate { get; set; }
    }
}
