using System.Security.Principal;

namespace FeedbackHub.Domain.Entities
{
    public class UserSubscription : BaseEntity
    {
        protected UserSubscription() { }

        public UserSubscription(int userId, int applicationId)
        {
            this.UserId = userId;
            this.ApplicationId = applicationId;
        }

        public int UserId { get; set; }

        public int ApplicationId { get; set; }

        public virtual UserDetail User { get; set; }

        public virtual Application Application { get; set; }
    }
}
