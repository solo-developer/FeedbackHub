using FeedbackHub.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FeedbackHub.Infrastructure.EFConfigurations
{
    public class UserDetailConfiguration : IEntityTypeConfiguration<UserDetail>
    {
        public void Configure(EntityTypeBuilder<UserDetail> builder)
        {
            builder.HasKey(ud => ud.Id);

            builder.Property(ud => ud.AppUserId)
                .IsRequired();

            builder.Property(ud => ud.FullName)
                .IsRequired().HasMaxLength(500);

            builder.Property(ud => ud.IsDeleted)
                .HasDefaultValue(false);

            builder.Property(ud => ud.AvatarUrl)
                .HasMaxLength(500)
    .IsRequired(false);

            // Relationships
            builder.HasOne(ud => ud.ApplicationUser)
                .WithOne()
                .HasForeignKey<UserDetail>(ud => ud.AppUserId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(ud => ud.RegistrationRequest)
        .WithOne(rr => rr.User)
        .HasForeignKey<UserDetail>(ud => ud.RegistrationRequestId)
        .IsRequired(false)
        .OnDelete(DeleteBehavior.SetNull);

            builder.HasMany(ud => ud.EmailSubscriptions)
                .WithOne(us => us.User)
                .HasForeignKey(us => us.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(ud => ud.AllowedApplications)
                .WithOne(us => us.AdminUser)
                .HasForeignKey(us => us.AdminUserId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(ud => ud.FeedbackHistories)
    .WithOne(us => us.User)
    .HasForeignKey(us => us.UserId)
    .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
