using FeedbackHub.Domain.Dto;
using FeedbackHub.Domain.Dto.Feedback;
using FeedbackHub.Domain.Entities;
using FeedbackHub.Domain.Enums;
using FeedbackHub.Domain.Exceptions;
using FeedbackHub.Domain.Repositories.Interface;
using FeedbackHub.Domain.Services.Interface;

namespace FeedbackHub.Domain.Templating
{
    public class FeedbackStatusChangedTokenProvider : ITokenValueProvider
    {
        private readonly IBaseRepository<Feedback> _feedbackRepo;
        private readonly IApplicationInfoProvider _applicationInfoProvider;
        public FeedbackStatusChangedTokenProvider(IBaseRepository<Feedback> feedbackRepo, IApplicationInfoProvider applicationInfoProvider)
        {
            _feedbackRepo = feedbackRepo;
            _applicationInfoProvider = applicationInfoProvider;
        }
        public string? TypeCode => TemplateType.FeedbackStatusChanged.ToString();

        public async Task<Dictionary<string, string>> GetTokensAsync(object data)
        {
            if (data is not FeedbackStatusUpdatedEmailNotificationDto request)
                throw new InvalidValueException("Parameter mismatch");

            var feedback = await _feedbackRepo.GetByIdAsync(request.UpdatedDetail.Id);

            return new Dictionary<string, string>
            {
                ["UserName"] = feedback.User.FullName,
                ["TicketId"] = feedback.TicketId.ToString(),
                ["TicketTitle"] = feedback.Title,
                ["OldStatus"] = request.OldStatus.ToString(),
                ["NewStatus"] = feedback.Status.ToString(),
                ["TicketUrl"] = $"{_applicationInfoProvider.GetSiteUrl()}/feedback/{feedback.Id}",
            };
        }
    }
}
