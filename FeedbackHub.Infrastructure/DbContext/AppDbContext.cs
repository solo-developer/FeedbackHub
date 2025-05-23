﻿using FeedbackHub.Domain.Entities;
using FeedbackHub.Infrastructure.EFConfigurations;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace FeedbackHub.Infrastructure.Context
{
    public class AppDbContext : IdentityDbContext<Domain.Entities.ApplicationUser,ApplicationRole,int>
    {
        public AppDbContext()
        {
            
        }
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.ApplyConfiguration(new UserApplicationAccessConfiguration());
            builder.ApplyConfiguration(new ApplicationConfiguration());
            builder.ApplyConfiguration(new AttachmentConfiguration());
            builder.ApplyConfiguration(new ClientApplicationSubscriptionConfiguration());
            builder.ApplyConfiguration(new ClientConfiguration());
            builder.ApplyConfiguration(new FeedbackConfiguration());
            builder.ApplyConfiguration(new FeedbackChangedFieldConfiguration());
            builder.ApplyConfiguration(new FeedbackHistoryConfiguration());
            builder.ApplyConfiguration(new FeedbackRevisionConfiguration());
            builder.ApplyConfiguration(new FeedbacksLinkConfiguration());
            builder.ApplyConfiguration(new FeedbackTypeConfiguration());
            builder.ApplyConfiguration(new RegistrationRequestConfiguration());
            builder.ApplyConfiguration(new SettingConfiguration());
            builder.ApplyConfiguration(new TemplateConfiguration());
            builder.ApplyConfiguration(new TicketSequenceConfiguration());
            builder.ApplyConfiguration(new UserDetailConfiguration());
            builder.ApplyConfiguration(new UserFeedbackEmailSubscriptionConfiguration());
            builder.ApplyConfiguration(new UserSubscribedFeedbackTypeNotificationConfiguration());
            builder.ApplyConfiguration(new UserNotificationTriggerStateConfiguration());
            base.OnModelCreating(builder);           
        }

        public DbSet<UserApplicationAccess> AdminUserApplicationAccesses { get; set; }
        public DbSet<Application> Applications { get; set; }
        public DbSet<Attachment> Attachments { get; set; }
        public DbSet<Client> Clients { get; set; }
        public DbSet<ClientApplicationSubscription> ClientApplicationSubscriptions { get; set; }
        public DbSet<Feedback> Feedbacks { get; set; }
        public DbSet<FeedbackChangedField> FeedbackChangedFields { get; set; }
        public DbSet<FeedbackRevision> FeedbackRevisions { get; set; }
        public DbSet<FeedbacksLink> FeedbackLinks { get; set; }
        public DbSet<FeedbackType> FeedbackTypes { get; set; }
        public DbSet<RegistrationRequest> RegistrationRequests { get; set; }
        public DbSet<Setting> Settings { get; set; }
        public DbSet<Template> Templates { get; set; }
        public DbSet<TicketSequence> TicketSequences { get; set; }
        public DbSet<UserDetail> UserDetails { get; set; }
        public DbSet<UserFeedbackEmailSubscription> UserFeedbackEmailSubscriptions { get; set; }
        public DbSet<UserNotificationTriggerState> UserNotificationTriggerStates { get; set; }
        public DbSet<UserSubscribedFeedbackTypeNotification> UserSubscribedFeedbackTypeNotifications { get; set; }
       
    }
}
