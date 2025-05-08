using FeedbackHub.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;


namespace FeedbackHub.Infrastructure.EFConfigurations
{
    public class FeedbackHistoryConfiguration : IEntityTypeConfiguration<FeedbackHistory>
    {
        public void Configure(EntityTypeBuilder<FeedbackHistory> builder)
        {
            builder.ToTable("FeedbackHistories");

            // Primary Key
            builder.HasKey(fh => fh.Id); 

            // Required properties
            builder.Property(fh => fh.FeedbackId)
                .IsRequired();

            builder.Property(fh => fh.UserId)
                .IsRequired();

            builder.Property(fh => fh.Comment)
                .IsRequired(); 

            builder.Property(fh => fh.CreatedDate)
                .IsRequired();


            builder.HasOne(fh => fh.User)
                .WithMany() 
                .HasForeignKey(fh => fh.UserId)
                .OnDelete(DeleteBehavior.Restrict); 

            builder.HasOne(fh => fh.Feedback)
                .WithMany()
                .HasForeignKey(fh => fh.FeedbackId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
