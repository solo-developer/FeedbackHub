using FeedbackHub.Domain.Enums;

namespace FeedbackHub.Domain.Entities
{
    public class UserNotificationTriggerState : BaseEntity
    {
        public UserNotificationTriggerState(int subscriptionId, NotificationTriggerStateLevel state)
        {
            this.SubscriptionId = subscriptionId;
            this.TriggerState = state;
        }
        public UserNotificationTriggerState()
        {
            
        }
        public int SubscriptionId { get;private set; }
        public NotificationTriggerStateLevel TriggerState { get;private set; }

        public virtual UserFeedbackEmailSubscription Subscription { get;private set; }
    }

}
