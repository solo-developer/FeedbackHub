namespace FeedbackHub.Domain.Entities
{
    public class UserSubscribedFeedbackTypeNotification : BaseEntity
    {
        protected UserSubscribedFeedbackTypeNotification()
        {
            
        }
        public UserSubscribedFeedbackTypeNotification(int feedbackSubscriptionId, int feedbackTypeId)
        {
            this.FeedbackSubscriptionId = feedbackSubscriptionId;
            this.FeedbackTypeId = feedbackTypeId;
        }
        public int FeedbackSubscriptionId { get;private set; }

        public int FeedbackTypeId { get;private set; }

        public virtual UserFeedbackEmailSubscription FeedbackSubscription { get;private set; }

        public virtual FeedbackType FeedbackType { get;private set; }
    }
}
