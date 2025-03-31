using FeedbackHub.Domain.Entities;
using FeedbackHub.Infrastructure.EFConfigurations;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace FeedbackHub.Infrastructure.Context
{
    public class AppDbContext : IdentityDbContext<Domain.Entities.ApplicationUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            builder.ApplyConfiguration(new AttachmentConfiguration());
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
