using FeedbackHub.Domain.Entities;
using FeedbackHub.Infrastructure.EFConfigurations;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace FeedbackHub.Infrastructure.Context
{
    public class AppDbContext : IdentityDbContext<Domain.Entities.ApplicationUser,ApplicationRole,int>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.ApplyConfiguration(new ApplicationConfiguration());
            builder.ApplyConfiguration(new AttachmentConfiguration());
            builder.ApplyConfiguration(new ClientConfiguration());
            builder.ApplyConfiguration(new FeedbackConfiguration());
            builder.ApplyConfiguration(new FeedbackTypeConfiguration());
            builder.ApplyConfiguration(new RegistrationRequestConfiguration());
            builder.ApplyConfiguration(new TicketSequenceConfiguration());
            builder.ApplyConfiguration(new UserDetailConfiguration());
            builder.ApplyConfiguration(new UserSubscriptionConfiguration());
            base.OnModelCreating(builder);
           
        }

        public DbSet<Application> Applications { get; set; }
        public DbSet<Attachment> Attachments { get; set; }
        public DbSet<Client> Clients { get; set; }
        public DbSet<Feedback> Feedbacks { get; set; }
        public DbSet<FeedbackType> FeedbackTypes { get; set; }
        public DbSet<RegistrationRequest> RegistrationRequests { get; set; }
        public DbSet<TicketSequence> TicketSequences { get; set; }
        public DbSet<UserDetail> UserDetails { get; set; }
        public DbSet<UserSubscription> UserSubscriptions { get; set; }
       
    }
}
