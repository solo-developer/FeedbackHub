using FeedbackHub.Domain.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace FeedbackHub.Infrastructure.EFConfigurations
{
    public class UserFeedbackEmailSubscriptionConfiguration : IEntityTypeConfiguration<UserFeedbackEmailSubscription>
    {
        public void Configure(EntityTypeBuilder<UserFeedbackEmailSubscription> builder)
        {
            builder.HasKey(e => e.Id);

            builder.Property(e => e.UserId).IsRequired();
            builder.Property(e => e.ApplicationId).IsRequired();

            builder.HasMany(e => e.SubscribedFeedbackTypes)
                   .WithOne(e => e.FeedbackSubscription)
                   .HasForeignKey(e => e.FeedbackSubscriptionId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(e => e.TriggerStates)
                .WithOne(e => e.Subscription)
                .HasForeignKey(e => e.SubscriptionId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(us => us.User)
.WithMany(a => a.EmailSubscriptions)
.HasForeignKey(us => us.UserId)
.OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(us => us.Application)
           .WithMany(a => a.NotificationSubscriptions)
           .HasForeignKey(us => us.ApplicationId)
           .OnDelete(DeleteBehavior.Restrict);
        }
    }

}
