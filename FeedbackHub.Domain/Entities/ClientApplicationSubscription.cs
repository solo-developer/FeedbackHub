namespace FeedbackHub.Domain.Entities
{
    public class ClientApplicationSubscription : BaseEntity
    {
        public int ClientId { get; set; }
        public int ApplicationId { get; set; }

        public Client Client { get; set; }

        public Application Application { get; set; }
    }
}
