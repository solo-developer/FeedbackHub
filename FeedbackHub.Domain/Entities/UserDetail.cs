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
        public static UserDetail CreateClientUser(int registrationRequestId, string fullName, string email,int clientId, List<int> applicationIds)
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
                userDetail.Subscribe(clientId, subscription);
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
                        new UserApplicationAccess(userDetail.Id, access.ClientId, a)));
                }
            }
            return userDetail;
        }

        public string FullName { get;private set; }
        public int AppUserId { get;private set; }
        public bool IsDeleted { get; private set; }

        public string? AvatarUrl { get;private set; }

        public int? RegistrationRequestId { get; private set; }

        public virtual ApplicationUser ApplicationUser { get; private set; }
        public virtual RegistrationRequest RegistrationRequest { get; private set; }
        public virtual List<UserFeedbackEmailSubscription> EmailSubscriptions { get; private set; } = new();
        public virtual List<UserApplicationAccess> AllowedApplications { get; private set; } = new();
        public virtual List<FeedbackRevision> Revisions { get; private set; } = new();
        public virtual List<FeedbacksLink> FeedbackLinks { get; private set; } = new();
        public virtual List<FeedbackHistory> FeedbackHistories { get; private set; } = new();

        public void MarkDeleted()
        {
            this.IsDeleted = true;
        }

        public void UndoDelete()
        {
            this.IsDeleted = false;
        }

        public void UpdateAvatar(string avatarUrl)
        {
            this.AvatarUrl = avatarUrl;
        }

        public void Subscribe(int clientId, int applicationId)
        {
            if (AllowedApplications.Any(a => a.ApplicationId == applicationId && a.ClientId == clientId)) return;
            AllowedApplications.Add(new UserApplicationAccess(this.Id,clientId, applicationId));
        }

        public void Unsubscribe(int clientId,int applicationId)
        {
            var subscribedApp = AllowedApplications.Find(a => a.ApplicationId == applicationId && a.ClientId == clientId);
            AllowedApplications.Remove(subscribedApp);
        }

        internal void ChangePassword(string newPassword)
        {
            var passwordHasher = new PasswordHasher<ApplicationUser>();
            this.ApplicationUser.PasswordHash = passwordHasher.HashPassword(this.ApplicationUser, newPassword);
        }
    }
}
