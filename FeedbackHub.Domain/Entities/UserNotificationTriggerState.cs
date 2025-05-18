using FeedbackHub.Domain.Enums;

namespace FeedbackHub.Domain.Entities
{
    public class UserNotificationTriggerState : BaseEntity
    {
        protected UserNotificationTriggerState()
        {

        }

        public UserNotificationTriggerState(int subscriptionId, NotificationTriggerStateLevel state)
        {
            this.SubscriptionId = subscriptionId;
            this.TriggerState = state;
        }
      
        public int SubscriptionId { get;private set; }
        public NotificationTriggerStateLevel TriggerState { get;private set; }

        public virtual UserFeedbackEmailSubscription Subscription { get;private set; }
    }

}
