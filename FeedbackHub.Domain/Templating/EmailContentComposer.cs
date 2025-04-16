using FeedbackHub.Domain.Entities;
using FeedbackHub.Domain.Enums;
using FeedbackHub.Domain.Exceptions;
using FeedbackHub.Domain.Repositories.Interface;
using Microsoft.EntityFrameworkCore;

namespace FeedbackHub.Domain.Templating
{
    public class EmailContentComposer : IEmailContentComposer
    {
        private readonly IBaseRepository<Template> _templateRepo;
        private readonly TokenProviderResolver _tokenProviderResolver;
        public EmailContentComposer(IBaseRepository<Template> templateRepo, TokenProviderResolver tokenProviderResolver)
        {
            _templateRepo = templateRepo;
            _tokenProviderResolver = tokenProviderResolver;

        }
        public async Task<(string subject,string body)> ComposeAsync(TemplateType templateType, object data)
        {
            var template = await _templateRepo.GetQueryableWithNoTracking().Where(a=> a.TemplateType == templateType).SingleOrDefaultAsync();

            if (template is null) throw new ItemNotFoundException($"Template type '{templateType.ToString()}' is not configured.");

            var tokens = await _tokenProviderResolver.CollectTokensAsync(templateType.ToString(), data);

            var subject = ReplacePlaceholders(template.Subject, tokens);
            var body = ReplacePlaceholders(template.EmailTemplate, tokens);

            return(subject,body);
        }

        private string ReplacePlaceholders(string text, Dictionary<string, string> values)
        {
            foreach (var kvp in values)
            {
                text = text.Replace($"{{{{{kvp.Key}}}}}", kvp.Value);
            }
            return text;
        }
    }
}
