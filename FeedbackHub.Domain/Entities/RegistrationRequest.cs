using FeedbackHub.Domain.Exceptions;
using FeedbackHub.Domain.ValueObjects;

namespace FeedbackHub.Domain.Entities
{
    public class RegistrationRequest : BaseEntity
    {
        public RegistrationRequest() { }

        public RegistrationRequest(Email email,int clientId,string fullname)
        {
            this.ClientId= clientId;
            this.Email= email;    
            this.FullName= fullname;
        }
        public int ClientId { get; set; }
        public int? ConvertedUserId { get; set; }
        public string FullName { get; set; }
        public required Email Email { get; set; }
        public DateTime RequestedAt { get; set; } = DateTime.Now;
        public virtual Client Client { get; set; }
        public virtual UserDetail User { get; set; }

        public void AcceptRegistration()
        {
            if (this.ConvertedUserId.HasValue) throw new InvalidStateTransitionException("The Registration request is already accepted.");
            this.User = UserDetail.Create(this.FullName);
        }

    }
}
