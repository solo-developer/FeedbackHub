using FeedbackHub.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FeedbackHub.Infrastructure.EFConfigurations
{
    public class UserSubscriptionConfiguration : IEntityTypeConfiguration<UserSubscription>
    {
        public void Configure(EntityTypeBuilder<UserSubscription> builder)
        {
            builder.HasKey(us => us.Id);

            builder.Property(us => us.UserId)
                .IsRequired();

            builder.Property(us => us.ApplicationId)
                .IsRequired();

            // Relationships
            builder.HasOne(us => us.User)
                .WithMany(ud => ud.Subscriptions)
                .HasForeignKey(us => us.UserId)
                .OnDelete(DeleteBehavior.Cascade); 

            builder.HasOne(us => us.Application)
                .WithMany(a => a.Subscriptions)
                .HasForeignKey(us => us.ApplicationId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
