using FeedbackHub.Domain.Dto.User;
using FeedbackHub.Domain.ValueObjects;
using Microsoft.AspNetCore.Identity;
using System.Runtime.CompilerServices;

namespace FeedbackHub.Domain.Entities
{
    public class UserDetail : BaseEntity
    {
        protected UserDetail()
        {

        }

        public static UserDetail AssociateAspUserWithUserDetail(int aspUserId, string fullName)
        {
            var userDetail = new UserDetail
            {
                AppUserId = aspUserId,
                FullName = fullName
            };
            return userDetail;
        }
        public static UserDetail CreateClientUser(int registrationRequestId, string fullName, string email, List<int> applicationIds)
        {
            var userDetail = new UserDetail
            {
                RegistrationRequestId = registrationRequestId,
                FullName = fullName,
                ApplicationUser = new ApplicationUser
                {
                    UserName = email,
                    Email = email
                },

            };

            foreach (var subscription in applicationIds)
            {
                userDetail.Subscribe(subscription);
            }
            return userDetail;

        }

        public static UserDetail CreateAdminUser(string fullName, Email email, List<AdminUserApplicationAccessDto> accesses)
        {
            var userDetail = new UserDetail
            {
                FullName = fullName,
                ApplicationUser = new ApplicationUser
                {
                    UserName = email.Value,
                    Email = email.Value
                }
            };
            foreach (var access in accesses)
            {
                if (access.ApplicationIds.Any())
                {
                    userDetail.AllowedApplications.AddRange(
                        access.ApplicationIds.Select(a =>
                        new AdminUserApplicationAccess(userDetail.Id, access.ClientId, a)));
                }
            }
            return userDetail;
        }

        public string FullName { get;private set; }
        public int AppUserId { get;private set; }
        public bool IsDeleted { get; private set; }

        public int? RegistrationRequestId { get; private set; }

        public virtual ApplicationUser ApplicationUser { get; private set; }
        public virtual RegistrationRequest RegistrationRequest { get; private set; }
        public virtual List<UserSubscription> Subscriptions { get; private set; } = new();
        public virtual List<UserFeedbackEmailSubscription> EmailSubscriptions { get; private set; } = new();
        public virtual List<AdminUserApplicationAccess> AllowedApplications { get; private set; } = new();
        public virtual List<FeedbackRevision> Revisions { get; private set; } = new();

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
