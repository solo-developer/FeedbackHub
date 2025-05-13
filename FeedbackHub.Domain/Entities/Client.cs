using System.ComponentModel.Design;

namespace FeedbackHub.Domain.Entities
{
    public class Client : BaseEntity
    {
        public Client() { }

        public Client(string name, string code, List<int> applicationIds)
        {
            this.Name = name;
            this.Code = code;
            this.AppSubscriptions = applicationIds.Select(a => new ClientApplicationSubscription
            {
                ApplicationId = a,
                ClientId = this.Id
            }).ToList(); ;
        }
        public string Name { get; private set; }
        public string Code { get; private set; }
        public bool IsEnabled { get; private set; } = true;

        public virtual List<RegistrationRequest> RegistrationRequests { get; set; } = new();
        public virtual List<ClientApplicationSubscription> AppSubscriptions { get; set; } = new();
        public virtual List<AdminUserApplicationAccess> AdminUsersWithAccess { get; set; } = new();

        public void Enable()
        {
            this.IsEnabled = true;
        }

        public void Disable() { this.IsEnabled = false; }

    }
}
