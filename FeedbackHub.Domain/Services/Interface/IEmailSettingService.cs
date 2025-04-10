using FeedbackHub.Domain.Dto;

namespace FeedbackHub.Domain.Services.Interface
{
    public interface IEmailSettingService
    {
        Task<EmailSettingDto> GetEmailSettingAsync();

        Task SaveAsync(EmailSettingDto emailSettingDto);
    }
}
