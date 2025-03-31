using FeedbackHub.Domain.Exceptions;
using FeedbackHub.Domain.ValueObjects;

namespace FeedbackHub.Domain.Entities
{
    public class RegistrationRequest : BaseEntity
    {
        protected RegistrationRequest() { }

        public RegistrationRequest(Email email,int clientId)
        {
            this.ClientId= clientId;
            this.Email= email;            
        }
        public int ClientId { get; set; }
        public int? ConvertedUserId { get; set; }
        public Email Email { get; set; }
        public DateTime RequestedAt { get; set; }
        public virtual Client Client { get; set; }
        public virtual UserDetail User { get; set; }

        public void AcceptRegistration()
        {
            if (this.ConvertedUserId.HasValue) throw new InvalidStateTransitionException("The Registration request is already accepted.");
            this.User = UserDetail.Create();
        }

    }
}
