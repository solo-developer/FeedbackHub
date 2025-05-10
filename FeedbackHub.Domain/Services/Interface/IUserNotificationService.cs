using FeedbackHub.Domain.Dto;

namespace FeedbackHub.Domain.Services.Interface
{
    public interface IUserNotificationService
    {
        Task<UserNotificationDto> GetSetting(int userId, int applicationId);

        Task SaveAsync(GenericDto<UserNotificationDto> dto);
    }
}
