using FeedbackHub.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FeedbackHub.Infrastructure.EFConfigurations
{
    public class FeedbackTypeConfiguration : IEntityTypeConfiguration<FeedbackType>
    {
        public void Configure(EntityTypeBuilder<FeedbackType> builder)
        {
            builder.HasKey(ft => ft.Id);

            builder.Property(ft => ft.Type)
                .IsRequired()
                .HasMaxLength(100);

            builder.Property(ft => ft.Color)
                .HasMaxLength(20); 

            builder.Property(ft => ft.IsDeleted)
                .HasDefaultValue(false);
        }
    }
}
