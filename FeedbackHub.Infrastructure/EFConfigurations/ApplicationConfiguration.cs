using FeedbackHub.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FeedbackHub.Infrastructure.EFConfigurations
{
    internal class ApplicationConfiguration : IEntityTypeConfiguration<Application>
    {
        public void Configure(EntityTypeBuilder<Application> builder)
        {
            builder.HasKey(a => a.Id); // Assuming Id is in BaseEntity

            builder.Property(a => a.Name)
                .IsRequired()
                .HasMaxLength(255);

            builder.Property(a => a.ShortName)
                .HasMaxLength(50);

            builder.Property(a => a.Logo)
                .HasColumnType("varbinary(max)");

            builder.Property(a => a.IsDeleted)
                .HasDefaultValue(false);

            builder.HasMany(a => a.Subscriptions)
                .WithOne(s => s.Application)
                .HasForeignKey(s => s.ApplicationId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(a => a.NotificationSubscriptions)
             .WithOne(s => s.Application)
             .HasForeignKey(s => s.ApplicationId)
             .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(a => a.ClientSubscriptions)
             .WithOne(s => s.Application)
             .HasForeignKey(s => s.ApplicationId)
             .OnDelete(DeleteBehavior.Cascade);
            
            builder.HasMany(a => a.AdminUsersWithAccess)
             .WithOne(s => s.Application)
             .HasForeignKey(s => s.ApplicationId)
             .OnDelete(DeleteBehavior.Cascade);

        }
    }
}
