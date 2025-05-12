namespace FeedbackHub.Domain.Entities
{
    public class AdminUserApplicationAccess : BaseEntity
    {
        public int Id { get; set; }

        public int AdminUserId { get; set; }
        public UserDetail AdminUser { get; set; }

        public int ClientId { get; set; }
        public Client Client { get; set; }

        public int? ApplicationId { get; set; } 
        public Application Application { get; set; }

    }
}
