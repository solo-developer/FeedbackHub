namespace FeedbackHub.Domain.Entities
{
    public class Client : BaseEntity
    {
        protected Client() { }

        public Client(string name, string code, List<int> applicationIds)
        {
            this.Name = name;
            this.Code = code;
            this.AppSubscriptions = applicationIds.Select(a => new ClientApplicationSubscription(this.Id,a)).ToList(); ;
        }

        public void Update(string name, string code, List<int> applicationIds)
        {
            this.Name = name;
            this.Code = code;

            this.AppSubscriptions.Clear();
            this.AppSubscriptions = applicationIds.Select(a => new ClientApplicationSubscription(this.Id,a)).ToList(); ;
        }
        public string Name { get; private set; }
        public string Code { get; private set; }
        public bool IsEnabled { get; private set; } = true;

        public virtual List<RegistrationRequest> RegistrationRequests { get; set; } = new();
        public virtual List<ClientApplicationSubscription> AppSubscriptions { get; set; } = new();
        public virtual List<UserApplicationAccess> AdminUsersWithAccess { get; set; } = new();

        public void Enable()
        {
            this.IsEnabled = true;
        }

        public void Disable() { this.IsEnabled = false; }

    }
}
