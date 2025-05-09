using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;
using FeedbackHub.Domain.Entities;

namespace FeedbackHub.Infrastructure.EFConfigurations
{
    public class AttachmentConfiguration : IEntityTypeConfiguration<Attachment>
    {
        public void Configure(EntityTypeBuilder<Attachment> builder)
        {
            builder.HasKey(a => a.Id);

            builder.Property(a => a.FeedbackId)
          .IsRequired();

            builder.Property(a => a.DisplayName)
                .IsRequired()
                .HasMaxLength(255);

            builder.Property(a => a.AttachmentIdentifier)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(a => a.CreatedDate)
        .IsRequired();

            builder.Property(a => a.CreatedBy)
                .IsRequired();

            builder.HasOne(a => a.Feedback)
                .WithMany(f => f.Attachments)
                .HasForeignKey(a => a.FeedbackId)
                .OnDelete(DeleteBehavior.Cascade);

            builder.HasOne(a => a.User)
                .WithMany()
                .HasForeignKey(a => a.CreatedBy)
                .OnDelete(DeleteBehavior.Restrict); 

        }
    }
}
