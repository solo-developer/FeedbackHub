namespace FeedbackHub.Domain.Entities
{
    public class Application : BaseEntity
    {
        protected Application() { }

        public Application(string name,string shortName, byte[] logo)
        {
            this.Name = name;
            this.ShortName = shortName;
            this.Logo = logo;
        }

        public string Name { get; set; }
        public string ShortName { get; set; }
        public byte[] Logo { get; set; }

        public bool IsDeleted { get;private set; }
        public virtual List<UserSubscription> Subscriptions { get; private set; } = new();
        public virtual List<UserFeedbackEmailSubscription> NotificationSubscriptions { get; private set; } = new();
        public virtual List<ClientApplicationSubscription> ClientSubscriptions { get; private set; } = new();
        public virtual List<AdminUserApplicationAccess> AdminUsersWithAccess { get; private set; } = new();
        public void MarkDeleted()
        {
            this.IsDeleted=true;
        }

        public void UndoDelete()
        {
            this.IsDeleted = false;
        }
    }
}
