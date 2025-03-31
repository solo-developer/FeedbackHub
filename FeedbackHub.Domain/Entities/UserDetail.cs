namespace FeedbackHub.Domain.Entities
{
    public class UserDetail : BaseEntity
    {

        public static UserDetail Create()
        {
            return new UserDetail();
        }
        protected UserDetail()
        {
            
        }



        public bool IsDeleted { get; private set; }
        public RegistrationRequest RegistrationRequest { get; set; }
        public List<UserSubscription> Subscriptions { get; private set; } = new();

        public void MarkDeleted()
        {
            this.IsDeleted = true;
        }

        public void UndoDelete()
        {
            this.IsDeleted= false;
        }

        public void Subscribe(int applicationId)
        {
            if (Subscriptions.Any(a => a.ApplicationId == applicationId)) return;
            Subscriptions.Add(new UserSubscription(this.Id, applicationId));
        }

        public void Unsubscribe(int applicationId)
        {
            var subscribedApp = Subscriptions.Find(a => a.ApplicationId == applicationId);
            Subscriptions.Remove(subscribedApp);
        }
    }
}
