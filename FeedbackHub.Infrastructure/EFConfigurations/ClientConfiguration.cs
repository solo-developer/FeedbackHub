using FeedbackHub.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FeedbackHub.Infrastructure.EFConfigurations
{
    public class ClientConfiguration : IEntityTypeConfiguration<Client>
    {
        public void Configure(EntityTypeBuilder<Client> builder)
        {
            builder.HasKey(c => c.Id); 

            builder.Property(c => c.Name)
                .IsRequired()
                .HasMaxLength(255);

            builder.Property(c => c.Code)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(c => c.IsEnabled)
                .HasDefaultValue(true); 

            builder.HasMany(c => c.RegistrationRequests)
                .WithOne(r => r.Client) 
                .HasForeignKey(r => r.ClientId)
                .OnDelete(DeleteBehavior.Cascade); 
            
            builder.HasMany(c => c.AppSubscriptions)
                .WithOne(r => r.Client) 
                .HasForeignKey(r => r.ClientId)
                .OnDelete(DeleteBehavior.Cascade);
            
            builder.HasMany(c => c.AdminUsersWithAccess)
                .WithOne(r => r.Client) 
                .HasForeignKey(r => r.ClientId)
                .OnDelete(DeleteBehavior.Cascade); 

        }
    }
}
