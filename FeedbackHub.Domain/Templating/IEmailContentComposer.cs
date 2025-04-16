using FeedbackHub.Domain.Enums;

namespace FeedbackHub.Domain.Templating
{
    public interface IEmailContentComposer
    {
        Task<(string subject, string body)> ComposeAsync(TemplateType templateType, object data);
    }
}
