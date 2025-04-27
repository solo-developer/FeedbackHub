using System.Text.Json.Serialization;

namespace FeedbackHub.Domain.Enums
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum UserType
    {
        All=0,
        Client=1,
        Admin=2
    }
}
