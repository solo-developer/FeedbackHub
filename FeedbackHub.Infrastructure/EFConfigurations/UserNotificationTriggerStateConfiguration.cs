using FeedbackHub.Domain.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace FeedbackHub.Infrastructure.EFConfigurations
{
    public class UserNotificationTriggerStateConfiguration : IEntityTypeConfiguration<UserNotificationTriggerState>
    {
        public void Configure(EntityTypeBuilder<UserNotificationTriggerState> builder)
        {
            builder.HasKey(x => x.Id);

            builder.Property(x => x.SubscriptionId)
                .IsRequired();

            builder.Property(x => x.TriggerState)
                .IsRequired()
                .HasConversion<int>();

            builder.HasOne(x => x.Subscription)
                .WithMany(s => s.TriggerStates)
                .HasForeignKey(x => x.SubscriptionId)
                .OnDelete(DeleteBehavior.Cascade); 
        }
    }
}
