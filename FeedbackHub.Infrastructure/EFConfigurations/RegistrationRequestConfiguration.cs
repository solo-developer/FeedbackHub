using FeedbackHub.Domain.Entities;
using FeedbackHub.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FeedbackHub.Infrastructure.EFConfigurations
{
    public class RegistrationRequestConfiguration : IEntityTypeConfiguration<RegistrationRequest>
    {
        public void Configure(EntityTypeBuilder<RegistrationRequest> builder)
        {
            builder.HasKey(rr => rr.Id); // Assuming Id is in BaseEntity

            builder.Property(rr => rr.ClientId)
                .IsRequired();

            builder.Property(rr => rr.FullName)
             .IsRequired().HasMaxLength(500);

            builder.Property(rr => rr.Email)
                .IsRequired()
                .HasConversion(
                    email => email.Value,    
                    value => Email.Create(value) 
                )
                .HasMaxLength(255); 

            builder.Property(rr => rr.RequestedAt)
                .HasDefaultValueSql("GETDATE()");

            // Relationships
            builder.HasOne(rr => rr.Client)
                .WithMany(c => c.RegistrationRequests)
                .HasForeignKey(rr => rr.ClientId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(rr => rr.User) // One-to-one relationship with User
         .WithOne(ud=>ud.RegistrationRequest) // This indicates one-to-one relationship on User side
         .HasForeignKey<RegistrationRequest>(rr => rr.ConvertedUserId) // Foreign key in RegistrationRequest
         .IsRequired(false) // Nullable since registration request might not be converted yet
         .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
