using FeedbackHub.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FeedbackHub.Infrastructure.EFConfigurations
{
    public class SettingConfiguration : IEntityTypeConfiguration<Setting>
    {
        public void Configure(EntityTypeBuilder<Setting> builder)
        {
            builder.HasKey(a => a.Id);

            builder.Property(a => a.Key)
                .IsRequired();

            builder.Property(a => a.Value)
                .IsRequired();

            builder.Property(a=>a.Group)
                .IsRequired();
        }
    }
}
