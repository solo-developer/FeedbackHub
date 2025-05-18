using FeedbackHub.Domain.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Microsoft.EntityFrameworkCore;

namespace FeedbackHub.Infrastructure.EFConfigurations
{
    public class FeedbackChangedFieldConfiguration : IEntityTypeConfiguration<FeedbackChangedField>
    {
        public void Configure(EntityTypeBuilder<FeedbackChangedField> builder)
        {
            builder.ToTable("FeedbackChangedFields");

            builder.HasKey(f => f.Id);

            builder.Property(f => f.FieldName)
                   .HasConversion<string>()
                   .IsRequired();

            builder.Property(f => f.OldValue)
                   .HasMaxLength(int.MaxValue);

            builder.Property(f => f.NewValue)
                   .HasMaxLength(int.MaxValue);

            builder.HasOne(f => f.FeedbackRevision)
                   .WithMany(r => r.ChangedFields)
                   .HasForeignKey(f => f.FeedbackRevisionId)
                   .OnDelete(DeleteBehavior.Cascade);

            builder.HasIndex(f => f.FeedbackRevisionId);
        }
    }
}
