using FeedbackHub.Domain.Dto;

namespace FeedbackHub.Domain.Services.Interface
{
    public interface IEmailSenderService
    {
        Task SendEmailAsync(EmailMessageDto dto);
    }
}
