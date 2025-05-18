using FeedbackHub.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FeedbackHub.Infrastructure.EFConfigurations
{
    public class FeedbackConfiguration : IEntityTypeConfiguration<Feedback>
    {
        public void Configure(EntityTypeBuilder<Feedback> builder)
        {
            builder.HasKey(f => f.Id);

            builder.Property(f => f.Title)
                .IsRequired()
                .HasMaxLength(255);

            builder.Property(f => f.Description)
                .IsRequired();

            builder.Property(f => f.TicketId)
                .IsRequired();

            builder.HasIndex(f => f.TicketId)
             .IsUnique(); // 

            builder.Property(f => f.CreatedDate)
                .HasDefaultValueSql("GETDATE()");

            builder.Property(f => f.IsDeleted)
                .HasDefaultValue(false);

            builder.Property(f => f.Status)
                .IsRequired()
                .HasConversion<int>(); 

            // Relationships
            builder.HasOne(f => f.User)
                .WithMany() 
                .HasForeignKey(f => f.UserId)
                .OnDelete(DeleteBehavior.Restrict); 

            builder.HasOne(f => f.FeedbackType)
                .WithMany() 
                .HasForeignKey(f => f.FeedbackTypeId)
                .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(f => f.Application)
                .WithMany() 
                .HasForeignKey(f => f.ApplicationId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(f => f.Attachments)
                .WithOne(a => a.Feedback)
                .HasForeignKey(a => a.FeedbackId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(f => f.Histories)
           .WithOne(h => h.Feedback)
           .HasForeignKey(h => h.FeedbackId)
           .OnDelete(DeleteBehavior.Cascade);


            builder.HasMany(f => f.Revisions)
           .WithOne(h => h.Feedback)
           .HasForeignKey(h => h.FeedbackId)
           .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
