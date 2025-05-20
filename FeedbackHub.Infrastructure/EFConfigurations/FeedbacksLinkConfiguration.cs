using FeedbackHub.Domain.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace FeedbackHub.Infrastructure.EFConfigurations
{
    public class FeedbacksLinkConfiguration : IEntityTypeConfiguration<FeedbacksLink>
    {
        public void Configure(EntityTypeBuilder<FeedbacksLink> builder)
        {

            builder.HasKey(fl => fl.Id);

            builder.Property(fl => fl.SourceFeedbackId)
                   .IsRequired();

            builder.Property(fl => fl.TargetFeedbackId)
                   .IsRequired();

            builder.Property(fl => fl.CreatedBy)
                   .IsRequired();

            builder.Property(fl => fl.CreatedDate)
                   .IsRequired();

            builder.Property(f => f.LinkType)
              .IsRequired()
              .HasConversion<int>();

            builder.HasOne(fl => fl.SourceFeedback)
                   .WithMany(fl => fl.SourceLinks)
                   .HasForeignKey(fl => fl.SourceFeedbackId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(fl => fl.TargetFeedback)
                   .WithMany(fl => fl.TargetLinks)
                   .HasForeignKey(fl => fl.TargetFeedbackId)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasOne(fl => fl.UserDetail)
                   .WithMany(fl => fl.FeedbackLinks)
                   .HasForeignKey(fl => fl.CreatedBy)
                   .OnDelete(DeleteBehavior.Restrict);

            builder.HasIndex(fl => fl.SourceFeedbackId);
            builder.HasIndex(fl => fl.TargetFeedbackId);
        }
    }
}
