using FeedbackHub.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

namespace FeedbackHub.Infrastructure.Converters
{
    public class EmailConverter : ValueConverter<Email, string>
    {
        public EmailConverter() : base(
            v => v.Value,
            v => Email.Create(v))
        {
        }
    }
}
