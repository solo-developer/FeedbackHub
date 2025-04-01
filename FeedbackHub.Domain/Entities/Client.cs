using System.ComponentModel.Design;

namespace FeedbackHub.Domain.Entities
{
    public class Client : BaseEntity
    {
        public string Name { get; set; }
        public string Code { get; set; }
        public bool IsEnabled { get; set; }

        public virtual List<RegistrationRequest> RegistrationRequests { get; set; } = new();
    }
}
