using FeedbackHub.Domain.Exceptions;
using FeedbackHub.Domain.Repositories.Interface;
using FeedbackHub.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore;

namespace FeedbackHub.Domain.Entities
{
    public class RegistrationRequest : BaseEntity
    {
        private readonly IBaseRepository<RegistrationRequest> _repo;
        public RegistrationRequest() { }

        public RegistrationRequest(IBaseRepository<RegistrationRequest> repo, Email email, int clientId, string fullname)
        {
            this.ClientId = clientId;
            this.Email = email;
            this.FullName = fullname;
            this._repo = repo;
            if (this.IsDuplicate().GetAwaiter().GetResult()) throw new DuplicateItemException("Registration request is already submitted.");
        }
        public int ClientId { get;protected set; }
        public int? ConvertedUserId { get;protected set; }
        public string FullName { get;protected set; }
        public Email Email { get; protected set; }
        public DateTime RequestedAt { get;protected set; } = DateTime.Now;

        public bool IsDeclined { get;protected set; } = false;

        public string? ReasonForDeclination { get;protected set; }
        public DateTime? DateOfDeclination {  get;protected set; }
        public virtual Client Client { get; set; }
        public virtual UserDetail User { get; set; }

        public void AcceptRegistration()
        {
            if (this.ConvertedUserId.HasValue) throw new InvalidStateTransitionException("The Registration request is already accepted.");
            this.User = UserDetail.Create(this.FullName);
           
        }

        public async Task<bool> IsDuplicate()
        {
            return await _repo.GetQueryableWithNoTracking().Where(a => a.Email.Equals(this.Email)).AnyAsync();
        }

        public void Decline(string reason)
        {
            this.IsDeclined = true;
            this.ReasonForDeclination = reason;
            this.DateOfDeclination = DateTime.Now;
        }

        public void UndoDeclination()
        {
            this.IsDeclined = false;
            this.ReasonForDeclination = string.Empty;
            this.DateOfDeclination = default;
        }
    }
}
