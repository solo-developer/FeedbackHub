namespace FeedbackHub.Domain.Entities
{
    public class ClientApplicationSubscription : BaseEntity
    {
        public int ClientId { get; set; }
        public int ApplicationId { get; set; }

        public virtual Client Client { get; set; }

        public virtual Application Application { get; set; }
    }
}
