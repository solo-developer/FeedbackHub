﻿namespace FeedbackHub.Domain.Entities
{
    public class UserApplicationAccess : BaseEntity
    {
        protected UserApplicationAccess() { }
        public UserApplicationAccess(int adminUserId, int clientId, int applicationId)
        {
            this.AdminUserId = adminUserId;
            this.ClientId = clientId;
            this.ApplicationId = applicationId;
        }
        public int AdminUserId { get; set; }
        public int ClientId { get; set; }
        public int ApplicationId { get; set; }
        public virtual UserDetail AdminUser { get; set; }
        public virtual Client Client { get; set; }
        public virtual Application Application { get; set; }

    }
}
