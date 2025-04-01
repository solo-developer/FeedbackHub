using FeedbackHub.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FeedbackHub.Infrastructure.EFConfigurations
{
    public class TicketSequenceConfiguration : IEntityTypeConfiguration<TicketSequence>
    {
        public void Configure(EntityTypeBuilder<TicketSequence> builder)
        {
            builder.HasKey(ts => ts.Id); 

            builder.Property(ts => ts.SequenceNo)
                .IsRequired();
        }
    }
}
