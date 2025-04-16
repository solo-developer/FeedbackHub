using FeedbackHub.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FeedbackHub.Infrastructure.EFConfigurations
{
    public class TemplateConfiguration : IEntityTypeConfiguration<Template>
    {
        public void Configure(EntityTypeBuilder<Template> builder)
        {
            builder.HasKey(a => a.Id);

            builder.Property(a => a.TemplateType)
                .IsRequired().HasConversion<string>(); ;

            builder.Property(a => a.Subject)
                .IsRequired().HasMaxLength(int.MaxValue);

            builder.Property(a => a.EmailTemplate)
                .IsRequired().HasMaxLength(int.MaxValue);
        }
    }
}
