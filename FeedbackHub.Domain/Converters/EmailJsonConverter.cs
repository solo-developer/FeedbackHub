using FeedbackHub.Domain.ValueObjects;
using System.Text.Json.Serialization;
using System.Text.Json;

namespace FeedbackHub.Domain.Converters
{
    public class EmailJsonConverter : JsonConverter<Email>
    {
        public override Email Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
            => Email.Create(reader.GetString());

        public override void Write(Utf8JsonWriter writer, Email value, JsonSerializerOptions options)
            => writer.WriteStringValue(value.Value);
    }
}
