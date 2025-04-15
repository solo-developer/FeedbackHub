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

            // Relationships
            builder.HasOne(ud => ud.ApplicationUser)
                .WithOne()
                .HasForeignKey<UserDetail>(ud => ud.AppUserId)
                .OnDelete(DeleteBehavior.Restrict); // Prevent accidental deletion of ApplicationUser

            builder.HasOne(ud => ud.RegistrationRequest)
          .WithOne(rr => rr.User) // This ensures that each user is mapped to exactly one registration request
          .HasForeignKey<RegistrationRequest>(rr => rr.ConvertedUserId) // Foreign key to UserDetail
          .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(ud => ud.Subscriptions)
                .WithOne(us => us.User)
                .HasForeignKey(us => us.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
