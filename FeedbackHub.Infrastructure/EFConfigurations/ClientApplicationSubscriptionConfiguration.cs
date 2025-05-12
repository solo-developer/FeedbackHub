using FeedbackHub.Domain.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace FeedbackHub.Infrastructure.EFConfigurations
{
    public class ClientApplicationSubscriptionConfiguration : IEntityTypeConfiguration<ClientApplicationSubscription>
    {
        public void Configure(EntityTypeBuilder<ClientApplicationSubscription> builder)
        {
            builder.HasKey(e => e.Id);

            builder.HasOne(e => e.Client)
                .WithMany(c => c.AppSubscriptions)
                .HasForeignKey(e => e.ClientId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(e => e.Application)
                .WithMany(a=>a.ClientSubscriptions) 
                .HasForeignKey(e => e.ApplicationId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.Property(e => e.ClientId).IsRequired();
            builder.Property(e => e.ApplicationId).IsRequired();
        }
    }
}
