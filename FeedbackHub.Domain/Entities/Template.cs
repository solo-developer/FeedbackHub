using FeedbackHub.Domain.Enums;

namespace FeedbackHub.Domain.Entities
{
    public class Template : BaseEntity
    {
        protected Template() { }

        public Template(string subject, string emailTemplate, TemplateType templateType)
        {
            Subject = subject;
            EmailTemplate = emailTemplate;
            TemplateType = templateType;
        }
        public TemplateType TemplateType { get;private set; }
        public string Subject { get;private set; }
        public string EmailTemplate { get;private set; }
    }
}
