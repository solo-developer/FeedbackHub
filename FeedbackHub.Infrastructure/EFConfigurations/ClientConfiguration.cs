using FeedbackHub.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

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

        }
    }
}
