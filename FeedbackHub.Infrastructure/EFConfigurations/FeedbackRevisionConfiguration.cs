using FeedbackHub.Domain.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace FeedbackHub.Infrastructure.EFConfigurations
{
    public class FeedbackRevisionConfiguration : IEntityTypeConfiguration<FeedbackRevision>
    {
        public void Configure(EntityTypeBuilder<FeedbackRevision> builder)
        {

            builder.HasKey(r => r.Id);

            builder.Property(r => r.ChangedBy)
                   .IsRequired();

            builder.Property(r => r.ChangedAt)
                   .IsRequired();

            builder.HasOne(r => r.Feedback)
                   .WithMany(f => f.Revisions)
                   .HasForeignKey(r => r.FeedbackId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasMany(r => r.ChangedFields)
                   .WithOne(cf => cf.FeedbackRevision)
                   .HasForeignKey(cf => cf.FeedbackRevisionId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(r => r.FeedbackId);
        }
    }
}
