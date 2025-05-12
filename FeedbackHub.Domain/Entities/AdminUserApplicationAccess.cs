namespace FeedbackHub.Domain.Entities
{
    public class AdminUserApplicationAccess : BaseEntity
    {
        public int AdminUserId { get; set; }
        public int ClientId { get; set; }
        public int? ApplicationId { get; set; }
        public virtual UserDetail AdminUser { get; set; }
        public virtual Client Client { get; set; }
        public virtual Application Application { get; set; }

    }
}
