using FeedbackHub.Domain.Dto;
using FeedbackHub.Domain.Entities;
using FeedbackHub.Domain.Repositories.Interface;
using FeedbackHub.Domain.Services.Interface;
using System.Transactions;

namespace FeedbackHub.Domain.Services.Implementations
{
    public class UserNotificationService : IUserNotificationService
    {
        private readonly IBaseRepository<UserFeedbackEmailSubscription> _repo;
        public UserNotificationService(IBaseRepository<UserFeedbackEmailSubscription> repo)
        {
            _repo = repo;
        }
        public async Task<UserNotificationDto> GetSetting(int userId, int applicationId)
        {
            var userNotification = await _repo.FindAsync(x => x.UserId == userId && x.ApplicationId == applicationId);

            if (userNotification == null) return new UserNotificationDto();

            return new UserNotificationDto
            {
                NotifyOnCommentMade = userNotification.NotifyOnCommentMade,
                NotifyOnStatusChange = userNotification.NotifyOnStatusChange,
                TriggerStates = userNotification.TriggerStates.Select(x => x.TriggerState).ToList(),
                FeedbackTypeIds = userNotification.SubscribedFeedbackTypes.Select(x => x.FeedbackTypeId).ToList()
            };
        }

        public async Task SaveAsync(GenericDto<UserNotificationDto> dto)
        {
            using (TransactionScope tx = new TransactionScope(TransactionScopeAsyncFlowOption.Enabled))
            {
                var userNotification = await _repo.FindAsync(x => x.UserId == dto.LoggedInUserId && x.ApplicationId == dto.ApplicationId)
                    ?? new UserFeedbackEmailSubscription(
                        dto.LoggedInUserId,
                        dto.ApplicationId ?? throw new InvalidOperationException("ApplicationId cannot be null."),
                        dto.Model.NotifyOnCommentMade,
                        dto.Model.NotifyOnStatusChange
                    );
              
                userNotification.AddFeedbackTypeSubscriptions(dto.Model.FeedbackTypeIds);
                userNotification.AddTriggerStates(dto.Model.TriggerStates);
                await _repo.AddOrUpdateAsync(userNotification, userNotification.Id);
                tx.Complete();
            }
        }
    }
}
