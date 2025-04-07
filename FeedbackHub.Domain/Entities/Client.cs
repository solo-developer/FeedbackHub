using System.ComponentModel.Design;

namespace FeedbackHub.Domain.Entities
{
    public class Client : BaseEntity
    {
        public Client() { }

        public Client(string name, string code)
        {
            this.Name = name;
            this.Code = code;
        }
        public string Name { get; private set; }
        public string Code { get; private set; }
        public bool IsEnabled { get; private set; } = true;

        public virtual List<RegistrationRequest> RegistrationRequests { get; set; } = new();

        public void Enable()
        {
            this.IsEnabled = true;
        }

        public void Disable() { this.IsEnabled = false; }

    }
}
