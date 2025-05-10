using FeedbackHub.Domain.Enums;

namespace FeedbackHub.Domain.Entities
{
    public class UserFeedbackEmailSubscription : BaseEntity
    {
        public UserFeedbackEmailSubscription()
        {

        }

        public int UserId { get; set; }
        public int ApplicationId { get; set; }
        public int FeedbackTypeId { get; set; }

        public bool NotifyOnCommentMade { get; set; } = false;
        public bool NotifyOnStatusChange { get; set; } = false;
        public virtual Application Application { get; set; }
        public virtual List<UserSubscribedFeedbackTypeNotification> SubscribedFeedbackTypes { get; private set; } = new List<UserSubscribedFeedbackTypeNotification>();

        public virtual List<UserNotificationTriggerState> TriggerStates { get; set; } = new List<UserNotificationTriggerState>();


        public void AddFeedbackTypeSubscriptions(List<int> feedbackTypeIds)
        {
            SubscribedFeedbackTypes.Clear();
            foreach (var feedbackTypeId in feedbackTypeIds)
            {
                this.SubscribedFeedbackTypes.Add(new UserSubscribedFeedbackTypeNotification(this.UserId, feedbackTypeId));
            }
        }

        public void AddTriggerStates(List<NotificationTriggerStateLevel> triggerStates)
        {
            if (triggerStates.Any())
                TriggerStates.Clear();
            if(this.NotifyOnStatusChange == false)
                return;

            foreach (var triggerState in triggerStates)
            {
                this.TriggerStates.Add(new UserNotificationTriggerState(this.UserId, triggerState));
            }
        }
    }
}
