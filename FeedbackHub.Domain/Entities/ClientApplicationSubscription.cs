namespace FeedbackHub.Domain.Entities
{
    public class ClientApplicationSubscription : BaseEntity
    {
        protected ClientApplicationSubscription() { }
        public ClientApplicationSubscription(int clientId, int applicationId)
        {
            this.ClientId = clientId;
            this.ApplicationId = applicationId;
        }
        public int ClientId { get;private set; }
        public int ApplicationId { get;private set; }

        public virtual Client Client { get; set; }

        public virtual Application Application { get; set; }
    }
}
