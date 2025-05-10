using FeedbackHub.Domain.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace FeedbackHub.Infrastructure.EFConfigurations
{
    public class UserSubscribedFeedbackTypeNotificationConfiguration : IEntityTypeConfiguration<UserSubscribedFeedbackTypeNotification>
    {
        public void Configure(EntityTypeBuilder<UserSubscribedFeedbackTypeNotification> builder)
        {
            builder.HasKey(e => e.Id);

            builder.HasIndex(e => new { e.FeedbackSubscriptionId, e.FeedbackTypeId }).IsUnique();

            builder.HasOne(e => e.FeedbackSubscription)
                   .WithMany(s => s.SubscribedFeedbackTypes)
                   .HasForeignKey(e => e.FeedbackSubscriptionId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(e => e.FeedbackType)
                   .WithMany()
                   .HasForeignKey(e => e.FeedbackTypeId)
                   .OnDelete(DeleteBehavior.Restrict);
        }
    }

}
