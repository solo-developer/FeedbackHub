using FeedbackHub.Domain.ValueObjects;
using Microsoft.AspNetCore.Identity;
using System.Runtime.CompilerServices;

namespace FeedbackHub.Domain.Entities
{
    public class UserDetail : BaseEntity
    {
        public static UserDetail CreateClientUser(int registrationRequestId, string fullName, string email, List<int> applicationIds)
        {
            return new UserDetail
            {
                RegistrationRequestId= registrationRequestId,
                FullName = fullName,
                ApplicationUser = new ApplicationUser
                {
                    UserName = email,
                    Email = email
                },
                Subscriptions = applicationIds.Select(id => new UserSubscription
                {
                    ApplicationId = id
                }).ToList()
            };
        }

        public static UserDetail CreateAdminUser( string fullName, Email email)
        {
            return new UserDetail
            {
                FullName = fullName,
                ApplicationUser = new ApplicationUser
                {
                    UserName = email.Value,
                    Email = email.Value
                },            
            };
        }



        public UserDetail()
        {

        }
        public string FullName { get; set; }
        public int AppUserId { get; set; }
        public bool IsDeleted { get; private set; }

        public int? RegistrationRequestId { get; private set; }

        public virtual ApplicationUser ApplicationUser { get; private set; }
        public virtual RegistrationRequest RegistrationRequest { get; private set; }
        public virtual List<UserSubscription> Subscriptions { get; private set; } = new();
        public virtual List<UserFeedbackEmailSubscription> EmailSubscriptions { get; private set; } = new();

        public void MarkDeleted()
        {
            this.IsDeleted = true;
        }

        public void UndoDelete()
        {
            this.IsDeleted = false;
        }

        public void Subscribe(int applicationId)
        {
            if (Subscriptions.Any(a => a.ApplicationId == applicationId)) return;
            Subscriptions.Add(new UserSubscription(this.Id, applicationId));
        }

        public void Unsubscribe(int applicationId)
        {
            var subscribedApp = Subscriptions.Find(a => a.ApplicationId == applicationId);
            Subscriptions.Remove(subscribedApp);
        }

        internal void ChangePassword(string newPassword)
        {
            var passwordHasher = new PasswordHasher<ApplicationUser>();
            this.ApplicationUser.PasswordHash = passwordHasher.HashPassword(this.ApplicationUser, newPassword);
        }
    }
}
